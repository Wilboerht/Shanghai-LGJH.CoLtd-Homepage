'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Star,
  Calendar,
  Target,
  Award,
} from 'lucide-react'

interface AnalyticsData {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  recentApplications: number
  departments: Array<{ name: string; count: number }>
  applicationStatusDistribution: Array<{ status: string; count: number }>
  hotJobs: Array<{
    id: string
    title: string
    department: string
    location: string
    applicationCount: number
  }>
  monthlyTrends: Array<{
    month: string
    applications: number
    hires: number
  }>
  conversionRates: {
    applicationToInterview: number
    interviewToOffer: number
    offerToHire: number
  }
  metrics: {
    averageApplicationsPerJob: number
    applicationGrowthRate: number
    topPerformingDepartment: string
    averageProcessingTime: number
  }
  efficiency: {
    averageRecruitmentCycle: number
    resumeScreeningRate: number
    interviewPassRate: number
  }
  quality: {
    applicationQualityScore: number
    positionFillRate: number
    recruitmentSuccessRate: number
  }
  cost: {
    averageCostPerApplication: number
    averageCostPerHire: number
    mostEffectiveDepartment: string
  }
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/content/careers/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('获取分析数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>加载分析数据中...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className='py-8 text-center'>
        <p className='text-gray-600'>无法加载分析数据</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 关键指标 */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>转化率</CardTitle>
            <Target className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics.conversionRates?.applicationToInterview || 0}%
            </div>
            <p className='text-xs text-muted-foreground'>申请到面试转化率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>录用率</CardTitle>
            <Award className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{analytics.conversionRates?.offerToHire || 0}%</div>
            <p className='text-xs text-muted-foreground'>Offer到入职转化率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>平均处理时间</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics.metrics?.averageProcessingTime || 0}天
            </div>
            <p className='text-xs text-muted-foreground'>从申请到处理完成</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>活跃度</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {analytics.totalApplications > 0
                ? Math.round((analytics.recentApplications / analytics.totalApplications) * 100)
                : 0}
              %
            </div>
            <p className='text-xs text-muted-foreground'>近7天申请占比</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* 部门招聘统计 */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BarChart3 className='h-5 w-5' />
              部门招聘统计
            </CardTitle>
            <CardDescription>各部门职位数量分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {analytics.departments.map((dept, index) => {
                const maxCount = Math.max(...analytics.departments.map(d => d.count))
                const percentage = (dept.count / maxCount) * 100

                return (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>{dept.name}</span>
                      <Badge variant='outline'>{dept.count} 个职位</Badge>
                    </div>
                    <div className='h-2 w-full rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 申请状态分布 */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              申请状态分布
            </CardTitle>
            <CardDescription>申请处理进度统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {(() => {
                const statusLabels: Record<string, string> = {
                  PENDING: '待处理',
                  REVIEWING: '审核中',
                  INTERVIEW: '已面试',
                  OFFER: '已录用',
                  REJECTED: '已拒绝',
                }

                const statusColors: Record<string, string> = {
                  PENDING: 'bg-yellow-500',
                  REVIEWING: 'bg-blue-500',
                  INTERVIEW: 'bg-purple-500',
                  OFFER: 'bg-green-500',
                  REJECTED: 'bg-red-500',
                }

                // 创建所有状态的完整列表，包括没有数据的状态
                const allStatuses = Object.keys(statusLabels).map(statusKey => {
                  const existingStatus = analytics.applicationStatusDistribution.find(
                    s => s.status === statusKey
                  )
                  return {
                    status: statusKey,
                    count: existingStatus ? existingStatus.count : 0,
                  }
                })

                return allStatuses.map((status, index) => {
                  const percentage =
                    analytics.totalApplications > 0
                      ? (status.count / analytics.totalApplications) * 100
                      : 0

                  return (
                    <div key={index} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          {statusLabels[status.status] || status.status}
                        </span>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-600'>{percentage.toFixed(1)}%</span>
                          <Badge variant='outline'>{status.count}</Badge>
                        </div>
                      </div>
                      <div className='h-2 w-full rounded-full bg-gray-200'>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${statusColors[status.status] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 热门职位排行 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5' />
            热门职位排行
          </CardTitle>
          <CardDescription>根据申请数量排序的热门职位</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {analytics.hotJobs.slice(0, 8).map((job, index) => (
              <div
                key={job.id}
                className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600'>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className='font-medium'>{job.title}</h4>
                    <p className='text-sm text-gray-600'>
                      {job.department} • {job.location}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-bold text-blue-600'>{job.applicationCount}</div>
                  <p className='text-xs text-gray-500'>申请数</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 招聘效率指标 */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>招聘效率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm'>平均招聘周期</span>
                <span className='font-medium'>
                  {analytics.efficiency?.averageRecruitmentCycle || 0}天
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm'>简历筛选率</span>
                <span className='font-medium'>
                  {analytics.efficiency?.resumeScreeningRate || 0}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm'>面试通过率</span>
                <span className='font-medium'>{analytics.efficiency?.interviewPassRate || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>质量指标</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm'>申请质量评分</span>
                <span className='font-medium'>
                  {analytics.quality?.applicationQualityScore || 0}/10
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm'>职位完成率</span>
                <span className='font-medium'>{analytics.quality?.positionFillRate || 0}%</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm'>招聘成功率</span>
                <span className='font-medium'>
                  {analytics.quality?.recruitmentSuccessRate || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>成本分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm'>每次录用成本</span>
                <span className='font-medium'>
                  ¥{analytics.cost?.averageCostPerHire?.toLocaleString() || 0}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm'>效率最高部门</span>
                <span className='font-medium'>
                  {analytics.cost?.mostEffectiveDepartment || '暂无数据'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm'>每申请成本</span>
                <span className='font-medium'>
                  ¥{analytics.cost?.averageCostPerApplication?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
