'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Star,
  // Calendar,
  // Tag,
  Newspaper,
  Eye,
  // TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface NewsItem {
  id: string
  title: string
  summary?: string
  content?: string
  image?: string
  date?: string
  tags?: string[]
  category?: string
  status: 'published' | 'draft' | 'archived'
  featured: boolean
  author?: {
    id: string
    name: string
    email: string
  }
  metadata?: {
    author?: string
    readTime?: string
    views?: number
  }
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  news: NewsItem[]
  categories: Array<{ id: string; name: string; count: number }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CompanyNewsManagePage() {
  const router = useRouter()

  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>(
    []
  )
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [mounted, setMounted] = useState(false)

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
      fetchNews()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // 获取新闻列表
  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        includeAll: 'true', // 包含所有状态的新闻
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)

      const response = await fetch(`/api/admin/content/company-news?${params}`)
      if (!response.ok) throw new Error('获取新闻列表失败')

      const data: ApiResponse = await response.json()
      setNews(data.news)
      setCategories(data.categories)
      setPagination(data.pagination)
    } catch (_error) {
      console.error('获取新闻列表失败:', _error)
      toast.error('获取新闻列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchNews()
    }
  }, [mounted, pagination.page, searchTerm, selectedCategory, selectedStatus])

  // 删除新闻
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇新闻吗？')) return

    try {
      const response = await fetch(`/api/admin/content/company-news/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('删除失败')

      toast.success('新闻删除成功')
      fetchNews()
    } catch (_error) {
      console.error('删除新闻失败:', _error)
      toast.error('删除新闻失败')
    }
  }

  // 切换特色状态
  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/content/company-news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      })

      if (!response.ok) throw new Error('更新失败')

      toast.success(featured ? '已取消特色' : '已设为特色')
      fetchNews()
    } catch (_error) {
      console.error('更新特色状态失败:', _error)
      toast.error('更新失败')
    }
  }

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const statusMap = {
      published: { label: '已发布', variant: 'default' as const },
      draft: { label: '草稿', variant: 'secondary' as const },
      archived: { label: '已归档', variant: 'outline' as const },
    }
    const config = statusMap[status as keyof typeof statusMap] || statusMap.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // 格式化日期 - 使用固定格式避免水合错误
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>公司动态管理</h1>
            <p className='text-muted-foreground'>管理企业新闻、公告和动态信息</p>
          </div>
          <Button onClick={() => router.push('/admin/content/company-news/create')}>
            <Plus className='mr-2 h-4 w-4' />
            发布新闻
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className='grid gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>总新闻数</CardTitle>
              <Newspaper className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{mounted ? pagination.total : 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>已发布</CardTitle>
              <Eye className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {mounted ? news.filter(item => item.status === 'published').length : 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>草稿</CardTitle>
              <Edit className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {mounted ? news.filter(item => item.status === 'draft').length : 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>特色新闻</CardTitle>
              <Star className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {mounted ? news.filter(item => item.featured).length : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选和搜索 */}
        <Card>
          <CardHeader>
            <CardTitle>新闻列表</CardTitle>
            <CardDescription>管理所有公司动态新闻，包括发布、编辑和删除操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='搜索新闻标题、内容...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-9'
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='选择分类' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>所有分类</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className='w-[120px]'>
                  <SelectValue placeholder='状态' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>所有状态</SelectItem>
                  <SelectItem value='published'>已发布</SelectItem>
                  <SelectItem value='draft'>草稿</SelectItem>
                  <SelectItem value='archived'>已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className='py-8 text-center'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
                <p className='mt-2 text-muted-foreground'>加载中...</p>
              </div>
            ) : news.length === 0 ? (
              <div className='py-8 text-center'>
                <Newspaper className='mx-auto h-12 w-12 text-muted-foreground' />
                <h3 className='mt-2 text-sm font-semibold text-gray-900'>暂无新闻</h3>
                <p className='mt-1 text-sm text-muted-foreground'>开始创建您的第一篇公司动态新闻</p>
                <div className='mt-6'>
                  <Button onClick={() => router.push('/admin/content/company-news/create')}>
                    <Plus className='mr-2 h-4 w-4' />
                    发布新闻
                  </Button>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[35%]'>新闻信息</TableHead>
                    <TableHead className='w-[12%]'>分类</TableHead>
                    <TableHead className='w-[10%]'>状态</TableHead>
                    <TableHead className='w-[12%]'>发布日期</TableHead>
                    <TableHead className='w-[12%]'>作者</TableHead>
                    <TableHead className='w-[9%]'>阅读量</TableHead>
                    <TableHead className='w-[10%] text-right'>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className='max-w-0'>
                        <div className='flex items-center gap-2'>
                          {item.image && (
                            <div className='relative h-10 w-14 flex-shrink-0 overflow-hidden rounded'>
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className='object-cover'
                              />
                            </div>
                          )}
                          <div className='min-w-0 flex-1'>
                            <div className='flex items-center gap-1'>
                              <p
                                className='truncate text-sm font-medium leading-tight'
                                title={item.title}
                              >
                                {item.title}
                              </p>
                              {item.featured && (
                                <Star className='h-3 w-3 flex-shrink-0 fill-yellow-400 text-yellow-400' />
                              )}
                            </div>
                            <p
                              className='mt-0.5 truncate text-xs text-muted-foreground'
                              title={item.summary}
                            >
                              {item.summary}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{item.category || '未分类'}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {mounted
                          ? item.date
                            ? formatDate(item.date)
                            : formatDate(item.createdAt)
                          : ''}
                      </TableCell>
                      <TableCell>
                        <span
                          className='block truncate text-sm'
                          title={item.metadata?.author || item.author?.name || '未知'}
                        >
                          {item.metadata?.author || item.author?.name || '未知'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1'>
                          <Eye className='h-3 w-3 text-muted-foreground' />
                          <span className='text-sm'>{item.metadata?.views || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/content/company-news/${item.id}/edit`)
                              }
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleFeatured(item.id, item.featured)}
                            >
                              <Star className='mr-2 h-4 w-4' />
                              {item.featured ? '取消特色' : '设为特色'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(`/mission/company-news/${item.id}`, '_blank')
                              }
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              预览
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
                              className='text-red-600'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
