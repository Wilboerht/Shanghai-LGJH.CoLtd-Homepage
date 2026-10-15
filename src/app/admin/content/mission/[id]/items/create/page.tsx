'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
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
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, X, Calendar, Tag, Star } from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

// 动态导入富文本编辑器
const RichTextEditor = dynamic(() => import('@/components/ui/rich-text-editor'), {
  ssr: false,
  loading: () => <div className='h-64 animate-pulse rounded-md bg-gray-100' />,
})

interface MissionModule {
  id: string
  title: string
  subtitle?: string
  description?: string
  category: string
}

interface FormData {
  title: string
  description: string
  content: string
  summary: string
  image: string
  date: string
  tags: string[]
  category: string
  status: 'published' | 'draft' | 'archived'
  featured: boolean
  sortOrder: number
  metadata: Record<string, any>
}

export default function CreateMissionItemPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string

  const [module, setModule] = useState<MissionModule | null>(null)
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    summary: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    category: '',
    status: 'draft',
    featured: false,
    sortOrder: 0,
    metadata: {},
  })

  // 获取模块信息
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`/api/admin/content/mission/${moduleId}`)
        if (!response.ok) throw new Error('获取模块信息失败')

        const data = await response.json()
        setModule(data)

        // 根据模块类型设置默认分类
        const defaultCategories = {
          'industry-education': '校企合作',
          'honors-activities': '荣誉奖项',
          'external-cooperation': '战略合作',
          'company-news': '公司新闻',
          'join-us': '招聘信息',
        }

        setFormData(prev => ({
          ...prev,
          category:
            defaultCategories[data.category as keyof typeof defaultCategories] || '默认分类',
        }))
      } catch (error) {
        console.error('获取模块信息失败:', error)
        toast.error('获取模块信息失败')
      }
    }

    fetchModule()
  }, [moduleId])

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('请输入项目标题')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`/api/admin/content/mission/${moduleId}/contents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date ? new Date(formData.date).toISOString() : undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建项目失败')
      }

      toast.success('项目创建成功')
      router.push(`/admin/content/mission/${moduleId}/items`)
    } catch (error) {
      console.error('创建项目失败:', error)
      toast.error(error instanceof Error ? error.message : '创建项目失败')
    } finally {
      setLoading(false)
    }
  }

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }))
  }

  // 处理键盘事件
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面头部 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push(`/admin/content/mission/${moduleId}/items`)}
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回项目列表
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>创建新项目</h1>
              <p className='text-gray-600'>
                {module?.title} - {module?.description}
              </p>
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
                    <Label htmlFor='title'>项目标题 *</Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder='输入项目标题'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='summary'>项目摘要</Label>
                    <Textarea
                      id='summary'
                      value={formData.summary}
                      onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder='输入项目摘要（用于列表显示）'
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor='description'>项目描述</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, description: e.target.value }))
                      }
                      placeholder='输入项目描述'
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor='image'>项目图片URL</Label>
                    <Input
                      id='image'
                      value={formData.image}
                      onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder='输入图片URL'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 详细内容 */}
              <Card>
                <CardHeader>
                  <CardTitle>详细内容</CardTitle>
                  <CardDescription>编写项目的详细内容</CardDescription>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder='输入项目详细内容...'
                  />
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
                        setFormData(prev => ({ ...prev, status: value }))
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

                  <div className='flex items-center justify-between'>
                    <Label htmlFor='featured' className='flex items-center space-x-2'>
                      <Star className='h-4 w-4' />
                      <span>特色项目</span>
                    </Label>
                    <Switch
                      id='featured'
                      checked={formData.featured}
                      onCheckedChange={checked =>
                        setFormData(prev => ({ ...prev, featured: checked }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor='date'>项目日期</Label>
                    <Input
                      id='date'
                      type='date'
                      value={formData.date}
                      onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor='sortOrder'>排序顺序</Label>
                    <Input
                      id='sortOrder'
                      type='number'
                      value={formData.sortOrder}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))
                      }
                      placeholder='0'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 分类和标签 */}
              <Card>
                <CardHeader>
                  <CardTitle>分类和标签</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='category'>项目分类</Label>
                    <Input
                      id='category'
                      value={formData.category}
                      onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder='输入项目分类'
                    />
                  </div>

                  <div>
                    <Label>标签</Label>
                    <div className='space-y-2'>
                      <div className='flex space-x-2'>
                        <Input
                          value={newTag}
                          onChange={e => setNewTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder='输入标签'
                        />
                        <Button type='button' onClick={addTag} size='sm'>
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {formData.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='flex items-center space-x-1'
                            >
                              <Tag className='h-3 w-3' />
                              <span>{tag}</span>
                              <button
                                type='button'
                                onClick={() => removeTag(tag)}
                                className='ml-1 hover:text-red-600'
                              >
                                <X className='h-3 w-3' />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <Card>
                <CardContent className='pt-6'>
                  <div className='space-y-2'>
                    <Button type='submit' className='w-full' disabled={loading}>
                      {loading ? '创建中...' : '创建项目'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full'
                      onClick={() => router.push(`/admin/content/mission/${moduleId}/items`)}
                    >
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
