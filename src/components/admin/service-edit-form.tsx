'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichTextField } from '@/components/ui/rich-text-field'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CoverImageUpload } from '@/components/ui/cover-image-upload'
import { Plus, X, Save, ArrowLeft } from 'lucide-react'
import { MetricsPreview, MetricsSuggestions } from '@/components/admin/metrics-preview'

interface Service {
  id?: string
  title: string
  subtitle?: string
  description?: string
  category?: string
  serviceType?: 'core' | 'specialized'
  level?: string
  duration?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

  // 服务页面展示配置
  icon?: string
  backgroundImage?: string
  highlight?: string
  features?: string[]
  displayOrder?: number

  // 页面内容结构 - 匹配 ModernServiceData
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
  courseInfo?: {
    level: string
    duration: string
    lessons: number
    instructor: string
    company: string
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

  // 原有字段保持兼容
  process?: Array<{
    step: number
    title: string
    description: string
    icon?: string
  }>
  visualElements?: {
    primaryColor?: string
    secondaryColor?: string
    icon?: string
  }
  ctaConfig?: {
    text?: string
    link?: string
    style?: string
  }
  metrics?: Array<{
    label: string
    value: string
    unit?: string
  }>
  slug: string
  // SEO字段
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

interface ServiceEditFormProps {
  service?: Service
  onSuccess?: () => void
  onCancel?: () => void
  readOnly?: boolean
}

export function ServiceEditForm({
  service,
  onSuccess,
  onCancel,
  readOnly = false,
}: ServiceEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Service>({
    title: '',
    subtitle: '',
    description: '',
    category: '专业服务',
    serviceType: 'core',
    level: 'intermediate',
    duration: '',
    status: 'DRAFT',

    // 服务页面展示配置
    icon: '',
    backgroundImage: '',
    highlight: '',
    features: [],
    displayOrder: 0,

    // 页面内容结构
    hero: {
      title: '',
      subtitle: '',
      description: '',
      instructor: {
        name: '专业团队',
        title: '服务专家',
        company: '临港景鸿',
      },
    },
    learning: {
      title: '服务内容',
      objectives: [],
    },
    courseInfo: {
      level: 'intermediate',
      duration: '',
      lessons: 0,
      instructor: '专业团队',
      company: '临港景鸿',
    },
    about: {
      title: '关于此服务',
      description: '',
      details: [],
    },
    cta: {
      buttonText: '立即咨询',
      isEnrollment: false,
    },

    // 原有字段保持兼容
    process: [],
    visualElements: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      icon: '',
    },
    ctaConfig: {
      text: '立即咨询',
      link: '/contact',
      style: 'primary',
    },
    metrics: [],
    slug: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
  })

  // 新增特性和指标的临时状态
  const [newFeature, setNewFeature] = useState('')
  const [metricsJson, setMetricsJson] = useState('')
  const [newProcessStep, setNewProcessStep] = useState({ title: '', description: '', icon: '' })

  // 解析指标JSON的辅助函数
  const parseMetricsJson = (jsonString: string) => {
    try {
      return JSON.parse(jsonString || '{}')
    } catch {
      return {}
    }
  }

  useEffect(() => {
    if (service) {
      // 安全解析 JSON 字段
      const parseJsonField = (field: any, defaultValue: any) => {
        if (!field) return defaultValue
        if (typeof field === 'string') {
          try {
            return JSON.parse(field)
          } catch {
            return defaultValue
          }
        }
        return field
      }

      const newFormData = {
        ...service,
        process: parseJsonField(service.process, []),
        visualElements: parseJsonField(service.visualElements, {
          primaryColor: '#3b82f6',
          secondaryColor: '#1e40af',
          icon: '',
        }),
        ctaConfig: parseJsonField(service.ctaConfig, {
          text: '了解更多',
          link: '#',
          style: 'primary',
        }),
        metrics: parseJsonField(service.metrics, []),
        features: parseJsonField(service.features, []),
        hero: parseJsonField(service.hero, {
          title: '',
          subtitle: '',
          description: '',
          instructor: {
            name: '专业团队',
            title: '服务专家',
            company: '临港景鸿',
          },
        }),
        learning: parseJsonField(service.learning, {
          title: '服务内容',
          objectives: [],
        }),
        courseInfo: parseJsonField(service.courseInfo, {
          level: 'intermediate',
          duration: '',
          lessons: 0,
          instructor: '专业团队',
          company: '临港景鸿',
        }),
        about: parseJsonField(service.about, {
          title: '关于此服务',
          subtitle: '',
          description: '',
          details: [],
        }),
        cta: parseJsonField(service.cta, {
          buttonText: '立即咨询',
          isEnrollment: false,
        }),
      }

      setFormData(newFormData)

      // 初始化指标JSON字符串
      const metrics = parseJsonField(service.metrics, [])
      if (Array.isArray(metrics) && metrics.length > 0) {
        // 将数组格式转换为对象格式
        const metricsObj: Record<string, string> = {}
        metrics.forEach((metric: any) => {
          if (metric.label && metric.value) {
            metricsObj[metric.label] = metric.unit ? `${metric.value}${metric.unit}` : metric.value
          }
        })
        setMetricsJson(JSON.stringify(metricsObj, null, 2))
      } else {
        setMetricsJson('')
      }
    }
  }, [service])

  const handleInputChange = (field: keyof Service, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parentField: keyof Service, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [field]: value,
      },
    }))
  }

  // 生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // 当标题改变时自动生成slug
  const handleTitleChange = (title: string) => {
    handleInputChange('title', title)
    if (!service) {
      // 只在创建时自动生成
      handleInputChange('slug', generateSlug(title))
    }
  }

  // 添加特性
  const addFeature = () => {
    if (newFeature.trim()) {
      const features = [...(formData.features || []), newFeature.trim()]
      handleInputChange('features', features)
      setNewFeature('')
    }
  }

  // 删除特性
  const removeFeature = (index: number) => {
    const features = formData.features?.filter((_, i) => i !== index) || []
    handleInputChange('features', features)
  }

  // 处理指标JSON变化
  const handleMetricsJsonChange = (value: string) => {
    setMetricsJson(value)
    try {
      if (value.trim()) {
        const metricsObj = JSON.parse(value)
        if (typeof metricsObj === 'object' && metricsObj !== null && !Array.isArray(metricsObj)) {
          // 将对象格式转换为数组格式以兼容现有数据结构
          const metricsArray = Object.entries(metricsObj).map(([label, value]) => ({
            label,
            value: String(value),
            unit: '',
          }))
          handleInputChange('metrics', metricsArray)
        }
      } else {
        handleInputChange('metrics', [])
      }
    } catch (error) {
      // JSON格式错误时不更新formData，保持当前状态
      console.log('JSON格式错误:', error)
    }
  }

  // 添加流程步骤
  const addProcessStep = () => {
    if (newProcessStep.title.trim() && newProcessStep.description.trim()) {
      const process = [...(formData.process || [])]
      const step = process.length + 1
      process.push({ ...newProcessStep, step })
      handleInputChange('process', process)
      setNewProcessStep({ title: '', description: '', icon: '' })
    }
  }

  // 删除流程步骤
  const removeProcessStep = (index: number) => {
    const process = formData.process?.filter((_, i) => i !== index) || []
    // 重新编号
    const reorderedProcess = process.map((item, i) => ({ ...item, step: i + 1 }))
    handleInputChange('process', reorderedProcess)
  }

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (!readOnly && !loading) {
          const form = document.querySelector('form') as HTMLFormElement
          if (form) form.requestSubmit()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [readOnly, loading])

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return

    setLoading(true)
    try {
      const url = service
        ? `/api/admin/content/services/${service.id}`
        : '/api/admin/content/services'

      const method = service ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(error.error || '操作失败')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* 核心信息 - 前端显示字段 */}
      <Card className='border-blue-200'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            📱 前端显示信息
            <Badge className='bg-blue-100 text-xs text-blue-800'>必填</Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>这些信息将直接显示在 /services 页面的服务卡片中</p>
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
              value={formData.description || ''}
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
                  (formData.description || '').length > 100
                    ? 'text-red-500'
                    : (formData.description || '').length > 80
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                }`}
              >
                {(formData.description || '').length}/100字
              </span>
            </div>
          </div>

          {/* 服务图标和显示顺序 */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='icon' className='text-base font-medium'>
                服务图标 *
              </Label>
              <select
                id='icon'
                value={formData.icon || ''}
                onChange={e => handleInputChange('icon', e.target.value)}
                className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={readOnly}
                required
                aria-label='图标名称'
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
                value={formData.displayOrder || ''}
                onChange={e => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
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

          {/* 背景图片上传 - 增强版 */}
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
                <p className='mt-2 font-medium text-blue-800'>🎨 设计建议：</p>
                <ul className='ml-4 space-y-0.5 text-blue-700'>
                  <li>• 选择与服务主题相关的专业图片</li>
                  <li>• 避免过于复杂的背景，确保文字清晰可读</li>
                  <li>• 建议使用科技感、商务风格的图片</li>
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
        </CardContent>
      </Card>

      {/* 技术配置 */}
      <Card className='border-gray-200'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            ⚙️ 技术配置
            <Badge variant='outline' className='text-xs'>
              系统设置
            </Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>URL路径和发布状态设置</p>
        </CardHeader>
        <CardContent className='space-y-4'>
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
              <Label htmlFor='status' className='text-base font-medium'>
                发布状态
              </Label>
              <select
                id='status'
                value={formData.status || 'DRAFT'}
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

          {/* 服务分类和级别 */}
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
        </CardContent>
      </Card>

      {/* 服务卡片预览 */}
      <Card className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            👁️ 实时预览
            <Badge className='bg-green-100 text-xs text-green-800'>前端效果</Badge>
          </CardTitle>
          <p className='text-sm text-green-700 dark:text-green-300'>
            这是服务在 <code className='rounded bg-green-100 px-1'>/services</code>{' '}
            页面的实际显示效果
          </p>
        </CardHeader>
        <CardContent>
          {/* 服务卡片预览 */}
          <div className='mx-auto max-w-md'>
            <div
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-md ${
                formData.backgroundImage
                  ? 'dynamic-bg-image border-transparent bg-transparent text-white'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              style={
                formData.backgroundImage
                  ? ({ '--bg-image': `url(${formData.backgroundImage})` } as React.CSSProperties)
                  : {}
              }
            >
              {/* 背景图片遮罩层 */}
              {formData.backgroundImage && (
                <div className='absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/40'></div>
              )}

              <div className='relative p-6'>
                <div className='flex items-start gap-4'>
                  {/* 图标 */}
                  <div
                    className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                      formData.backgroundImage
                        ? 'border border-white/30 bg-white/20 text-white backdrop-blur-sm'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className='text-sm'>📱</span>
                  </div>

                  <div className='flex-1'>
                    {/* 标题和描述 */}
                    <h3
                      className={`mb-2 text-lg font-semibold ${
                        formData.backgroundImage ? 'text-white drop-shadow-md' : 'text-slate-900'
                      }`}
                    >
                      {formData.title || '服务标题'}
                    </h3>
                    <p
                      className={`mb-3 text-sm leading-relaxed ${
                        formData.backgroundImage ? 'text-white/95 drop-shadow-md' : 'text-slate-600'
                      }`}
                    >
                      {formData.description || '服务描述...'}
                    </p>

                    {/* 亮点 */}
                    {formData.highlight && (
                      <p
                        className={`text-sm font-medium ${
                          formData.backgroundImage
                            ? 'text-blue-200 drop-shadow-md'
                            : 'text-blue-600'
                        }`}
                      >
                        ✨ {formData.highlight}
                      </p>
                    )}

                    {/* CTA */}
                    <div
                      className={`mt-4 flex items-center gap-2 text-sm font-medium transition-colors ${
                        formData.backgroundImage
                          ? 'text-white drop-shadow-md group-hover:text-blue-200'
                          : 'text-blue-600 group-hover:text-blue-700'
                      }`}
                    >
                      了解更多
                      <span className='text-xs'>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-600'>💡 这是用户在服务列表页面看到的效果</p>
          </div>
        </CardContent>
      </Card>

      {/* 可选配置 - 折叠区域 */}
      <Card className='border-gray-200'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-base'>
            📋 可选配置
            <Badge variant='outline' className='text-xs'>
              详情页使用
            </Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>这些信息用于服务详情页面，可以稍后配置</p>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* 服务特性 - 增强版 */}
          <div>
            <Label className='flex items-center gap-2 text-base font-medium text-gray-700'>
              🏷️ 服务特性
              <Badge variant='outline' className='text-xs'>
                最多6个
              </Badge>
            </Label>

            {/* 预设特性模板 */}
            {!readOnly && (
              <div className='mt-3 rounded-lg border border-purple-200 bg-purple-50 p-4'>
                <h4 className='mb-3 font-medium text-purple-800'>🚀 常用特性模板</h4>
                <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                  {[
                    '数字化咨询规划',
                    '系统集成服务',
                    '数据治理平台',
                    '流程数字化',
                    '云平台迁移',
                    '数字化培训',
                    '智能监控',
                    '故障预测',
                    '自动化运维',
                    '性能优化',
                    '安全防护',
                    '合规审计',
                  ].map(template => (
                    <Button
                      key={template}
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        if (!formData.features?.includes(template)) {
                          const newFeatures = [...(formData.features || []), template]
                          handleInputChange('features', newFeatures)
                        }
                      }}
                      disabled={formData.features?.includes(template)}
                      className='h-8 justify-start text-xs'
                    >
                      {formData.features?.includes(template) ? '✅' : '+'} {template}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className='mt-3 flex flex-wrap gap-2'>
              {Array.isArray(formData.features) && formData.features.length > 0 ? (
                formData.features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-1'>
                    <Badge variant='secondary' className='text-xs'>
                      {feature}
                    </Badge>
                    {!readOnly && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => removeFeature(index)}
                        className='h-5 w-5 p-0 text-red-500 hover:text-red-700'
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <span className='text-xs text-gray-500'>暂无特性，可以从上方模板快速添加</span>
              )}
            </div>

            {!readOnly && (
              <div className='mt-3 flex gap-2'>
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  placeholder='自定义服务特性'
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className='text-sm'
                />
                <Button type='button' onClick={addFeature} variant='outline' size='sm'>
                  <Plus className='h-4 w-4' />
                  添加
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 服务指标 - 增强版 */}
      <Card className='border-blue-200'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            📊 服务指标
            <Badge className='bg-blue-100 text-xs text-blue-800'>前端显示</Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>
            这些指标将显示在服务卡片和详情页面中，用于展示服务价值
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {!readOnly && (
            <div className='space-y-6'>
              {/* 快速指标模板 */}
              <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                <h4 className='mb-3 font-medium text-green-800'>🚀 快速添加常用指标</h4>
                <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
                  {[
                    { label: '效率提升', value: '80%' },
                    { label: '成本降低', value: '60%' },
                    { label: '故障减少', value: '90%' },
                    { label: '响应时间', value: '50%' },
                    { label: '客户满意度', value: '95%' },
                    { label: '项目成功率', value: '98%' },
                    { label: 'ROI回报', value: '300%' },
                    { label: '部署时间', value: '30天' },
                  ].map(template => (
                    <Button
                      key={template.label}
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        const currentMetrics = parseMetricsJson(metricsJson)
                        const newMetrics = { ...currentMetrics, [template.label]: template.value }
                        setMetricsJson(JSON.stringify(newMetrics, null, 2))
                      }}
                      className='h-8 justify-start text-xs'
                    >
                      {template.label}: {template.value}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor='metricsJson' className='flex items-center gap-2'>
                  关键指标配置
                  <Badge variant='outline' className='text-xs'>
                    JSON格式
                  </Badge>
                </Label>
                <Textarea
                  id='metricsJson'
                  value={metricsJson}
                  onChange={e => handleMetricsJsonChange(e.target.value)}
                  placeholder='{"效率提升": "80%", "成本降低": "60%", "项目数量": "200+"}'
                  rows={6}
                  className='font-mono text-sm'
                />
                <div className='mt-2 space-y-1 text-sm text-gray-500'>
                  <p className='font-medium'>📝 格式说明：</p>
                  <ul className='ml-4 space-y-0.5'>
                    <li>• 使用JSON对象格式：{`{"指标名": "数值"}`}</li>
                    <li>• 指标名建议4-6个字：如"效率提升"、"成本降低"</li>
                    <li>• 数值可包含百分号、加号等：如"80%"、"200+"</li>
                    <li>• 最多显示4个指标，建议选择最有说服力的数据</li>
                  </ul>
                </div>
              </div>

              {/* 指标预览 */}
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <MetricsPreview metricsJson={metricsJson} />
                <MetricsSuggestions />
              </div>
            </div>
          )}

          {readOnly && Array.isArray(formData.metrics) && formData.metrics.length > 0 && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {formData.metrics.map((metric, index) => (
                <div key={index} className='rounded-lg border p-4'>
                  <h4 className='mb-2 font-medium'>{metric.label}</h4>
                  <p className='text-2xl font-bold text-blue-600'>
                    {metric.value}
                    {metric.unit && <span className='ml-1 text-sm'>{metric.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 服务流程 */}
      <Card>
        <CardHeader>
          <CardTitle>服务流程</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-4'>
            {Array.isArray(formData.process) &&
              formData.process.map((step, index) => (
                <div key={index} className='flex items-start gap-4 rounded-lg border p-4'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100'>
                    <span className='text-sm font-medium text-blue-600'>{step.step}</span>
                  </div>
                  <div className='flex-1'>
                    <h4 className='mb-1 font-medium'>{step.title}</h4>
                    <p className='text-sm text-gray-600'>{step.description}</p>
                    {step.icon && <p className='mt-1 text-xs text-gray-500'>图标: {step.icon}</p>}
                  </div>
                  {!readOnly && (
                    <button
                      type='button'
                      onClick={() => removeProcessStep(index)}
                      className='text-red-600 hover:text-red-800'
                      aria-label={`删除流程步骤: ${step.title}`}
                      title={`删除流程步骤: ${step.title}`}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              ))}
          </div>

          {!readOnly && (
            <div className='space-y-2'>
              <Input
                value={newProcessStep.title}
                onChange={e => setNewProcessStep(prev => ({ ...prev, title: e.target.value }))}
                placeholder='流程步骤标题'
              />
              <Textarea
                value={newProcessStep.description}
                onChange={e =>
                  setNewProcessStep(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder='流程步骤描述'
                rows={2}
              />
              <div className='flex gap-2'>
                <Input
                  value={newProcessStep.icon}
                  onChange={e => setNewProcessStep(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder='图标名称（可选）'
                />
                <Button type='button' onClick={addProcessStep} variant='outline'>
                  <Plus className='h-4 w-4' />
                  添加步骤
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 视觉配置 */}
      <Card>
        <CardHeader>
          <CardTitle>视觉配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='primaryColor'>主色调</Label>
              <div className='flex gap-2'>
                <Input
                  id='primaryColor'
                  type='color'
                  value={formData.visualElements?.primaryColor || '#3b82f6'}
                  onChange={e =>
                    handleNestedInputChange('visualElements', 'primaryColor', e.target.value)
                  }
                  disabled={readOnly}
                  className='h-10 w-16'
                />
                <Input
                  value={formData.visualElements?.primaryColor || '#3b82f6'}
                  onChange={e =>
                    handleNestedInputChange('visualElements', 'primaryColor', e.target.value)
                  }
                  disabled={readOnly}
                  placeholder='#3b82f6'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='secondaryColor'>辅助色调</Label>
              <div className='flex gap-2'>
                <Input
                  id='secondaryColor'
                  type='color'
                  value={formData.visualElements?.secondaryColor || '#1e40af'}
                  onChange={e =>
                    handleNestedInputChange('visualElements', 'secondaryColor', e.target.value)
                  }
                  disabled={readOnly}
                  className='h-10 w-16'
                />
                <Input
                  value={formData.visualElements?.secondaryColor || '#1e40af'}
                  onChange={e =>
                    handleNestedInputChange('visualElements', 'secondaryColor', e.target.value)
                  }
                  disabled={readOnly}
                  placeholder='#1e40af'
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor='icon'>服务图标</Label>
            <Input
              id='icon'
              value={formData.visualElements?.icon || ''}
              onChange={e => handleNestedInputChange('visualElements', 'icon', e.target.value)}
              placeholder='图标名称或URL'
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* CTA配置 */}
      <Card>
        <CardHeader>
          <CardTitle>行动按钮配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <Label htmlFor='ctaText'>按钮文字</Label>
              <Input
                id='ctaText'
                value={formData.ctaConfig?.text || ''}
                onChange={e => handleNestedInputChange('ctaConfig', 'text', e.target.value)}
                placeholder='了解更多'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='ctaLink'>按钮链接</Label>
              <Input
                id='ctaLink'
                value={formData.ctaConfig?.link || ''}
                onChange={e => handleNestedInputChange('ctaConfig', 'link', e.target.value)}
                placeholder='#'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='ctaStyle'>按钮样式</Label>
              <select
                id='ctaStyle'
                value={formData.ctaConfig?.style || 'primary'}
                onChange={e => handleNestedInputChange('ctaConfig', 'style', e.target.value)}
                disabled={readOnly}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                aria-label='按钮样式'
              >
                <option value='primary'>主要按钮</option>
                <option value='secondary'>次要按钮</option>
                <option value='outline'>边框按钮</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO设置 */}
      <Card>
        <CardHeader>
          <CardTitle>SEO设置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='metaTitle'>页面标题</Label>
            <Input
              id='metaTitle'
              value={formData.seo?.metaTitle || ''}
              onChange={e => handleNestedInputChange('seo', 'metaTitle', e.target.value)}
              placeholder='SEO页面标题（建议60字符以内）'
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor='metaDescription'>页面描述</Label>
            <Textarea
              id='metaDescription'
              value={formData.seo?.metaDescription || ''}
              onChange={e => handleNestedInputChange('seo', 'metaDescription', e.target.value)}
              placeholder='SEO页面描述（建议160字符以内）'
              rows={3}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor='keywords'>关键词</Label>
            <Input
              id='keywords'
              value={formData.seo?.keywords?.join(', ') || ''}
              onChange={e =>
                handleNestedInputChange(
                  'seo',
                  'keywords',
                  e.target.value
                    .split(',')
                    .map(k => k.trim())
                    .filter(k => k)
                )
              }
              placeholder='关键词，用逗号分隔'
              disabled={readOnly}
            />
            <p className='mt-1 text-sm text-gray-600'>多个关键词请用逗号分隔</p>
          </div>
        </CardContent>
      </Card>

      {/* Hero区域配置 */}
      <Card>
        <CardHeader>
          <CardTitle>Hero区域配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='heroTitle'>Hero标题</Label>
              <Input
                id='heroTitle'
                value={formData.hero?.title || ''}
                onChange={e => handleNestedInputChange('hero', 'title', e.target.value)}
                placeholder='Hero区域主标题'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='heroSubtitle'>Hero副标题</Label>
              <Input
                id='heroSubtitle'
                value={formData.hero?.subtitle || ''}
                onChange={e => handleNestedInputChange('hero', 'subtitle', e.target.value)}
                placeholder='Hero区域副标题'
                disabled={readOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor='heroDescription'>Hero描述</Label>
            <Textarea
              id='heroDescription'
              value={formData.hero?.description || ''}
              onChange={e => handleNestedInputChange('hero', 'description', e.target.value)}
              placeholder='Hero区域详细描述'
              rows={3}
              disabled={readOnly}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <Label htmlFor='instructorName'>专家姓名</Label>
              <Input
                id='instructorName'
                value={formData.hero?.instructor?.name || ''}
                onChange={e => {
                  const instructor = { ...(formData.hero?.instructor || {}), name: e.target.value }
                  handleNestedInputChange('hero', 'instructor', instructor)
                }}
                placeholder='专家姓名'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='instructorTitle'>专家职位</Label>
              <Input
                id='instructorTitle'
                value={formData.hero?.instructor?.title || ''}
                onChange={e => {
                  const instructor = { ...(formData.hero?.instructor || {}), title: e.target.value }
                  handleNestedInputChange('hero', 'instructor', instructor)
                }}
                placeholder='专家职位'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='instructorCompany'>所属公司</Label>
              <Input
                id='instructorCompany'
                value={formData.hero?.instructor?.company || ''}
                onChange={e => {
                  const instructor = {
                    ...(formData.hero?.instructor || {}),
                    company: e.target.value,
                  }
                  handleNestedInputChange('hero', 'instructor', instructor)
                }}
                placeholder='所属公司'
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学习内容配置 */}
      <Card>
        <CardHeader>
          <CardTitle>学习内容配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='learningTitle'>学习内容标题</Label>
            <Input
              id='learningTitle'
              value={formData.learning?.title || ''}
              onChange={e => handleNestedInputChange('learning', 'title', e.target.value)}
              placeholder='学习内容标题'
              disabled={readOnly}
            />
          </div>

          <div>
            <Label>学习目标</Label>
            <div className='space-y-2'>
              {Array.isArray(formData.learning?.objectives) &&
                formData.learning.objectives.map((objective, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <Input
                      value={objective}
                      onChange={e => {
                        const objectives = [...(formData.learning?.objectives || [])]
                        objectives[index] = e.target.value
                        handleNestedInputChange('learning', 'objectives', objectives)
                      }}
                      placeholder={`学习目标 ${index + 1}`}
                      disabled={readOnly}
                    />
                    {!readOnly && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const objectives =
                            formData.learning?.objectives?.filter((_, i) => i !== index) || []
                          handleNestedInputChange('learning', 'objectives', objectives)
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}

              {!readOnly && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    const objectives = [...(formData.learning?.objectives || []), '']
                    handleNestedInputChange('learning', 'objectives', objectives)
                  }}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  添加学习目标
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 服务信息配置 */}
      <Card>
        <CardHeader>
          <CardTitle>服务信息配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <Label htmlFor='courseLevel'>服务级别</Label>
              <select
                id='courseLevel'
                value={formData.courseInfo?.level || 'intermediate'}
                onChange={e => handleNestedInputChange('courseInfo', 'level', e.target.value)}
                disabled={readOnly}
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                aria-label='服务级别'
              >
                <option value='beginner'>初级服务</option>
                <option value='intermediate'>中级服务</option>
                <option value='advanced'>高级服务</option>
              </select>
            </div>
            <div>
              <Label htmlFor='courseDuration'>服务周期</Label>
              <Input
                id='courseDuration'
                value={formData.courseInfo?.duration || ''}
                onChange={e => handleNestedInputChange('courseInfo', 'duration', e.target.value)}
                placeholder='如：3-6个月'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='courseLessons'>服务模块数</Label>
              <Input
                id='courseLessons'
                type='number'
                value={formData.courseInfo?.lessons || 0}
                onChange={e =>
                  handleNestedInputChange('courseInfo', 'lessons', parseInt(e.target.value) || 0)
                }
                placeholder='服务模块数量'
                disabled={readOnly}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='courseInstructor'>服务专家</Label>
              <Input
                id='courseInstructor'
                value={formData.courseInfo?.instructor || ''}
                onChange={e => handleNestedInputChange('courseInfo', 'instructor', e.target.value)}
                placeholder='服务专家姓名'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='courseCompany'>服务公司</Label>
              <Input
                id='courseCompany'
                value={formData.courseInfo?.company || ''}
                onChange={e => handleNestedInputChange('courseInfo', 'company', e.target.value)}
                placeholder='服务提供公司'
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 关于服务配置 */}
      <Card>
        <CardHeader>
          <CardTitle>关于服务配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='aboutTitle'>关于服务标题</Label>
            <Input
              id='aboutTitle'
              value={formData.about?.title || ''}
              onChange={e => handleNestedInputChange('about', 'title', e.target.value)}
              placeholder='关于服务标题'
              disabled={readOnly}
            />
          </div>

          {/* 注释：subtitle字段已从about类型中移除 */}
          {/* <div>
            <Label htmlFor='aboutSubtitle'>关于服务副标题</Label>
            <Input
              id='aboutSubtitle'
              value={formData.about?.subtitle || ''}
              onChange={e => handleNestedInputChange('about', 'subtitle', e.target.value)}
              placeholder='关于服务副标题（可选）'
              disabled={readOnly}
            />
          </div> */}

          <div>
            <Label htmlFor='aboutDescription'>关于服务描述</Label>
            <Textarea
              id='aboutDescription'
              value={formData.about?.description || ''}
              onChange={e => handleNestedInputChange('about', 'description', e.target.value)}
              placeholder='关于服务的详细描述'
              rows={3}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label>服务详情</Label>
            <div className='space-y-2'>
              {Array.isArray(formData.about?.details) &&
                formData.about.details.map((detail, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <Input
                      value={detail}
                      onChange={e => {
                        const details = [...(formData.about?.details || [])]
                        details[index] = e.target.value
                        handleNestedInputChange('about', 'details', details)
                      }}
                      placeholder={`服务详情 ${index + 1}`}
                      disabled={readOnly}
                    />
                    {!readOnly && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const details =
                            formData.about?.details?.filter((_, i) => i !== index) || []
                          handleNestedInputChange('about', 'details', details)
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}

              {!readOnly && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    const details = [...(formData.about?.details || []), '']
                    handleNestedInputChange('about', 'details', details)
                  }}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  添加服务详情
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA按钮配置 */}
      <Card>
        <CardHeader>
          <CardTitle>CTA按钮配置</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='ctaButtonText'>按钮文字</Label>
              <Input
                id='ctaButtonText'
                value={formData.cta?.buttonText || ''}
                onChange={e => handleNestedInputChange('cta', 'buttonText', e.target.value)}
                placeholder='立即咨询'
                disabled={readOnly}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='ctaIsEnrollment'
                checked={formData.cta?.isEnrollment || false}
                onChange={e => handleNestedInputChange('cta', 'isEnrollment', e.target.checked)}
                disabled={readOnly}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                aria-label='是否为注册按钮'
              />
              <Label htmlFor='ctaIsEnrollment'>是否为注册按钮</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作工具栏 - 增强版 */}
      <Card className='sticky bottom-4 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'>
        <CardContent className='p-4'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='flex items-center gap-4'>
              <Button type='button' variant='outline' onClick={onCancel}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                {readOnly ? '关闭' : '返回列表'}
              </Button>

              {/* 预览按钮 */}
              {formData.slug && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => window.open(`/services/${formData.slug}`, '_blank')}
                  className='border-blue-300 text-blue-600 hover:bg-blue-50'
                >
                  👁️ 预览页面
                </Button>
              )}
            </div>

            <div className='flex items-center gap-3'>
              {/* 状态指示器 */}
              <div className='flex items-center gap-2'>
                <div
                  className={`h-2 w-2 rounded-full ${
                    formData.status === 'PUBLISHED'
                      ? 'bg-green-500'
                      : formData.status === 'DRAFT'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                  }`}
                ></div>
                <span className='text-sm text-gray-600'>
                  {formData.status === 'PUBLISHED'
                    ? '已发布'
                    : formData.status === 'DRAFT'
                      ? '草稿'
                      : '已归档'}
                </span>
              </div>

              {/* 保存按钮 */}
              {!readOnly && (
                <div className='flex gap-2'>
                  {/* 保存为草稿 */}
                  {formData.status !== 'DRAFT' && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        handleInputChange('status', 'DRAFT')
                        // 触发表单提交
                        setTimeout(() => {
                          const form = document.querySelector('form') as HTMLFormElement
                          if (form) form.requestSubmit()
                        }, 100)
                      }}
                      disabled={loading}
                      className='border-yellow-300 text-yellow-600 hover:bg-yellow-50'
                    >
                      📝 保存草稿
                    </Button>
                  )}

                  {/* 主保存按钮 */}
                  <Button
                    type='submit'
                    disabled={loading}
                    className='min-w-[140px] bg-blue-600 hover:bg-blue-700'
                  >
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
                </div>
              )}
            </div>
          </div>

          {/* 快速操作提示 */}
          <div className='mt-3 border-t border-gray-200 pt-3 dark:border-gray-700'>
            <div className='flex flex-wrap gap-4 text-xs text-gray-500'>
              <span>💡 快捷键：Ctrl+S 保存</span>
              <span>🔗 URL预览：/services/{formData.slug || 'service-slug'}</span>
              {formData.backgroundImage && <span>🖼️ 已设置背景图片</span>}
              {Array.isArray(formData.features) && formData.features.length > 0 && (
                <span>🏷️ {formData.features.length} 个特性</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
