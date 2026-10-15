'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
import { GraduationCap, Save, ArrowLeft, Plus, Trash2, Eye, Image as ImageIcon } from 'lucide-react'

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

export default function EditEducationContentPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    content: '',
    status: 'draft',
    type: 'overview',
    sortOrder: 0,
    image: '',
  })

  // 获取内容数据
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/content/mission/industry-education/${itemId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const item = await response.json()

        // 使用新的文章式数据结构
        // content字段直接存储HTML内容，metadata字段存储额外信息
        let metadata: any = {}
        try {
          metadata = item.metadata
            ? typeof item.metadata === 'string'
              ? JSON.parse(item.metadata)
              : item.metadata
            : {}
        } catch (e) {
          console.error('解析metadata失败:', e)
          metadata = {}
        }

        setFormData({
          title: item.title,
          description: item.description || '',
          content: item.content || '', // 直接使用HTML内容
          status: item.status,
          type: item.category || 'cooperation-overview', // 使用category字段
          sortOrder: item.sortOrder || 0,
          image: item.image || '',
          field: metadata.field || '',
          partner: metadata.partner || '',
          year: metadata.year || '',
        })
      } else {
        alert('获取数据失败')
        router.back()
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      alert('获取数据失败')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (itemId) {
      fetchData()
    }
  }, [itemId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // 使用新的文章式数据结构
      // content字段直接存储HTML内容，metadata字段存储额外信息
      const metadata: any = {}

      // 根据类型添加特定的metadata
      if (formData.type === 'university') {
        metadata.field = formData.field
      } else if (formData.type === 'success-case') {
        metadata.partner = formData.partner
        metadata.year = formData.year
        metadata.category = formData.field || '合作案例'
      }

      const requestData = {
        title: formData.title,
        description: formData.description,
        content: formData.content, // 直接存储HTML内容
        image: formData.image, // 封面图片
        category: formData.type, // 使用category字段而不是content中的type
        status: formData.status,
        sortOrder: formData.sortOrder,
        metadata: JSON.stringify(metadata), // 额外信息存储在metadata中
      }

      console.log('提交数据:', requestData)

      const response = await fetch(`/api/admin/content/mission/industry-education/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('响应状态:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('更新成功:', result)
        router.push('/admin/content/mission/education-integration')
      } else {
        const error = await response.json()
        console.error('更新失败响应:', error)
        alert(`更新失败: ${error.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('更新失败:', error)
      alert(`更新失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setSaving(false)
    }
  }

  // 处理图片选择
  const handleImageSelect = (url: string) => {
    console.log('选择的图片:', url)
    try {
      setFormData(prev => {
        const newData = { ...prev, image: url }
        console.log('更新后的formData:', newData)
        return newData
      })
      setIsMediaPickerOpen(false)
    } catch (error) {
      console.error('设置图片时出错:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex h-64 items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      </AdminLayout>
    )
  }

  const selectedType = contentTypes.find(t => t.id === formData.type)

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面头部 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
            <div>
              <h1 className='flex items-center text-2xl font-bold text-gray-900 dark:text-white'>
                <GraduationCap className='mr-3 h-8 w-8 text-blue-600' />
                编辑{selectedType?.label}
              </h1>
              <p className='mt-1 text-gray-600 dark:text-gray-300'>
                编辑产教融合页面的{selectedType?.label}内容
              </p>
            </div>
          </div>
          <Button
            variant='outline'
            onClick={() => window.open('/mission/education-integration', '_blank')}
          >
            <Eye className='mr-2 h-4 w-4' />
            预览页面
          </Button>
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
                    <Label htmlFor='title'>标题 *</Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder='请输入标题'
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor='description'>描述</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, description: e.target.value }))
                      }
                      placeholder='请输入描述'
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

                      <div>
                        <Label htmlFor='image'>封面图片</Label>
                        <div className='space-y-2'>
                          <div className='flex gap-2'>
                            <Input
                              id='image'
                              value={formData.image || ''}
                              onChange={e =>
                                setFormData(prev => ({ ...prev, image: e.target.value }))
                              }
                              placeholder='图片URL或点击选择图片'
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

                      <div>
                        <Label htmlFor='image'>封面图片</Label>
                        <div className='space-y-2'>
                          <div className='flex gap-2'>
                            <Input
                              id='image'
                              value={formData.image || ''}
                              onChange={e =>
                                setFormData(prev => ({ ...prev, image: e.target.value }))
                              }
                              placeholder='图片URL或点击选择图片'
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
                    </>
                  )}

                  {/* 通用封面图片字段 */}
                  {formData.type !== 'success-case' && formData.type !== 'university' && (
                    <div>
                      <Label htmlFor='image'>封面图片</Label>
                      <div className='space-y-2'>
                        <div className='flex gap-2'>
                          <Input
                            id='image'
                            value={formData.image || ''}
                            onChange={e =>
                              setFormData(prev => ({ ...prev, image: e.target.value }))
                            }
                            placeholder='图片URL或点击选择图片'
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
                  )}

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
                <Button type='submit' disabled={saving}>
                  <Save className='mr-2 h-4 w-4' />
                  {saving ? '保存中...' : '保存'}
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
      {isMediaPickerOpen && (
        <ImageUpload value={formData.image || ''} onChange={handleImageSelect} label='选择图片' />
      )}
    </AdminLayout>
  )
}
