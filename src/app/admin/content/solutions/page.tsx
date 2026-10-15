'use client'

import React, { useState, useEffect } from 'react'

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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Target,
} from 'lucide-react'
import SolutionEditForm from '@/components/admin/solution-edit-form'

interface Solution {
  id: string
  category: string
  title: string
  subtitle?: string
  description?: string
  features?: string[]
  applications?: string[]
  metrics?: Array<{
    value: string
    label: string
  }>
  technologies?: string[]
  benefits?: string[]
  image?: string
  slug: string
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

// 解决方案分类选项
const SOLUTION_CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: '园区管理', label: '园区管理' },
  { value: '社区管理', label: '社区管理' },
  { value: '公共交通', label: '公共交通' },
  { value: '工业制造', label: '工业制造' },
  { value: '物流运输', label: '物流运输' },
  { value: '大健康', label: '大健康' },
  { value: '商业综合体', label: '商业综合体' },
  { value: '其他方案', label: '其他方案' },
]

export default function SolutionsManagePage() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // 对话框状态
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // 获取解决方案列表
  const fetchSolutions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && selectedCategory !== 'all' && { category: selectedCategory }),
      })

      const response = await fetch(`/api/admin/content/solutions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSolutions(data.solutions)
        setTotalPages(data.pagination.pages)
        setTotalCount(data.pagination.total)
      }
    } catch (error) {
      console.error('获取解决方案列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSolutions()
  }, [currentPage, searchTerm, selectedCategory])

  // 计算统计数据
  const getStatsData = () => {
    const categoryStats = solutions.reduce(
      (acc, solution) => {
        acc[solution.category] = (acc[solution.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const totalFeatures = solutions.reduce((sum, solution) => {
      return sum + (solution.features?.length || 0)
    }, 0)

    const totalApplications = solutions.reduce((sum, solution) => {
      return sum + (solution.applications?.length || 0)
    }, 0)

    return {
      total: totalCount,
      categories: Object.keys(categoryStats).length,
      features: totalFeatures,
      applications: totalApplications,
      categoryStats,
    }
  }

  const stats = getStatsData()

  // 打开创建对话框
  const openCreateDialog = () => {
    setSelectedSolution(null)
    setIsCreating(true)
    setIsEditOpen(true)
  }

  // 打开编辑对话框
  const openEditDialog = (solution: Solution) => {
    setSelectedSolution(solution)
    setIsCreating(false)
    setIsEditOpen(true)
  }

  // 保存解决方案
  const handleSaveSolution = async (solutionData: Partial<Solution>) => {
    try {
      const url = isCreating
        ? '/api/admin/content/solutions'
        : `/api/admin/content/solutions/${selectedSolution?.id}`

      const method = isCreating ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solutionData),
      })

      if (response.ok) {
        setIsEditOpen(false)
        fetchSolutions()
      } else {
        const error = await response.json()
        alert(error.error || '保存失败')
      }
    } catch (error) {
      console.error('保存解决方案失败:', error)
      alert('保存失败')
    }
  }

  // 删除解决方案
  const handleDeleteSolution = async () => {
    if (!selectedSolution) return

    try {
      const response = await fetch(`/api/admin/content/solutions/${selectedSolution.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIsDeleteOpen(false)
        fetchSolutions()
      } else {
        const error = await response.json()
        alert(error.error || '删除失败')
      }
    } catch (error) {
      console.error('删除解决方案失败:', error)
      alert('删除失败')
    }
  }

  // 获取分类标签
  const getCategoryLabel = (category: string) => {
    const cat = SOLUTION_CATEGORIES.find(c => c.value === category)
    return cat?.label || category
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>解决方案管理</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>管理和编辑解决方案内容</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className='mr-2 h-4 w-4' />
            新建解决方案
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    解决方案总数
                  </p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>{stats.total}</p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                  <BarChart3 className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>分类覆盖</p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stats.categories}
                  </p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30'>
                  <Target className='h-4 w-4 text-green-600 dark:text-green-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>核心功能</p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stats.features}
                  </p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
                  <TrendingUp className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>应用场景</p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {stats.applications}
                  </p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30'>
                  <Users className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>技术栈</p>
                  <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {solutions.reduce(
                      (sum, solution) => sum + (solution.technologies?.length || 0),
                      0
                    )}
                  </p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30'>
                  <TrendingUp className='h-4 w-4 text-indigo-600 dark:text-indigo-400' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='搜索解决方案标题、描述...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='flex gap-2'>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className='w-40'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='筛选分类' />
              </SelectTrigger>
              <SelectContent>
                {SOLUTION_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 筛选结果提示 */}
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>解决方案列表</h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>共 {stats.total} 个解决方案</p>
        </div>

        {/* 解决方案列表 */}
        <div className='rounded-lg border bg-white dark:bg-gray-800'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>解决方案</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>内容完整度</TableHead>
                <TableHead>关键指标</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className='w-[100px]'>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center'>
                    加载中...
                  </TableCell>
                </TableRow>
              ) : solutions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center'>
                    暂无解决方案
                  </TableCell>
                </TableRow>
              ) : (
                solutions.map(solution => {
                  // 计算内容完整度
                  const completionFields = [
                    solution.subtitle,
                    solution.description,
                    solution.image,
                    (solution.features?.length ?? 0) > 0,
                    (solution.applications?.length ?? 0) > 0,
                    (solution.technologies?.length ?? 0) > 0,
                    (solution.benefits?.length ?? 0) > 0,
                    (solution.metrics?.length ?? 0) > 0,
                  ]
                  const completedFields = completionFields.filter(Boolean).length
                  const completionPercentage = Math.round(
                    (completedFields / completionFields.length) * 100
                  )

                  return (
                    <TableRow key={solution.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium text-gray-900 dark:text-white'>
                            {solution.title}
                          </div>
                          {solution.subtitle && (
                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                              {solution.subtitle}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{getCategoryLabel(solution.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <div className='relative h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700'>
                            <div
                              className={`absolute left-0 top-0 h-2 rounded-full transition-all ${
                                completionPercentage >= 80
                                  ? 'w-full bg-green-500'
                                  : completionPercentage >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{
                                width:
                                  completionPercentage >= 80
                                    ? '100%'
                                    : completionPercentage >= 60
                                      ? '75%'
                                      : '50%',
                              }}
                            />
                          </div>
                          <span
                            className={`text-sm ${
                              completionPercentage >= 80
                                ? 'text-green-600 dark:text-green-400'
                                : completionPercentage >= 60
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {completionPercentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          {solution.metrics?.length || 0} 个指标
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          {new Date(solution.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => window.open(`/solutions/${solution.slug}`, '_blank')}
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              在新窗口预览
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSolution(solution)
                                setIsPreviewOpen(true)
                              }}
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              内嵌预览
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSolution(solution)
                                setIsDetailOpen(true)
                              }}
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              查看数据
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(solution)}>
                              <Edit className='mr-2 h-4 w-4' />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSolution(solution)
                                setIsDeleteOpen(true)
                              }}
                              className='text-red-600'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className='flex justify-center gap-2'>
            <Button
              variant='outline'
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className='flex items-center px-4 text-sm text-gray-600 dark:text-gray-400'>
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <Button
              variant='outline'
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        )}

        {/* 编辑对话框 */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>{isCreating ? '新建解决方案' : '编辑解决方案'}</DialogTitle>
              <DialogDescription>
                {isCreating ? '创建新的解决方案' : '修改解决方案信息'}
              </DialogDescription>
            </DialogHeader>
            <SolutionEditForm
              solution={
                selectedSolution
                  ? {
                      ...selectedSolution,
                      features: ensureArray(selectedSolution.features),
                      applications: ensureArray(selectedSolution.applications),
                      metrics: ensureArray(selectedSolution.metrics),
                      technologies: ensureArray(selectedSolution.technologies),
                      benefits: ensureArray(selectedSolution.benefits),
                    }
                  : null
              }
              isCreating={isCreating}
              onSave={handleSaveSolution}
              onCancel={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* 详情查看对话框 */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>解决方案详情</DialogTitle>
              <DialogDescription>查看解决方案的详细信息</DialogDescription>
            </DialogHeader>
            {selectedSolution && (
              <div className='space-y-6'>
                {/* 基本信息 */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        解决方案标题
                      </label>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                        {selectedSolution.title}
                      </p>
                    </div>
                    {selectedSolution.subtitle && (
                      <div>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          副标题
                        </label>
                        <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                          {selectedSolution.subtitle}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        分类
                      </label>
                      <div className='mt-1'>
                        <Badge variant='outline'>
                          {getCategoryLabel(selectedSolution.category)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        URL标识
                      </label>
                      <p className='mt-1 font-mono text-sm text-gray-900 dark:text-white'>
                        {selectedSolution.slug}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    {selectedSolution.image && (
                      <div>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          解决方案图片
                        </label>
                        <div className='mt-1'>
                          <img
                            src={selectedSolution.image}
                            alt={selectedSolution.title}
                            className='h-32 w-full rounded-lg border object-cover'
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        渐变色配置
                      </label>
                      <p className='mt-1 font-mono text-sm text-gray-900 dark:text-white'>
                        {selectedSolution.gradient || '未设置'}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        强调色
                      </label>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                        {selectedSolution.accentColor || '未设置'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 详细介绍 */}
                {selectedSolution.description && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      解决方案详细介绍
                    </label>
                    <div className='mt-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                      <p className='whitespace-pre-wrap text-sm text-gray-900 dark:text-white'>
                        {selectedSolution.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* 核心功能 */}
                {ensureArray(selectedSolution.features).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      核心功能
                    </label>
                    <div className='mt-1 flex flex-wrap gap-2'>
                      {ensureArray(selectedSolution.features).map((feature, index) => (
                        <Badge key={index} variant='secondary'>
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 应用场景 */}
                {ensureArray(selectedSolution.applications).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      应用场景
                    </label>
                    <div className='mt-1 flex flex-wrap gap-2'>
                      {ensureArray(selectedSolution.applications).map((app, index) => (
                        <Badge key={index} variant='outline'>
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 核心技术 */}
                {ensureArray(selectedSolution.technologies).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      核心技术
                    </label>
                    <div className='mt-1 flex flex-wrap gap-2'>
                      {ensureArray(selectedSolution.technologies).map((tech, index) => (
                        <Badge key={index} variant='default'>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 客户收益 */}
                {ensureArray(selectedSolution.benefits).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      客户收益
                    </label>
                    <div className='mt-1 flex flex-wrap gap-2'>
                      {ensureArray(selectedSolution.benefits).map((benefit, index) => (
                        <Badge key={index} variant='secondary'>
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 关键指标 */}
                {ensureArray(selectedSolution.metrics).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      关键指标
                    </label>
                    <div className='mt-1 grid grid-cols-1 gap-2 md:grid-cols-2'>
                      {ensureArray(selectedSolution.metrics).map((metric, index) => (
                        <div
                          key={index}
                          className='flex justify-between rounded bg-gray-50 p-2 dark:bg-gray-800'
                        >
                          <span className='font-medium'>{metric.value || metric}</span>
                          <span className='text-sm text-gray-600 dark:text-gray-400'>
                            {metric.label || ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 更新信息 */}
                <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
                  <div className='grid grid-cols-1 gap-4 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-2'>
                    <div>
                      <span className='font-medium'>创建时间：</span>
                      {new Date(selectedSolution.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className='font-medium'>更新时间：</span>
                      {new Date(selectedSolution.updatedAt).toLocaleString()}
                    </div>
                    {selectedSolution.updater && (
                      <div className='md:col-span-2'>
                        <span className='font-medium'>最后更新者：</span>
                        {selectedSolution.updater.name} ({selectedSolution.updater.email})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 预览对话框 */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>解决方案预览</DialogTitle>
              <DialogDescription>预览解决方案在前端页面的显示效果</DialogDescription>
            </DialogHeader>
            {selectedSolution && (
              <div className='space-y-6'>
                {/* 预览提示 */}
                <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                  <p className='text-sm text-blue-800 dark:text-blue-200'>
                    💡 这是解决方案在前端页面的预览效果，实际页面可能会有细微差异
                  </p>
                </div>

                {/* 模拟前端头部 */}
                <div className='rounded-lg border bg-white p-6 dark:bg-slate-900'>
                  <div className='text-center'>
                    <div className='mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'>
                      {getCategoryLabel(selectedSolution.category)}
                    </div>
                    <h1 className='mb-3 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl'>
                      {selectedSolution.title}
                    </h1>
                    {selectedSolution.subtitle && (
                      <p className='mb-4 text-base text-slate-600 dark:text-slate-300 md:text-lg'>
                        {selectedSolution.subtitle}
                      </p>
                    )}
                    {selectedSolution.description && (
                      <p className='text-slate-500 dark:text-slate-400'>
                        {selectedSolution.description}
                      </p>
                    )}
                  </div>

                  {/* 关键指标预览 */}
                  {ensureArray(selectedSolution.metrics).length > 0 && (
                    <div className='mt-8'>
                      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                        {ensureArray(selectedSolution.metrics).map((metric, index) => (
                          <div
                            key={index}
                            className='rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800'
                          >
                            <div className='mb-1 text-xl font-bold text-slate-900 dark:text-white md:text-2xl'>
                              {metric.value}
                            </div>
                            <div className='text-xs text-slate-600 dark:text-slate-400 md:text-sm'>
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 应用场景预览 */}
                {ensureArray(selectedSolution.applications).length > 0 && (
                  <div className='rounded-lg border bg-gradient-to-r from-slate-50 to-slate-100 p-6 dark:from-slate-800 dark:to-slate-700'>
                    <div className='text-center'>
                      <div className='flex flex-wrap justify-center gap-2'>
                        {ensureArray(selectedSolution.applications).map((application, index) => (
                          <span
                            key={index}
                            className='inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-600 dark:text-slate-200 dark:ring-slate-500'
                          >
                            <div className='mr-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                            {application}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className='flex justify-between border-t pt-4'>
                  <Button
                    variant='outline'
                    onClick={() => window.open(`/solutions/${selectedSolution.slug}`, '_blank')}
                  >
                    在新窗口查看完整页面
                  </Button>
                  <Button variant='outline' onClick={() => setIsPreviewOpen(false)}>
                    关闭预览
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 删除确认对话框 */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
              <DialogDescription>
                您确定要删除解决方案 "{selectedSolution?.title}" 吗？此操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <div className='mt-4 flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
                取消
              </Button>
              <Button variant='destructive' onClick={handleDeleteSolution}>
                确认删除
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
