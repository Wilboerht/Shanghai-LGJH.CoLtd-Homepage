'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  GraduationCap,
  Building2,
  Award,
  Star,
  Lightbulb,
  TrendingUp,
  Users,
  BookOpen,
  Target,
} from 'lucide-react'

interface EducationData {
  overview: any
  cooperationModes: any
  achievements: any
  universities: any[]
  successCases: any[]
}

interface MissionItem {
  id: string
  title: string
  description: string
  content: string
  category: string
  status: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const contentTypes = [
  { id: 'cooperation-overview', label: '合作概况', icon: TrendingUp, color: 'blue' },
  { id: 'university', label: '合作院校', icon: Building2, color: 'purple' },
  { id: 'success-case', label: '成功案例', icon: Award, color: 'orange' },
]

export default function EducationIntegrationCMSPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<EducationData | null>(null)
  const [items, setItems] = useState<MissionItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('cooperation-overview')

  // 获取产教融合数据
  const fetchData = async () => {
    try {
      setLoading(true)

      // 获取前端显示数据
      const frontendResponse = await fetch('/api/mission/industry-education', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (frontendResponse.ok) {
        const frontendData = await frontendResponse.json()
        setData(frontendData)
      }

      // 获取CMS管理数据 - 直接从industry-education API获取
      const cmsResponse = await fetch('/api/admin/content/mission/industry-education', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (cmsResponse.ok) {
        const contentType = cmsResponse.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          const cmsData = await cmsResponse.json()
          // 直接使用返回的items数组
          setItems(cmsData.items || [])
        } else {
          console.error('CMS API返回了HTML而不是JSON，可能被重定向到登录页面')
        }
      } else {
        console.error('CMS API响应失败:', cmsResponse.status)
        if (cmsResponse.status === 401) {
          console.error('认证失败，可能需要重新登录')
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === 'authenticated' && session?.user?.isAdmin) {
      fetchData()
    }
  }, [mounted, status, session])

  // 筛选数据
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedType === 'all') return matchesSearch

    try {
      const content = JSON.parse(item.content || '{}')
      return matchesSearch && content.type === selectedType
    } catch {
      return false
    }
  })

  // 按类型分组数据
  const groupedData = contentTypes.reduce(
    (acc, type) => {
      acc[type.id] = filteredItems.filter(item => item.category === type.id)
      return acc
    },
    {} as Record<string, MissionItem[]>
  )

  const handleEdit = (item: MissionItem) => {
    router.push(`/admin/content/mission/education-integration/${item.id}/edit`)
  }

  const handleDelete = async (item: MissionItem) => {
    if (!confirm(`确定要删除"${item.title}"吗？`)) return

    try {
      const response = await fetch(`/api/admin/content/mission/industry-education/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await fetchData()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  const handleCreate = (type: string) => {
    router.push(`/admin/content/mission/education-integration/create?type=${type}`)
  }

  if (!mounted || loading || status === 'loading') {
    return (
      <AdminLayout>
        <div className='flex h-64 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面头部 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='flex items-center text-2xl font-bold text-gray-900 dark:text-white'>
              <GraduationCap className='mr-3 h-8 w-8 text-blue-600' />
              产教融合内容管理
            </h1>
            <p className='mt-1 text-gray-600 dark:text-gray-300'>管理产教融合页面的文章内容</p>
          </div>
          <Button onClick={() => router.push('/mission/education-integration')} variant='outline'>
            <Target className='mr-2 h-4 w-4' />
            预览页面
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {contentTypes.map(type => {
            const count = groupedData[type.id]?.length || 0
            const Icon = type.icon
            return (
              <Card key={type.id}>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>{type.label}</p>
                      <p className='text-2xl font-bold'>{count}</p>
                    </div>
                    <Icon className={`h-8 w-8 text-${type.color}-600`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 搜索和筛选 */}
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <Input
              placeholder='搜索内容...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className='w-48'>
              <SelectValue placeholder='选择内容类型' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>全部类型</SelectItem>
              {contentTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 内容管理标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3'>
            {contentTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 各类型内容标签页 */}
          {contentTypes.map(type => (
            <TabsContent key={type.id} value={type.id} className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>{type.label}管理</h2>
                <Button onClick={() => handleCreate(type.id)}>
                  <Plus className='mr-2 h-4 w-4' />
                  添加{type.label}
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>标题</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedData[type.id]?.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className='font-medium'>{item.title}</TableCell>
                        <TableCell className='max-w-xs truncate'>{item.description}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                            {item.status === 'published' ? '已发布' : '草稿'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className='flex space-x-2'>
                            <Button size='sm' variant='outline' onClick={() => handleEdit(item)}>
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button size='sm' variant='outline' onClick={() => handleDelete(item)}>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {groupedData[type.id]?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className='py-8 text-center text-gray-500'>
                          暂无{type.label}内容
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  )
}
