'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  Search,
  Download,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  User,
  FileText,
  ExternalLink,
  MoreHorizontal,
  UserCheck,
  Filter,
} from 'lucide-react'

interface JobApplication {
  id: string
  jobId: string
  applicantName: string
  email: string
  phone?: string
  introduction: string
  resumeUrl?: string
  resumeName?: string
  resumeType?: string
  resumeSize?: number
  status: 'NEW' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'REJECTED'
  createdAt: string
  processedAt?: string
  adminNotes?: string
  processor?: {
    id: string
    name: string
    email: string
  }
  job?: {
    id: string
    title: string
    department: string
    location: string
  }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  REVIEWING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  INTERVIEW: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  OFFER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const statusLabels = {
  NEW: '新申请',
  REVIEWING: '审核中',
  INTERVIEW: '面试中',
  OFFER: '已录用',
  REJECTED: '已拒绝',
}

interface ApplicationsManagerProps {
  embedded?: boolean // 是否嵌入在其他页面中
  showHeader?: boolean // 是否显示标题
}

export function ApplicationsManager({
  embedded = false,
  showHeader = true,
}: ApplicationsManagerProps) {
  const router = useRouter()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // 获取申请列表
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/forms/applications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
        setPagination(data.pagination || pagination)
      }
    } catch (error) {
      console.error('获取申请列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 更新申请状态
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/forms/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchApplications() // 重新获取数据
      } else {
        alert('更新状态失败')
      }
    } catch (error) {
      console.error('更新申请状态失败:', error)
      alert('更新状态失败')
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 格式化文件大小
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '未知'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  useEffect(() => {
    fetchApplications()
  }, [pagination.page, searchTerm, statusFilter])

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>加载申请数据中...</p>
        </div>
      </div>
    )
  }

  const content = (
    <div className='space-y-6'>
      {/* 搜索和筛选 */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='搜索申请人姓名、邮箱...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-9'
          />
        </div>
        <div className='flex gap-2'>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='筛选状态' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>所有状态</SelectItem>
              <SelectItem value='NEW'>新申请</SelectItem>
              <SelectItem value='REVIEWING'>审核中</SelectItem>
              <SelectItem value='INTERVIEW'>面试中</SelectItem>
              <SelectItem value='OFFER'>已录用</SelectItem>
              <SelectItem value='REJECTED'>已拒绝</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' onClick={fetchApplications}>
            <RefreshCw className='mr-2 h-4 w-4' />
            刷新
          </Button>
          {!embedded && (
            <Button variant='outline'>
              <Download className='mr-2 h-4 w-4' />
              导出
            </Button>
          )}
        </div>
      </div>

      {/* 申请列表 */}
      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[20%]'>申请人</TableHead>
              <TableHead className='w-[25%]'>申请职位</TableHead>
              <TableHead className='w-[15%]'>联系方式</TableHead>
              <TableHead className='w-[12%]'>状态</TableHead>
              <TableHead className='w-[13%]'>申请时间</TableHead>
              <TableHead className='w-[15%] text-right'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <div className='font-medium'>{application.applicantName}</div>
                    <div className='text-sm text-gray-600'>{application.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Briefcase className='h-4 w-4 text-gray-400' />
                    <div>
                      <div className='font-medium'>{application.job?.title || '职位已删除'}</div>
                      <div className='text-sm text-gray-500'>{application.job?.department}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='text-sm'>
                    {application.phone && <div>{application.phone}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[application.status]}>
                    {statusLabels[application.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className='text-sm text-gray-600'>{formatDate(application.createdAt)}</span>
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
                          setSelectedApplication(application)
                          setIsDetailDialogOpen(true)
                        }}
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        查看简历
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateApplicationStatus(application.id, 'REVIEWING')}
                        disabled={application.status === 'REVIEWING'}
                      >
                        <UserCheck className='mr-2 h-4 w-4' />
                        标记为审核中
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateApplicationStatus(application.id, 'INTERVIEW')}
                        disabled={application.status === 'INTERVIEW'}
                      >
                        <Calendar className='mr-2 h-4 w-4' />
                        安排面试
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateApplicationStatus(application.id, 'OFFER')}
                        disabled={application.status === 'OFFER'}
                      >
                        <UserCheck className='mr-2 h-4 w-4' />
                        发放Offer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            共 {pagination.total} 条记录，第 {pagination.page} / {pagination.totalPages} 页
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className='h-4 w-4' />
              上一页
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={!pagination.hasNext}
            >
              下一页
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {/* 申请简历对话框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>申请简历</DialogTitle>
            <DialogDescription>查看申请人的简历和详细信息</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>申请人姓名</label>
                  <p className='text-sm text-gray-600'>{selectedApplication.applicantName}</p>
                </div>
                <div>
                  <label className='text-sm font-medium'>邮箱地址</label>
                  <p className='text-sm text-gray-600'>{selectedApplication.email}</p>
                </div>
                <div>
                  <label className='text-sm font-medium'>联系电话</label>
                  <p className='text-sm text-gray-600'>{selectedApplication.phone || '未提供'}</p>
                </div>
                <div>
                  <label className='text-sm font-medium'>申请职位</label>
                  <p className='text-sm text-gray-600'>
                    {selectedApplication.job?.title || '职位已删除'}
                    {selectedApplication.job?.department && (
                      <span className='text-gray-400'> · {selectedApplication.job.department}</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium'>申请状态</label>
                  <Badge className={statusColors[selectedApplication.status]}>
                    {statusLabels[selectedApplication.status]}
                  </Badge>
                </div>
              </div>
              <div>
                <label className='text-sm font-medium'>自我介绍</label>
                <p className='mt-1 rounded bg-gray-50 p-3 text-sm text-gray-600'>
                  {selectedApplication.introduction}
                </p>
              </div>
              {selectedApplication.resumeUrl && (
                <div>
                  <label className='text-sm font-medium'>简历文件</label>
                  <div className='mt-1 flex items-center justify-between rounded bg-gray-50 p-3'>
                    <div className='flex items-center gap-2'>
                      <FileText className='h-4 w-4' />
                      <span className='text-sm'>{selectedApplication.resumeName}</span>
                      <span className='text-xs text-gray-500'>
                        ({formatFileSize(selectedApplication.resumeSize)})
                      </span>
                    </div>
                    <Button variant='outline' size='sm' asChild>
                      <a
                        href={selectedApplication.resumeUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <ExternalLink className='mr-2 h-4 w-4' />
                        查看简历
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle>申请管理</CardTitle>
          <CardDescription>查看和处理所有职位申请</CardDescription>
        </CardHeader>
      )}
      <CardContent>{content}</CardContent>
    </Card>
  )
}
