'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichTextField } from '@/components/ui/rich-text-field'
import { MultiImageUpload } from '@/components/ui/multi-image-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus, Edit } from 'lucide-react'

import {
  PRODUCT_CATEGORY_OPTIONS,
  normalizeCategoryId,
  getCategoryName,
} from '@/lib/product-categories'

// 使用统一的产品分类选项
const PRODUCT_CATEGORIES = PRODUCT_CATEGORY_OPTIONS

interface ImageItem {
  id: string
  url: string
  alt?: string
}

interface Product {
  id: string
  category: string
  title: string
  subtitle?: string
  description?: string
  features?: string[]
  specifications?: Array<{
    name: string
    value: string
    unit?: string
  }>
  applications?: string[]
  benefits?: string[]
  image?: string // 主图片，保持向后兼容
  images?: ImageItem[] // 多张图片
  status: 'AVAILABLE' | 'COMING_SOON' | 'DISCONTINUED'
  slug: string
  tags?: string[]
  gradient?: string
  accentColor?: string
  createdAt: Date
  updatedAt: Date
}

interface ProductEditFormProps {
  product: Product | null
  isCreating: boolean
  onSave: (product: Partial<Product>) => void
  onCancel: () => void
}

export default function ProductEditForm({
  product,
  isCreating,
  onSave,
  onCancel,
}: ProductEditFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [newFeature, setNewFeature] = useState('')
  const [newApplication, setNewApplication] = useState('')
  const [newBenefit, setNewBenefit] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newSpec, setNewSpec] = useState({ name: '', value: '', unit: '' })

  useEffect(() => {
    if (product) {
      // 处理图片数据，确保向后兼容
      const processedProduct = {
        ...product,
        images:
          product.images ||
          (product.image
            ? [
                {
                  id: 'legacy',
                  url: product.image,
                  alt: product.title,
                },
              ]
            : []),
      }
      setFormData(processedProduct)
    }
  }, [product])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      const features = [...(formData.features || []), newFeature.trim()]
      handleInputChange('features', features)
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    const features = formData.features?.filter((_, i) => i !== index) || []
    handleInputChange('features', features)
  }

  const addApplication = () => {
    if (newApplication.trim()) {
      const applications = [...(formData.applications || []), newApplication.trim()]
      handleInputChange('applications', applications)
      setNewApplication('')
    }
  }

  const removeApplication = (index: number) => {
    const applications = formData.applications?.filter((_, i) => i !== index) || []
    handleInputChange('applications', applications)
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      const benefits = [...(formData.benefits || []), newBenefit.trim()]
      handleInputChange('benefits', benefits)
      setNewBenefit('')
    }
  }

  const removeBenefit = (index: number) => {
    const benefits = formData.benefits?.filter((_, i) => i !== index) || []
    handleInputChange('benefits', benefits)
  }

  const addTag = () => {
    if (newTag.trim()) {
      const tags = [...(formData.tags || []), newTag.trim()]
      handleInputChange('tags', tags)
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    const tags = formData.tags?.filter((_, i) => i !== index) || []
    handleInputChange('tags', tags)
  }

  const addSpecification = () => {
    if (newSpec.name.trim() && newSpec.value.trim()) {
      const specifications = [...(formData.specifications || []), { ...newSpec }]
      handleInputChange('specifications', specifications)
      setNewSpec({ name: '', value: '', unit: '' })
    }
  }

  const removeSpecification = (index: number) => {
    const specifications = formData.specifications?.filter((_, i) => i !== index) || []
    handleInputChange('specifications', specifications)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title)
    if (isCreating) {
      handleInputChange('slug', generateSlug(title))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 基本验证
    if (!formData.title?.trim()) {
      alert('请输入产品标题')
      return
    }

    if (!formData.category?.trim()) {
      alert('请输入产品分类')
      return
    }

    if (!formData.slug?.trim()) {
      alert('请输入产品URL标识')
      return
    }

    // 处理图片数据，确保向后兼容
    const processedData = {
      ...formData,
      // 设置主图片为第一张图片（向后兼容）
      image:
        formData.images && formData.images.length > 0 ? formData.images[0].url : formData.image,
    }

    onSave(processedData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* 第一部分：基本信息 */}
      <div className='rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100'>基本信息</h3>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='title' className='text-blue-800 dark:text-blue-200'>
                产品标题 *
              </Label>
              <Input
                id='title'
                value={formData.title || ''}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder='输入产品标题'
                required
                className='border-blue-200 focus:border-blue-400 dark:border-blue-700'
              />
            </div>
            <div>
              <Label htmlFor='category' className='text-blue-800 dark:text-blue-200'>
                产品分类 *
              </Label>
              <Select
                value={formData.category || ''}
                onValueChange={value => handleInputChange('category', value)}
              >
                <SelectTrigger className='border-blue-200 focus:border-blue-400 dark:border-blue-700'>
                  <SelectValue placeholder='选择产品分类' />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor='subtitle' className='text-blue-800 dark:text-blue-200'>
              产品副标题
            </Label>
            <Input
              id='subtitle'
              value={formData.subtitle || ''}
              onChange={e => handleInputChange('subtitle', e.target.value)}
              placeholder='简短的产品描述'
              className='border-blue-200 focus:border-blue-400 dark:border-blue-700'
            />
          </div>
        </div>
      </div>

      {/* 第二部分：详细描述 */}
      <div className='rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-green-900 dark:text-green-100'>详细描述</h3>
        <RichTextField
          id='description'
          label='产品详细介绍'
          value={formData.description || ''}
          onChange={content => handleInputChange('description', content)}
          placeholder='详细描述产品的功能、特点和优势，支持富文本格式'
          height={250}
          description='支持富文本编辑，可以添加格式、链接、表格等'
        />
      </div>

      {/* 第三部分：配置信息 */}
      <div className='rounded-lg border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-purple-900 dark:text-purple-100'>
          配置信息
        </h3>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='slug' className='text-purple-800 dark:text-purple-200'>
                URL标识 *
              </Label>
              <Input
                id='slug'
                value={formData.slug || ''}
                onChange={e => handleInputChange('slug', e.target.value)}
                placeholder='产品页面的URL标识，如：smart-camera'
                required
                className='border-purple-200 focus:border-purple-400 dark:border-purple-700'
              />
            </div>
            <div>
              <Label htmlFor='status' className='text-purple-800 dark:text-purple-200'>
                产品状态
              </Label>
              <Select
                value={formData.status || 'AVAILABLE'}
                onValueChange={value => handleInputChange('status', value)}
              >
                <SelectTrigger className='border-purple-200 focus:border-purple-400 dark:border-purple-700'>
                  <SelectValue placeholder='选择产品状态' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='AVAILABLE'>可用</SelectItem>
                  <SelectItem value='COMING_SOON'>即将推出</SelectItem>
                  <SelectItem value='DISCONTINUED'>已停产</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 产品图片上传 */}
          <div className='space-y-4'>
            <MultiImageUpload
              value={formData.images || []}
              onChange={images => handleInputChange('images', images)}
              label='产品图片'
              helpText='上传产品的展示图片，第一张图片将作为主图显示。建议使用高质量的产品图片，尺寸建议为 1200x800 像素。'
              maxImages={8}
              maxSize={5}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='accentColor' className='text-purple-800 dark:text-purple-200'>
                强调色
              </Label>
              <Input
                id='accentColor'
                value={formData.accentColor || ''}
                onChange={e => handleInputChange('accentColor', e.target.value)}
                placeholder='如：#3B82F6'
                className='border-purple-200 focus:border-purple-400 dark:border-purple-700'
              />
            </div>
            <div>
              <Label htmlFor='gradient' className='text-purple-800 dark:text-purple-200'>
                渐变背景
              </Label>
              <Input
                id='gradient'
                value={formData.gradient || ''}
                onChange={e => handleInputChange('gradient', e.target.value)}
                placeholder='如：from-blue-500 to-purple-600'
                className='border-purple-200 focus:border-purple-400 dark:border-purple-700'
              />
            </div>
          </div>
        </div>
      </div>

      {/* 第四部分：核心功能 */}
      <div className='rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100'>
          核心功能
        </h3>
        <div className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              value={newFeature}
              onChange={e => setNewFeature(e.target.value)}
              placeholder='添加核心功能特性'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className='border-orange-200 focus:border-orange-400 dark:border-orange-700'
            />
            <Button
              type='button'
              onClick={addFeature}
              className='bg-orange-600 hover:bg-orange-700'
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.features?.map((feature, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='flex items-center gap-1 bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200'
              >
                {feature}
                <X
                  className='h-3 w-3 cursor-pointer hover:text-red-600'
                  onClick={() => removeFeature(index)}
                />
              </Badge>
            ))}
          </div>
          {formData.features?.length === 0 && (
            <p className='text-sm text-orange-600 dark:text-orange-400'>
              暂无核心功能，请添加产品的主要特性
            </p>
          )}
        </div>
      </div>

      {/* 第五部分：技术规格 */}
      <div className='rounded-lg border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-indigo-900 dark:text-indigo-100'>
          技术规格
        </h3>
        <div className='space-y-4'>
          <div className='grid grid-cols-3 gap-2'>
            <Input
              value={newSpec.name}
              onChange={e => setNewSpec(prev => ({ ...prev, name: e.target.value }))}
              placeholder='规格名称'
              className='border-indigo-200 focus:border-indigo-400 dark:border-indigo-700'
            />
            <Input
              value={newSpec.value}
              onChange={e => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
              placeholder='规格值'
              className='border-indigo-200 focus:border-indigo-400 dark:border-indigo-700'
            />
            <div className='flex gap-2'>
              <Input
                value={newSpec.unit}
                onChange={e => setNewSpec(prev => ({ ...prev, unit: e.target.value }))}
                placeholder='单位(可选)'
                className='border-indigo-200 focus:border-indigo-400 dark:border-indigo-700'
              />
              <Button
                type='button'
                onClick={addSpecification}
                className='bg-indigo-600 hover:bg-indigo-700'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='space-y-2'>
            {formData.specifications?.map((spec, index) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900/50'
              >
                <span className='text-indigo-900 dark:text-indigo-100'>
                  <strong>{spec.name}:</strong> {spec.value}
                  {spec.unit && ` ${spec.unit}`}
                </span>
                <X
                  className='h-4 w-4 cursor-pointer text-red-500 hover:text-red-700'
                  onClick={() => removeSpecification(index)}
                />
              </div>
            ))}
          </div>
          {formData.specifications?.length === 0 && (
            <p className='text-sm text-indigo-600 dark:text-indigo-400'>
              暂无技术规格，请添加产品的技术参数
            </p>
          )}
        </div>
      </div>

      {/* 第六部分：应用场景 */}
      <div className='rounded-lg border border-teal-200 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-teal-900 dark:text-teal-100'>应用场景</h3>
        <div className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              value={newApplication}
              onChange={e => setNewApplication(e.target.value)}
              placeholder='添加应用场景'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addApplication())}
              className='border-teal-200 focus:border-teal-400 dark:border-teal-700'
            />
            <Button
              type='button'
              onClick={addApplication}
              className='bg-teal-600 hover:bg-teal-700'
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.applications?.map((app, index) => (
              <Badge
                key={index}
                variant='outline'
                className='flex items-center gap-1 border-teal-300 text-teal-800 hover:bg-teal-100 dark:border-teal-700 dark:text-teal-200'
              >
                {app}
                <X
                  className='h-3 w-3 cursor-pointer hover:text-red-600'
                  onClick={() => removeApplication(index)}
                />
              </Badge>
            ))}
          </div>
          {formData.applications?.length === 0 && (
            <p className='text-sm text-teal-600 dark:text-teal-400'>
              暂无应用场景，请添加产品的使用场景
            </p>
          )}
        </div>
      </div>

      {/* 第七部分：产品优势 */}
      <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-emerald-900 dark:text-emerald-100'>
          产品优势
        </h3>
        <div className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              value={newBenefit}
              onChange={e => setNewBenefit(e.target.value)}
              placeholder='添加产品优势'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              className='border-emerald-200 focus:border-emerald-400 dark:border-emerald-700'
            />
            <Button
              type='button'
              onClick={addBenefit}
              className='bg-emerald-600 hover:bg-emerald-700'
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.benefits?.map((benefit, index) => (
              <Badge
                key={index}
                variant='default'
                className='flex items-center gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-200'
              >
                {benefit}
                <X
                  className='h-3 w-3 cursor-pointer hover:text-red-600'
                  onClick={() => removeBenefit(index)}
                />
              </Badge>
            ))}
          </div>
          {formData.benefits?.length === 0 && (
            <p className='text-sm text-emerald-600 dark:text-emerald-400'>
              暂无产品优势，请添加产品的核心优势
            </p>
          )}
        </div>
      </div>

      {/* 第八部分：产品标签 */}
      <div className='rounded-lg border border-rose-200 bg-rose-50 p-6 dark:border-rose-800 dark:bg-rose-950/30'>
        <h3 className='mb-4 text-lg font-semibold text-rose-900 dark:text-rose-100'>产品标签</h3>
        <div className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder='添加产品标签'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className='border-rose-200 focus:border-rose-400 dark:border-rose-700'
            />
            <Button type='button' onClick={addTag} className='bg-rose-600 hover:bg-rose-700'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.tags?.map((tag, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='flex items-center gap-1 bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-900 dark:text-rose-200'
              >
                #{tag}
                <X
                  className='h-3 w-3 cursor-pointer hover:text-red-600'
                  onClick={() => removeTag(index)}
                />
              </Badge>
            ))}
          </div>
          {formData.tags?.length === 0 && (
            <p className='text-sm text-rose-600 dark:text-rose-400'>
              暂无产品标签，请添加便于搜索的关键词
            </p>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className='sticky bottom-0 -mx-6 -mb-6 rounded-b-lg border-t border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900'>
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='text-sm text-slate-600 dark:text-slate-400'>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-blue-500'></div>
              {isCreating ? '创建新产品后将自动保存到数据库' : '修改将立即保存到数据库'}
            </div>
          </div>
          <div className='flex gap-3'>
            <Button type='button' variant='outline' onClick={onCancel} className='min-w-[100px]'>
              取消
            </Button>
            <Button type='submit' className='min-w-[120px] bg-blue-600 hover:bg-blue-700'>
              {isCreating ? (
                <>
                  <Plus className='mr-2 h-4 w-4' />
                  创建产品
                </>
              ) : (
                <>
                  <Edit className='mr-2 h-4 w-4' />
                  保存修改
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
