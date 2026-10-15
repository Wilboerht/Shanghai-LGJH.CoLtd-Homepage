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
import { Plus, X, Save, ArrowLeft, Upload } from 'lucide-react'

interface UnifiedService {
  id?: string
  title: string
  subtitle?: string
  description?: string
  category: string
  serviceType?: 'core' | 'specialized'
  level?: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

  // /services 页面关键字段
  icon?: string // 图标名称 (如 'Cpu', 'Settings' 等)
  backgroundImage?: string // 背景图片URL
  highlight?: string // 核心亮点文字
  features?: string[] // 功能特性列表
  displayOrder?: number // 显示顺序

  // Hero区域
  hero?: {
    title: string
    subtitle: string
    description: string
    instructor?: {
      name: string
      title: string
      company: string
    }
  }

  // 服务内容
  learning?: {
    title: string
    objectives: string[]
  }

  // 关于服务
  about?: {
    title: string
    subtitle?: string
    description: string
    details: string[]
  }

  // CTA配置
  cta?: {
    buttonText: string
    isEnrollment: boolean
  }

  slug: string
}

interface UnifiedServiceFormProps {
  service?: UnifiedService
  onSuccess?: () => void
  onCancel?: () => void
  readOnly?: boolean
}

export function UnifiedServiceForm({
  service,
  onSuccess,
  onCancel,
  readOnly = false,
}: UnifiedServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UnifiedService>(() => {
    // 如果有现有服务，使用其状态；否则默认为草稿
    const defaultStatus = service?.status || 'DRAFT'

    return {
      title: service?.title || '',
      subtitle: service?.subtitle || '',
      description: service?.description || '',
      category: service?.category || '专业服务',
      serviceType: service?.serviceType || 'core',
      level: service?.level || 'intermediate',
      duration: service?.duration || '',
      status: defaultStatus,

      // /services 页面关键字段
      icon: service?.icon || 'Settings',
      backgroundImage: service?.backgroundImage || '',
      highlight: service?.highlight || '',
      features: service?.features || [],
      displayOrder: service?.displayOrder || 1,
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
        subtitle: '',
        description: '',
        details: [],
      },
      cta: service?.cta || {
        buttonText: '立即咨询',
        isEnrollment: false,
      },
      slug: service?.slug || 'new-service',
    }
  })

  const [newFeature, setNewFeature] = useState('')
  const [newObjective, setNewObjective] = useState('')
  const [newDetail, setNewDetail] = useState('')

  useEffect(() => {
    if (service) {
      setFormData(prev => ({
        ...service,
        features: service.features || [],
        hero: service.hero || {
          title: service.title || '',
          subtitle: service.subtitle || '',
          description: service.description || '',
          instructor: {
            name: '专业团队',
            title: '服务专家',
            company: '临港景鸿',
          },
        },
        learning: service.learning || {
          title: '服务内容',
          objectives: [],
        },
        about: service.about || {
          title: '关于此服务',
          subtitle: '',
          description: '',
          details: [],
        },
        cta: service.cta || {
          buttonText: '立即咨询',
          isEnrollment: false,
        },
      }))
    }
  }, [service])

  // 生成slug
  const generateSlug = (title: string) => {
    if (!title || title.trim() === '') {
      console.log('生成slug: 标题为空，返回默认值')
      return 'new-service'
    }

    // 处理中文字符，将中文转换为拼音或保留中文
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-') // 将空格替换为连字符
      .replace(/[^\w\u4e00-\u9fff-]/g, '') // 保留字母、数字、中文字符和连字符
      .trim()

    console.log('生成slug:', title, '->', slug)
    return slug || 'new-service' // 如果生成的slug为空，返回默认值
  }

  // 处理标题变化
  const handleTitleChange = (title: string) => {
    const newSlug = generateSlug(title)
    console.log('标题变化:', title, '新slug:', newSlug)
    setFormData(prev => ({
      ...prev,
      title,
      slug: newSlug,
      hero: {
        ...prev.hero!,
        title: title,
      },
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

  // 添加服务目标
  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        learning: {
          ...prev.learning!,
          objectives: [...prev.learning!.objectives, newObjective.trim()],
        },
      }))
      setNewObjective('')
    }
  }

  // 删除服务目标
  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning: {
        ...prev.learning!,
        objectives: prev.learning!.objectives.filter((_, i) => i !== index),
      },
    }))
  }

  // 添加详细信息
  const addDetail = () => {
    if (newDetail.trim()) {
      setFormData(prev => ({
        ...prev,
        about: {
          ...prev.about!,
          details: [...prev.about!.details, newDetail.trim()],
        },
      }))
      setNewDetail('')
    }
  }

  // 删除详细信息
  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      about: {
        ...prev.about!,
        details: prev.about!.details.filter((_, i) => i !== index),
      },
    }))
  }

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

      // 提交前验证和修复数据
      const submitData = { ...formData }
      if (!submitData.slug || submitData.slug.trim() === '') {
        console.log('提交前修复空slug')
        submitData.slug = generateSlug(submitData.title) || 'new-service'
      }

      console.log('提交服务数据:', submitData)
      console.log('slug字段值:', submitData.slug)
      console.log('slug字段类型:', typeof submitData.slug)
      console.log('slug字段长度:', submitData.slug?.length)
      console.log('请求URL:', url)
      console.log('请求方法:', method)

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
      {/* /services 页面显示信息 - 最重要的部分 */}
      <Card className='border-blue-200'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            🌐 服务页面显示信息
            <Badge className='bg-blue-100 text-blue-800'>核心字段</Badge>
          </CardTitle>
          <p className='text-sm text-gray-600'>这些信息将直接显示在 /services 页面的服务卡片中</p>
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
              <p className='mt-1 text-xs text-gray-500'>显示为服务卡片的主标题</p>
            </div>
            <div>
              <Label htmlFor='serviceType'>服务类型 *</Label>
              <Select
                value={formData.serviceType || 'core'}
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
              <p className='mt-1 text-xs text-gray-500'>决定服务在页面中的分类显示</p>
            </div>
          </div>

          <div>
            <Label htmlFor='description'>服务描述 *</Label>
            <Textarea
              id='description'
              value={formData.description || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  description: e.target.value,
                  hero: {
                    ...prev.hero!,
                    description: e.target.value,
                  },
                }))
              }
              placeholder='简洁描述服务的核心价值和功能...'
              disabled={readOnly}
              rows={3}
              required
            />
            <p className='mt-1 text-xs text-gray-500'>显示在服务卡片中的描述文字</p>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='icon'>服务图标</Label>
              <Select
                value={formData.icon || 'Settings'}
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
              <p className='mt-1 text-xs text-gray-500'>服务卡片左侧显示的图标</p>
            </div>
            <div>
              <Label htmlFor='highlight'>核心亮点</Label>
              <Input
                id='highlight'
                value={formData.highlight || ''}
                onChange={e => setFormData(prev => ({ ...prev, highlight: e.target.value }))}
                placeholder='例如：平均提升40%运营效率'
                disabled={readOnly}
              />
              <p className='mt-1 text-xs text-gray-500'>显示在服务卡片右上角的亮点文字</p>
            </div>
          </div>

          <div>
            <Label htmlFor='subtitle'>服务副标题</Label>
            <Input
              id='subtitle'
              value={formData.subtitle || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  subtitle: e.target.value,
                  hero: {
                    ...prev.hero!,
                    subtitle: e.target.value,
                  },
                }))
              }
              placeholder='例如：企业数字化转型专业服务'
              disabled={readOnly}
            />
            <p className='mt-1 text-xs text-gray-500'>可选的副标题，显示在主标题下方</p>
          </div>

          {/* 功能特性管理 */}
          <div>
            <Label>功能特性</Label>
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
                {formData.features?.map((feature, index) => (
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
              <p className='text-xs text-gray-500'>显示在服务卡片中的功能特性标签</p>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='backgroundImage'>背景图片URL</Label>
              <Input
                id='backgroundImage'
                value={formData.backgroundImage || ''}
                onChange={e => setFormData(prev => ({ ...prev, backgroundImage: e.target.value }))}
                placeholder='例如：/images/services/digital-transformation-bg.jpg'
                disabled={readOnly}
              />
              <p className='mt-1 text-xs text-gray-500'>服务卡片的背景图片</p>
            </div>
            <div>
              <Label htmlFor='displayOrder'>显示顺序</Label>
              <Input
                id='displayOrder'
                type='number'
                value={formData.displayOrder || 1}
                onChange={e =>
                  setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))
                }
                placeholder='1'
                disabled={readOnly}
                min='1'
              />
              <p className='mt-1 text-xs text-gray-500'>数字越小越靠前显示</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 基本配置 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            ⚙️ 基本配置
            <Badge variant='outline'>可选</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
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
            <div>
              <Label htmlFor='level'>服务级别</Label>
              <Select
                value={formData.level || 'intermediate'}
                onValueChange={value => setFormData(prev => ({ ...prev, level: value as any }))}
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
        </CardContent>
      </Card>

      {/* 服务内容 */}
      <Card>
        <CardHeader>
          <CardTitle>📚 服务内容</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='learning-title'>内容标题</Label>
            <Input
              id='learning-title'
              value={formData.learning?.title || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  learning: {
                    ...prev.learning!,
                    title: e.target.value,
                  },
                }))
              }
              placeholder='例如：服务内容'
              disabled={readOnly}
            />
          </div>

          <div>
            <Label>服务目标</Label>
            <div className='mb-2 flex gap-2'>
              <Input
                value={newObjective}
                onChange={e => setNewObjective(e.target.value)}
                placeholder='添加服务目标'
                disabled={readOnly}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addObjective())}
              />
              <Button
                type='button'
                onClick={addObjective}
                disabled={readOnly || !newObjective.trim()}
                size='sm'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <div className='space-y-2'>
              {formData.learning?.objectives.map((objective, index) => (
                <div key={index} className='flex items-center gap-2 rounded bg-gray-50 p-2'>
                  <span className='flex-1'>{objective}</span>
                  {!readOnly && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeObjective(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 关于服务 */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ 关于服务</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='about-title'>关于标题</Label>
            <Input
              id='about-title'
              value={formData.about?.title || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  about: {
                    ...prev.about!,
                    title: e.target.value,
                  },
                }))
              }
              placeholder='例如：关于此服务'
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor='about-subtitle'>关于副标题</Label>
            <Input
              id='about-subtitle'
              value={formData.about?.subtitle || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  about: {
                    ...prev.about!,
                    subtitle: e.target.value,
                  },
                }))
              }
              placeholder='例如：专业的服务理念和方法'
              disabled={readOnly}
            />
          </div>

          <div>
            <Label>详细信息</Label>
            <div className='mb-2 flex gap-2'>
              <Textarea
                value={newDetail}
                onChange={e => setNewDetail(e.target.value)}
                placeholder='添加详细信息段落'
                disabled={readOnly}
                rows={2}
              />
              <Button
                type='button'
                onClick={addDetail}
                disabled={readOnly || !newDetail.trim()}
                size='sm'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <div className='space-y-2'>
              {formData.about?.details.map((detail, index) => (
                <div key={index} className='flex items-start gap-2 rounded bg-gray-50 p-3'>
                  <span className='flex-1 text-sm'>{detail}</span>
                  {!readOnly && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeDetail(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA配置 */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 行动召唤</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='cta-button'>按钮文字</Label>
            <Input
              id='cta-button'
              value={formData.cta?.buttonText || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  cta: {
                    ...prev.cta!,
                    buttonText: e.target.value,
                  },
                }))
              }
              placeholder='例如：立即咨询'
              disabled={readOnly}
            />
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
