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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X, Save, ArrowLeft, Upload, Settings, Target, Eye } from 'lucide-react'
import { ArticleAboutEditor } from '@/components/admin/article-about-editor'

interface EnhancedService {
  id?: string
  title: string
  subtitle?: string
  description?: string
  category: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  backgroundImage?: string
  features?: string[]

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

  learning?: {
    title: string
    objectives: string[]
  }

  about?: {
    title: string
    subtitle?: string
    description?: string
    content?: string
    details?: string[]
    sections?: Array<{
      id: string
      type: 'text' | 'image' | 'list' | 'quote' | 'divider'
      title?: string
      content?: string
      imageUrl?: string
      imageAlt?: string
      items?: string[]
      order: number
    }>
  }

  cta?: {
    buttonText: string
    isEnrollment: boolean
  }

  slug: string
}

interface EnhancedServiceFormProps {
  service?: EnhancedService
  onSuccess?: () => void
  onCancel?: () => void
  readOnly?: boolean
}

export function EnhancedServiceForm({
  service,
  onSuccess,
  onCancel,
  readOnly = false,
}: EnhancedServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState<EnhancedService>({
    title: '',
    subtitle: '',
    description: '',
    category: '专业服务',
    level: 'intermediate',
    duration: '',
    status: 'DRAFT',
    backgroundImage: '',
    features: [],
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
    about: {
      title: '关于此服务',
      subtitle: '',
      description: '',
      content: '',
      details: [],
      sections: [],
    },
    cta: {
      buttonText: '立即咨询',
      isEnrollment: false,
    },
    slug: 'new-service', // 提供默认slug，避免验证失败
  })

  const [newFeature, setNewFeature] = useState('')
  const [newObjective, setNewObjective] = useState('')
  const [newDetail, setNewDetail] = useState('')

  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        features: service.features || [],
        hero: service.hero || formData.hero,
        learning: service.learning || formData.learning,
        about: service.about || formData.about,
        cta: service.cta || formData.cta,
      })
    }
  }, [service])

  // 生成slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  // 处理标题变化
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
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
          details: [...(prev.about?.details || []), newDetail.trim()],
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
        details: (prev.about?.details || []).filter((_, i) => i !== index),
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

      console.log('提交服务数据:', formData)
      console.log('请求URL:', url)
      console.log('请求方法:', method)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保包含session cookies
        body: JSON.stringify(formData),
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
    <div onClick={e => e.stopPropagation()}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='basic' className='flex items-center gap-2'>
              <Settings className='h-4 w-4' />
              基本设置
            </TabsTrigger>
            <TabsTrigger value='content' className='flex items-center gap-2'>
              <Target className='h-4 w-4' />
              页面内容
            </TabsTrigger>
            <TabsTrigger value='advanced' className='flex items-center gap-2'>
              <Eye className='h-4 w-4' />
              高级配置
            </TabsTrigger>
          </TabsList>

          {/* 基本设置标签页 */}
          <TabsContent value='basic' className='space-y-4'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>📝 基本信息</CardTitle>
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
                </div>

                <div>
                  <Label htmlFor='description'>服务描述</Label>
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
                        about: {
                          ...prev.about!,
                          description: e.target.value,
                        },
                      }))
                    }
                    placeholder='简要描述服务内容和价值'
                    disabled={readOnly}
                    rows={3}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div>
                    <Label htmlFor='level'>服务级别</Label>
                    <Select
                      value={formData.level}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, level: value as any }))
                      }
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
                    <Label htmlFor='status'>状态</Label>
                    <Select
                      value={formData.status}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, status: value as any }))
                      }
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

            {/* 服务特性 */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>🎯 服务特性</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    placeholder='添加服务特性'
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
                        <X
                          className='h-3 w-3 cursor-pointer'
                          onClick={() => removeFeature(index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 页面内容标签页 */}
          <TabsContent value='content' className='space-y-4'>
            {/* 服务内容 */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>📚 服务内容</CardTitle>
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

            {/* 关于服务 - 文章式编辑器 */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>📝 关于服务</CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleAboutEditor
                  data={formData.about!}
                  onChange={aboutData =>
                    setFormData(prev => ({
                      ...prev,
                      about: aboutData,
                    }))
                  }
                  readOnly={readOnly}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 高级配置标签页 */}
          <TabsContent value='advanced' className='space-y-4'>
            {/* 背景图片设置 */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>🖼️ 背景图片</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    value={formData.backgroundImage || ''}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, backgroundImage: e.target.value }))
                    }
                    placeholder='输入图片URL'
                    disabled={readOnly}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={readOnly}
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = async e => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          const url = URL.createObjectURL(file)
                          setFormData(prev => ({ ...prev, backgroundImage: url }))
                        }
                      }
                      input.click()
                    }}
                  >
                    <Upload className='mr-1 h-4 w-4' />
                    上传
                  </Button>
                </div>

                {/* 预设背景图片 */}
                <div>
                  <Label className='text-sm text-gray-600'>预设背景图片：</Label>
                  <div className='mt-2 grid grid-cols-2 gap-3 md:grid-cols-3'>
                    {[
                      {
                        name: '数字化转型',
                        path: '/images/services/digital-transformation-bg.jpg',
                      },
                      { name: '智能运维', path: '/images/services/intelligent-operation-bg.png' },
                      {
                        name: '智能化工程',
                        path: '/images/services/intelligent-engineering-bg.jpg',
                      },
                      { name: '消防工程', path: '/images/services/fire-engineering-bg.png' },
                      { name: '风险评估', path: '/images/services/risk-assessment-bg.png' },
                    ].map(preset => (
                      <div
                        key={preset.path}
                        className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                          formData.backgroundImage === preset.path
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() =>
                          !readOnly &&
                          setFormData(prev => ({ ...prev, backgroundImage: preset.path }))
                        }
                      >
                        <div
                          className='aspect-video bg-cover bg-center'
                          style={{ backgroundImage: `url(${preset.path})` }}
                        >
                          <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                            <span className='px-2 text-center text-xs font-medium text-white'>
                              {preset.name}
                            </span>
                          </div>
                        </div>
                        {formData.backgroundImage === preset.path && (
                          <div className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500'>
                            <span className='text-xs text-white'>✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 背景图片预览 */}
                {formData.backgroundImage && (
                  <div>
                    <Label className='text-sm text-gray-600'>预览效果：</Label>
                    <div className='relative mt-2 overflow-hidden rounded-lg border'>
                      <div
                        className='aspect-video bg-cover bg-center'
                        style={{ backgroundImage: `url(${formData.backgroundImage})` }}
                      >
                        <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                          <div className='text-center text-white'>
                            <h3 className='text-lg font-bold'>{formData.title || '服务标题'}</h3>
                            <p className='text-sm opacity-90'>
                              {formData.subtitle || '服务副标题'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA配置 */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>🎯 行动召唤</CardTitle>
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
          </TabsContent>
        </Tabs>

        {/* 操作按钮 */}
        <div className='-mx-6 mt-6 flex items-center justify-between border-t bg-gray-50/50 px-6 py-4 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={loading}
            className='min-w-[100px]'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            取消
          </Button>
          <div className='flex gap-2'>
            {!readOnly && (
              <Button type='submit' disabled={loading} className='min-w-[120px]'>
                <Save className='mr-2 h-4 w-4' />
                {loading ? '保存中...' : service ? '更新服务' : '创建服务'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
