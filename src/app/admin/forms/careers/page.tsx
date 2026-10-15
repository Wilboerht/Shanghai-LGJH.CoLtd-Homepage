'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Briefcase,
  MapPin,
  Clock,
  FileText,
} from 'lucide-react'

interface JobPosition {
  id: number
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  status: string
  createdAt: string
  _count?: {
    applications: number
  }
}

// JobApplication interface removed - now managed in dedicated applications page

export default function CareersManagementPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [applicationsCount, setApplicationsCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'jobs'>('jobs')

  // 获取职位列表
  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/admin/content/careers/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  // 获取申请统计数据
  const fetchApplicationsCount = async () => {
    try {
      const response = await fetch('/api/admin/forms/applications/stats')
      if (response.ok) {
        const data = await response.json()
        setApplicationsCount(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching applications count:', error)
      setApplicationsCount(0)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchJobs(), fetchApplicationsCount()])
      setLoading(false)
    }
    loadData()
  }, [])

  // 删除职位
  const handleDeleteJob = async (jobId: number, jobTitle: string) => {
    const confirmed = window.confirm(
      `确定要删除职位"${jobTitle}"吗？\n\n注意：如果该职位有申请记录，将无法删除。`
    )

    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/content/careers/jobs/${jobId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('职位删除成功')
        // 重新加载职位列表
        fetchJobs()
      } else {
        const errorData = await response.json()
        alert(`删除失败: ${errorData.error}`)
      }
    } catch (error) {
      alert('网络错误，删除失败')
    }
  }

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const statusMap = {
      published: { label: '已发布', variant: 'default' as const },
      draft: { label: '草稿', variant: 'secondary' as const },
      archived: { label: '已归档', variant: 'outline' as const },
      pending: { label: '待处理', variant: 'secondary' as const },
      reviewed: { label: '已审核', variant: 'default' as const },
      rejected: { label: '已拒绝', variant: 'destructive' as const },
    }

    const config = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: 'outline' as const,
    }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>招聘管理</h1>
            <p className='mt-2 text-gray-600'>
              招聘管理功能已迁移到内容管理模块，请前往
              <button
                onClick={() => router.push('/admin/content/careers')}
                className='ml-1 text-blue-600 underline hover:text-blue-800'
              >
                新的招聘管理页面
              </button>
            </p>
          </div>
          <div className='flex space-x-3'>
            <Button
              onClick={() => router.push('/admin/content/careers')}
              className='bg-blue-600 hover:bg-blue-700'
            >
              <Briefcase className='mr-2 h-4 w-4' />
              前往新招聘管理
            </Button>
          </div>
        </div>

        {/* 迁移提示卡片 */}
        <Card className='border-blue-200 bg-blue-50'>
          <CardContent className='p-6'>
            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                  <Briefcase className='h-6 w-6 text-blue-600' />
                </div>
              </div>
              <div className='flex-1'>
                <h3 className='mb-2 text-lg font-semibold text-blue-900'>功能迁移通知</h3>
                <p className='mb-4 text-blue-700'>
                  为了提供更好的用户体验，招聘管理功能已经迁移到内容管理模块中。新的招聘管理页面集成了职位管理、申请处理和数据分析功能，提供一站式的招聘管理体验。
                </p>
                <div className='flex gap-3'>
                  <Button
                    onClick={() => router.push('/admin/content/careers')}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    <Briefcase className='mr-2 h-4 w-4' />
                    前往新招聘管理
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => router.push('/admin/content/careers?tab=applications')}
                    className='border-blue-300 text-blue-700 hover:bg-blue-50'
                  >
                    <Users className='mr-2 h-4 w-4' />
                    直接查看申请管理
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <Briefcase className='h-8 w-8 text-blue-600' />
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>总职位</p>
                  <p className='text-2xl font-bold'>{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer transition-shadow hover:shadow-md'
            onClick={() => router.push('/admin/forms/applications')}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Users className='h-8 w-8 text-green-600' />
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>总申请</p>
                    <p className='text-2xl font-bold'>{applicationsCount}</p>
                  </div>
                </div>
                <div className='text-xs font-medium text-blue-600'>点击管理 →</div>
              </div>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer transition-shadow hover:shadow-md'
            onClick={() => router.push('/admin/forms/applications?status=pending')}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Clock className='h-8 w-8 text-orange-600' />
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>待处理</p>
                    <p className='text-2xl font-bold'>-</p>
                    <p className='text-xs text-gray-500'>点击查看详情</p>
                  </div>
                </div>
                <div className='text-xs font-medium text-blue-600'>点击查看 →</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <MapPin className='h-8 w-8 text-purple-600' />
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>部门数</p>
                  <p className='text-2xl font-bold'>
                    {new Set(jobs.map(job => job.department)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 申请管理提示卡片 */}
        <Card className='border-blue-200 bg-blue-50'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <Users className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-medium text-blue-900'>招聘申请管理</h3>
                  <p className='text-sm text-blue-700'>
                    所有招聘申请现在统一在专门的申请管理页面处理
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/admin/forms/applications')}
                className='bg-blue-600 hover:bg-blue-700'
              >
                前往申请管理
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 职位管理区域 */}
        <Card>
          <CardHeader>
            <CardTitle>职位列表</CardTitle>
            <CardDescription>管理所有招聘职位，包括发布、编辑和删除操作</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='py-8 text-center'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                <p className='mt-2 text-gray-600'>加载中...</p>
              </div>
            ) : // 职位列表
            jobs.length === 0 ? (
              <div className='py-8 text-center'>
                <p className='text-gray-600'>暂无职位</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>职位信息</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>地点</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>申请数</TableHead>
                    <TableHead>发布时间</TableHead>
                    <TableHead className='text-right'>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium'>{job.title}</div>
                          <div className='text-sm text-gray-500'>{job.experience}</div>
                        </div>
                      </TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{job._count?.applications || 0}</TableCell>
                      <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() => window.open(`/careers/${job.id}`, '_blank')}
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/content/careers/jobs/${job.id}/edit`)
                              }
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              编辑职位
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              className='text-red-600 focus:text-red-600'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              删除职位
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
