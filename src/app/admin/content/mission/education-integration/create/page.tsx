'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageUpload } from '@/components/ui/image-upload'
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react'

const contentTypes = [
  { id: 'cooperation-overview', label: '合作概况' },
  { id: 'university', label: '合作院校' },
  { id: 'success-case', label: '成功案例' },
]

interface FormData {
  title: string
  description: string
  content: string
  status: string
  type: string
  sortOrder: number
  image?: string
  field?: string
  partner?: string
  year?: string
}

export default function CreateEducationIntegrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentType = searchParams.get('type') || 'university'

  const [loading, setLoading] = useState(false)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    status: 'draft',
    type: contentType,
    sortOrder: 0,
    image: '',
    field: '',
    partner: '',
    year: '',
  })

  const selectedType = contentTypes.find(t => t.id === formData.type)

  const handleImageSelect = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
    setIsMediaPickerOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 构建metadata
      const metadata: any = {}

      // 根据类型添加特定的metadata
      if (formData.type === 'university') {
        metadata.field = formData.field
      } else if (formData.type === 'success-case') {
        metadata.partner = formData.partner
        metadata.year = formData.year
        metadata.category = formData.field || '合作案例'
      }

      // 创建内容项
      const response = await fetch('/api/admin/content/mission/industry-education', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          image: formData.image,
          category: formData.type,
          status: formData.status,
          sortOrder: Number(formData.sortOrder) || 0,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API错误:', errorData)
        throw new Error(errorData.error || '创建失败')
      }

      router.push('/admin/content/mission/education-integration')
    } catch (error) {
      console.error('创建失败:', error)
      alert(`创建失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面头部 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>创建内容</h1>
              <p className='text-gray-600'>{selectedType?.label || '产教融合内容'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* 主要内容 */}
            <div className='space-y-6 lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='title'>标题</Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder='请输入标题'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='description'>简介</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, description: e.target.value }))
                      }
                      placeholder='请输入简介'
                      rows={3}
                    />
                  </div>

                  {/* 院校特定字段 */}
                  {formData.type === 'university' && (
                    <>
                      <div>
                        <Label htmlFor='field'>合作领域</Label>
                        <Input
                          id='field'
                          value={formData.field || ''}
                          onChange={e => setFormData(prev => ({ ...prev, field: e.target.value }))}
                          placeholder='如：网络安全、人工智能'
                        />
                      </div>
                    </>
                  )}

                  {/* 成功案例特定字段 */}
                  {formData.type === 'success-case' && (
                    <>
                      <div>
                        <Label htmlFor='partner'>合作伙伴</Label>
                        <Input
                          id='partner'
                          value={formData.partner || ''}
                          onChange={e =>
                            setFormData(prev => ({ ...prev, partner: e.target.value }))
                          }
                          placeholder='如：北京理工大学'
                        />
                      </div>

                      <div>
                        <Label htmlFor='year'>合作时间</Label>
                        <Input
                          id='year'
                          value={formData.year || ''}
                          onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
                          placeholder='如：2021-2024年'
                        />
                      </div>
                    </>
                  )}

                  {/* 封面图片 */}
                  <div>
                    <Label htmlFor='image'>封面图片</Label>
                    <div className='space-y-2'>
                      <div className='flex gap-2'>
                        <Input
                          id='image'
                          value={formData.image || ''}
                          onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                          placeholder='图片URL'
                          className='flex-1'
                        />
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => setIsMediaPickerOpen(true)}
                        >
                          <ImageIcon className='mr-2 h-4 w-4' />
                          选择图片
                        </Button>
                      </div>
                      {formData.image && (
                        <div className='mt-2'>
                          <img
                            src={formData.image}
                            alt='封面预览'
                            className='h-32 max-w-xs rounded-md border object-cover'
                            onError={e => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='content'>详细内容</Label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={value => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder='请输入详细内容...'
                      height={300}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>发布设置</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='type'>内容类型</Label>
                    <Select
                      value={formData.type}
                      onValueChange={value => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='status'>状态</Label>
                    <Select
                      value={formData.status}
                      onValueChange={value => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='draft'>草稿</SelectItem>
                        <SelectItem value='published'>已发布</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='sortOrder'>排序</Label>
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

              <div className='flex flex-col gap-2'>
                <Button type='submit' disabled={loading}>
                  <Save className='mr-2 h-4 w-4' />
                  {loading ? '保存中...' : '保存'}
                </Button>
                <Button type='button' variant='outline' onClick={() => router.back()}>
                  取消
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 媒体选择器 */}
      {isMediaPickerOpen && <ImageUpload value='' onChange={handleImageSelect} label='选择图片' />}
    </AdminLayout>
  )
}
