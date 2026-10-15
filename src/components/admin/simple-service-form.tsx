'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { CoverImageUpload } from '@/components/ui/cover-image-upload'
import { Save, ArrowLeft, Plus, X } from 'lucide-react'

// 简化的服务数据类型
interface SimpleService {
  id?: string
  title: string
  subtitle?: string
  description: string
  icon: string
  displayOrder: number
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  features?: string[]
  backgroundImage?: string
  highlight?: string
  category?: string
  serviceType?: string
  level?: string
  duration?: string

  // 详情页面必需字段
  hero?: {
    title: string
    subtitle: string
    description: string
    instructor: {
      name: string
      title: string
      company: string
    }
  }
  learning?: {
    title: string
    objectives: string[]
  }
  about?: {
    title: string
    description: string
    details: string[]
  }
  cta?: {
    buttonText: string
    isEnrollment: boolean
  }
  metrics?: Array<{
    label: string
    value: string
    unit?: string
  }>
  courseInfo?: {
    level: string
    duration: string
    lessons: number
    instructor: string
    company: string
  }
}

interface SimpleServiceFormProps {
  service?: SimpleService
  onSuccess?: () => void
  onCancel?: () => void
  readOnly?: boolean
}

export function SimpleServiceForm({
  service,
  onSuccess,
  onCancel,
  readOnly = false,
}: SimpleServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [newFeature, setNewFeature] = useState('')
  const [newObjective, setNewObjective] = useState('')
  const [newDetail, setNewDetail] = useState('')
  const [newMetric, setNewMetric] = useState({ label: '', value: '' })

  const [formData, setFormData] = useState<SimpleService>({
    title: service?.title || '',
    subtitle: service?.subtitle || '',
    description: service?.description || '',
    icon: service?.icon || '',
    displayOrder: service?.displayOrder || 1,
    slug: service?.slug || '',
    status: service?.status || 'DRAFT',
    features: service?.features || [],
    backgroundImage: service?.backgroundImage || '',
    highlight: service?.highlight || '',
    category: service?.category || '专业服务',
    serviceType: service?.serviceType || 'core',
    level: service?.level || 'intermediate',
    duration: service?.duration || '',

    // 详情页面必需字段
    hero: service?.hero || {
      title: service?.title || '',
      subtitle: service?.subtitle || '',
      description: service?.description || '',
      instructor: {
        name: '专业团队',
        title: '服务专家',
        company: '临港景鸿',
      },
    },
    learning: service?.learning || {
      title: '服务内容',
      objectives: [],
    },
    about: service?.about || {
      title: '关于此服务',
      description: service?.description || '',
      details: [],
    },
    cta: service?.cta || {
      buttonText: '立即咨询',
      isEnrollment: false,
    },
    metrics: service?.metrics || [],
    courseInfo: service?.courseInfo || {
      level: service?.level || 'intermediate',
      duration: service?.duration || '',
      lessons: 1,
      instructor: '专业团队',
      company: '临港景鸿',
    },
  })

  // 处理输入变化
  const handleInputChange = (field: keyof SimpleService, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 处理标题变化，自动生成slug
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug:
        prev.slug ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, ''),
    }))
  }

  // 添加特性
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature('')
    }
  }

  // 删除特性
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }))
  }

  // 添加服务内容目标
  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        learning: {
          ...prev.learning!,
          objectives: [...(prev.learning?.objectives || []), newObjective.trim()],
        },
      }))
      setNewObjective('')
    }
  }

  // 删除服务内容目标
  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning: {
        ...prev.learning!,
        objectives: prev.learning?.objectives?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  // 添加服务详情
  const addDetail = () => {
    if (newDetail.trim()) {
      setFormData(prev => ({
        ...prev,
        about: {
          ...prev.about!,
          details: [...(prev.about?.details || []), newDetail.trim()],
        },
      }))
      setNewDetail('')
    }
  }

  // 删除服务详情
  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      about: {
        ...prev.about!,
        details: prev.about?.details?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  // 添加关键指标
  const addMetric = () => {
    if (newMetric.label.trim() && newMetric.value.trim()) {
      setFormData(prev => ({
        ...prev,
        metrics: [...(prev.metrics || []), { ...newMetric }],
      }))
      setNewMetric({ label: '', value: '' })
    }
  }

  // 删除关键指标
  const removeMetric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics?.filter((_, i) => i !== index) || [],
    }))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = service?.id
        ? `/api/admin/content/services/${service.id}`
        : '/api/admin/content/services'

      const method = service?.id ? 'PUT' : 'POST'

      // 确保关键字段与基本信息同步
      const submitData = {
        ...formData,
        hero: {
          ...formData.hero!,
          title: formData.title,
          subtitle: formData.subtitle || '',
          description: formData.description,
        },
        about: {
          ...formData.about!,
          description: formData.description,
        },
        courseInfo: {
          ...formData.courseInfo!,
          level: formData.level || 'intermediate',
          duration: formData.duration || '',
        },
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(`保存失败: ${error.message || '未知错误'}`)
      }
    } catch (error) {
      console.error('保存服务失败:', error)
      alert('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mx-auto max-w-4xl space-y-6'>
      {/* 前端显示信息 */}
      <Card className='border-blue-200'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            📱 服务信息
            <Badge className='bg-blue-100 text-xs text-blue-800'>前端显示</Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>这些信息将显示在 /services 页面的服务卡片中</p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* 服务标题 */}
          <div>
            <Label htmlFor='title' className='text-base font-medium'>
              服务标题 *
            </Label>
            <Input
              id='title'
              value={formData.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder='例如：数字化转型、智能运维服务'
              disabled={readOnly}
              required
              className='text-base'
            />
            <p className='mt-1 text-xs text-gray-500'>💡 显示为服务卡片的主标题</p>
          </div>

          {/* 服务描述 */}
          <div>
            <Label htmlFor='description' className='text-base font-medium'>
              服务描述 *
            </Label>
            <textarea
              id='description'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder='简洁描述服务的核心价值和功能，例如：帮助企业实现全面数字化转型，提升运营效率和竞争力。'
              disabled={readOnly}
              required
              rows={3}
              className='flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
            <div className='mt-1 flex items-center justify-between'>
              <p className='text-xs text-gray-500'>💡 显示在标题下方，建议50-100字</p>
              <span
                className={`text-xs ${
                  formData.description.length > 100
                    ? 'text-red-500'
                    : formData.description.length > 80
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                }`}
              >
                {formData.description.length}/100字
              </span>
            </div>
          </div>

          {/* 背景图片上传 */}
          <div className='space-y-3'>
            <Label className='flex items-center gap-2 text-base font-medium'>
              🖼️ 服务卡片背景图片
              <Badge variant='outline' className='text-xs'>
                推荐
              </Badge>
            </Label>

            <CoverImageUpload
              value={formData.backgroundImage || ''}
              onChange={url => handleInputChange('backgroundImage', url)}
              label=''
              placeholder='为服务卡片选择专业背景图片'
              uploadType='service-background'
            />

            <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
              <div className='space-y-1 text-sm'>
                <p className='font-medium text-blue-800'>📐 图片规格建议：</p>
                <ul className='ml-4 space-y-0.5 text-blue-700'>
                  <li>• 尺寸比例：16:9 或 4:3</li>
                  <li>• 分辨率：至少 800x450 像素</li>
                  <li>• 格式：JPG、PNG、WebP</li>
                  <li>• 文件大小：建议小于 500KB</li>
                </ul>
              </div>
            </div>

            {/* 背景图片预览效果 */}
            {formData.backgroundImage && (
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <p className='mb-2 text-sm font-medium text-gray-700'>🔍 卡片效果预览：</p>
                <div
                  className='dynamic-bg-image relative h-32 overflow-hidden rounded-lg border border-gray-300'
                  style={
                    { '--bg-image': `url(${formData.backgroundImage})` } as React.CSSProperties
                  }
                >
                  <div className='absolute inset-0 bg-black/40'></div>
                  <div className='relative p-4 text-white'>
                    <h3 className='text-lg font-bold drop-shadow-md'>
                      {formData.title || '服务标题'}
                    </h3>
                    <p className='mt-1 text-sm text-white/90 drop-shadow-md'>
                      {formData.description?.substring(0, 60) || '服务描述...'}
                      {(formData.description?.length || 0) > 60 && '...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 服务亮点 */}
          <div>
            <Label htmlFor='highlight' className='text-base font-medium'>
              服务亮点
            </Label>
            <Input
              id='highlight'
              value={formData.highlight || ''}
              onChange={e => handleInputChange('highlight', e.target.value)}
              placeholder='例如：平均提升40%运营效率'
              disabled={readOnly}
              className='text-base'
            />
            <p className='mt-1 text-xs text-gray-500'>💡 显示在服务卡片底部，突出核心价值</p>
          </div>

          {/* 图标和显示顺序 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='icon' className='text-base font-medium'>
                服务图标 *
              </Label>
              <select
                id='icon'
                value={formData.icon}
                onChange={e => handleInputChange('icon', e.target.value)}
                className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={readOnly}
                required
                aria-label='服务图标'
              >
                <option value=''>选择图标</option>
                <option value='Cpu'>💻 数字化转型 (Cpu)</option>
                <option value='Settings'>⚙️ 智能运维 (Settings)</option>
                <option value='Wrench'>🔧 智能工程 (Wrench)</option>
                <option value='Flame'>🔥 消防工程 (Flame)</option>
                <option value='Shield'>🛡️ 风险评估 (Shield)</option>
                <option value='Grid3X3'>📋 其他服务 (Grid3X3)</option>
                <option value='CheckCircle'>✅ 检查服务 (CheckCircle)</option>
                <option value='Star'>⭐ 星级服务 (Star)</option>
              </select>
              <p className='mt-1 text-xs text-gray-500'>💡 显示在卡片左上角</p>
            </div>
            <div>
              <Label htmlFor='displayOrder' className='text-base font-medium'>
                显示顺序 *
              </Label>
              <Input
                id='displayOrder'
                type='number'
                value={formData.displayOrder}
                onChange={e => handleInputChange('displayOrder', parseInt(e.target.value) || 1)}
                placeholder='1'
                disabled={readOnly}
                required
                min='1'
                max='99'
                className='text-base'
              />
              <p className='mt-1 text-xs text-gray-500'>💡 数字越小越靠前，建议1-6</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 技术配置 */}
      <Card className='border-gray-200'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>⚙️ 技术配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* 服务分类和类型 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='category' className='text-base font-medium'>
                服务分类
              </Label>
              <select
                id='category'
                value={formData.category || '专业服务'}
                onChange={e => handleInputChange('category', e.target.value)}
                className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={readOnly}
                aria-label='服务分类'
              >
                <option value='专业服务'>🏢 专业服务</option>
                <option value='数字化服务'>💻 数字化服务</option>
                <option value='智能服务'>🤖 智能服务</option>
                <option value='工程服务'>🔧 工程服务</option>
                <option value='咨询服务'>💡 咨询服务</option>
              </select>
              <p className='mt-1 text-xs text-gray-500'>💡 用于服务分类和筛选</p>
            </div>
            <div>
              <Label htmlFor='serviceType' className='text-base font-medium'>
                服务类型
              </Label>
              <select
                id='serviceType'
                value={formData.serviceType || 'core'}
                onChange={e => handleInputChange('serviceType', e.target.value)}
                className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={readOnly}
                aria-label='服务类型'
              >
                <option value='core'>🌟 核心服务</option>
                <option value='specialized'>🎯 专业服务</option>
              </select>
              <p className='mt-1 text-xs text-gray-500'>💡 核心服务优先显示</p>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='slug' className='text-base font-medium'>
                URL标识 *
              </Label>
              <Input
                id='slug'
                value={formData.slug}
                onChange={e => handleInputChange('slug', e.target.value)}
                placeholder='digital-transformation'
                disabled={readOnly}
                required
                className='font-mono text-sm'
              />
              <p className='mt-1 text-xs text-gray-500'>
                🔗 完整URL：/services/
                <span className='font-mono'>{formData.slug || 'service-slug'}</span>
              </p>
            </div>
            <div>
              <Label htmlFor='subtitle' className='text-base font-medium'>
                英文副标题
              </Label>
              <Input
                id='subtitle'
                value={formData.subtitle || ''}
                onChange={e => handleInputChange('subtitle', e.target.value)}
                placeholder='Digital Transformation'
                disabled={readOnly}
                className='text-sm'
              />
              <p className='mt-1 text-xs text-gray-500'>可选，用于详情页面</p>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <Label htmlFor='level' className='text-base font-medium'>
                服务级别
              </Label>
              <select
                id='level'
                value={formData.level || 'intermediate'}
                onChange={e => handleInputChange('level', e.target.value)}
                className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={readOnly}
                aria-label='服务级别'
              >
                <option value='beginner'>🟢 初级</option>
                <option value='intermediate'>🟡 中级</option>
                <option value='advanced'>🔴 高级</option>
              </select>
              <p className='mt-1 text-xs text-gray-500'>💡 用于详情页面显示</p>
            </div>
            <div>
              <Label htmlFor='duration' className='text-base font-medium'>
                服务周期
              </Label>
              <Input
                id='duration'
                value={formData.duration || ''}
                onChange={e => handleInputChange('duration', e.target.value)}
                placeholder='例如：1-3个月'
                disabled={readOnly}
                className='text-sm'
              />
              <p className='mt-1 text-xs text-gray-500'>💡 服务完成所需时间</p>
            </div>
            <div>
              <Label htmlFor='status' className='text-base font-medium'>
                发布状态
              </Label>
              <select
                id='status'
                value={formData.status}
                onChange={e => handleInputChange('status', e.target.value)}
                className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={readOnly}
                aria-label='发布状态'
              >
                <option value='DRAFT'>📝 草稿</option>
                <option value='PUBLISHED'>✅ 已发布</option>
                <option value='ARCHIVED'>📦 已归档</option>
              </select>
              <p className='mt-1 text-xs text-gray-500'>💡 只有已发布的服务会在前端显示</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详情页面内容 */}
      <Card className='border-purple-200'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            📄 详情页面内容
            <Badge variant='outline' className='text-xs'>
              详情页显示
            </Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>这些内容将显示在服务详情页面中</p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* 服务内容目标 */}
          <div>
            <Label className='text-base font-medium'>服务内容目标</Label>
            <div className='space-y-3'>
              {formData.learning?.objectives?.map((objective, index) => (
                <div key={index} className='flex items-center gap-2 rounded-lg bg-gray-50 p-3'>
                  <span className='flex-1 text-sm'>{objective}</span>
                  {!readOnly && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeObjective(index)}
                      className='h-8 w-8 p-0 text-red-500 hover:text-red-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
              {!readOnly && (
                <div className='flex gap-2'>
                  <Input
                    value={newObjective}
                    onChange={e => setNewObjective(e.target.value)}
                    placeholder='添加服务内容目标，例如：提供专业的数字化咨询'
                    className='flex-1'
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  />
                  <Button type='button' onClick={addObjective} size='sm'>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </div>
            <p className='mt-1 text-xs text-gray-500'>💡 显示在详情页面的"服务内容"部分</p>
          </div>

          {/* 服务详情说明 */}
          <div>
            <Label className='text-base font-medium'>服务详情说明</Label>
            <div className='space-y-3'>
              {formData.about?.details?.map((detail, index) => (
                <div key={index} className='flex items-center gap-2 rounded-lg bg-gray-50 p-3'>
                  <span className='flex-1 text-sm'>{detail}</span>
                  {!readOnly && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeDetail(index)}
                      className='h-8 w-8 p-0 text-red-500 hover:text-red-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
              {!readOnly && (
                <div className='flex gap-2'>
                  <Input
                    value={newDetail}
                    onChange={e => setNewDetail(e.target.value)}
                    placeholder='添加服务详情说明，例如：专业团队提供一对一服务'
                    className='flex-1'
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addDetail())}
                  />
                  <Button type='button' onClick={addDetail} size='sm'>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </div>
            <p className='mt-1 text-xs text-gray-500'>💡 显示在详情页面的"关于此服务"部分</p>
          </div>

          {/* 关键指标 */}
          <div>
            <Label className='text-base font-medium'>关键指标</Label>
            <div className='space-y-3'>
              {formData.metrics?.map((metric, index) => (
                <div key={index} className='flex items-center gap-2 rounded-lg bg-gray-50 p-3'>
                  <div className='grid flex-1 grid-cols-2 gap-2'>
                    <span className='text-sm font-medium'>{metric.label}</span>
                    <span className='text-sm font-bold text-blue-600'>{metric.value}</span>
                  </div>
                  {!readOnly && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeMetric(index)}
                      className='h-8 w-8 p-0 text-red-500 hover:text-red-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
              {!readOnly && (
                <div className='grid grid-cols-2 gap-2'>
                  <Input
                    value={newMetric.label}
                    onChange={e => setNewMetric(prev => ({ ...prev, label: e.target.value }))}
                    placeholder='指标名称，如：效率提升'
                    className='text-sm'
                  />
                  <div className='flex gap-2'>
                    <Input
                      value={newMetric.value}
                      onChange={e => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
                      placeholder='数值，如：80%'
                      className='flex-1 text-sm'
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMetric())}
                    />
                    <Button type='button' onClick={addMetric} size='sm'>
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
              {!readOnly && (
                <div className='flex flex-wrap gap-2'>
                  <p className='mb-1 w-full text-xs text-gray-500'>💡 快速添加常用指标：</p>
                  {[
                    { label: '效率提升', value: '80%' },
                    { label: '成本降低', value: '60%' },
                    { label: '项目数量', value: '200+' },
                    { label: '成功率', value: '98%' },
                  ].map(template => (
                    <Button
                      key={template.label}
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setNewMetric(template)}
                      className='h-7 text-xs'
                    >
                      {template.label}: {template.value}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <p className='mt-1 text-xs text-gray-500'>💡 显示在详情页面头部的关键数据，建议2-4个</p>
          </div>

          {/* CTA按钮文字 */}
          <div>
            <Label htmlFor='ctaButtonText' className='text-base font-medium'>
              行动按钮文字
            </Label>
            <Input
              id='ctaButtonText'
              value={formData.cta?.buttonText || '立即咨询'}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  cta: { ...prev.cta!, buttonText: e.target.value },
                }))
              }
              placeholder='立即咨询'
              disabled={readOnly}
              className='text-base'
            />
            <p className='mt-1 text-xs text-gray-500'>💡 详情页面底部的行动按钮文字</p>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className='flex items-center justify-between border-t pt-6'>
        <div className='text-sm text-gray-500'>💡 保存后，服务将根据发布状态显示在前端页面</div>
        <div className='flex items-center gap-3'>
          <Button type='button' variant='outline' onClick={onCancel}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            {readOnly ? '关闭' : '取消'}
          </Button>
          {!readOnly && (
            <Button type='submit' disabled={loading} className='min-w-[120px]'>
              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                  保存中...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Save className='h-4 w-4' />
                  {service ? '更新服务' : '创建服务'}
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
