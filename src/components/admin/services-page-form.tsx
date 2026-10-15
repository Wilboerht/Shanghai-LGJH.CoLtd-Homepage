'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X, Save, ArrowLeft } from 'lucide-react'
import { SimpleImageUpload } from '@/components/ui/simple-image-upload'

// 专门为 /services 页面优化的服务数据结构
interface ServicesPageService {
  id?: string
  title: string
  subtitle?: string
  description?: string
  serviceType: 'core' | 'specialized'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

  // /services 页面核心字段
  icon: string // 图标名称
  highlight: string // 核心亮点
  features: string[] // 功能特性
  backgroundImage?: string // 背景图片
  displayOrder: number // 显示顺序

  // 其他必要字段
  category: string
  level?: string
  duration?: string
  slug: string
}

interface ServicesPageFormProps {
  service?: ServicesPageService
  onSuccess?: () => void
  onCancel?: () => void
  readOnly?: boolean
}

export function ServicesPageForm({
  service,
  onSuccess,
  onCancel,
  readOnly = false,
}: ServicesPageFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ServicesPageService>(() => ({
    title: service?.title || '',
    subtitle: service?.subtitle || '',
    description: service?.description || '',
    serviceType: service?.serviceType || 'core',
    status: service?.status || 'DRAFT',
    icon: service?.icon || 'Settings',
    highlight: service?.highlight || '',
    features: service?.features || [],
    backgroundImage: service?.backgroundImage || '',
    displayOrder: service?.displayOrder || 1,
    category: service?.category || '专业服务',
    level: service?.level || 'intermediate',
    duration: service?.duration || '',
    slug: service?.slug || 'new-service',
  }))

  const [newFeature, setNewFeature] = useState('')
  const [slugError, setSlugError] = useState('')
  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)

  // 生成slug - 只生成英文slug，避免中文导致的URL问题
  const generateSlug = (title: string) => {
    if (!title || title.trim() === '') {
      return 'new-service'
    }

    // 中文到英文的映射表
    const chineseToEnglish: { [key: string]: string } = {
      数字化: 'digital',
      转型: 'transformation',
      智能: 'intelligent',
      制造: 'manufacturing',
      工业: 'industrial',
      人工智能: 'ai',
      服务: 'service',
      系统: 'system',
      管理: 'management',
      咨询: 'consulting',
      解决方案: 'solution',
      平台: 'platform',
      技术: 'technology',
      开发: 'development',
      设计: 'design',
      安全: 'security',
      网络: 'network',
      云: 'cloud',
      大数据: 'big-data',
      分析: 'analytics',
      优化: 'optimization',
      自动化: 'automation',
      集成: 'integration',
      企业: 'enterprise',
      商业: 'business',
      专业: 'professional',
      高级: 'advanced',
      基础: 'basic',
      核心: 'core',
      评估: 'assessment',
      培训: 'training',
      支持: 'support',
      维护: 'maintenance',
    }

    let slug = title.trim().toLowerCase()

    // 替换常见中文词汇为英文，并在词汇间添加分隔符
    Object.entries(chineseToEnglish).forEach(([chinese, english]) => {
      slug = slug.replace(new RegExp(chinese, 'g'), ` ${english} `)
    })

    // 处理剩余的中文字符和格式化
    slug = slug
      .replace(/[\u4e00-\u9fff]/g, ' ') // 将中文字符替换为空格
      .replace(/[^a-z0-9\s]/g, ' ') // 将非字母数字字符替换为空格
      .replace(/\s+/g, '-') // 多个空格转为单个连字符
      .replace(/--+/g, '-') // 多个连字符合并为一个
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符

    return slug || 'new-service'
  }

  // 验证slug格式 - 只允许英文字符
  const validateSlug = (slug: string) => {
    if (!slug || slug.trim() === '') {
      return '服务标识不能为空'
    }

    // 检查是否包含中文字符
    if (/[\u4e00-\u9fff]/.test(slug)) {
      return '服务标识不能包含中文字符，请使用英文字母、数字和连字符'
    }

    // 检查是否只包含有效字符（英文字母、数字、连字符）
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return '服务标识只能包含小写英文字母、数字和连字符'
    }

    // 检查是否以连字符开头或结尾
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return '服务标识不能以连字符开头或结尾'
    }

    // 检查是否包含连续的连字符
    if (slug.includes('--')) {
      return '服务标识不能包含连续的连字符'
    }

    return ''
  }

  // 检查slug可用性
  const checkSlugAvailability = async (slug: string) => {
    if (!slug || validateSlug(slug)) {
      setSlugAvailable(null)
      return
    }

    setSlugChecking(true)
    setSlugAvailable(null)

    try {
      const response = await fetch(
        `/api/admin/content/services/check-slug?slug=${encodeURIComponent(slug)}&excludeId=${service?.id || ''}`
      )
      const data = await response.json()

      if (data.available) {
        setSlugAvailable(true)
        setSlugError('')
      } else {
        setSlugAvailable(false)
        setSlugError('此服务标识已被使用，请选择其他标识')
      }
    } catch (error) {
      console.error('检查slug可用性失败:', error)
      setSlugAvailable(null)
    } finally {
      setSlugChecking(false)
    }
  }

  // 处理slug变化
  const handleSlugChange = (slug: string) => {
    setFormData(prev => ({ ...prev, slug }))
    const error = validateSlug(slug)
    setSlugError(error)
  }

  // 使用useEffect来处理slug可用性检查的延迟
  useEffect(() => {
    if (!formData.slug || slugError) return

    const timeoutId = setTimeout(() => {
      checkSlugAvailability(formData.slug)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.slug, slugError])

  // 处理标题变化
  const handleTitleChange = (title: string) => {
    setFormData(prev => {
      // 如果是新服务（没有ID）或者当前slug是自动生成的，则自动更新slug
      const shouldUpdateSlug =
        !service?.id || prev.slug === generateSlug(prev.title) || prev.slug === 'new-service'

      return {
        ...prev,
        title,
        slug: shouldUpdateSlug ? generateSlug(title) : prev.slug,
      }
    })
  }

  // 添加特性
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature('')
    }
  }

  // 删除特性
  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return

    // 验证slug
    const currentSlugError = validateSlug(formData.slug)
    if (currentSlugError) {
      setSlugError(currentSlugError)
      alert(`服务标识格式错误: ${currentSlugError}`)
      return
    }

    setLoading(true)
    try {
      const url = service
        ? `/api/admin/content/services/${service.id}`
        : '/api/admin/content/services'

      const method = service ? 'PUT' : 'POST'

      // 提交前验证和修复数据
      const submitData = { ...formData }
      if (!submitData.slug || submitData.slug.trim() === '') {
        submitData.slug = generateSlug(submitData.title) || 'new-service'
      }

      console.log('提交服务数据:', submitData)

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
        console.error('服务创建失败:', error)
        const errorMessage = error.message || error.error || '操作失败'
        alert(`保存失败: ${errorMessage}`)
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
      {/* /services 页面核心信息 */}
      <Card className='border-blue-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            🌐 服务页面信息
            <Badge className='bg-blue-100 text-blue-800'>核心字段</Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>这些信息将直接显示在 /services 页面中</p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='title'>服务标题 *</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder='例如：数字化转型'
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <Label htmlFor='serviceType'>服务类型 *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, serviceType: value as 'core' | 'specialized' }))
                }
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='core'>核心服务</SelectItem>
                  <SelectItem value='specialized'>专业服务</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor='slug'>
              服务标识 (URL Slug) *
              <span className='ml-2 text-xs font-normal text-gray-500'>
                仅限英文字母、数字和连字符
              </span>
            </Label>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Input
                  id='slug'
                  value={formData.slug}
                  onChange={e => handleSlugChange(e.target.value)}
                  placeholder='例如：digital-transformation 或 ai-service'
                  disabled={readOnly}
                  required
                  className={
                    slugError ? 'border-red-500' : slugAvailable === true ? 'border-green-500' : ''
                  }
                />
                <div className='absolute right-3 top-1/2 -translate-y-1/2 transform'>
                  {slugChecking && (
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
                  )}
                  {!slugChecking && slugAvailable === true && (
                    <div className='text-green-500'>✓</div>
                  )}
                  {!slugChecking && slugAvailable === false && (
                    <div className='text-red-500'>✗</div>
                  )}
                </div>
              </div>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  const newSlug = generateSlug(formData.title)
                  setFormData(prev => ({ ...prev, slug: newSlug }))
                  setSlugError(validateSlug(newSlug))
                  if (!validateSlug(newSlug)) {
                    checkSlugAvailability(newSlug)
                  }
                }}
                disabled={readOnly || !formData.title}
                size='sm'
              >
                自动生成
              </Button>
            </div>
            {slugError && <p className='mt-1 text-xs text-red-600'>{slugError}</p>}
            {!slugError && slugAvailable === true && (
              <p className='mt-1 text-xs text-green-600'>✓ 服务标识可用</p>
            )}
            <p className='mt-1 text-xs text-gray-500'>
              用于生成服务页面URL: /services/{formData.slug}
              {formData.slug && !slugError && (
                <span className='block text-blue-600'>预览: /services/{formData.slug}</span>
              )}
            </p>
          </div>

          <div>
            <Label htmlFor='description'>服务描述 *</Label>
            <Textarea
              id='description'
              value={formData.description || ''}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder='简洁描述服务的核心价值和功能...'
              disabled={readOnly}
              rows={3}
              required
            />
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='icon'>服务图标 *</Label>
              <Select
                value={formData.icon}
                onValueChange={value => setFormData(prev => ({ ...prev, icon: value }))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Cpu'>💻 Cpu (数字化)</SelectItem>
                  <SelectItem value='Settings'>⚙️ Settings (系统)</SelectItem>
                  <SelectItem value='Wrench'>🔧 Wrench (工程)</SelectItem>
                  <SelectItem value='Flame'>🔥 Flame (消防)</SelectItem>
                  <SelectItem value='Shield'>🛡️ Shield (安全)</SelectItem>
                  <SelectItem value='CheckCircle'>✅ CheckCircle (验收)</SelectItem>
                  <SelectItem value='Star'>⭐ Star (优质)</SelectItem>
                  <SelectItem value='Grid3X3'>📋 Grid3X3 (其他)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='highlight'>核心亮点 *</Label>
              <Input
                id='highlight'
                value={formData.highlight}
                onChange={e => setFormData(prev => ({ ...prev, highlight: e.target.value }))}
                placeholder='例如：平均提升40%运营效率'
                disabled={readOnly}
                required
              />
            </div>
          </div>

          {/* 功能特性 */}
          <div>
            <Label>功能特性 *</Label>
            <div className='space-y-2'>
              <div className='flex gap-2'>
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  placeholder='添加功能特性，例如：数字化咨询'
                  disabled={readOnly}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button
                  type='button'
                  onClick={addFeature}
                  disabled={readOnly || !newFeature.trim()}
                  size='sm'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant='secondary' className='flex items-center gap-1'>
                    {feature}
                    {!readOnly && (
                      <button
                        type='button'
                        onClick={() => removeFeature(index)}
                        className='ml-1 hover:text-red-600'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              <p className='text-xs text-gray-500'>至少添加3-4个功能特性</p>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='backgroundImage'>背景图片</Label>
              <SimpleImageUpload
                value={formData.backgroundImage || ''}
                onChange={url => setFormData(prev => ({ ...prev, backgroundImage: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, backgroundImage: '' }))}
                placeholder='选择服务背景图片或输入图片URL'
                maxSize={10}
                className={readOnly ? 'pointer-events-none opacity-50' : ''}
              />
              <p className='mt-1 text-xs text-gray-500'>推荐尺寸：1200x600px，用于服务卡片背景</p>
            </div>
            <div>
              <Label htmlFor='displayOrder'>显示顺序</Label>
              <Input
                id='displayOrder'
                type='number'
                value={formData.displayOrder}
                onChange={e =>
                  setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))
                }
                placeholder='1'
                disabled={readOnly}
                min='1'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 其他配置 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            ⚙️ 其他配置
            <Badge variant='outline'>可选</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='subtitle'>服务副标题</Label>
              <Input
                id='subtitle'
                value={formData.subtitle || ''}
                onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder='例如：企业数字化转型专业服务'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='category'>服务分类</Label>
              <Select
                value={formData.category}
                onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='数字化服务'>数字化服务</SelectItem>
                  <SelectItem value='智能服务'>智能服务</SelectItem>
                  <SelectItem value='工程服务'>工程服务</SelectItem>
                  <SelectItem value='安全工程'>安全工程</SelectItem>
                  <SelectItem value='评估服务'>评估服务</SelectItem>
                  <SelectItem value='专业服务'>专业服务</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <Label htmlFor='level'>服务级别</Label>
              <Select
                value={formData.level || 'intermediate'}
                onValueChange={value => setFormData(prev => ({ ...prev, level: value }))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='beginner'>初级</SelectItem>
                  <SelectItem value='intermediate'>中级</SelectItem>
                  <SelectItem value='advanced'>高级</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='duration'>服务周期</Label>
              <Input
                id='duration'
                value={formData.duration || ''}
                onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder='例如：3-6个月'
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor='status'>发布状态</Label>
              <Select
                value={formData.status}
                onValueChange={value => setFormData(prev => ({ ...prev, status: value as any }))}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='DRAFT'>草稿</SelectItem>
                  <SelectItem value='PUBLISHED'>已发布</SelectItem>
                  <SelectItem value='ARCHIVED'>已归档</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className='flex justify-between'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={loading}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          返回
        </Button>
        <Button type='submit' disabled={loading || readOnly}>
          <Save className='mr-2 h-4 w-4' />
          {loading ? '保存中...' : service ? '更新服务' : '创建服务'}
        </Button>
      </div>
    </form>
  )
}
