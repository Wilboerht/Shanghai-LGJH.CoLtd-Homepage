'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Award,
  Calendar,
  Users,
  Search,
  Filter,
  TrendingUp,
  Star,
  Activity,
} from 'lucide-react'
import { toast } from 'sonner'

interface TimelineItem {
  id: string
  title: string
  date: string
  description: string
  image: string
  status: 'published' | 'draft' | 'archived'
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    name: string
    email: string
  }
}

interface Stats {
  totalItems: number
  publishedItems: number
}

export default function HonorsActivitiesAdminPage() {
  const router = useRouter()
  const [items, setItems] = useState<TimelineItem[]>([])
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    publishedItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // 获取数据
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/content/mission/honors-activities')
      if (!response.ok) {
        throw new Error('获取数据失败')
      }
      const data = await response.json()
      // 合并荣誉和活动数据为统一的时间轴条目
      const allItems = [
        ...(data.honors || []).map((item: any) => ({
          ...item,
          date: item.date || `${item.year}-12-31`,
        })),
        ...(data.activities || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setItems(allItems)
      setStats({
        totalItems: allItems.length,
        publishedItems: allItems.filter(item => item.status === 'published').length,
      })
    } catch (error) {
      console.error('获取数据失败:', error)
      toast.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除项目
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个项目吗？')) return

    try {
      const response = await fetch(`/api/admin/content/mission/honors-activities/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      toast.success('删除成功')
      fetchData()
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  // 切换发布状态
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

    try {
      const response = await fetch(`/api/admin/content/mission/honors-activities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('更新状态失败')
      }

      toast.success('状态更新成功')
      fetchData()
    } catch (error) {
      console.error('更新状态失败:', error)
      toast.error('更新状态失败')
    }
  }

  // 过滤数据
  const filteredItems = items.filter(
    item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600'></div>
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
            <h1 className='text-3xl font-bold'>发展历程管理</h1>
            <p className='mt-2 text-gray-600'>管理企业发展历程时间轴内容</p>
          </div>
          <div className='flex space-x-3'>
            <Button variant='outline' onClick={() => router.push('/mission/honors-activities')}>
              <Eye className='mr-2 h-4 w-4' />
              预览页面
            </Button>
            <Button onClick={() => router.push('/admin/content/mission/honors-activities/create')}>
              <Plus className='mr-2 h-4 w-4' />
              添加条目
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <Calendar className='h-8 w-8 text-blue-600' />
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>总条目数</p>
                  <p className='text-2xl font-bold'>{stats.totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center'>
                <TrendingUp className='h-8 w-8 text-emerald-600' />
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>已发布条目</p>
                  <p className='text-2xl font-bold'>{stats.publishedItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索和过滤 */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center space-x-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='搜索时间轴条目...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Button variant='outline'>
                <Filter className='mr-2 h-4 w-4' />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 时间轴条目管理 */}
        <Card>
          <CardHeader>
            <CardTitle>时间轴条目</CardTitle>
            <CardDescription>管理发展历程时间轴上的所有条目</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className='flex items-center space-x-3'>
                        {item.featured && <Star className='h-4 w-4 text-yellow-500' />}
                        <span className='font-medium'>{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString('zh-CN')}</TableCell>
                    <TableCell className='max-w-xs truncate'>{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                        {item.status === 'published' ? '已发布' : '草稿'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/admin/content/mission/honors-activities/${item.id}/edit`
                              )
                            }
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(item.id, item.status)}>
                            <Eye className='mr-2 h-4 w-4' />
                            {item.status === 'published' ? '取消发布' : '发布'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className='text-red-600'
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
