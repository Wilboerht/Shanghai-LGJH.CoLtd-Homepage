'use client'

import React, { useState, useEffect } from 'react'
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
  Users,
  Shield,
  Clock,
  UserCheck,
} from 'lucide-react'
import { UserEditForm } from '@/components/admin/user-edit-form'

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  _count?: {
    contactSubmissions: number
    pages: number
    products: number
  }
}

export default function UsersManagePage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // 对话框状态
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole && selectedRole !== 'all' && { role: selectedRole }),
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.pagination.pages)
        setTotalCount(data.pagination.total)
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, selectedRole])

  // 计算统计数据
  const getStatsData = () => {
    const adminCount = users.filter(user => user.isAdmin).length
    const regularCount = users.filter(user => !user.isAdmin).length

    // 使用 useMemo 来避免在每次渲染时重新计算，并确保客户端和服务端一致
    const recentActiveCount = React.useMemo(() => {
      const now = new Date()
      return users.filter(user => {
        if (!user.lastLogin) return false
        const daysDiff =
          (now.getTime() - new Date(user.lastLogin).getTime()) / (1000 * 60 * 60 * 24)
        return daysDiff <= 7
      }).length
    }, [users])

    return {
      total: totalCount,
      admins: adminCount,
      regular: regularCount,
      recentActive: recentActiveCount,
    }
  }

  const stats = getStatsData()

  // 打开创建对话框
  const openCreateDialog = () => {
    setSelectedUser(null)
    setIsCreating(true)
    setIsEditOpen(true)
  }

  // 打开编辑对话框
  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setIsCreating(false)
    setIsEditOpen(true)
  }

  // 保存用户
  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      const url = isCreating ? '/api/admin/users' : `/api/admin/users/${selectedUser?.id}`

      const method = isCreating ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        setIsEditOpen(false)
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || '保存失败')
      }
    } catch (error) {
      console.error('保存用户失败:', error)
      alert('保存失败')
    }
  }

  // 删除用户
  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIsDeleteOpen(false)
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || '删除失败')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      alert('删除失败')
    }
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>用户管理</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>管理系统用户和权限</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className='mr-2 h-4 w-4' />
            新建用户
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>总用户数</p>
                  <p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                  <Users className='h-4 w-4 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>管理员</p>
                  <p className='text-2xl font-bold text-gray-900'>{stats.admins}</p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-red-100'>
                  <Shield className='h-4 w-4 text-red-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>普通用户</p>
                  <p className='text-2xl font-bold text-gray-900'>{stats.regular}</p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-100'>
                  <UserCheck className='h-4 w-4 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>近期活跃</p>
                  <p className='text-2xl font-bold text-gray-900'>{stats.recentActive}</p>
                </div>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100'>
                  <Clock className='h-4 w-4 text-orange-600' />
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
              placeholder='搜索用户姓名、邮箱...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='flex gap-2'>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className='w-40'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue placeholder='筛选角色' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全部角色</SelectItem>
                <SelectItem value='admin'>管理员</SelectItem>
                <SelectItem value='user'>普通用户</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 用户列表 */}
        <div className='rounded-lg border bg-white dark:bg-gray-800'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户信息</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className='w-[100px]'>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-center'>
                    加载中...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-center'>
                    暂无用户
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>{user.name}</div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isAdmin ? 'destructive' : 'secondary'}>
                        {user.isAdmin ? '管理员' : '普通用户'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '从未登录'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        {new Date(user.createdAt).toLocaleDateString()}
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
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDetailOpen(true)
                            }}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className='mr-2 h-4 w-4' />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
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
                ))
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
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>{isCreating ? '新建用户' : '编辑用户'}</DialogTitle>
              <DialogDescription>
                {isCreating ? '创建新的系统用户' : '修改用户信息和权限'}
              </DialogDescription>
            </DialogHeader>
            <UserEditForm
              user={selectedUser}
              isCreating={isCreating}
              onSave={handleSaveUser}
              onCancel={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* 详情查看对话框 */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>用户详情</DialogTitle>
              <DialogDescription>查看用户的详细信息和活动统计</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className='space-y-6'>
                {/* 基本信息 */}
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        用户姓名
                      </label>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                        {selectedUser.name}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        邮箱地址
                      </label>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        用户角色
                      </label>
                      <div className='mt-1'>
                        <Badge variant={selectedUser.isAdmin ? 'destructive' : 'secondary'}>
                          {selectedUser.isAdmin ? '管理员' : '普通用户'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        最后登录时间
                      </label>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                        {selectedUser.lastLogin
                          ? new Date(selectedUser.lastLogin).toLocaleString()
                          : '从未登录'}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        创建时间
                      </label>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        更新时间
                      </label>
                      <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                        {new Date(selectedUser.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 活动统计 */}
                {selectedUser._count && (
                  <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
                    <label className='mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      活动统计
                    </label>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800'>
                        <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {selectedUser._count.contactSubmissions || 0}
                        </div>
                        <div className='text-xs text-gray-600 dark:text-gray-400'>处理表单</div>
                      </div>
                      <div className='rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800'>
                        <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {selectedUser._count.pages || 0}
                        </div>
                        <div className='text-xs text-gray-600 dark:text-gray-400'>编辑页面</div>
                      </div>
                      <div className='rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800'>
                        <div className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {selectedUser._count.products || 0}
                        </div>
                        <div className='text-xs text-gray-600 dark:text-gray-400'>管理产品</div>
                      </div>
                    </div>
                  </div>
                )}
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
                您确定要删除用户 "{selectedUser?.name}" 吗？此操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <div className='mt-4 flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
                取消
              </Button>
              <Button variant='destructive' onClick={handleDeleteUser}>
                确认删除
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
