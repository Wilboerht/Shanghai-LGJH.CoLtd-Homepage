'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/admin/stats-card'
import {
  Mail,
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  RefreshCw,
  BarChart3,
  StickyNote,
  Save,
  Edit3,
} from 'lucide-react'

interface DashboardStats {
  pendingSubmissions: number
  jobApplications: number
  totalContent: number
  totalUsers: number
  submissionGrowth: number
  applicationGrowth: number
  contentGrowth: number
  userGrowth: number
  recentActivities?: {
    submissions: Array<{
      id: string
      name: string
      subject: string
      status: string
      createdAt: string
    }>
    contentUpdates: Array<{
      type: string
      title: string
      updatedAt: string
    }>
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // 记事本状态
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesSaving, setNotesSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 格式化时间为相对时间
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return '刚刚'
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}小时前`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}天前`

    return date.toLocaleDateString('zh-CN')
  }

  // 获取状态对应的中文
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      NEW: '新提交',
      PROCESSING: '处理中',
      REPLIED: '已回复',
      CLOSED: '已关闭',
    }
    return statusMap[status] || status
  }

  // 加载记事本内容
  const loadNotes = () => {
    if (typeof window !== 'undefined' && mounted) {
      const savedNotes = localStorage.getItem('admin-dashboard-notes')
      if (savedNotes) {
        setNotes(savedNotes)
      }
    }
  }

  // 保存记事本内容
  const saveNotes = async () => {
    setNotesSaving(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-dashboard-notes', notes)
      }
      setIsEditingNotes(false)
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('保存记事本失败:', error)
    } finally {
      setNotesSaving(false)
    }
  }

  // 取消编辑
  const cancelEdit = () => {
    loadNotes() // 重新加载保存的内容
    setIsEditingNotes(false)
  }

  // 获取仪表板统计数据
  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      // 使用真实的仪表板API
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('API请求失败:', response.status, response.statusText)
        // 如果API失败，使用备用数据
        const fallbackStats = {
          pendingSubmissions: 0,
          jobApplications: 0,
          totalContent: 0,
          totalUsers: 0,
          submissionGrowth: 0,
          applicationGrowth: 0,
          contentGrowth: 0,
          userGrowth: 0,
        }
        setStats(fallbackStats)
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardStats()
    setRefreshing(false)
  }

  useEffect(() => {
    setMounted(true)
    fetchDashboardStats()
  }, [])

  useEffect(() => {
    if (mounted) {
      loadNotes() // 只在客户端挂载后加载记事本内容
    }
  }, [mounted])

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <RefreshCw className='mx-auto mb-4 h-8 w-8 animate-spin text-gray-400' />
            <p className='text-gray-500'>加载仪表板数据中...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题和操作 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>管理仪表板</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
              欢迎使用临港景鸿内容管理系统
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
            <Button onClick={() => (window.location.href = '/admin/analytics')}>
              <BarChart3 className='mr-2 h-4 w-4' />
              查看详细报表
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <StatsCard
              title='待处理表单'
              value={stats.pendingSubmissions}
              change={stats.submissionGrowth}
              icon={Mail}
              color='blue'
            />
            <StatsCard
              title='招聘申请'
              value={stats.jobApplications}
              change={stats.applicationGrowth}
              icon={Briefcase}
              color='green'
            />
            <StatsCard
              title='内容总数'
              value={stats.totalContent}
              change={stats.contentGrowth}
              icon={FileText}
              color='purple'
            />
            <StatsCard
              title='用户总数'
              value={stats.totalUsers}
              change={stats.userGrowth}
              icon={Users}
              color='orange'
            />
          </div>
        )}

        {/* 记事本和最近活动 */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* 记事本（便利贴） */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <StickyNote className='h-5 w-5 text-yellow-500' />
                记事本
              </CardTitle>
              <CardDescription>记录您的想法和待办事项</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className='space-y-4'>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder='在这里记录您的想法、待办事项或重要提醒...'
                    className='h-40 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400'
                    autoFocus
                  />
                  <div className='flex gap-2'>
                    <Button
                      onClick={saveNotes}
                      disabled={notesSaving}
                      size='sm'
                      className='flex items-center gap-2'
                    >
                      {notesSaving ? (
                        <RefreshCw className='h-4 w-4 animate-spin' />
                      ) : (
                        <Save className='h-4 w-4' />
                      )}
                      {notesSaving ? '保存中...' : '保存'}
                    </Button>
                    <Button onClick={cancelEdit} variant='outline' size='sm' disabled={notesSaving}>
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='min-h-[120px] rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20'>
                    {notes ? (
                      <div className='whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300'>
                        {notes}
                      </div>
                    ) : (
                      <div className='text-sm italic text-gray-500 dark:text-gray-400'>
                        点击编辑按钮开始记录...
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => setIsEditingNotes(true)}
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2'
                  >
                    <Edit3 className='h-4 w-4' />
                    编辑记事本
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 最近活动 */}
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>系统最新动态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {stats?.recentActivities ? (
                  <>
                    {/* 最近表单提交 */}
                    {stats.recentActivities.submissions.slice(0, 3).map(submission => (
                      <div key={submission.id} className='flex items-start space-x-3'>
                        <div className='flex-shrink-0'>
                          <CheckCircle className='h-5 w-5 text-green-500' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-medium text-gray-900 dark:text-white'>
                            新的联系表单提交
                          </p>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            来自{submission.name}的{submission.subject} -{' '}
                            {formatRelativeTime(submission.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* 最近内容更新 */}
                    {stats.recentActivities.contentUpdates.slice(0, 2).map((update, index) => (
                      <div key={`content-${index}`} className='flex items-start space-x-3'>
                        <div className='flex-shrink-0'>
                          <Clock className='h-5 w-5 text-blue-500' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-medium text-gray-900 dark:text-white'>
                            {update.type === 'product' ? '产品信息更新' : '内容更新'}
                          </p>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {update.title} - {formatRelativeTime(update.updatedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  /* 加载状态或无数据时的占位符 */
                  <div className='space-y-4'>
                    <div className='flex items-start space-x-3'>
                      <div className='flex-shrink-0'>
                        <div className='h-5 w-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700'></div>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='mb-2 h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700'></div>
                        <div className='h-3 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700'></div>
                      </div>
                    </div>
                    <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
                      {loading ? '加载中...' : '暂无最近活动'}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
