'use client'

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { AdminLayout } from '@/components/admin/layout/admin-layout'

interface FormData {
  title: string
  description: string
  date: string
  category: string
  status: 'published' | 'draft' | 'archived'
  featured: boolean
}

export default function EditTimelineItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    date: '',
    category: '荣誉奖项',
    status: 'draft',
    featured: false,
  })

  // 解包 params
  const resolvedParams = use(params)

  // 获取项目数据
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `/api/admin/content/mission/honors-activities/${resolvedParams.id}`
        )
        if (!response.ok) {
          throw new Error('获取项目数据失败')
        }
        const data = await response.json()

        setFormData({
          title: data.title || '',
          description: data.description || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          category: data.category || '荣誉奖项',
          status: data.status || 'draft',
          featured: data.featured || false,
        })
      } catch (error) {
        console.error('获取项目数据失败:', error)
        toast.error('获取项目数据失败')
        router.push('/admin/content/mission/honors-activities')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchItem()
  }, [resolvedParams.id, router])

  // 处理输入变化
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('请输入标题')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `/api/admin/content/mission/honors-activities/${resolvedParams.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 确保包含session cookies
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新失败')
      }

      toast.success('时间轴条目更新成功！')
      router.push('/admin/content/mission/honors-activities')
    } catch (error) {
      console.error('更新失败:', error)
      toast.error(error instanceof Error ? error.message : '更新失败')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className='flex min-h-[400px] items-center justify-center'>
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
        {/* 页面头部 */}
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <Button variant='outline' onClick={() => router.back()} className='h-10'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回列表
            </Button>
            <div className='text-right'>
              <h1 className='text-3xl font-bold text-gray-900'>编辑时间轴条目</h1>
              <p className='mt-1 text-gray-600'>修改发展历程条目的详细信息</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
            {/* 主要内容 */}
            <div className='space-y-6 lg:col-span-3'>
              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-xl'>基本信息</CardTitle>
                  <CardDescription>填写时间轴条目的基本信息</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='title' className='text-sm font-medium'>
                      标题 *
                    </Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      placeholder='输入时间轴条目标题'
                      className='h-11'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='category' className='text-sm font-medium'>
                      分类 *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={value => handleInputChange('category', value)}
                    >
                      <SelectTrigger className='h-11'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='荣誉奖项'>荣誉奖项</SelectItem>
                        <SelectItem value='认证资质'>认证资质</SelectItem>
                        <SelectItem value='技术奖项'>技术奖项</SelectItem>
                        <SelectItem value='公益活动'>公益活动</SelectItem>
                        <SelectItem value='行业会议'>行业会议</SelectItem>
                        <SelectItem value='环保活动'>环保活动</SelectItem>
                        <SelectItem value='创新活动'>创新活动</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description' className='text-sm font-medium'>
                      描述
                    </Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={e => handleInputChange('description', e.target.value)}
                      placeholder='输入详细描述内容...'
                      rows={6}
                      className='resize-none'
                    />
                    <p className='text-xs text-gray-500'>详细描述该时间轴事件的内容和意义</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className='space-y-6'>
              {/* 发布设置 */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>发布设置</CardTitle>
                  <CardDescription>管理条目的发布状态</CardDescription>
                </CardHeader>
                <CardContent className='space-y-5'>
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>状态</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'published' | 'draft' | 'archived') =>
                        handleInputChange('status', value)
                      }
                    >
                      <SelectTrigger className='h-10'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='draft'>📝 草稿</SelectItem>
                        <SelectItem value='published'>✅ 已发布</SelectItem>
                        <SelectItem value='archived'>📦 已归档</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='date' className='text-sm font-medium'>
                      事件日期
                    </Label>
                    <Input
                      id='date'
                      type='date'
                      value={formData.date}
                      onChange={e => handleInputChange('date', e.target.value)}
                      className='h-10'
                    />
                    <p className='text-xs text-gray-500'>选择该事件发生的日期</p>
                  </div>

                  <div className='border-t pt-2'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <Label htmlFor='featured' className='text-sm font-medium'>
                          精选条目
                        </Label>
                        <p className='text-xs text-gray-500'>在首页重点展示</p>
                      </div>
                      <Switch
                        id='featured'
                        checked={formData.featured}
                        onCheckedChange={checked => handleInputChange('featured', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>操作</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button type='submit' disabled={loading} className='h-11 w-full' size='lg'>
                    <Save className='mr-2 h-4 w-4' />
                    {loading ? '更新中...' : '保存更改'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.back()}
                    disabled={loading}
                    className='h-10 w-full'
                  >
                    取消编辑
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
