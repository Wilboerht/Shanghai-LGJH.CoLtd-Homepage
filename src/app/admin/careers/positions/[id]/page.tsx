'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
} from 'lucide-react'

interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT'
  isHot: boolean
  isUrgent: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  _count: {
    applications: number
  }
}

export default function PositionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobPosition | null>(null)
  const [loading, setLoading] = useState(true)

  const jobId = params.id as string

  // 获取职位详情
  const fetchJobDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/content/careers/jobs/${jobId}`)
      if (!response.ok) throw new Error('获取职位详情失败')

      const result = await response.json()
      setJob(result)
    } catch (error) {
      console.error('获取职位详情失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (jobId) {
      fetchJobDetail()
    }
  }, [jobId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className='bg-green-100 text-green-800'>活跃</Badge>
      case 'INACTIVE':
        return <Badge className='bg-gray-100 text-gray-800'>暂停</Badge>
      case 'DRAFT':
        return <Badge className='bg-yellow-100 text-yellow-800'>草稿</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>加载中...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className='py-12 text-center'>
        <p className='text-gray-600 dark:text-gray-400'>职位不存在</p>
        <Button variant='outline' onClick={() => router.back()} className='mt-4'>
          返回
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 返回按钮 */}
      <Button variant='ghost' onClick={() => router.back()} className='mb-4'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        返回职位列表
      </Button>

      {/* 职位头部信息 */}
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{job.title}</h1>
                {getStatusBadge(job.status)}
                {job.isHot && <Badge variant='destructive'>热门</Badge>}
                {job.isUrgent && (
                  <Badge variant='outline' className='border-orange-500 text-orange-600'>
                    急招
                  </Badge>
                )}
              </div>
              <div className='flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400'>
                <div className='flex items-center gap-1'>
                  <Briefcase className='h-4 w-4' />
                  {job.department}
                </div>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4' />
                  {job.location}
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='h-4 w-4' />
                  {job.type}
                </div>
                <div className='flex items-center gap-1'>
                  <DollarSign className='h-4 w-4' />
                  {job.salary}
                </div>
                <div className='flex items-center gap-1'>
                  <Users className='h-4 w-4' />
                  {job._count.applications} 申请
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline'>
                <Edit className='mr-2 h-4 w-4' />
                编辑
              </Button>
              <Button variant='outline' className='text-red-600 hover:text-red-700'>
                <Trash2 className='mr-2 h-4 w-4' />
                删除
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* 主要内容 */}
        <div className='space-y-6 lg:col-span-2'>
          {/* 职位描述 */}
          <Card>
            <CardHeader>
              <CardTitle>职位描述</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='prose prose-sm max-w-none dark:prose-invert'>
                <p className='whitespace-pre-wrap'>{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* 职位要求 */}
          <Card>
            <CardHeader>
              <CardTitle>职位要求</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {job.requirements.map((requirement, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='mt-1 text-blue-500'>•</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 福利待遇 */}
          <Card>
            <CardHeader>
              <CardTitle>福利待遇</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {job.benefits.map((benefit, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='mt-1 text-green-500'>•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className='space-y-6'>
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  工作经验
                </label>
                <p className='mt-1'>{job.experience}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  创建时间
                </label>
                <p className='mt-1'>{formatDate(job.createdAt)}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  更新时间
                </label>
                <p className='mt-1'>{formatDate(job.updatedAt)}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  创建者
                </label>
                <p className='mt-1'>{job.createdBy}</p>
              </div>
            </CardContent>
          </Card>

          {/* 技能标签 */}
          {job.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>技能标签</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 申请统计 */}
          <Card>
            <CardHeader>
              <CardTitle>申请统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center'>
                <div className='text-3xl font-bold text-blue-600'>{job._count.applications}</div>
                <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>总申请数</p>
                <Button className='mt-4 w-full' variant='outline'>
                  查看申请列表
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
