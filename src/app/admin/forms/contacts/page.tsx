'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
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
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  User,
  Building,
  MessageSquare,
} from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'NEW' | 'READ' | 'PROCESSING' | 'REPLIED' | 'CLOSED'
  createdAt: string
  processedAt?: string
  adminNotes?: string
  processor?: {
    id: string
    name: string
    email: string
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
  READ: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  PROCESSING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  REPLIED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

const statusLabels = {
  NEW: '新提交',
  READ: '已查看',
  PROCESSING: '处理中',
  REPLIED: '已回复',
  CLOSED: '已关闭',
}

export default function ContactsManagePage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  // 获取联系表单数据
  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)

      const response = await fetch(`/api/admin/forms/contacts?${params}`)
      if (!response.ok) throw new Error('获取数据失败')

      const data = await response.json()
      setContacts(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error('获取联系表单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 更新表单状态
  const updateContactStatus = async (id: string, status: string, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/forms/contacts?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      })

      if (!response.ok) throw new Error('更新失败')

      await fetchContacts()
      setSelectedContact(null)
    } catch (error) {
      console.error('更新状态失败:', error)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [pagination.page, filters])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>联系表单管理</h1>
          <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
            查看和管理网站联系表单提交
          </p>
        </div>

        {/* 统计卡片 */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>总提交数</CardTitle>
              <Mail className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{pagination.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>待处理</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {contacts.filter(c => c.status === 'NEW').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>已处理</CardTitle>
              <User className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {contacts.filter(c => c.status === 'REPLIED').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>已归档</CardTitle>
              <Building className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-600'>
                {contacts.filter(c => c.status === 'CLOSED').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 筛选和搜索 */}
        <Card>
          <CardHeader>
            <CardTitle>筛选和搜索</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                  <Input
                    placeholder='搜索姓名、邮箱、主题或公司...'
                    value={filters.search}
                    onChange={e => setFilters({ ...filters, search: e.target.value })}
                    className='pl-10'
                  />
                </div>
              </div>
              <Select
                value={filters.status || 'all'}
                onValueChange={value =>
                  setFilters({ ...filters, status: value === 'all' ? '' : value })
                }
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='选择状态' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>全部状态</SelectItem>
                  <SelectItem value='NEW'>新提交</SelectItem>
                  <SelectItem value='READ'>已查看</SelectItem>
                  <SelectItem value='PROCESSING'>处理中</SelectItem>
                  <SelectItem value='REPLIED'>已回复</SelectItem>
                  <SelectItem value='CLOSED'>已关闭</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' onClick={fetchContacts} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 表单列表 */}
        <Card>
          <CardHeader>
            <CardTitle>联系表单列表</CardTitle>
            <CardDescription>
              共 {pagination.total} 条记录，第 {pagination.page} / {pagination.totalPages} 页
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>主题</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>提交时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='py-8 text-center'>
                        <RefreshCw className='mx-auto mb-2 h-6 w-6 animate-spin' />
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='py-8 text-center text-gray-500'>
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell className='font-medium'>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell className='max-w-xs truncate'>{contact.subject}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[contact.status]}>
                            {statusLabels[contact.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(contact.createdAt)}</TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setSelectedContact(contact)}
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className='max-w-2xl'>
                                <DialogHeader>
                                  <DialogTitle>联系表单详情</DialogTitle>
                                  <DialogDescription>查看和处理联系表单提交</DialogDescription>
                                </DialogHeader>
                                {selectedContact && (
                                  <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                      <div>
                                        <label className='text-sm font-medium'>姓名</label>
                                        <p className='text-sm text-gray-600'>
                                          {selectedContact.name}
                                        </p>
                                      </div>
                                      <div>
                                        <label className='text-sm font-medium'>邮箱</label>
                                        <p className='text-sm text-gray-600'>
                                          {selectedContact.email}
                                        </p>
                                      </div>
                                      {selectedContact.phone && (
                                        <div>
                                          <label className='text-sm font-medium'>电话</label>
                                          <p className='text-sm text-gray-600'>
                                            {selectedContact.phone}
                                          </p>
                                        </div>
                                      )}
                                      {selectedContact.company && (
                                        <div>
                                          <label className='text-sm font-medium'>公司</label>
                                          <p className='text-sm text-gray-600'>
                                            {selectedContact.company}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <label className='text-sm font-medium'>主题</label>
                                      <p className='text-sm text-gray-600'>
                                        {selectedContact.subject}
                                      </p>
                                    </div>
                                    <div>
                                      <label className='text-sm font-medium'>消息内容</label>
                                      <p className='whitespace-pre-wrap text-sm text-gray-600'>
                                        {selectedContact.message}
                                      </p>
                                    </div>
                                    <div className='flex flex-wrap gap-2'>
                                      <Button
                                        onClick={() =>
                                          updateContactStatus(selectedContact.id, 'READ')
                                        }
                                        disabled={selectedContact.status === 'READ'}
                                        size='sm'
                                      >
                                        标记为已查看
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          updateContactStatus(selectedContact.id, 'PROCESSING')
                                        }
                                        disabled={selectedContact.status === 'PROCESSING'}
                                        size='sm'
                                        variant='outline'
                                      >
                                        标记为处理中
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          updateContactStatus(selectedContact.id, 'REPLIED')
                                        }
                                        disabled={selectedContact.status === 'REPLIED'}
                                        size='sm'
                                        className='bg-green-600 hover:bg-green-700'
                                      >
                                        标记为已回复
                                      </Button>
                                      <Button
                                        variant='outline'
                                        onClick={() =>
                                          updateContactStatus(selectedContact.id, 'CLOSED')
                                        }
                                        disabled={selectedContact.status === 'CLOSED'}
                                        size='sm'
                                      >
                                        关闭
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className='mt-4 flex items-center justify-between'>
                <div className='text-sm text-gray-600'>
                  显示 {(pagination.page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} 条，共{' '}
                  {pagination.total} 条
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className='h-4 w-4' />
                    上一页
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={!pagination.hasNext}
                  >
                    下一页
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
