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
  FileText,
  Star,
  Calendar,
  User,
} from 'lucide-react'
import ResearchEditForm from '@/components/admin/research-edit-form'

interface Research {
  id: string
  title: string
  subtitle?: string
  description: string
  category: 'AI_RESEARCH' | 'INNOVATION' | 'ACHIEVEMENTS' | 'PAPERS'
  content: string
  image?: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: Date
  tags?: string[]
  authors?: Array<{
    name: string
    title?: string
    email?: string
    avatar?: string
  }>
  attachments?: Array<{
    name: string
    url: string
    type?: string
  }>
  featured: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  updater?: {
    id: string
    name: string
    email: string
  }
}

// 研究分类选项
const RESEARCH_CATEGORIES = [
  { value: 'all', label: '全部分类' },
  { value: 'AI_RESEARCH', label: 'AI研究与应用' },
  { value: 'INNOVATION', label: '技术创新' },
  { value: 'ACHIEVEMENTS', label: '研发成果' },
  { value: 'PAPERS', label: '技术论文' },
]

// 研究状态选项
const RESEARCH_STATUS = [
  { value: 'all', label: '全部状态' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'PUBLISHED', label: '已发布' },
  { value: 'ARCHIVED', label: '已归档' },
]

// 状态颜色映射
const statusColors = {
  DRAFT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

// 状态标签映射
const statusLabels = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
}

// 分类标签映射
const categoryLabels = {
  AI_RESEARCH: 'AI研究与应用',
  INNOVATION: '技术创新',
  ACHIEVEMENTS: '研发成果',
  PAPERS: '技术论文',
}

export default function ResearchManagePage() {
  const [research, setResearch] = useState<Research[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // 获取研究列表
  const fetchResearch = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
      })

      const response = await fetch(`/api/admin/content/research?${params}`)
      if (!response.ok) throw new Error('获取研究列表失败')

      const data = await response.json()
      setResearch(data.data)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error('获取研究列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResearch()
  }, [currentPage, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder])

  // 创建研究
  const handleCreate = async (researchData: any) => {
    try {
      // 处理日期字段 - 将Date对象转换为ISO字符串
      const processedData = {
        ...researchData,
        publishedAt:
          researchData.publishedAt instanceof Date
            ? researchData.publishedAt.toISOString()
            : researchData.publishedAt,
      }

      console.log('创建研究 - 发送数据:', processedData)

      const response = await fetch('/api/admin/content/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      })

      console.log('创建研究 - 响应状态:', response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('创建研究 - API错误响应:', errorData)

        let errorMessage = '创建研究失败'
        try {
          const parsedError = JSON.parse(errorData)
          errorMessage = parsedError.message || parsedError.error || errorMessage
        } catch {
          // 如果无法解析JSON，使用原始错误文本
          errorMessage = errorData || errorMessage
        }

        throw new Error(`创建研究失败: ${response.status} - ${errorMessage}`)
      }

      await fetchResearch()
    } catch (error) {
      console.error('创建研究失败:', error)
      throw error
    }
  }

  // 更新研究
  const handleUpdate = async (researchData: any) => {
    if (!selectedResearch) return

    try {
      // 处理日期字段 - 将Date对象转换为ISO字符串
      const processedData = {
        ...researchData,
        publishedAt:
          researchData.publishedAt instanceof Date
            ? researchData.publishedAt.toISOString()
            : researchData.publishedAt,
      }

      console.log('Updating research with data:', processedData)
      const response = await fetch(`/api/admin/content/research/${selectedResearch.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Error Response:', errorData)
        throw new Error(`更新研究失败: ${response.status} - ${errorData}`)
      }

      await fetchResearch()
    } catch (error) {
      console.error('更新研究失败:', error)
      throw error
    }
  }

  // 删除研究
  const handleDelete = async () => {
    if (!selectedResearch) return

    try {
      const response = await fetch(`/api/admin/content/research/${selectedResearch.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('删除研究失败')

      await fetchResearch()
      setShowDeleteDialog(false)
      setSelectedResearch(null)
    } catch (error) {
      console.error('删除研究失败:', error)
    }
  }

  // 格式化日期
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  // 筛选后的研究列表
  const filteredResearch = research.filter(item => {
    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题和操作 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>研究管理</h1>
            <p className='text-muted-foreground'>管理技术研究、创新成果和学术论文</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className='mr-2 h-4 w-4' />
            新建研究
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <FileText className='h-4 w-4 text-muted-foreground' />
                <div className='ml-2'>
                  <p className='text-sm font-medium leading-none'>总研究数</p>
                  <p className='text-2xl font-bold'>{research.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
                <div className='ml-2'>
                  <p className='text-sm font-medium leading-none'>已发布</p>
                  <p className='text-2xl font-bold'>
                    {research.filter(r => r.status === 'PUBLISHED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <Star className='h-4 w-4 text-muted-foreground' />
                <div className='ml-2'>
                  <p className='text-sm font-medium leading-none'>特色研究</p>
                  <p className='text-2xl font-bold'>{research.filter(r => r.featured).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <div className='ml-2'>
                  <p className='text-sm font-medium leading-none'>本月新增</p>
                  <p className='text-2xl font-bold'>
                    {
                      research.filter(r => {
                        const now = new Date()
                        const created = new Date(r.createdAt)
                        return (
                          created.getMonth() === now.getMonth() &&
                          created.getFullYear() === now.getFullYear()
                        )
                      }).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和筛选 */}
        <div className='flex items-center space-x-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='搜索研究标题或描述...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-8'
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='选择分类' />
            </SelectTrigger>
            <SelectContent>
              {RESEARCH_CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='选择状态' />
            </SelectTrigger>
            <SelectContent>
              {RESEARCH_STATUS.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 研究列表 */}
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>研究团队</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>特色</TableHead>
                  <TableHead>发布日期</TableHead>
                  <TableHead>更新者</TableHead>
                  <TableHead className='text-right'>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className='py-8 text-center'>
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : filteredResearch.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='py-8 text-center'>
                      暂无研究数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResearch.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium'>{item.title}</div>
                          {item.subtitle && (
                            <div className='text-sm text-muted-foreground'>{item.subtitle}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{categoryLabels[item.category]}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center space-x-1'>
                          {ensureArray(item.authors)
                            .slice(0, 3)
                            .map((author: any, index) => (
                              <div
                                key={index}
                                className='flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gray-200'
                                title={`${author.name}${author.title ? ` - ${author.title}` : ''}`}
                              >
                                {author.avatar ? (
                                  <img
                                    src={author.avatar}
                                    alt={author.name}
                                    className='h-full w-full object-cover'
                                    onError={e => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                      target.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600 ${author.avatar ? 'hidden' : ''}`}
                                >
                                  {author.name.charAt(0)}
                                </div>
                              </div>
                            ))}
                          {ensureArray(item.authors).length > 3 && (
                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-600'>
                              +{ensureArray(item.authors).length - 3}
                            </div>
                          )}
                          {ensureArray(item.authors).length === 0 && (
                            <span className='text-sm text-gray-400'>无</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.featured && <Star className='h-4 w-4 fill-current text-yellow-500' />}
                      </TableCell>
                      <TableCell>{formatDate(item.publishedAt)}</TableCell>
                      <TableCell>
                        <div className='flex items-center'>
                          <User className='mr-1 h-4 w-4 text-muted-foreground' />
                          <span className='text-sm'>{item.updater?.name || '系统'}</span>
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
                              onClick={() => {
                                setSelectedResearch(item)
                                setShowViewDialog(true)
                              }}
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedResearch(item)
                                setShowEditDialog(true)
                              }}
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedResearch(item)
                                setShowDeleteDialog(true)
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              第 {currentPage} 页，共 {totalPages} 页
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          </div>
        )}

        {/* 查看详情对话框 */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>研究详情</DialogTitle>
              <DialogDescription>查看研究的详细信息</DialogDescription>
            </DialogHeader>
            {selectedResearch && (
              <div className='space-y-6'>
                {/* 基本信息 */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      标题
                    </label>
                    <p className='mt-1 text-sm text-gray-900 dark:text-gray-100'>
                      {selectedResearch.title}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      副标题
                    </label>
                    <p className='mt-1 text-sm text-gray-900 dark:text-gray-100'>
                      {selectedResearch.subtitle || '-'}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      分类
                    </label>
                    <div className='mt-1'>
                      <Badge variant='outline'>{categoryLabels[selectedResearch.category]}</Badge>
                    </div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      状态
                    </label>
                    <div className='mt-1'>
                      <Badge className={statusColors[selectedResearch.status]}>
                        {statusLabels[selectedResearch.status]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    描述
                  </label>
                  <p className='mt-1 text-sm text-gray-900 dark:text-gray-100'>
                    {selectedResearch.description}
                  </p>
                </div>

                {/* 标签 */}
                {ensureArray(selectedResearch.tags).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      标签
                    </label>
                    <div className='mt-1 flex flex-wrap gap-2'>
                      {ensureArray(selectedResearch.tags).map((tag, index) => (
                        <Badge key={index} variant='secondary'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 作者信息 */}
                {ensureArray(selectedResearch.authors).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      作者信息
                    </label>
                    <div className='mt-1 space-y-2'>
                      {ensureArray(selectedResearch.authors).map((author: any, index) => (
                        <div
                          key={index}
                          className='flex items-center space-x-3 rounded bg-gray-50 p-3 dark:bg-gray-800'
                        >
                          <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200'>
                            {author.avatar ? (
                              <img
                                src={author.avatar}
                                alt={author.name}
                                className='h-full w-full object-cover'
                                onError={e => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  target.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <div
                              className={`flex h-full w-full items-center justify-center ${author.avatar ? 'hidden' : ''}`}
                            >
                              <span className='text-sm font-semibold text-gray-600'>
                                {author.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className='flex-1'>
                            <div className='font-medium text-gray-900 dark:text-gray-100'>
                              {author.name}
                            </div>
                            {author.title && (
                              <div className='text-sm text-gray-600 dark:text-gray-400'>
                                {author.title}
                              </div>
                            )}
                            {author.email && (
                              <div className='text-sm text-gray-500 dark:text-gray-500'>
                                {author.email}
                              </div>
                            )}
                            {author.avatar && (
                              <div className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
                                头像: {author.avatar}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 附件 */}
                {ensureArray(selectedResearch.attachments).length > 0 && (
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      附件
                    </label>
                    <div className='mt-1 space-y-2'>
                      {ensureArray(selectedResearch.attachments).map((attachment: any, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-800'
                        >
                          <div className='flex items-center space-x-2'>
                            <FileText className='h-4 w-4 text-gray-500' />
                            <span className='text-sm'>{attachment.name}</span>
                            {attachment.type && (
                              <Badge variant='outline' className='text-xs'>
                                {attachment.type}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => window.open(attachment.url, '_blank')}
                          >
                            下载
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 其他信息 */}
                <div className='grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3'>
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      特色研究
                    </label>
                    <p className='mt-1 text-sm'>{selectedResearch.featured ? '是' : '否'}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      发布日期
                    </label>
                    <p className='mt-1 text-sm'>{formatDate(selectedResearch.publishedAt)}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      更新时间
                    </label>
                    <p className='mt-1 text-sm'>{formatDate(selectedResearch.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 删除确认对话框 */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
              <DialogDescription>
                您确定要删除研究 "{selectedResearch?.title}" 吗？此操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <div className='flex justify-end space-x-2'>
              <Button variant='outline' onClick={() => setShowDeleteDialog(false)}>
                取消
              </Button>
              <Button variant='destructive' onClick={handleDelete}>
                删除
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 创建/编辑表单 */}
        <ResearchEditForm
          research={showEditDialog ? selectedResearch || undefined : undefined}
          open={showCreateDialog || showEditDialog}
          onOpenChange={open => {
            if (!open) {
              setShowCreateDialog(false)
              setShowEditDialog(false)
              setSelectedResearch(null)
            }
          }}
          onSave={showEditDialog ? handleUpdate : handleCreate}
        />
      </div>
    </AdminLayout>
  )
}
