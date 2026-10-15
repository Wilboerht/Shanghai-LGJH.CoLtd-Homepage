'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  Plus,
  X,
  GripVertical,
  Type,
  Image as ImageIcon,
  List,
  Quote,
  Minus,
  Eye,
  Edit,
} from 'lucide-react'
import { ArticleAboutData } from '@/components/services/article-about-section'

interface ArticleAboutEditorProps {
  data: ArticleAboutData
  onChange: (data: ArticleAboutData) => void
  readOnly?: boolean
}

export function ArticleAboutEditor({ data, onChange, readOnly = false }: ArticleAboutEditorProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)

  // 更新基本信息
  const updateBasicInfo = (
    field: keyof Pick<ArticleAboutData, 'title' | 'subtitle' | 'description' | 'content'>,
    value: string
  ) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  // 添加新的内容块
  const addSection = (type: 'text' | 'image' | 'list' | 'quote' | 'divider') => {
    const newSection = {
      id: `section-${Date.now()}`,
      type,
      title: '',
      content: '',
      order: (data.sections?.length || 0) + 1,
    }

    onChange({
      ...data,
      sections: [...(data.sections || []), newSection],
    })
  }

  // 更新内容块
  const updateSection = (
    sectionId: string,
    updates: Partial<NonNullable<ArticleAboutData['sections']>[0]>
  ) => {
    const sections =
      data.sections?.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ) || []

    onChange({
      ...data,
      sections,
    })
  }

  // 删除内容块
  const removeSection = (sectionId: string) => {
    const sections = data.sections?.filter(section => section.id !== sectionId) || []
    onChange({
      ...data,
      sections,
    })
  }

  // 移动内容块
  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sections = [...(data.sections || [])]
    const index = sections.findIndex(s => s.id === sectionId)

    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sections.length) return

    // 交换位置
    ;[sections[index], sections[newIndex]] = [sections[newIndex], sections[index]]

    // 更新order
    sections.forEach((section, i) => {
      section.order = i + 1
    })

    onChange({
      ...data,
      sections,
    })
  }

  // 渲染内容块编辑器
  const renderSectionEditor = (
    section: NonNullable<ArticleAboutData['sections']>[0],
    index: number
  ) => {
    const isEditing = editingSectionId === section.id

    return (
      <Card
        key={section.id}
        className='border-l-4 border-l-blue-500'
        onClick={e => e.stopPropagation()}
      >
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <GripVertical className='h-4 w-4 text-gray-400' />
              <span className='text-sm font-medium text-gray-600'>
                {section.type === 'text' && '📝 文本块'}
                {section.type === 'image' && '🖼️ 图片块'}
                {section.type === 'list' && '📋 列表块'}
                {section.type === 'quote' && '💬 引用块'}
                {section.type === 'divider' && '➖ 分割线'}
              </span>
              {section.title && <span className='text-sm text-gray-500'>- {section.title}</span>}
            </div>
            <div className='flex items-center gap-1'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setEditingSectionId(isEditing ? null : section.id)
                }}
                disabled={readOnly}
              >
                {isEditing ? <Eye className='h-4 w-4' /> : <Edit className='h-4 w-4' />}
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  moveSection(section.id, 'up')
                }}
                disabled={readOnly || index === 0}
              >
                ↑
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  moveSection(section.id, 'down')
                }}
                disabled={readOnly || index === (data.sections?.length || 0) - 1}
              >
                ↓
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeSection(section.id)
                }}
                disabled={readOnly}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isEditing && (
          <CardContent className='space-y-4'>
            {/* 标题 */}
            {section.type !== 'divider' && (
              <div>
                <Label>标题 (可选)</Label>
                <Input
                  value={section.title || ''}
                  onChange={e => updateSection(section.id, { title: e.target.value })}
                  placeholder='输入标题...'
                  disabled={readOnly}
                />
              </div>
            )}

            {/* 内容编辑 */}
            {section.type === 'text' && (
              <div>
                <Label>内容</Label>
                <RichTextEditor
                  value={section.content || ''}
                  onChange={content => updateSection(section.id, { content })}
                  placeholder='输入文本内容...'
                  disabled={readOnly}
                />
              </div>
            )}

            {section.type === 'image' && (
              <div className='space-y-4'>
                <div>
                  <Label>图片URL</Label>
                  <div className='flex gap-2'>
                    <Input
                      value={section.imageUrl || ''}
                      onChange={e => updateSection(section.id, { imageUrl: e.target.value })}
                      placeholder='输入图片URL或点击选择...'
                      disabled={readOnly}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setIsImageUploadOpen(true)}
                      disabled={readOnly}
                    >
                      <ImageIcon className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>图片描述</Label>
                  <Input
                    value={section.imageAlt || ''}
                    onChange={e => updateSection(section.id, { imageAlt: e.target.value })}
                    placeholder='图片描述文字...'
                    disabled={readOnly}
                  />
                </div>
              </div>
            )}

            {section.type === 'list' && (
              <div>
                <Label>列表项</Label>
                <div className='space-y-2'>
                  {section.items?.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className='flex gap-2'>
                      <Input
                        value={item}
                        onChange={e => {
                          const items = [...(section.items || [])]
                          items[itemIndex] = e.target.value
                          updateSection(section.id, { items })
                        }}
                        placeholder={`列表项 ${itemIndex + 1}`}
                        disabled={readOnly}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={e => {
                          e.preventDefault()
                          e.stopPropagation()
                          const items =
                            section.items?.filter((_: string, i: number) => i !== itemIndex) || []
                          updateSection(section.id, { items })
                        }}
                        disabled={readOnly}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      const items = [...(section.items || []), '']
                      updateSection(section.id, { items })
                    }}
                    disabled={readOnly}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    添加列表项
                  </Button>
                </div>
              </div>
            )}

            {section.type === 'quote' && (
              <div>
                <Label>引用内容</Label>
                <Textarea
                  value={section.content || ''}
                  onChange={e => updateSection(section.id, { content: e.target.value })}
                  placeholder='输入引用内容...'
                  rows={3}
                  disabled={readOnly}
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <div className='space-y-6' onClick={e => e.stopPropagation()}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-2' onClick={e => e.stopPropagation()}>
          <TabsTrigger value='basic' onClick={e => e.stopPropagation()}>
            基本信息
          </TabsTrigger>
          <TabsTrigger value='article' onClick={e => e.stopPropagation()}>
            文章内容
          </TabsTrigger>
        </TabsList>

        <TabsContent value='basic' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='about-title'>标题</Label>
                <Input
                  id='about-title'
                  value={data.title}
                  onChange={e => updateBasicInfo('title', e.target.value)}
                  placeholder='例如：关于此服务'
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor='about-subtitle'>副标题</Label>
                <Input
                  id='about-subtitle'
                  value={data.subtitle || ''}
                  onChange={e => updateBasicInfo('subtitle', e.target.value)}
                  placeholder='例如：专业的服务理念和执行标准'
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor='about-description'>简短描述</Label>
                <Textarea
                  id='about-description'
                  value={data.description || ''}
                  onChange={e => updateBasicInfo('description', e.target.value)}
                  placeholder='简短的服务介绍...'
                  rows={3}
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor='about-content'>富文本内容</Label>
                <RichTextEditor
                  value={data.content || ''}
                  onChange={content => updateBasicInfo('content', content)}
                  placeholder='输入详细的服务介绍内容...'
                  disabled={readOnly}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='article' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span>文章内容块</span>
                {!readOnly && (
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        addSection('text')
                      }}
                    >
                      <Type className='mr-1 h-4 w-4' />
                      文本
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        addSection('image')
                      }}
                    >
                      <ImageIcon className='mr-1 h-4 w-4' />
                      图片
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        addSection('list')
                      }}
                    >
                      <List className='mr-1 h-4 w-4' />
                      列表
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        addSection('quote')
                      }}
                    >
                      <Quote className='mr-1 h-4 w-4' />
                      引用
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        addSection('divider')
                      }}
                    >
                      <Minus className='mr-1 h-4 w-4' />
                      分割线
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {data.sections && data.sections.length > 0 ? (
                <div className='space-y-4'>
                  {data.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => renderSectionEditor(section, index))}
                </div>
              ) : (
                <div className='py-8 text-center text-gray-500'>
                  <Type className='mx-auto mb-4 h-12 w-12 text-gray-300' />
                  <p>还没有添加任何内容块</p>
                  <p className='text-sm'>点击上方按钮添加文本、图片、列表等内容</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 图片上传 */}
      {isImageUploadOpen && (
        <ImageUpload
          value=''
          onChange={(url: string) => {
            // 这里需要根据当前编辑的section来更新图片
            setIsImageUploadOpen(false)
          }}
          label='上传图片'
        />
      )}
    </div>
  )
}
