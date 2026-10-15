'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
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
  // Clock,
  FileText,
  Search,
  // Filter,
  TrendingUp,
  Building,
  // Heart,
  // Settings,
  // BarChart3,
  // UserCheck,
  Star,
} from 'lucide-react'

import { AnalyticsDashboard } from '@/components/admin/careers/analytics-dashboard'
import { ApplicationsManager } from '@/components/admin/careers/applications-manager'

interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  status: 'published' | 'draft' | 'archived'
  isHot: boolean
  isUrgent: boolean
  createdAt: string
  _count?: {
    applications: number
  }
}

interface CompanyStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  departments: Array<{ name: string; count: number }>
  recentApplications: number
}

export default function CareersManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<JobPosition[]>([])

  const [stats, setStats] = useState<CompanyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(() => {
    // 从URL参数获取初始标签页
    return searchParams.get('tab') || 'jobs'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true)

      // 获取职位数据
      const jobsResponse = await fetch('/api/admin/content/careers/jobs')
      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json()
        setJobs(jobsData.jobs || [])
      }

      // 获取统计数据
      const statsResponse = await fetch('/api/admin/content/careers/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (_error) {
      console.error('Error fetching data:', _error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 筛选职位
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const statusMap = {
      published: { label: '已发布', variant: 'default' as const },
      draft: { label: '草稿', variant: 'secondary' as const },
      archived: { label: '已归档', variant: 'outline' as const },
    }
    const config = statusMap[status as keyof typeof statusMap] || statusMap.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <p className='text-gray-600'>加载中...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>加入我们 - 招聘管理</h1>
            <p className='mt-2 text-gray-600'>管理职位发布、申请处理和招聘数据分析</p>
          </div>
          <div className='flex space-x-3'>
            <Button variant='outline' onClick={() => router.push('/careers')}>
              <Eye className='mr-2 h-4 w-4' />
              预览页面
            </Button>
            <Button onClick={() => router.push('/admin/content/careers/jobs/new')}>
              <Plus className='mr-2 h-4 w-4' />
              发布新职位
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>总职位数</CardTitle>
                <Briefcase className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalJobs}</div>
                <p className='text-xs text-muted-foreground'>活跃职位: {stats.activeJobs}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>总申请数</CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalApplications}</div>
                <p className='text-xs text-muted-foreground'>待处理: {stats.pendingApplications}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>活跃部门</CardTitle>
                <Building className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.departments.length}</div>
                <p className='text-xs text-muted-foreground'>正在招聘的部门数</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>近期申请</CardTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.recentApplications}</div>
                <p className='text-xs text-muted-foreground'>最近7天新申请</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 主要内容区域 */}
        <Tabs
          value={activeTab}
          onValueChange={value => {
            setActiveTab(value)
            // 更新URL参数但不刷新页面
            const url = new URL(window.location.href)
            url.searchParams.set('tab', value)
            window.history.replaceState({}, '', url.toString())
          }}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='jobs'>职位管理</TabsTrigger>
            <TabsTrigger value='applications'>申请管理</TabsTrigger>
            <TabsTrigger value='analytics'>数据分析</TabsTrigger>
          </TabsList>

          {/* 职位管理标签页 */}
          <TabsContent value='jobs' className='space-y-6'>
            {/* 搜索和筛选 */}
            <Card>
              <CardHeader>
                <CardTitle>职位管理</CardTitle>
                <CardDescription>管理所有招聘职位，包括发布、编辑和状态更新</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center'>
                  <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      placeholder='搜索职位标题、部门...'
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className='pl-9'
                    />
                  </div>
                  <div className='flex gap-2'>
                    <select
                      value={selectedDepartment}
                      onChange={e => setSelectedDepartment(e.target.value)}
                      className='rounded-md border px-3 py-2'
                      aria-label='选择部门筛选'
                    >
                      <option value='all'>所有部门</option>
                      <option value='技术研发部'>技术研发部</option>
                      <option value='产品运营部'>产品运营部</option>
                      <option value='市场销售部'>市场销售部</option>
                      <option value='管理支持部'>管理支持部</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                      className='rounded-md border px-3 py-2'
                      aria-label='选择状态筛选'
                    >
                      <option value='all'>所有状态</option>
                      <option value='published'>已发布</option>
                      <option value='draft'>草稿</option>
                      <option value='archived'>已归档</option>
                    </select>
                  </div>
                </div>

                {/* 职位列表 */}
                <div className='rounded-lg border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[30%]'>职位信息</TableHead>
                        <TableHead className='w-[15%]'>部门</TableHead>
                        <TableHead className='w-[12%]'>地点</TableHead>
                        <TableHead className='w-[10%]'>状态</TableHead>
                        <TableHead className='w-[10%]'>申请数</TableHead>
                        <TableHead className='w-[13%]'>发布时间</TableHead>
                        <TableHead className='w-[10%] text-right'>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map(job => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <div className='space-y-1'>
                              <div className='flex items-center gap-2'>
                                <span className='font-medium'>{job.title}</span>
                                {job.isHot && <Star className='h-4 w-4 text-yellow-500' />}
                                {job.isUrgent && (
                                  <Badge variant='destructive' className='text-xs'>
                                    急招
                                  </Badge>
                                )}
                              </div>
                              <div className='text-sm text-gray-600'>
                                {job.type} • {job.experience} • {job.salary}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant='outline'>{job.department}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-1'>
                              <MapPin className='h-3 w-3 text-gray-400' />
                              <span className='text-sm'>{job.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell>
                            <div className='flex items-center gap-1'>
                              <Users className='h-3 w-3 text-gray-400' />
                              <span className='text-sm'>{job._count?.applications || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className='text-sm text-gray-600'>
                              {formatDate(job.createdAt)}
                            </span>
                          </TableCell>
                          <TableCell className='text-right'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => router.push(`/careers/${job.id}`)}>
                                  <Eye className='mr-2 h-4 w-4' />
                                  查看详情
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/admin/content/careers/jobs/${job.id}`)
                                  }
                                >
                                  <Edit className='mr-2 h-4 w-4' />
                                  编辑职位
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(`/admin/forms/applications?jobId=${job.id}`)
                                  }
                                >
                                  <FileText className='mr-2 h-4 w-4' />
                                  查看申请
                                </DropdownMenuItem>
                                <DropdownMenuItem className='text-red-600'>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 申请管理标签页 - 集成申请管理功能 */}
          <TabsContent value='applications' className='space-y-6'>
            <ApplicationsManager embedded={true} showHeader={false} />
          </TabsContent>

          {/* 数据分析标签页 */}
          <TabsContent value='analytics' className='space-y-6'>
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
