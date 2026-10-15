'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X, Plus, User, FileText } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'
// import AvatarManager from './avatar-manager'

interface Research {
  id?: string
  title: string
  subtitle?: string
  description: string
  category: 'AI_RESEARCH' | 'INNOVATION' | 'ACHIEVEMENTS' | 'PAPERS'
  content: string
  image?: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: Date
  tags?: string[]
  authors?: Array<{
    name: string
    title?: string
    email?: string
    avatar?: string
  }>
  attachments?: Array<{
    name: string
    url: string
    type?: string
  }>
  featured: boolean
  sortOrder: number
}

interface ResearchEditFormProps {
  research?: Research
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (research: Research) => Promise<void>
}

// 研究分类选项
const RESEARCH_CATEGORIES = [
  { value: 'AI_RESEARCH', label: 'AI研究与应用' },
  { value: 'INNOVATION', label: '技术创新' },
  { value: 'ACHIEVEMENTS', label: '研发成果' },
  { value: 'PAPERS', label: '技术论文' },
]

// 研究状态选项
const RESEARCH_STATUS = [
  { value: 'DRAFT', label: '草稿' },
  { value: 'PUBLISHED', label: '已发布' },
  { value: 'ARCHIVED', label: '已归档' },
]

export default function ResearchEditForm({
  research,
  open,
  onOpenChange,
  onSave,
}: ResearchEditFormProps) {
  const [formData, setFormData] = useState<Research>({
    title: '',
    subtitle: '',
    description: '',
    category: 'AI_RESEARCH',
    content: '',
    image: '',
    slug: '',
    status: 'DRAFT',
    tags: [],
    authors: [],
    attachments: [],
    featured: false,
    sortOrder: 0,
  })
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newAuthor, setNewAuthor] = useState({ name: '', title: '', email: '', avatar: '' })
  const [newAttachment, setNewAttachment] = useState({ name: '', url: '', type: '' })

  // 初始化表单数据
  useEffect(() => {
    if (research) {
      setFormData({
        ...research,
        tags: research.tags || [],
        authors: research.authors || [],
        attachments: research.attachments || [],
        // 确保publishedAt是Date对象或undefined
        publishedAt: research.publishedAt ? new Date(research.publishedAt) : undefined,
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        category: 'AI_RESEARCH',
        content: '',
        image: '',
        slug: '',
        status: 'DRAFT',
        tags: [],
        authors: [],
        attachments: [],
        featured: false,
        sortOrder: 0,
      })
    }
  }, [research, open])

  // 生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // 处理标题变化
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag('')
    }
  }

  // 删除标签
  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || [],
    }))
  }

  // 添加作者
  const addAuthor = () => {
    if (newAuthor.name.trim()) {
      setFormData(prev => ({
        ...prev,
        authors: [...(prev.authors || []), { ...newAuthor }],
      }))
      setNewAuthor({ name: '', title: '', email: '', avatar: '' })
    }
  }

  // 删除作者
  const removeAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors?.filter((_, i) => i !== index) || [],
    }))
  }

  // 添加附件
  const addAttachment = () => {
    if (newAttachment.name.trim() && newAttachment.url.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), { ...newAttachment }],
      }))
      setNewAttachment({ name: '', url: '', type: '' })
    }
  }

  // 删除附件
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || [],
    }))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 基本验证
      if (!formData.title.trim()) {
        alert('请输入标题')
        return
      }
      if (!formData.description.trim()) {
        alert('请输入描述')
        return
      }
      if (!formData.content.trim()) {
        alert('请输入研究内容')
        return
      }
      if (!formData.slug.trim()) {
        alert('请输入URL标识符')
        return
      }

      // 清理数据 - 让Zod schema处理空字符串的转换
      const cleanedData = {
        ...formData,
        // 确保字段被trim处理
        title: formData.title.trim(),
        subtitle: formData.subtitle?.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        image: formData.image?.trim(),
        slug: formData.slug.trim(),
      }

      console.log('Submitting form data:', cleanedData)
      await onSave(cleanedData)
      onOpenChange(false)
    } catch (error) {
      console.error('保存研究失败:', error)
      // Show user-friendly error message
      alert(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{research ? '编辑研究' : '新建研究'}</DialogTitle>
          <DialogDescription>{research ? '编辑研究信息' : '创建新的研究内容'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* 基本信息 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='title'>标题 *</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder='输入研究标题'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='subtitle'>副标题</Label>
              <Input
                id='subtitle'
                value={formData.subtitle || ''}
                onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder='输入副标题（可选）'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='category'>分类 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='选择分类' />
                </SelectTrigger>
                <SelectContent>
                  {RESEARCH_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='status'>状态</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='选择状态' />
                </SelectTrigger>
                <SelectContent>
                  {RESEARCH_STATUS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* URL标识符和图片 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='slug'>URL标识符 *</Label>
              <Input
                id='slug'
                value={formData.slug}
                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder='url-friendly-identifier'
                required
              />
            </div>
            <div className='space-y-2'>
              <ImageUpload
                label='封面图片'
                value={formData.image || ''}
                onChange={value => setFormData(prev => ({ ...prev, image: value }))}
                placeholder='输入图片URL或上传图片'
                helpText='支持JPG、PNG、WebP格式，建议尺寸1200x600像素'
                maxSize={10}
                uploadType='research'
              />
            </div>
          </div>

          {/* 描述 */}
          <div className='space-y-2'>
            <Label htmlFor='description'>描述 *</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder='输入研究描述'
              rows={3}
              required
            />
          </div>

          {/* 内容 */}
          <div className='space-y-2'>
            <Label htmlFor='content'>研究内容 *</Label>
            <Textarea
              id='content'
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder='输入详细的研究内容'
              rows={8}
              required
            />
          </div>

          {/* 标签管理 */}
          <div className='space-y-2'>
            <Label>标签</Label>
            <div className='flex gap-2'>
              <Input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder='添加标签'
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type='button' onClick={addTag} variant='outline'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-2'>
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant='secondary' className='flex items-center gap-1'>
                    {tag}
                    <X className='h-3 w-3 cursor-pointer' onClick={() => removeTag(index)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 作者管理 */}
          <div className='space-y-2'>
            <Label>作者信息</Label>
            <div className='space-y-3'>
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4'>
                <Input
                  value={newAuthor.name}
                  onChange={e => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder='作者姓名'
                />
                <Input
                  value={newAuthor.title}
                  onChange={e => setNewAuthor(prev => ({ ...prev, title: e.target.value }))}
                  placeholder='职位（可选）'
                />
                <Input
                  value={newAuthor.email}
                  onChange={e => setNewAuthor(prev => ({ ...prev, email: e.target.value }))}
                  placeholder='邮箱（可选）'
                />
                <Button type='button' onClick={addAuthor} variant='outline'>
                  <Plus className='h-4 w-4' />
                  添加作者
                </Button>
              </div>
              <div className='flex items-center gap-2'>
                <Input
                  value={newAuthor.avatar}
                  onChange={e => setNewAuthor(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder='头像URL（可选）'
                  className='flex-1'
                />
                {/* <AvatarManager
                  onSelectAvatar={(url) => setNewAuthor(prev => ({ ...prev, avatar: url }))}
                /> */}
              </div>
            </div>
            {formData.authors && formData.authors.length > 0 && (
              <div className='mt-2 space-y-2'>
                {formData.authors.map((author, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-gray-800'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200'>
                        {author.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className='h-full w-full object-cover'
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <div
                          className={`flex h-full w-full items-center justify-center ${author.avatar ? 'hidden' : ''}`}
                        >
                          <span className='text-sm font-semibold text-gray-600'>
                            {author.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium text-gray-900 dark:text-gray-100'>
                          {author.name}
                        </div>
                        {author.title && (
                          <div className='text-sm text-gray-600 dark:text-gray-400'>
                            {author.title}
                          </div>
                        )}
                        {author.email && (
                          <div className='text-sm text-gray-500 dark:text-gray-500'>
                            {author.email}
                          </div>
                        )}
                        {author.avatar && (
                          <div className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
                            头像: {author.avatar}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeAuthor(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 附件管理 */}
          <div className='space-y-2'>
            <Label>附件</Label>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-4'>
              <Input
                value={newAttachment.name}
                onChange={e => setNewAttachment(prev => ({ ...prev, name: e.target.value }))}
                placeholder='附件名称'
              />
              <Input
                value={newAttachment.url}
                onChange={e => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
                placeholder='附件URL'
              />
              <Input
                value={newAttachment.type}
                onChange={e => setNewAttachment(prev => ({ ...prev, type: e.target.value }))}
                placeholder='类型（可选）'
              />
              <Button type='button' onClick={addAttachment} variant='outline'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            {formData.attachments && formData.attachments.length > 0 && (
              <div className='mt-2 space-y-2'>
                {formData.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-800'
                  >
                    <div className='flex items-center space-x-2'>
                      <FileText className='h-4 w-4 text-gray-500' />
                      <div>
                        <span className='font-medium'>{attachment.name}</span>
                        {attachment.type && (
                          <Badge variant='outline' className='ml-2 text-xs'>
                            {attachment.type}
                          </Badge>
                        )}
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          {attachment.url}
                        </div>
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeAttachment(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 其他设置 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='featured'
                checked={formData.featured}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor='featured'>特色研究</Label>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='sortOrder'>排序权重</Label>
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
          </div>

          {/* 提交按钮 */}
          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
