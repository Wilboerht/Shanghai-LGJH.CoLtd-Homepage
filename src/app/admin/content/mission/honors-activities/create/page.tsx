'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { X, Plus, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

interface FormData {
  title: string
  description: string
  date: string
  category: string
  status: 'published' | 'draft' | 'archived'
  featured: boolean
}

export default function CreateHonorsActivitiesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '荣誉奖项',
    status: 'draft',
    featured: false,
  })

  // 处理表单字段变化
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
      toast.error('请填写标题')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/admin/content/mission/honors-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保包含session cookies
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建失败')
      }

      const result = await response.json()
      toast.success('创建成功')
      router.push('/admin/content/mission/honors-activities')
    } catch (error) {
      console.error('创建失败:', error)
      toast.error(error instanceof Error ? error.message : '创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
            <div>
              <h1 className='text-3xl font-bold'>创建时间轴条目</h1>
              <p className='mt-2 text-gray-600'>添加新的发展历程条目</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* 主要内容 */}
            <div className='space-y-6 lg:col-span-2'>
              {/* 基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>填写项目的基本信息</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='title'>标题 *</Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      placeholder='输入时间轴条目标题'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='category'>分类 *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={value => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
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

                  <div>
                    <Label htmlFor='description'>描述</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={e => handleInputChange('description', e.target.value)}
                      placeholder='输入详细描述'
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏设置 */}
            <div className='space-y-6'>
              {/* 发布设置 */}
              <Card>
                <CardHeader>
                  <CardTitle>发布设置</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='status'>状态</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'published' | 'draft' | 'archived') =>
                        handleInputChange('status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='draft'>草稿</SelectItem>
                        <SelectItem value='published'>已发布</SelectItem>
                        <SelectItem value='archived'>已归档</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      id='featured'
                      checked={formData.featured}
                      onCheckedChange={checked => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor='featured'>设为精选</Label>
                  </div>

                  <div>
                    <Label htmlFor='date'>日期</Label>
                    <Input
                      id='date'
                      type='date'
                      value={formData.date}
                      onChange={e => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <Card>
                <CardContent className='pt-6'>
                  <div className='flex space-x-3'>
                    <Button type='submit' disabled={loading} className='flex-1'>
                      <Save className='mr-2 h-4 w-4' />
                      {loading ? '创建中...' : '创建项目'}
                    </Button>
                    <Button type='button' variant='outline' onClick={() => router.back()}>
                      取消
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
