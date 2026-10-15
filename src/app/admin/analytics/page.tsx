'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  Users,
  Mail,
  FileText,
  Calendar,
  Download,
  RefreshCw,
  Activity,
  Eye,
  MessageSquare,
} from 'lucide-react'
import { AnalyticsChart } from '@/components/admin/analytics-chart'
import { StatsCard } from '@/components/admin/stats-card'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalSubmissions: number
    totalContent: number
    totalViews: number
    userGrowth: number
    submissionGrowth: number
    contentGrowth: number
    viewGrowth: number
  }
  submissions: {
    daily: Array<{ date: string; count: number }>
    byStatus: Array<{ status: string; count: number }>
  }
  content: {
    byCategory: Array<{ category: string; count: number }>
    recentUpdates: Array<{ date: string; count: number }>
  }
  users: {
    registrations: Array<{ date: string; count: number }>
    activity: Array<{ date: string; active: number }>
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  // 获取统计数据
  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // 使用真实的统计API
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        console.error('API请求失败:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  // 导出数据
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/analytics/export?range=${timeRange}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('导出数据失败:', error)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  if (loading && !data) {
    return (
      <AdminLayout>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <RefreshCw className='mx-auto mb-4 h-8 w-8 animate-spin text-gray-400' />
            <p className='text-gray-500'>加载统计数据中...</p>
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
            <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>统计报表</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
              查看系统使用情况和数据趋势
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='w-32'>
                <Calendar className='mr-2 h-4 w-4' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='7d'>最近7天</SelectItem>
                <SelectItem value='30d'>最近30天</SelectItem>
                <SelectItem value='90d'>最近90天</SelectItem>
                <SelectItem value='1y'>最近1年</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='outline' onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Button onClick={handleExport}>
              <Download className='mr-2 h-4 w-4' />
              导出
            </Button>
          </div>
        </div>

        {/* 概览统计卡片 */}
        {data && (
          <>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <StatsCard
                title='总用户数'
                value={data.overview.totalUsers}
                change={data.overview.userGrowth}
                icon={Users}
                color='blue'
              />
              <StatsCard
                title='表单提交'
                value={data.overview.totalSubmissions}
                change={data.overview.submissionGrowth}
                icon={Mail}
                color='green'
              />
              <StatsCard
                title='内容数量'
                value={data.overview.totalContent}
                change={data.overview.contentGrowth}
                icon={FileText}
                color='purple'
              />
              <StatsCard
                title='页面访问'
                value={data.overview.totalViews}
                change={data.overview.viewGrowth}
                icon={Eye}
                color='orange'
              />
            </div>

            {/* 图表区域 */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* 表单提交趋势 */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <MessageSquare className='h-5 w-5' />
                    表单提交趋势
                  </CardTitle>
                  <CardDescription>
                    {timeRange === '7d'
                      ? '最近7天'
                      : timeRange === '30d'
                        ? '最近30天'
                        : timeRange === '90d'
                          ? '最近90天'
                          : '最近1年'}
                    的表单提交情况
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    data={data.submissions.daily}
                    type='line'
                    xKey='date'
                    yKey='count'
                    color='#3b82f6'
                  />
                </CardContent>
              </Card>

              {/* 用户活动趋势 */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Activity className='h-5 w-5' />
                    用户活动趋势
                  </CardTitle>
                  <CardDescription>用户注册和活跃度变化</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    data={data.users.activity}
                    type='area'
                    xKey='date'
                    yKey='active'
                    color='#10b981'
                  />
                </CardContent>
              </Card>

              {/* 内容分类统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <TrendingUp className='h-5 w-5' />
                    内容分类统计
                  </CardTitle>
                  <CardDescription>各类内容的数量分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart
                    data={data.content.byCategory}
                    type='doughnut'
                    xKey='category'
                    yKey='count'
                    color='#f59e0b'
                  />
                </CardContent>
              </Card>
            </div>

            {/* 详细数据表格 */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* 表单状态统计 */}
              <Card>
                <CardHeader>
                  <CardTitle>表单处理状态</CardTitle>
                  <CardDescription>各状态表单的数量统计</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {data.submissions.byStatus.map((item, index) => (
                      <div key={index} className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>{item.status}</span>
                        <span className='text-sm text-gray-600'>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 最近内容更新 */}
              <Card>
                <CardHeader>
                  <CardTitle>内容更新活动</CardTitle>
                  <CardDescription>最近的内容更新情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {data.content.recentUpdates.slice(0, 5).map((item, index) => (
                      <div key={index} className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>{item.date}</span>
                        <span className='text-sm text-gray-600'>{item.count} 次更新</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
