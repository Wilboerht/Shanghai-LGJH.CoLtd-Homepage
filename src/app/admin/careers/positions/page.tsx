'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Users } from 'lucide-react'
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
  updatedAt: string
  _count: {
    applications: number
  }
}

interface JobsData {
  jobs: JobPosition[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: {
    total: number
    published: number
    draft: number
    archived: number
    departments: Array<{ department: string; _count: { department: number } }>
  }
}

export default function PositionsPage() {
  const [data, setData] = useState<JobsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')

  // 获取职位数据
  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (departmentFilter !== 'all') params.append('department', departmentFilter)

      const response = await fetch(`/api/admin/content/careers/jobs?${params.toString()}`)
      if (!response.ok) throw new Error('获取数据失败')

      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('获取职位数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [searchTerm, statusFilter, departmentFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className='bg-green-100 text-green-800'>已发布</Badge>
      case 'archived':
        return <Badge className='bg-gray-100 text-gray-800'>已归档</Badge>
      case 'draft':
        return <Badge className='bg-yellow-100 text-yellow-800'>草稿</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const handleDeletePosition = async (positionId: string) => {
    if (!confirm('确定要删除这个职位吗？此操作不可撤销。')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/content/careers/jobs/${positionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('职位删除成功')
        fetchJobs() // 重新加载数据
      } else {
        const error = await response.json()
        alert(`删除失败: ${error.error}`)
      }
    } catch (error) {
      console.error('删除职位失败:', error)
      alert('删除失败，请重试')
    }
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
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>总职位数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data?.stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>已发布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{data?.stats?.published || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>已归档</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-600'>{data?.stats?.archived || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>草稿职位</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>{data?.stats?.draft || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 操作栏 */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 items-center space-x-4'>
          <div className='relative max-w-sm flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='搜索职位...'
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
              <SelectItem value='published'>已发布</SelectItem>
              <SelectItem value='archived'>已归档</SelectItem>
              <SelectItem value='draft'>草稿</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='部门' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>全部部门</SelectItem>
              {data?.stats?.departments?.map(dept => (
                <SelectItem key={dept.department} value={dept.department}>
                  {dept.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild>
          <Link href='/admin/careers/positions/new'>
            <Plus className='mr-2 h-4 w-4' />
            新增职位
          </Link>
        </Button>
      </div>

      {/* 职位列表 */}
      <Card>
        <CardHeader>
          <CardTitle>职位列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {data?.jobs.map(job => (
              <div
                key={job.id}
                className='flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800'
              >
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h3 className='font-medium text-gray-900 dark:text-white'>{job.title}</h3>
                    {getStatusBadge(job.status)}
                    {job.isHot && (
                      <Badge variant='destructive' className='text-xs'>
                        热门
                      </Badge>
                    )}
                    {job.isUrgent && (
                      <Badge
                        variant='outline'
                        className='border-orange-500 text-xs text-orange-600'
                      >
                        急招
                      </Badge>
                    )}
                  </div>
                  <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.experience}</span>
                    <span>•</span>
                    <span className='flex items-center gap-1'>
                      <Users className='h-3 w-3' />
                      {job._count.applications} 申请
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/careers/positions/${job.id}`}>
                        <Eye className='mr-2 h-4 w-4' />
                        查看详情
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/careers/positions/${job.id}/edit`}>
                        <Edit className='mr-2 h-4 w-4' />
                        编辑职位
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-red-600'
                      onClick={() => handleDeletePosition(job.id)}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      删除职位
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
