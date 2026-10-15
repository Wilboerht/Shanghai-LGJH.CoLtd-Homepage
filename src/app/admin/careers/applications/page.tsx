'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Search,
  MoreHorizontal,
  Eye,
  Check,
  X,
  Clock,
  Download,
  Mail,
  UserPlus,
  Users,
  Trash2,
  AlertTriangle,
  Calendar,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface JobApplication {
  id: string
  jobId: string
  applicantName: string
  email: string
  phone: string
  status: 'NEW' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED'
  createdAt: string
  processedAt?: string
  resumeUrl?: string
  resumeName?: string
  hasResume: boolean
  job?: {
    title: string
    department: string
  }
}

interface ApplicationsData {
  applications: JobApplication[]
  total: number
  pending: number
  reviewed: number
  interview: number
  offer: number
  hired: number
  rejected: number
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [data, setData] = useState<ApplicationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [talentPoolIds, setTalentPoolIds] = useState<Set<string>>(new Set())
  const [addingToTalentPool, setAddingToTalentPool] = useState<string | null>(null)
  const [deletingApplication, setDeletingApplication] = useState<string | null>(null)
  const [page] = useState(1)
  const [showOldApplications, setShowOldApplications] = useState(false)
  const [cleanupStats, setCleanupStats] = useState<{
    cleanupCount: number
    cutoffDate: string
    sampleApplications: unknown[]
  } | null>(null)

  // 获取申请数据
  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      params.append('page', page.toString())
      params.append('limit', '10')

      const response = await fetch(`/api/admin/forms/applications?${params.toString()}`)
      if (!response.ok) throw new Error('获取数据失败')

      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('获取申请数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
    fetchCleanupStats()
  }, [searchTerm, statusFilter, page])

  // 获取清理统计信息
  const fetchCleanupStats = async () => {
    try {
      const response = await fetch(
        '/api/admin/forms/applications/cleanup?daysOld=180&excludeTalentPool=true'
      )
      if (response.ok) {
        const stats = await response.json()
        setCleanupStats(stats)
      }
    } catch (error) {
      console.error('获取清理统计失败:', error)
    }
  }

  // 检查人才库状态
  useEffect(() => {
    const checkTalentPoolStatus = async () => {
      if (!data?.applications.length) return

      try {
        // 这里我们可以通过API检查哪些申请已在人才库中
        // 暂时先设为空，后续可以优化
        // const applicationIds = data.applications.map(app => app.id)
        // TODO: 调用API检查状态
      } catch (error) {
        console.error('检查人才库状态失败:', error)
      }
    }

    checkTalentPoolStatus()
  }, [data?.applications])

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
      case 'HIRED':
        return <Badge className='border-green-300 bg-green-100 text-green-800'>已录用</Badge>
      case 'REJECTED':
        return <Badge className='border-red-300 bg-red-100 text-red-800'>已拒绝</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // 检查申请是否已在人才库中
  const isInTalentPool = (applicationId: string) => {
    return talentPoolIds.has(applicationId)
  }

  // 加入人才库
  const addToTalentPool = async (application: JobApplication) => {
    if (isInTalentPool(application.id)) {
      alert('该申请已在人才库中')
      return
    }

    setAddingToTalentPool(application.id)

    try {
      const response = await fetch('/api/admin/talent-pool/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          rating: 3,
          availability: 'AVAILABLE',
          addedReason: `从"${application.job?.title || '未知职位'}"申请转入`,
        }),
      })

      if (response.ok) {
        await response.json()
        setTalentPoolIds(prev => new Set([...prev, application.id]))
        alert(`已成功将 ${application.applicantName} 加入人才储备库`)
      } else {
        const error = await response.json()
        alert(`加入失败: ${error.error}`)
      }
    } catch (error) {
      console.error('加入人才库失败:', error)
      alert('操作失败，请重试')
    } finally {
      setAddingToTalentPool(null)
    }
  }

  // 删除单个申请
  const deleteApplication = async (application: JobApplication) => {
    if (!confirm(`确定要删除 ${application.applicantName} 的申请吗？此操作不可撤销。`)) {
      return
    }

    setDeletingApplication(application.id)

    try {
      const response = await fetch(`/api/admin/forms/applications/${application.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert(`已成功删除 ${application.applicantName} 的申请`)
        // 重新获取数据
        fetchApplications()
      } else {
        const error = await response.json()
        alert(`删除失败: ${error.error}`)
      }
    } catch (error) {
      console.error('删除申请失败:', error)
      alert('删除失败，请重试')
    } finally {
      setDeletingApplication(null)
    }
  }

  // 批量删除180天前的申请
  const cleanupOldApplications = async () => {
    if (!confirm('确定要删除180天前未加入人才库的申请吗？此操作不可撤销。')) {
      return
    }

    try {
      const response = await fetch('/api/admin/forms/applications/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          daysOld: 180,
          excludeTalentPool: true,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`已成功清理 ${result.deletedCount} 条过期申请记录`)
        // 重新获取数据
        fetchApplications()
        fetchCleanupStats()
      } else {
        const error = await response.json()
        alert(`清理失败: ${error.error}`)
      }
    } catch (error) {
      console.error('清理申请失败:', error)
      alert('清理失败，请重试')
    }
  }

  // 检查申请是否过期（180天前）
  const isApplicationOld = (createdAt: string) => {
    const applicationDate = new Date(createdAt)
    const now = new Date()
    const diffTime = now.getTime() - applicationDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 180
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

  return (
    <div className='space-y-6'>
      {/* 统计卡片 */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>总申请数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>待处理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>{data?.pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>已审核</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>{data?.reviewed || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>面试中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-purple-600'>{data?.interview || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>已录用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{data?.hired || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>已拒绝</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{data?.rejected || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 过期申请提醒 */}
      {cleanupStats && cleanupStats.cleanupCount > 0 && (
        <Card className='border-orange-200 bg-orange-50 dark:bg-orange-900/20'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center text-sm font-medium text-orange-800 dark:text-orange-300'>
              <AlertTriangle className='mr-2 h-4 w-4' />
              过期申请提醒
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-2xl font-bold text-orange-600'>
                  {cleanupStats.cleanupCount}
                </div>
                <p className='mt-1 text-sm text-orange-700 dark:text-orange-400'>
                  条申请超过180天未处理（未加入人才库）
                </p>
                <p className='mt-1 text-xs text-orange-600 dark:text-orange-500'>
                  建议定期清理以释放存储空间
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={cleanupOldApplications}
                className='border-orange-300 text-orange-600 hover:bg-orange-100'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                立即清理
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 操作栏 */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 items-center space-x-4'>
          <div className='relative max-w-sm flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='搜索申请人...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='状态' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>全部状态</SelectItem>
              <SelectItem value='NEW'>新申请</SelectItem>
              <SelectItem value='REVIEWING'>审核中</SelectItem>
              <SelectItem value='INTERVIEW'>面试中</SelectItem>
              <SelectItem value='OFFER'>已发offer</SelectItem>
              <SelectItem value='HIRED'>已录用</SelectItem>
              <SelectItem value='REJECTED'>已拒绝</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={cleanupOldApplications}
            className='border-orange-300 text-orange-600 hover:bg-orange-50'
          >
            <Calendar className='mr-2 h-4 w-4' />
            清理过期申请
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowOldApplications(!showOldApplications)}
            className={showOldApplications ? 'border-yellow-300 bg-yellow-50 text-yellow-700' : ''}
          >
            <AlertTriangle className='mr-2 h-4 w-4' />
            {showOldApplications ? '隐藏过期' : '显示过期'}
          </Button>
        </div>
      </div>

      {/* 申请列表 */}
      <Card>
        <CardHeader>
          <CardTitle>申请列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {data?.applications
              .filter(
                application => showOldApplications || !isApplicationOld(application.createdAt)
              )
              .map(application => {
                const isOld = isApplicationOld(application.createdAt)
                const inTalentPool = isInTalentPool(application.id)

                return (
                  <div
                    key={application.id}
                    className={`flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      isOld && !inTalentPool
                        ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/10'
                        : ''
                    }`}
                  >
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-3'>
                        <h3 className='font-medium text-gray-900 dark:text-white'>
                          {application.applicantName}
                        </h3>
                        {getStatusBadge(application.status)}
                        {isOld && !inTalentPool && (
                          <Badge
                            variant='outline'
                            className='border-orange-300 bg-orange-50 text-orange-600'
                          >
                            <Clock className='mr-1 h-3 w-3' />
                            过期
                          </Badge>
                        )}
                        {inTalentPool && (
                          <Badge
                            variant='outline'
                            className='border-green-300 bg-green-50 text-green-600'
                          >
                            <Users className='mr-1 h-3 w-3' />
                            已入库
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                        <span>{application.job?.title || '未知职位'}</span>
                        <span>•</span>
                        <span>{application.job?.department || '未知部门'}</span>
                        <span>•</span>
                        <span>{application.email}</span>
                        <span>•</span>
                        <span>{formatDate(application.createdAt)}</span>
                        {isOld && (
                          <>
                            <span>•</span>
                            <span className='font-medium text-orange-600'>
                              {Math.ceil(
                                (new Date().getTime() - new Date(application.createdAt).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{' '}
                              天前
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/careers/applications/${application.id}`)
                          }
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          查看简历
                        </DropdownMenuItem>
                        {application.hasResume && (
                          <DropdownMenuItem
                            onClick={() => window.open(application.resumeUrl, '_blank')}
                          >
                            <Download className='mr-2 h-4 w-4' />
                            下载简历
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => window.open(`mailto:${application.email}`, '_blank')}
                        >
                          <Mail className='mr-2 h-4 w-4' />
                          发送邮件
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => addToTalentPool(application)}
                          disabled={inTalentPool || addingToTalentPool === application.id}
                        >
                          <UserPlus className='mr-2 h-4 w-4' />
                          {inTalentPool
                            ? '已在人才库'
                            : addingToTalentPool === application.id
                              ? '加入中...'
                              : '加入人才库'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Check className='mr-2 h-4 w-4' />
                          通过申请
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-red-600'>
                          <X className='mr-2 h-4 w-4' />
                          拒绝申请
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteApplication(application)}
                          disabled={deletingApplication === application.id}
                          className='text-red-600'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          {deletingApplication === application.id ? '删除中...' : '删除申请'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
