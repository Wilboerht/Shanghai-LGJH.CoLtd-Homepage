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
import { ArrowLeft, Save, Eye, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

// 动态导入富文本编辑器
const RichTextEditor = dynamic(() => import('@/components/ui/rich-text-editor'), {
  ssr: false,
  loading: () => <div className='h-64 animate-pulse rounded-md bg-gray-100' />,
})

// 导入封面图片上传组件
import { CoverImageUpload } from '@/components/ui/cover-image-upload'

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
  metadata: {
    author: string
    readTime: string
  }
}

export default function CreateCompanyNewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    summary: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    category: '企业发展',
    status: 'draft',
    featured: false,
    metadata: {
      author: '临港景鸿',
      readTime: '3分钟',
    },
  })

  // 处理表单字段变化
  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // 处理元数据变化
  const handleMetadataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }))
  }

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
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

  // 提交表单
  const handleSubmit = async (status?: 'published' | 'draft') => {
    if (!formData.title.trim()) {
      toast.error('请输入新闻标题')
      return
    }

    if (!formData.content.trim()) {
      toast.error('请输入新闻内容')
      return
    }

    try {
      setLoading(true)

      const submitData = {
        ...formData,
        status: status || formData.status,
        summary: formData.summary || formData.description,
      }

      const response = await fetch('/api/admin/content/company-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建新闻失败')
      }

      const result = await response.json()
      toast.success('新闻创建成功')

      // 根据状态决定跳转
      if (status === 'published') {
        // 如果是发布，跳转到新闻详情页面
        window.open(`/mission/company-news/${result.news.id}`, '_blank')
      }

      router.push('/admin/content/company-news')
    } catch (_error) {
      console.error('创建新闻失败:', _error)
      toast.error(_error instanceof Error ? _error.message : '创建新闻失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='outline' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>发布新闻</h1>
              <p className='text-muted-foreground'>创建新的公司动态新闻</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={() => handleSubmit('draft')} disabled={loading}>
              <Save className='mr-2 h-4 w-4' />
              保存草稿
            </Button>
            <Button onClick={() => handleSubmit('published')} disabled={loading}>
              <Eye className='mr-2 h-4 w-4' />
              发布新闻
            </Button>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* 主要内容 */}
          <div className='space-y-6 lg:col-span-2'>
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>填写新闻的基本信息</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='title'>新闻标题 *</Label>
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder='请输入新闻标题'
                  />
                </div>

                <div>
                  <Label htmlFor='description'>新闻描述</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder='请输入新闻描述'
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor='summary'>新闻摘要</Label>
                  <Textarea
                    id='summary'
                    value={formData.summary}
                    onChange={e => handleInputChange('summary', e.target.value)}
                    placeholder='请输入新闻摘要（如果不填写，将使用描述作为摘要）'
                    rows={2}
                  />
                </div>

                <div>
                  <CoverImageUpload
                    value={formData.image}
                    onChange={url => handleInputChange('image', url)}
                    label='封面图片'
                    placeholder='请选择或输入封面图片'
                    uploadType='company-news'
                    showMediaLibrary={false}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 新闻内容 */}
            <Card>
              <CardHeader>
                <CardTitle>新闻内容</CardTitle>
                <CardDescription>编写详细的新闻内容</CardDescription>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={formData.content}
                  onChange={value => handleInputChange('content', value)}
                  placeholder='请输入新闻内容...'
                />
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className='space-y-6'>
            {/* 发布设置 */}
            <Card>
              <CardHeader>
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='date'>发布日期</Label>
                  <Input
                    id='date'
                    type='date'
                    value={formData.date}
                    onChange={e => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor='category'>新闻分类</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='选择分类' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='企业发展'>企业发展</SelectItem>
                      <SelectItem value='产品发布'>产品发布</SelectItem>
                      <SelectItem value='合作签约'>合作签约</SelectItem>
                      <SelectItem value='荣誉奖项'>荣誉奖项</SelectItem>
                      <SelectItem value='员工发展'>员工发展</SelectItem>
                      <SelectItem value='市场拓展'>市场拓展</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='flex items-center justify-between'>
                  <Label htmlFor='featured'>设为特色新闻</Label>
                  <Switch
                    id='featured'
                    checked={formData.featured}
                    onCheckedChange={checked => handleInputChange('featured', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 标签 */}
            <Card>
              <CardHeader>
                <CardTitle>标签</CardTitle>
                <CardDescription>添加相关标签，便于分类和搜索</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder='输入标签'
                  />
                  <Button type='button' variant='outline' size='sm' onClick={addTag}>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant='secondary' className='flex items-center gap-1'>
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className='ml-1 hover:text-red-500'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 元数据 */}
            <Card>
              <CardHeader>
                <CardTitle>元数据</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='author'>作者</Label>
                  <Input
                    id='author'
                    value={formData.metadata.author}
                    onChange={e => handleMetadataChange('author', e.target.value)}
                    placeholder='作者名称'
                  />
                </div>

                <div>
                  <Label htmlFor='readTime'>阅读时间</Label>
                  <Input
                    id='readTime'
                    value={formData.metadata.readTime}
                    onChange={e => handleMetadataChange('readTime', e.target.value)}
                    placeholder='如：3分钟'
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
