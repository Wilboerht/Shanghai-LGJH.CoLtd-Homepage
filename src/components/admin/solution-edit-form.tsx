'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { RichTextField } from '@/components/ui/rich-text-field'

import { MetricsPreview, MetricsSuggestions } from '@/components/admin/metrics-preview'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus } from 'lucide-react'

interface Solution {
  id: string
  category: string
  title: string
  subtitle?: string
  description?: string
  content?: string // 新增富文本内容字段
  features?: string[]
  applications?: string[]
  metrics?: Array<{
    value: string
    label: string
  }>
  technologies?: string[]
  benefits?: string[]
  image?: string
  slug: string
  gradient?: string
  accentColor?: string
  createdAt: Date
  updatedAt: Date
}

interface SolutionEditFormProps {
  solution: Solution | null
  isCreating: boolean
  onSave: (solution: Partial<Solution>) => void
  onCancel: () => void
}

// 解决方案分类选项
const SOLUTION_CATEGORIES = [
  { value: '园区管理', label: '园区管理' },
  { value: '社区管理', label: '社区管理' },
  { value: '公共交通', label: '公共交通' },
  { value: '工业制造', label: '工业制造' },
  { value: '物流运输', label: '物流运输' },
  { value: '大健康', label: '大健康' },
  { value: '商业综合体', label: '商业综合体' },
  { value: '其他方案', label: '其他方案' },
]

export default function SolutionEditForm({
  solution,
  isCreating,
  onSave,
  onCancel,
}: SolutionEditFormProps) {
  const [formData, setFormData] = useState<Partial<Solution>>({})
  const [newFeature, setNewFeature] = useState('')
  const [newApplication, setNewApplication] = useState('')
  const [newTechnology, setNewTechnology] = useState('')
  const [newBenefit, setNewBenefit] = useState('')
  const [metricsJson, setMetricsJson] = useState('')
  const [newMetricLabel, setNewMetricLabel] = useState('')
  const [newMetricValue, setNewMetricValue] = useState('')

  useEffect(() => {
    console.log('SolutionEditForm useEffect triggered:', { solution, isCreating })
    if (solution) {
      // 过滤掉不应该编辑的字段
      const { id, createdAt, updatedAt, ...editableData } = solution
      console.log('Setting form data:', editableData)
      setFormData(editableData)

      // 初始化指标JSON字符串
      if (solution.metrics && Array.isArray(solution.metrics) && solution.metrics.length > 0) {
        const metricsObj: Record<string, string> = {}
        solution.metrics.forEach((metric: any) => {
          if (metric.label && metric.value) {
            metricsObj[metric.label] = metric.value
          }
        })
        setMetricsJson(JSON.stringify(metricsObj, null, 2))
      } else {
        setMetricsJson('')
      }
    } else if (isCreating) {
      // 创建新解决方案时的默认值
      setFormData({
        category: '',
        title: '',
        subtitle: '',
        description: '',
        content: '',
        features: [],
        applications: [],
        metrics: [],
        technologies: [],
        benefits: [],

        slug: '',
        gradient: '',
        accentColor: '',
      })
    }
  }, [solution, isCreating])

  // 监控 formData 变化
  useEffect(() => {
    console.log('FormData updated:', formData)
  }, [formData])

  const handleInputChange = (field: string, value: any) => {
    console.log(`Updating field ${field} to:`, value)
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

  const addTechnology = () => {
    if (newTechnology.trim()) {
      const technologies = [...(formData.technologies || []), newTechnology.trim()]
      handleInputChange('technologies', technologies)
      setNewTechnology('')
    }
  }

  const removeTechnology = (index: number) => {
    const technologies = formData.technologies?.filter((_, i) => i !== index) || []
    handleInputChange('technologies', technologies)
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

  // 添加新指标
  const addMetric = () => {
    if (newMetricLabel.trim() && newMetricValue.trim()) {
      const metrics = [
        ...(formData.metrics || []),
        {
          label: newMetricLabel.trim(),
          value: newMetricValue.trim(),
        },
      ]
      handleInputChange('metrics', metrics)
      setNewMetricLabel('')
      setNewMetricValue('')
    }
  }

  // 删除指标
  const removeMetric = (index: number) => {
    const metrics = formData.metrics?.filter((_, i) => i !== index) || []
    handleInputChange('metrics', metrics)
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
      alert('请输入解决方案标题')
      return
    }

    if (!formData.category?.trim()) {
      alert('请选择解决方案分类')
      return
    }

    if (!formData.slug?.trim()) {
      alert('请输入URL标识')
      return
    }

    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* 第一部分：基本信息 */}
      <div className='rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>基本信息</h3>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <Label htmlFor='title'>解决方案标题 *</Label>
              <Input
                id='title'
                value={formData.title || ''}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder='输入解决方案标题'
                required
                className='font-medium'
              />
            </div>
            <div>
              <Label htmlFor='category'>解决方案分类 *</Label>
              {(solution || isCreating) && (
                <Select
                  key={`category-${solution?.id || 'new'}-${formData.category}`}
                  value={formData.category || ''}
                  onValueChange={value => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='选择解决方案分类' />
                  </SelectTrigger>
                  <SelectContent>
                    {SOLUTION_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='subtitle'>解决方案副标题</Label>
            <Input
              id='subtitle'
              value={formData.subtitle || ''}
              onChange={e => handleInputChange('subtitle', e.target.value)}
              placeholder='简短的解决方案描述，显示在标题下方'
            />
            <p className='mt-1 text-xs text-slate-700 dark:text-slate-300'>
              显示在详情页面标题下方的副标题
            </p>
          </div>

          <div>
            <Label htmlFor='description'>解决方案简介</Label>
            <Textarea
              id='description'
              value={formData.description || ''}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder='简要描述解决方案的核心功能和特点'
              rows={3}
              className='resize-none'
            />
            <p className='mt-1 text-xs text-slate-700 dark:text-slate-300'>
              显示在详情页面头部和列表页面的简介，建议控制在150字以内
            </p>
          </div>

          <div>
            <Label htmlFor='slug'>URL标识 *</Label>
            <Input
              id='slug'
              value={formData.slug || ''}
              onChange={e => handleInputChange('slug', e.target.value)}
              placeholder='解决方案页面的URL标识，如：smart-park'
              required
              className='font-mono text-sm'
            />
            <p className='mt-1 text-xs text-slate-700 dark:text-slate-300'>
              用于生成页面URL，只能包含字母、数字和连字符
            </p>
          </div>
        </div>
      </div>

      {/* 第二部分：关键指标 */}
      <div className='rounded-lg border border-slate-200 bg-blue-50 p-6 dark:border-slate-700 dark:bg-blue-900/20'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>关键指标</h3>
        <div className='space-y-4'>
          {/* 添加新指标 */}
          <div className='space-y-2'>
            <Label>添加关键指标</Label>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
              <Input
                value={newMetricLabel}
                onChange={e => setNewMetricLabel(e.target.value)}
                placeholder='指标名称，如：系统可用性'
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMetric())}
              />
              <Input
                value={newMetricValue}
                onChange={e => setNewMetricValue(e.target.value)}
                placeholder='指标数值，如：99.9%'
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMetric())}
              />
              <Button type='button' onClick={addMetric} size='sm'>
                <Plus className='mr-2 h-4 w-4' />
                添加指标
              </Button>
            </div>
          </div>

          {/* 已添加的指标 */}
          {formData.metrics && formData.metrics.length > 0 && (
            <div className='space-y-2'>
              <Label>已添加的指标</Label>
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                {formData.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border bg-white p-3'
                  >
                    <div className='flex-1'>
                      <div className='font-medium text-slate-900'>{metric.label}</div>
                      <div className='text-sm text-slate-600'>{metric.value}</div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeMetric(index)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='rounded-lg border border-blue-200 bg-blue-100 p-3'>
            <div className='space-y-1 text-sm'>
              <p className='font-medium text-blue-800'>💡 指标建议：</p>
              <ul className='ml-4 space-y-0.5 text-blue-700'>
                <li>• 系统可用性：99.9%</li>
                <li>• 处理速度：10倍提升</li>
                <li>• 成本节省：40%</li>
                <li>• 响应时间：&lt;100ms</li>
              </ul>
              <p className='mt-2 text-amber-600'>⚠️ 最多显示4个指标，超出部分将被忽略</p>
            </div>
          </div>

          <p className='text-xs text-slate-700 dark:text-slate-300'>
            关键指标显示在详情页面头部，突出展示解决方案的核心数据
          </p>
        </div>
      </div>

      {/* 第三部分：应用场景 */}
      <div className='rounded-lg border border-slate-200 bg-green-50 p-6 dark:border-slate-700 dark:bg-green-900/20'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>应用场景</h3>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <Input
              value={newApplication}
              onChange={e => setNewApplication(e.target.value)}
              placeholder='添加应用场景，如：智慧园区、数字化工厂'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addApplication())}
              className='flex-1'
            />
            <Button type='button' onClick={addApplication} size='sm'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.applications?.map((application, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='flex items-center gap-1 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
              >
                {application}
                <X className='h-3 w-3 cursor-pointer' onClick={() => removeApplication(index)} />
              </Badge>
            ))}
          </div>
          <p className='text-xs text-slate-700 dark:text-slate-300'>
            应用场景以标签形式显示在详情页面顶部，帮助用户快速了解适用范围
          </p>
        </div>
      </div>

      {/* 第四部分：详细内容 */}
      <div className='rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>详细内容</h3>
        <RichTextField
          id='content'
          label='详情页面主要内容'
          value={formData.content || ''}
          onChange={content => handleInputChange('content', content)}
          placeholder='详细的解决方案介绍内容，支持富文本格式，可以插入图片、表格、链接等'
          height={400}
          description='详情页面的主要内容区域，支持富文本编辑，可以添加标题、段落、图片、表格、链接等丰富内容'
        />
      </div>

      {/* 第五部分：核心功能 */}
      <div className='rounded-lg border border-slate-200 bg-blue-50 p-6 dark:border-slate-700 dark:bg-blue-900/20'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>核心功能</h3>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <Input
              value={newFeature}
              onChange={e => setNewFeature(e.target.value)}
              placeholder='添加核心功能，如：实时监控、智能分析'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className='flex-1'
            />
            <Button type='button' onClick={addFeature} size='sm'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.features?.map((feature, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='flex items-center gap-1 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
              >
                {feature}
                <X className='h-3 w-3 cursor-pointer' onClick={() => removeFeature(index)} />
              </Badge>
            ))}
          </div>
          <p className='text-xs text-slate-700 dark:text-slate-300'>
            核心功能以卡片形式显示在详情页面，展示解决方案的主要能力
          </p>
        </div>
      </div>

      {/* 第六部分：核心技术 */}
      <div className='rounded-lg border border-slate-200 bg-purple-50 p-6 dark:border-slate-700 dark:bg-purple-900/20'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>核心技术</h3>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <Input
              value={newTechnology}
              onChange={e => setNewTechnology(e.target.value)}
              placeholder='添加核心技术，如：AI算法、云计算'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className='flex-1'
            />
            <Button type='button' onClick={addTechnology} size='sm'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.technologies?.map((technology, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='flex items-center gap-1 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
              >
                {technology}
                <X className='h-3 w-3 cursor-pointer' onClick={() => removeTechnology(index)} />
              </Badge>
            ))}
          </div>
          <p className='text-xs text-slate-700 dark:text-slate-300'>
            核心技术以网格形式显示，突出解决方案的技术优势
          </p>
        </div>
      </div>

      {/* 第七部分：核心优势 */}
      <div className='rounded-lg border border-slate-200 bg-orange-50 p-6 dark:border-slate-700 dark:bg-orange-900/20'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>核心优势</h3>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <Input
              value={newBenefit}
              onChange={e => setNewBenefit(e.target.value)}
              placeholder='添加核心优势，如：降低成本30%、提升效率50%'
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              className='flex-1'
            />
            <Button type='button' onClick={addBenefit} size='sm'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {formData.benefits?.map((benefit, index) => (
              <Badge
                key={index}
                variant='secondary'
                className='flex items-center gap-1 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
              >
                {benefit}
                <X className='h-3 w-3 cursor-pointer' onClick={() => removeBenefit(index)} />
              </Badge>
            ))}
          </div>
          <p className='text-xs text-slate-700 dark:text-slate-300'>
            核心优势以列表形式显示，强调解决方案为客户带来的价值
          </p>
        </div>
      </div>

      {/* 第八部分：样式配置 */}
      <div className='rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800'>
        <h3 className='mb-4 text-lg font-semibold text-slate-900 dark:text-white'>样式配置</h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label htmlFor='gradient'>渐变色配置</Label>
            <Input
              id='gradient'
              value={formData.gradient || ''}
              onChange={e => handleInputChange('gradient', e.target.value)}
              placeholder='如：from-blue-600 to-cyan-600'
            />
            <p className='mt-1 text-xs text-slate-700 dark:text-slate-300'>
              用于列表页面卡片的背景渐变
            </p>
          </div>
          <div>
            <Label htmlFor='accentColor'>强调色</Label>
            <Input
              id='accentColor'
              value={formData.accentColor || ''}
              onChange={e => handleInputChange('accentColor', e.target.value)}
              placeholder='如：blue'
            />
            <p className='mt-1 text-xs text-slate-700 dark:text-slate-300'>
              用于图标和装饰元素的主题色
            </p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className='flex justify-end gap-2 border-t pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          取消
        </Button>
        <Button type='submit'>{isCreating ? '创建解决方案' : '保存修改'}</Button>
      </div>
    </form>
  )
}
