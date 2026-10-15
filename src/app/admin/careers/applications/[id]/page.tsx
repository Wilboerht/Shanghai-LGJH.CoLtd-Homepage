'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  // Mail,
  // Phone,
  // Calendar,
  Briefcase,
  // User,
  FileText,
  // Check,
  // X,
  ExternalLink,
  // Eye,
  Download,
} from 'lucide-react'

interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  jobDepartment: string
  jobLocation: string
  applicantName: string
  email: string
  phone: string
  introduction: string
  resumeUrl?: string
  resumeName?: string
  resumeType?: string
  resumeSize?: number
  hasResume: boolean
  status: 'NEW' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'REJECTED'
  adminNotes?: string
  processedBy?: string
  processedAt?: string
  createdAt: string
}

interface JobDetails {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary?: string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  isHot: boolean
  isUrgent: boolean
  status: string
  createdAt: string
  updatedAt: string
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const applicationId = params.id as string

  // 获取申请详情
  const fetchApplicationDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/forms/applications/${applicationId}`)
      if (!response.ok) throw new Error('获取申请详情失败')

      const result = await response.json()
      setApplication(result.application)

      // 同时获取职位详情
      if (result.application.jobId) {
        fetchJobDetails(result.application.jobId)
      }
    } catch (_error) {
      console.error('获取申请详情失败:', _error)
    } finally {
      setLoading(false)
    }
  }

  // 获取职位详情
  const fetchJobDetails = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/content/careers/jobs/${jobId}`)
      if (!response.ok) {
        console.warn('获取职位详情失败，可能职位已删除')
        return
      }
      const data = await response.json()
      setJobDetails(data)
    } catch (_error) {
      console.error('获取职位详情失败:', _error)
    }
  }

  // 更新申请状态
  const updateApplicationStatus = async (status: string) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/forms/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
        }),
      })

      if (!response.ok) throw new Error('更新状态失败')

      await fetchApplicationDetail()
    } catch (_error) {
      console.error('更新状态失败:', _error)
    } finally {
      setUpdating(false)
    }
  }

  // 加入人才储备库
  const addToTalentPool = async () => {
    if (!application) return

    try {
      setUpdating(true)
      const response = await fetch('/api/admin/talent-pool/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          rating: 3,
          availability: 'AVAILABLE',
          addedReason: '从招聘申请转入',
          notes: `从"${application.jobTitle}"职位申请转入人才储备库`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '加入人才储备库失败')
      }

      alert('已成功加入人才储备库！')
    } catch (_error) {
      console.error('加入人才储备库失败:', _error)
      alert(_error instanceof Error ? _error.message : '加入人才储备库失败，请稍后重试')
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetail()
    }
  }, [applicationId])

  // 自动更新状态：当查看申请时，如果是新申请，自动标记为审核中
  useEffect(() => {
    if (application && application.status === 'NEW') {
      updateApplicationStatus('REVIEWING')
    }
  }, [application])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge className='border-yellow-300 bg-yellow-100 text-yellow-800'>新申请</Badge>
      case 'REVIEWING':
        return <Badge className='border-blue-300 bg-blue-100 text-blue-800'>审核中</Badge>
      case 'INTERVIEW':
        return <Badge className='border-purple-300 bg-purple-100 text-purple-800'>面试邀约</Badge>
      case 'OFFER':
        return <Badge className='border-green-300 bg-green-100 text-green-800'>已发Offer</Badge>
      case 'REJECTED':
        return <Badge className='border-red-300 bg-red-100 text-red-800'>已拒绝</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  if (!application) {
    return (
      <div className='py-12 text-center'>
        <p className='text-gray-600 dark:text-gray-400'>申请不存在</p>
        <Button variant='outline' onClick={() => router.back()} className='mt-4'>
          返回
        </Button>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* 顶部导航栏 */}
      <div className='border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button variant='ghost' onClick={() => router.back()}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                返回
              </Button>
              <div className='flex items-center gap-3'>
                <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {application.applicantName}
                </h1>
                {getStatusBadge(application.status)}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className='flex gap-2'>
              <Button
                size='sm'
                onClick={() => updateApplicationStatus('INTERVIEW')}
                disabled={updating || application.status === 'INTERVIEW'}
                className='bg-blue-600 text-white hover:bg-blue-700'
              >
                面试邀约
              </Button>
              <Button
                size='sm'
                onClick={() => updateApplicationStatus('OFFER')}
                disabled={updating || application.status === 'OFFER'}
                className='bg-green-600 text-white hover:bg-green-700'
              >
                发放Offer
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => updateApplicationStatus('REJECTED')}
                disabled={updating}
                className='text-red-600 hover:bg-red-50'
              >
                拒绝
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={addToTalentPool}
                disabled={updating}
                className='text-purple-600 hover:bg-purple-50'
              >
                加入储备库
              </Button>
            </div>
          </div>
        </div>

        {/* 申请者基本信息 */}
        <div className='border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-600 dark:bg-gray-700/50'>
          <div className='grid grid-cols-4 gap-6 text-sm'>
            <div>
              <span className='text-gray-500 dark:text-gray-400'>职位：</span>
              <span className='ml-2 text-gray-900 dark:text-white'>{application.jobTitle}</span>
            </div>
            <div>
              <span className='text-gray-500 dark:text-gray-400'>邮箱：</span>
              <span className='ml-2 text-gray-900 dark:text-white'>{application.email}</span>
            </div>
            <div>
              <span className='text-gray-500 dark:text-gray-400'>电话：</span>
              <span className='ml-2 text-gray-900 dark:text-white'>
                {application.phone || '未提供'}
              </span>
            </div>
            <div>
              <span className='text-gray-500 dark:text-gray-400'>申请时间：</span>
              <span className='ml-2 text-gray-900 dark:text-white'>
                {formatDate(application.createdAt)}
              </span>
            </div>
          </div>

          {/* 个人介绍 */}
          {application.introduction && (
            <div className='mt-3 border-t border-gray-200 pt-3 dark:border-gray-600'>
              <div className='flex items-start gap-2'>
                <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  个人介绍：
                </span>
                <p className='flex-1 text-sm leading-relaxed text-gray-900 dark:text-white'>
                  {application.introduction}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className='flex h-[calc(100vh-180px)]'>
        {/* 简历预览 */}
        <div className='flex-1 bg-white dark:bg-gray-800'>
          <div className='flex h-full flex-col'>
            <div className='flex items-center justify-between border-b border-gray-200 px-6 py-3 dark:border-gray-700'>
              <h2 className='font-medium text-gray-900 dark:text-white'>简历预览</h2>
              {application.resumeUrl && (
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => window.open(`${application.resumeUrl}?preview=true`, '_blank')}
                  >
                    <ExternalLink className='mr-1 h-3 w-3' />
                    新窗口打开
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => window.open(application.resumeUrl, '_blank')}
                  >
                    <Download className='mr-1 h-3 w-3' />
                    下载
                  </Button>
                </div>
              )}
            </div>

            <div className='flex-1 p-6'>
              {application.resumeUrl ? (
                <div className='h-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'>
                  <iframe
                    src={`${application.resumeUrl}?preview=true`}
                    className='h-full w-full'
                    title='简历预览'
                  />
                </div>
              ) : (
                <div className='flex h-full items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700'>
                  <div className='text-center'>
                    <FileText className='mx-auto h-12 w-12 text-gray-400' />
                    <p className='mt-2 text-gray-500 dark:text-gray-400'>未上传简历</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 职位信息 */}
        <div className='w-80 overflow-y-auto border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
          <div className='border-b border-gray-200 px-6 py-3 dark:border-gray-700'>
            <h2 className='font-medium text-gray-900 dark:text-white'>职位信息</h2>
          </div>

          <div className='space-y-6 p-6'>
            {jobDetails ? (
              <>
                {/* 基本信息 */}
                <div>
                  <h3 className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
                    基本信息
                  </h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>职位</span>
                      <span className='text-gray-900 dark:text-white'>{jobDetails.title}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>部门</span>
                      <span className='text-gray-900 dark:text-white'>{jobDetails.department}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>地点</span>
                      <span className='text-gray-900 dark:text-white'>{jobDetails.location}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>类型</span>
                      <span className='text-gray-900 dark:text-white'>{jobDetails.type}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>经验</span>
                      <span className='text-gray-900 dark:text-white'>{jobDetails.experience}</span>
                    </div>
                    {jobDetails.salary && (
                      <div className='flex justify-between'>
                        <span className='text-gray-500'>薪资</span>
                        <span className='text-gray-900 dark:text-white'>{jobDetails.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 任职要求 */}
                {jobDetails.requirements && jobDetails.requirements.length > 0 && (
                  <div>
                    <h3 className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
                      任职要求
                    </h3>
                    <ul className='space-y-2 text-sm'>
                      {jobDetails.requirements.map((req: string, index: number) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 text-xs text-blue-500'>•</span>
                          <span className='text-gray-700 dark:text-gray-300'>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 福利待遇 */}
                {jobDetails.benefits && jobDetails.benefits.length > 0 && (
                  <div>
                    <h3 className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
                      福利待遇
                    </h3>
                    <ul className='space-y-2 text-sm'>
                      {jobDetails.benefits.map((benefit: string, index: number) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 text-xs text-green-500'>•</span>
                          <span className='text-gray-700 dark:text-gray-300'>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 职位描述 */}
                {jobDetails.description && (
                  <div>
                    <h3 className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
                      职位描述
                    </h3>
                    <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
                      <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
                        {jobDetails.description}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className='py-12 text-center'>
                <Briefcase className='mx-auto h-8 w-8 text-gray-400' />
                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>加载中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
