'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SYSTEM' | 'FORM_SUBMISSION' | 'USER_ACTION'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  isRead: boolean
  actionUrl?: string
  actionText?: string
  metadata?: any
  createdAt: string
  readAt?: string
}

interface NotificationResponse {
  success: boolean
  data: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  unreadCount: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filterType, setFilterType] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // 加载通知
  const loadNotifications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })

      if (showUnreadOnly) {
        params.append('unreadOnly', 'true')
      }

      if (filterType !== 'all') {
        params.append('type', filterType)
      }

      const response = await fetch(`/api/admin/notifications?${params}`)
      const result: NotificationResponse = await response.json()

      if (result.success) {
        setNotifications(result.data)
        setTotalPages(result.pagination.totalPages)
        setUnreadCount(result.unreadCount)
      }
    } catch (error) {
      console.error('加载通知失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [currentPage, filterType, showUnreadOnly])

  // 标记为已读
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        loadNotifications()
      }
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }

  // 删除通知
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadNotifications()
      }
    } catch (error) {
      console.error('删除通知失败:', error)
    }
  }

  // 批量标记为已读
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications/batch', {
        method: 'POST',
      })

      if (response.ok) {
        loadNotifications()
      }
    } catch (error) {
      console.error('标记全部已读失败:', error)
    }
  }

  // 批量操作
  const batchOperation = async (action: string) => {
    if (selectedIds.length === 0) return

    try {
      const response = await fetch('/api/admin/notifications/batch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notificationIds: selectedIds,
        }),
      })

      if (response.ok) {
        setSelectedIds([])
        loadNotifications()
      }
    } catch (error) {
      console.error('批量操作失败:', error)
    }
  }

  // 获取通知类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'WARNING':
        return <AlertTriangle className='h-4 w-4 text-yellow-500' />
      case 'ERROR':
        return <AlertCircle className='h-4 w-4 text-red-500' />
      case 'SYSTEM':
        return <Bell className='h-4 w-4 text-blue-500' />
      case 'FORM_SUBMISSION':
        return <Info className='h-4 w-4 text-purple-500' />
      default:
        return <Info className='h-4 w-4 text-gray-500' />
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'LOW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  // 切换选择
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map(n => n.id))
    }
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>通知中心</h1>
            <p className='text-gray-600 dark:text-gray-400'>
              管理您的系统通知和消息
              {unreadCount > 0 && (
                <Badge className='ml-2 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'>
                  {unreadCount} 条未读
                </Badge>
              )}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={loadNotifications} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            {unreadCount > 0 && (
              <Button variant='outline' size='sm' onClick={markAllAsRead}>
                <CheckCheck className='h-4 w-4' />
                全部已读
              </Button>
            )}
          </div>
        </div>

        {/* 筛选和操作栏 */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
          {/* 筛选选项 */}
          <div className='space-y-5'>
            <div className='flex items-center gap-3'>
              <Filter className='h-5 w-5 text-blue-500' />
              <h3 className='text-base font-semibold text-gray-900 dark:text-white'>筛选通知</h3>
            </div>

            {/* 通知类型筛选 */}
            <div className='space-y-3'>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>按类型筛选</h4>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5'>
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setFilterType('all')}
                  className='h-9 justify-start'
                >
                  <Bell className='mr-2 h-4 w-4' />
                  全部类型
                </Button>
                <Button
                  variant={filterType === 'FORM_SUBMISSION' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setFilterType('FORM_SUBMISSION')}
                  className='h-9 justify-start'
                >
                  <Info className='mr-2 h-4 w-4 text-purple-500' />
                  表单提交
                </Button>
                <Button
                  variant={filterType === 'SYSTEM' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setFilterType('SYSTEM')}
                  className='h-9 justify-start'
                >
                  <Bell className='mr-2 h-4 w-4 text-blue-500' />
                  系统通知
                </Button>
                <Button
                  variant={filterType === 'USER_ACTION' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setFilterType('USER_ACTION')}
                  className='h-9 justify-start'
                >
                  <AlertCircle className='mr-2 h-4 w-4 text-orange-500' />
                  用户操作
                </Button>
                <Button
                  variant={filterType === 'SUCCESS' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setFilterType('SUCCESS')}
                  className='h-9 justify-start'
                >
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  成功通知
                </Button>
              </div>
            </div>

            {/* 读取状态筛选 */}
            <div className='space-y-3'>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>按状态筛选</h4>
              <div className='flex gap-2'>
                <Button
                  variant={!showUnreadOnly ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setShowUnreadOnly(false)}
                  className='h-9'
                >
                  全部通知
                </Button>
                <Button
                  variant={showUnreadOnly ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setShowUnreadOnly(true)}
                  className='h-9'
                >
                  <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-red-500'></div>
                    仅未读
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* 批量操作 */}
          {selectedIds.length > 0 && (
            <div className='mt-4 border-t border-gray-200 pt-4 dark:border-gray-700'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                  <CheckCheck className='h-4 w-4 text-blue-500' />
                  <span className='text-sm font-medium text-gray-900 dark:text-white'>
                    已选择 {selectedIds.length} 条通知
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => batchOperation('markAsRead')}
                    className='border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20'
                  >
                    <Check className='mr-1 h-4 w-4' />
                    标记已读
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => batchOperation('delete')}
                    className='border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
                  >
                    <Trash2 className='mr-1 h-4 w-4' />
                    删除选中
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedIds([])}
                    className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  >
                    <X className='mr-1 h-4 w-4' />
                    取消选择
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 通知列表 */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <Bell className='h-5 w-5' />
                通知列表
                {notifications.length > 0 && (
                  <Badge variant='secondary' className='ml-2'>
                    {notifications.length} 条
                  </Badge>
                )}
              </CardTitle>

              {/* 全选操作 */}
              {notifications.length > 0 && (
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={toggleSelectAll}
                    className='text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  >
                    <CheckCheck className='mr-1 h-4 w-4' />
                    {selectedIds.length === notifications.length ? '取消全选' : '全选'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <RefreshCw className='h-6 w-6 animate-spin text-gray-400' />
                <span className='ml-2 text-gray-600 dark:text-gray-400'>加载中...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className='py-8 text-center'>
                <Bell className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <p className='text-gray-600 dark:text-gray-400'>暂无通知</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      notification.isRead
                        ? 'bg-gray-50 dark:bg-gray-800/50'
                        : 'border-blue-200 bg-white dark:border-blue-800 dark:bg-gray-800'
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      {/* 选择框 */}
                      <input
                        type='checkbox'
                        checked={selectedIds.includes(notification.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, notification.id])
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== notification.id))
                          }
                        }}
                        className='mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700'
                        aria-label={`选择通知: ${notification.title}`}
                      />

                      {/* 通知图标 */}
                      <div className='mt-1 flex-shrink-0'>{getTypeIcon(notification.type)}</div>

                      {/* 通知内容 */}
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex-1'>
                            <h3
                              className={`font-medium ${
                                notification.isRead
                                  ? 'text-gray-700 dark:text-gray-300'
                                  : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <p
                              className={`mt-1 text-sm ${
                                notification.isRead
                                  ? 'text-gray-500 dark:text-gray-400'
                                  : 'text-gray-600 dark:text-gray-300'
                              }`}
                            >
                              {notification.message}
                            </p>
                          </div>

                          {/* 优先级标签 */}
                          {notification.priority !== 'NORMAL' && (
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority === 'URGENT'
                                ? '紧急'
                                : notification.priority === 'HIGH'
                                  ? '重要'
                                  : '低'}
                            </Badge>
                          )}
                        </div>

                        {/* 操作按钮和时间 */}
                        <div className='mt-3 flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            {/* 操作链接 */}
                            {notification.actionUrl && (
                              <Button
                                variant='link'
                                size='sm'
                                className='h-auto p-0 text-blue-600 hover:text-blue-700'
                                onClick={() => window.open(notification.actionUrl, '_blank')}
                              >
                                <ExternalLink className='mr-1 h-3 w-3' />
                                {notification.actionText || '查看详情'}
                              </Button>
                            )}
                          </div>

                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                              {formatTime(notification.createdAt)}
                            </span>

                            {/* 操作按钮 */}
                            <div className='flex items-center gap-1'>
                              {!notification.isRead && (
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => markAsRead(notification.id)}
                                  title='标记为已读'
                                >
                                  <Check className='h-4 w-4' />
                                </Button>
                              )}
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => deleteNotification(notification.id)}
                                title='删除通知'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
