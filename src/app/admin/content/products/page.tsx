'use client'

import React, { useState, useEffect } from 'react'
import { ProductStatus } from '@prisma/client'

// 类型安全的辅助函数
function ensureArray(value: any): any[] {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import ProductEditForm from '@/components/admin/product-edit-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Copy,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Cpu,
  Lightbulb,
  Activity,
  Heart,
  Zap,
  Grid3X3,
} from 'lucide-react'
import { toast } from 'sonner'
import { PRODUCT_CATEGORY_OPTIONS } from '@/lib/product-categories'

// 产品分类选项（使用统一的分类管理）
const PRODUCT_CATEGORIES = [{ value: 'all', label: '全部分类' }, ...PRODUCT_CATEGORY_OPTIONS]

// 产品类型定义
interface Product {
  id: string
  category: string
  title: string
  subtitle?: string
  description?: string
  features?: string[]
  specifications?: Array<{
    name: string
    value: string
    unit?: string
  }>
  applications?: string[]
  benefits?: string[]
  image?: string
  status: 'AVAILABLE' | 'COMING_SOON' | 'DISCONTINUED'
  slug: string
  tags?: string[]
  gradient?: string
  accentColor?: string
  createdAt: Date
  updatedAt: Date
  updater?: {
    id: string
    name: string
    email: string
  }
}

// 分页信息
interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

// 筛选条件
interface Filters {
  category: string
  search: string
  status: string
}

// 产品分类接口
interface ProductCategory {
  id: string
  name: string
  description: string
  order: number
  isActive: boolean
  gradient: string
  iconName: string
}

export default function ProductsManagePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [filters, setFilters] = useState<Filters>({
    category: '',
    search: '',
    status: '',
  })
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // 批量操作状态
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkAction, setBulkAction] = useState('')

  // 分类管理状态
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [categoriesSaving, setCategoriesSaving] = useState(false)
  const [categoriesHasChanges, setCategoriesHasChanges] = useState(false)

  // 标签页状态
  const [activeTab, setActiveTab] = useState('products')

  // 获取产品列表
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })

      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/admin/content/products?${params}`)

      if (!response.ok) {
        if (response.status === 401) {
          // 未授权，可能需要重新登录
          console.error('未授权访问，请重新登录')
          // 可以在这里添加重定向到登录页面的逻辑
          // window.location.href = '/admin/login'
          throw new Error('未授权访问，请重新登录')
        }

        // 尝试解析错误消息
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || '获取产品列表失败')
        } catch {
          throw new Error(`获取产品列表失败 (${response.status})`)
        }
      }

      const data = await response.json()
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('获取产品列表失败:', error)
      // 可以在这里添加用户友好的错误提示
      alert(error instanceof Error ? error.message : '获取产品列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除产品
  const deleteProduct = async (id: string) => {
    if (!confirm('确定要删除这个产品吗？此操作不可撤销。')) return

    try {
      const response = await fetch(`/api/admin/content/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('删除产品失败')

      // 刷新列表
      fetchProducts()
    } catch (error) {
      console.error('删除产品失败:', error)
    }
  }

  // 初始化和筛选变化时获取数据
  useEffect(() => {
    fetchProducts()
  }, [pagination.page, pagination.limit, filters])

  // 初始化分类数据
  useEffect(() => {
    fetchCategories()
  }, [])

  // 重置筛选
  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      search: '',
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // 打开编辑对话框
  const openEditDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setIsCreating(false)
    } else {
      setEditingProduct({
        id: '',
        category: '',
        title: '',
        subtitle: '',
        description: '',
        features: [],
        specifications: [],
        applications: [],
        benefits: [],
        image: '',
        status: 'AVAILABLE' as ProductStatus,
        slug: '',
        tags: [],
        gradient: '',
        accentColor: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setIsCreating(true)
    }
    setIsEditOpen(true)
  }

  // 批量操作处理
  const handleBulkAction = async () => {
    if (selectedProducts.length === 0) {
      toast.error('请选择要操作的产品')
      return
    }

    setBulkLoading(true)
    try {
      const response = await fetch('/api/admin/content/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          productIds: selectedProducts,
        }),
      })

      if (!response.ok) throw new Error('批量操作失败')

      const result = await response.json()
      toast.success(result.message)

      // 重新获取产品列表
      await fetchProducts()

      // 清空选择
      setSelectedProducts([])
      setShowBulkDialog(false)
      setBulkAction('')
    } catch (error) {
      console.error('批量操作失败:', error)
      toast.error(error instanceof Error ? error.message : '批量操作失败')
    } finally {
      setBulkLoading(false)
    }
  }

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  // 单个选择
  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId])
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId))
    }
  }

  // 保存产品
  const saveProduct = async (productData: Partial<Product>) => {
    try {
      const url = isCreating
        ? '/api/admin/content/products'
        : `/api/admin/content/products/${editingProduct?.id}`

      const method = isCreating ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error(isCreating ? '创建产品失败' : '更新产品失败')
      }

      // 刷新产品列表
      await fetchProducts()
      setIsEditOpen(false)
      setEditingProduct(null)

      alert(isCreating ? '产品创建成功' : '产品更新成功')
    } catch (error) {
      console.error('保存产品失败:', error)
      alert('保存产品失败')
    }
  }

  // 分类管理函数
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await fetch('/api/admin/content/product-categories')
      if (!response.ok) throw new Error('获取分类失败')

      const data = await response.json()
      setCategories(data.categories)
      setCategoriesHasChanges(false)
    } catch (error) {
      console.error('获取分类失败:', error)
      toast.error('获取分类数据失败')
    } finally {
      setCategoriesLoading(false)
    }
  }

  const saveCategories = async () => {
    try {
      setCategoriesSaving(true)
      const response = await fetch('/api/admin/content/product-categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories }),
      })

      if (!response.ok) throw new Error('保存失败')

      toast.success('分类排序已更新')
      setCategoriesHasChanges(false)
    } catch (error) {
      console.error('保存分类失败:', error)
      toast.error('保存分类排序失败')
    } finally {
      setCategoriesSaving(false)
    }
  }

  const resetCategoriesChanges = () => {
    fetchCategories()
  }

  const moveCategoryUp = (index: number) => {
    if (index === 0) return

    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index - 1]
    newCategories[index - 1] = temp

    const updatedCategories = newCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1,
    }))

    setCategories(updatedCategories)
    setCategoriesHasChanges(true)
  }

  const moveCategoryDown = (index: number) => {
    if (index === categories.length - 1) return

    const newCategories = [...categories]
    const temp = newCategories[index]
    newCategories[index] = newCategories[index + 1]
    newCategories[index + 1] = temp

    const updatedCategories = newCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1,
    }))

    setCategories(updatedCategories)
    setCategoriesHasChanges(true)
  }

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat))
    )
    setCategoriesHasChanges(true)
  }

  const getCategoryIcon = (iconName: string) => {
    const iconMap = {
      Package,
      Cpu,
      Lightbulb,
      Activity,
      Heart,
      Zap,
      Grid3X3,
    }
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Package
    return IconComponent
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>产品管理</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
              管理产品信息、状态和分类，支持批量操作和快速搜索
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => window.location.reload()}>
              <RefreshCw className='mr-2 h-4 w-4' />
              刷新
            </Button>
            <Button onClick={() => openEditDialog()}>
              <Plus className='mr-2 h-4 w-4' />
              新增产品
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Card className='transition-shadow hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>产品总数</CardTitle>
              <Package className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>{pagination.total}</div>
              <p className='text-xs text-muted-foreground'>全部产品数量</p>
            </CardContent>
          </Card>
          <Card className='transition-shadow hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>产品分类</CardTitle>
              <TrendingUp className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {new Set(products.map(p => p.category)).size}
              </div>
              <p className='text-xs text-muted-foreground'>不同产品分类</p>
            </CardContent>
          </Card>
          <Card className='transition-shadow hover:shadow-md'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>功能特性</CardTitle>
              <CheckCircle className='h-4 w-4 text-purple-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-purple-600'>
                {products.reduce((total, p) => total + ensureArray(p.features).length, 0)}
              </div>
              <p className='text-xs text-muted-foreground'>总功能特性数</p>
            </CardContent>
          </Card>
        </div>

        {/* 标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='products'>产品列表</TabsTrigger>
            <TabsTrigger value='categories'>排序管理</TabsTrigger>
          </TabsList>

          {/* 产品列表标签页 */}
          <TabsContent value='products' className='space-y-6'>
            {/* 筛选和搜索 */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='text-lg'>筛选和搜索</CardTitle>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setFilters({ search: '', category: '', status: '' })}
                  >
                    清除筛选
                  </Button>
                  <Button variant='outline' size='sm'>
                    <Download className='mr-2 h-4 w-4' />
                    导出
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                  <div className='md:col-span-2'>
                    <div className='relative'>
                      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                      <Input
                        placeholder='搜索产品名称、副标题、描述...'
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                        className='pl-10'
                      />
                    </div>
                  </div>
                  <Select
                    value={filters.category || 'all'}
                    onValueChange={value =>
                      setFilters({ ...filters, category: value === 'all' ? '' : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='选择分类' />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={pagination.limit.toString()}
                    onValueChange={value =>
                      setPagination(prev => ({ ...prev, limit: parseInt(value), page: 1 }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='每页显示' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='10'>每页 10 条</SelectItem>
                      <SelectItem value='20'>每页 20 条</SelectItem>
                      <SelectItem value='50'>每页 50 条</SelectItem>
                      <SelectItem value='100'>每页 100 条</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 批量操作工具栏 - 底部悬浮 */}
            {selectedProducts.length > 0 && (
              <div className='fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform'>
                <div className='min-w-max rounded-lg border border-blue-200 bg-blue-50 px-6 py-4 shadow-lg backdrop-blur-sm dark:border-blue-800 dark:bg-blue-950/50'>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-3'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500'></div>
                      <span className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                        已选择 {selectedProducts.length} 个产品
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const selectedData = products.filter(p => selectedProducts.includes(p.id))
                          const dataStr = JSON.stringify(selectedData, null, 2)
                          const blob = new Blob([dataStr], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `products-${new Date().toISOString().split('T')[0]}.json`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        导出选中
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setShowBulkDialog(true)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        批量删除
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setSelectedProducts([])}
                        className='ml-2'
                      >
                        取消选择
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 产品列表 */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <div>
                  <CardTitle>产品列表</CardTitle>
                  <CardDescription>共 {pagination.total} 个产品</CardDescription>
                </div>
                <Button onClick={() => openEditDialog()}>
                  <Plus className='mr-2 h-4 w-4' />
                  新增产品
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className='py-8 text-center'>加载中...</div>
                ) : products.length === 0 ? (
                  <div className='py-8 text-center text-gray-500'>暂无产品数据</div>
                ) : (
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='w-12'>
                            <Checkbox
                              checked={
                                selectedProducts.length === products.length && products.length > 0
                              }
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>产品信息</TableHead>
                          <TableHead>分类</TableHead>
                          <TableHead>特性数量</TableHead>
                          <TableHead>更新时间</TableHead>
                          <TableHead className='text-right'>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map(product => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={checked =>
                                  handleSelectProduct(product.id, checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center space-x-3'>
                                <div className='relative'>
                                  {product.image ? (
                                    <img
                                      src={product.image}
                                      alt={product.title}
                                      className='h-12 w-12 rounded-lg border object-cover'
                                      onError={e => {
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800'>
                                      <Package className='h-6 w-6 text-gray-400' />
                                    </div>
                                  )}
                                </div>
                                <div className='min-w-0 flex-1'>
                                  <div className='truncate font-medium text-gray-900 dark:text-white'>
                                    {product.title}
                                  </div>
                                  {product.subtitle && (
                                    <div className='truncate text-sm text-gray-500 dark:text-gray-400'>
                                      {product.subtitle}
                                    </div>
                                  )}
                                  <div className='text-xs text-gray-400 dark:text-gray-500'>
                                    ID: {product.slug}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant='outline' className='text-xs'>
                                {PRODUCT_CATEGORIES.find(cat => cat.value === product.category)
                                  ?.label || product.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='text-sm'>
                                <div className='text-gray-900 dark:text-white'>
                                  {ensureArray(product.features).length} 个特性
                                </div>
                                <div className='text-xs text-gray-500'>
                                  {ensureArray(product.specifications).length} 个规格
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='text-sm'>
                                <div className='text-gray-900 dark:text-white'>
                                  {new Date(product.updatedAt).toLocaleDateString()}
                                </div>
                                <div className='text-xs text-gray-500'>
                                  {new Date(product.updatedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className='text-right'>
                              <div className='flex items-center justify-end gap-2'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                                  className='h-8 w-8 p-0'
                                >
                                  <ExternalLink className='h-4 w-4' />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='h-8 w-8 p-0'>
                                      <MoreHorizontal className='h-4 w-4' />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align='end' className='w-48'>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedProduct(product)
                                        setIsDetailOpen(true)
                                      }}
                                    >
                                      <Eye className='mr-2 h-4 w-4' />
                                      查看详情
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                      <Edit className='mr-2 h-4 w-4' />
                                      编辑产品
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => deleteProduct(product.id)}
                                      className='text-red-600 focus:text-red-600'
                                    >
                                      <Trash2 className='mr-2 h-4 w-4' />
                                      删除产品
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>

              {/* 分页控件 */}
              {pagination.pages > 1 && (
                <div className='flex items-center justify-between border-t px-6 py-4'>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    显示第 {(pagination.page - 1) * pagination.limit + 1} -{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} 条，共{' '}
                    {pagination.total} 条记录
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                      }
                      disabled={pagination.page === 1}
                    >
                      上一页
                    </Button>
                    <span className='flex items-center px-3 text-sm text-gray-600 dark:text-gray-400'>
                      第 {pagination.page} 页，共 {pagination.pages} 页
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setPagination(prev => ({
                          ...prev,
                          page: Math.min(prev.pages, prev.page + 1),
                        }))
                      }
                      disabled={pagination.page === pagination.pages}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* 产品详情弹窗 */}
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
              <DialogContent className='max-h-[85vh] max-w-5xl overflow-y-auto'>
                <DialogHeader className='border-b pb-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <DialogTitle className='text-xl font-semibold'>
                        {selectedProduct?.title || '产品详情'}
                      </DialogTitle>
                      <DialogDescription className='mt-1'>
                        查看产品的完整信息和配置
                      </DialogDescription>
                    </div>
                    {selectedProduct && (
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={selectedProduct.status === 'AVAILABLE' ? 'default' : 'secondary'}
                          className='text-xs'
                        >
                          {selectedProduct.status === 'AVAILABLE' ? '可用' : '即将推出'}
                        </Badge>
                        <Badge variant='outline' className='text-xs'>
                          {selectedProduct.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                </DialogHeader>
                {selectedProduct && (
                  <div className='space-y-6 pt-4'>
                    {/* 基本信息卡片 */}
                    <Card>
                      <CardHeader>
                        <CardTitle className='text-lg'>基本信息</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                          {/* 产品图片 */}
                          <div className='lg:col-span-1'>
                            {selectedProduct.image ? (
                              <div className='aspect-square w-full overflow-hidden rounded-lg border'>
                                <img
                                  src={selectedProduct.image}
                                  alt={selectedProduct.title}
                                  className='h-full w-full object-cover'
                                  onError={e => {
                                    e.currentTarget.src = '/images/placeholder-product.jpg'
                                  }}
                                />
                              </div>
                            ) : (
                              <div className='flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-gray-300'>
                                <div className='text-center text-gray-500'>
                                  <Package className='mx-auto mb-2 h-12 w-12 opacity-50' />
                                  <p className='text-sm'>暂无图片</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 产品信息 */}
                          <div className='space-y-4 lg:col-span-2'>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                              <div>
                                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                                  产品名称
                                </label>
                                <p className='mt-1 text-base font-medium text-gray-900 dark:text-white'>
                                  {selectedProduct.title}
                                </p>
                              </div>

                              {selectedProduct.subtitle && (
                                <div>
                                  <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                                    副标题
                                  </label>
                                  <p className='mt-1 text-base text-gray-700 dark:text-gray-300'>
                                    {selectedProduct.subtitle}
                                  </p>
                                </div>
                              )}

                              <div>
                                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                                  产品分类
                                </label>
                                <div className='mt-1'>
                                  <Badge variant='outline' className='text-sm'>
                                    {selectedProduct.category}
                                  </Badge>
                                </div>
                              </div>

                              <div>
                                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                                  产品状态
                                </label>
                                <div className='mt-1'>
                                  <Badge
                                    variant={
                                      selectedProduct.status === 'AVAILABLE'
                                        ? 'default'
                                        : 'secondary'
                                    }
                                    className='text-sm'
                                  >
                                    {selectedProduct.status === 'AVAILABLE' ? '可用' : '即将推出'}
                                  </Badge>
                                </div>
                              </div>

                              <div className='md:col-span-2'>
                                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                                  URL别名
                                </label>
                                <p className='mt-1 rounded bg-gray-50 px-2 py-1 font-mono text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
                                  /products/{selectedProduct.slug}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 产品描述 */}
                    {selectedProduct.description && (
                      <Card>
                        <CardHeader>
                          <CardTitle className='text-lg'>产品描述</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='prose prose-sm max-w-none dark:prose-invert'>
                            <p className='whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300'>
                              {selectedProduct.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 产品特性网格 */}
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                      {/* 核心功能 */}
                      {ensureArray(selectedProduct.features).length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className='text-lg'>核心功能</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className='flex flex-wrap gap-2'>
                              {ensureArray(selectedProduct.features).map((feature, index) => (
                                <Badge key={index} variant='secondary' className='text-sm'>
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* 应用场景 */}
                      {ensureArray(selectedProduct.applications).length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className='text-lg'>应用场景</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className='flex flex-wrap gap-2'>
                              {ensureArray(selectedProduct.applications).map((app, index) => (
                                <Badge key={index} variant='outline' className='text-sm'>
                                  {app}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* 产品优势 */}
                      {ensureArray(selectedProduct.benefits).length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className='text-lg'>产品优势</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className='flex flex-wrap gap-2'>
                              {ensureArray(selectedProduct.benefits).map((benefit, index) => (
                                <Badge key={index} variant='default' className='text-sm'>
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* 产品标签 */}
                      {ensureArray(selectedProduct.tags).length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className='text-lg'>产品标签</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className='flex flex-wrap gap-2'>
                              {ensureArray(selectedProduct.tags).map((tag, index) => (
                                <Badge key={index} variant='secondary' className='text-sm'>
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* 技术规格 */}
                    {ensureArray(selectedProduct.specifications).length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className='text-lg'>技术规格</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                            {ensureArray(selectedProduct.specifications).map((spec, index) => (
                              <div
                                key={index}
                                className='flex items-center justify-between rounded-lg border bg-gray-50 p-3 dark:bg-gray-800'
                              >
                                <span className='font-medium text-gray-900 dark:text-white'>
                                  {spec.name}
                                </span>
                                <span className='font-mono text-sm text-gray-600 dark:text-gray-400'>
                                  {spec.value}
                                  {spec.unit && ` ${spec.unit}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* 系统信息 */}
                    <Card className='bg-gray-50 dark:bg-gray-900'>
                      <CardHeader>
                        <CardTitle className='text-lg'>系统信息</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                          <div className='space-y-1'>
                            <label className='text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                              创建时间
                            </label>
                            <p className='font-mono text-sm text-gray-900 dark:text-white'>
                              {new Date(selectedProduct.createdAt).toLocaleString('zh-CN')}
                            </p>
                          </div>
                          <div className='space-y-1'>
                            <label className='text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                              更新时间
                            </label>
                            <p className='font-mono text-sm text-gray-900 dark:text-white'>
                              {new Date(selectedProduct.updatedAt).toLocaleString('zh-CN')}
                            </p>
                          </div>
                          {selectedProduct.updater && (
                            <div className='space-y-1'>
                              <label className='text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                                最后更新者
                              </label>
                              <p className='text-sm text-gray-900 dark:text-white'>
                                {selectedProduct.updater.name}
                              </p>
                              <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {selectedProduct.updater.email}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* 排序管理标签页 */}
          <TabsContent value='categories' className='space-y-6'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>产品分类排序管理</CardTitle>
                    <CardDescription>调整产品分类在前端页面的显示顺序和状态</CardDescription>
                  </div>
                  <div className='flex gap-2'>
                    {categoriesHasChanges && (
                      <Button
                        variant='outline'
                        onClick={resetCategoriesChanges}
                        disabled={categoriesSaving}
                      >
                        重置
                      </Button>
                    )}
                    <Button
                      onClick={saveCategories}
                      disabled={!categoriesHasChanges || categoriesSaving}
                    >
                      {categoriesSaving ? '保存中...' : '保存排序'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <div className='flex items-center justify-center py-8'>
                    <div className='text-center'>
                      <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                      <p className='mt-2 text-gray-600'>加载分类数据...</p>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {categories.map((category, index) => (
                      <div
                        key={category.id}
                        className={`
                          flex items-center gap-4 rounded-lg border border-gray-200
                          bg-white p-4 dark:border-gray-700 dark:bg-gray-800
                          ${!category.isActive ? 'bg-gray-50 opacity-50 dark:bg-gray-900' : ''}
                        `}
                      >
                        {/* 排序控制 */}
                        <div className='flex flex-col gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => moveCategoryUp(index)}
                            disabled={index === 0}
                            className='h-6 w-6 p-0 disabled:opacity-30'
                          >
                            <ArrowUp className='h-3 w-3' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => moveCategoryDown(index)}
                            disabled={index === categories.length - 1}
                            className='h-6 w-6 p-0 disabled:opacity-30'
                          >
                            <ArrowDown className='h-3 w-3' />
                          </Button>
                        </div>

                        {/* 排序号 */}
                        <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium dark:bg-gray-700'>
                          {category.order}
                        </div>

                        {/* 分类信息 */}
                        <div className='min-w-0 flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            <h3 className='font-medium text-gray-900 dark:text-white'>
                              {category.name}
                            </h3>
                            {!category.isActive && (
                              <span className='text-xs text-gray-500'>(已隐藏)</span>
                            )}
                          </div>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {category.description}
                          </p>
                        </div>

                        {/* 状态控制 */}
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            {category.isActive ? '显示' : '隐藏'}
                          </span>
                          <Switch
                            checked={category.isActive}
                            onCheckedChange={() => toggleCategoryStatus(category.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 使用说明 */}
            <Card>
              <CardHeader>
                <CardTitle>使用说明</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3 text-sm text-gray-600 dark:text-gray-400'>
                  <p>• 点击上下箭头调整分类显示顺序</p>
                  <p>• 使用开关控制分类在前端的显示状态</p>
                  <p>• 所有更改会自动保存并立即生效</p>
                </div>
              </CardContent>
            </Card>

            {/* 更改提示 */}
            {categoriesHasChanges && (
              <div className='fixed bottom-6 right-6 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg'>
                <p className='text-sm'>您有未保存的更改</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 编辑/创建产品对话框 */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className='max-h-[95vh] max-w-6xl overflow-y-auto'>
            <DialogHeader className='border-b border-slate-200 pb-6 dark:border-slate-700'>
              <DialogTitle className='text-xl font-semibold text-slate-900 dark:text-white'>
                {isCreating ? '🚀 创建新产品' : '✏️ 编辑产品'}
              </DialogTitle>
              <DialogDescription className='text-slate-600 dark:text-slate-400'>
                {isCreating
                  ? '填写完整的产品信息，创建专业的产品展示页面'
                  : '修改产品的详细信息，包括技术规格、核心功能、应用场景等'}
              </DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <ProductEditForm
                product={{
                  ...editingProduct,
                  features: ensureArray(editingProduct.features),
                  applications: ensureArray(editingProduct.applications),
                  benefits: ensureArray(editingProduct.benefits),
                  tags: ensureArray(editingProduct.tags),
                  specifications: ensureArray(editingProduct.specifications),
                }}
                isCreating={isCreating}
                onSave={saveProduct}
                onCancel={() => {
                  setIsEditOpen(false)
                  setEditingProduct(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* 批量操作确认对话框 */}
        <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>批量删除产品</DialogTitle>
              <DialogDescription>
                确定要删除选中的 {selectedProducts.length} 个产品吗？此操作不可撤销。
              </DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-2 pt-4'>
              <Button
                variant='outline'
                onClick={() => setShowBulkDialog(false)}
                disabled={bulkLoading}
              >
                取消
              </Button>
              <Button variant='destructive' onClick={handleBulkAction} disabled={bulkLoading}>
                {bulkLoading ? '删除中...' : '确认删除'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
