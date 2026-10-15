'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Save, ArrowLeft, Plus, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface JobFormData {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  status: 'draft' | 'published'
  validUntil?: string
}

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newBenefit, setNewBenefit] = useState('')

  const [formData, setFormData] = useState<JobFormData>({
    id: '',
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    description: '',
    requirements: [],
    benefits: [],
    status: 'draft',
    validUntil: '',
  })

  // 加载职位数据
  useEffect(() => {
    const loadJobData = async () => {
      if (!jobId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/admin/content/careers/jobs/${jobId}`)

        if (response.ok) {
          const job = await response.json()

          // 设置表单数据
          setFormData({
            id: job.id,
            title: job.title || '',
            department: job.department || '',
            location: job.location || '',
            type: job.type || '',
            experience: job.experience || '',
            salary: job.salary || '',
            description: job.description || '',
            requirements: Array.isArray(job.requirements) ? job.requirements : [],
            benefits: Array.isArray(job.benefits) ? job.benefits : [],
            status: job.status || 'draft',
            validUntil: job.validUntil ? new Date(job.validUntil).toISOString().split('T')[0] : '',
          })
        } else if (response.status === 404) {
          setErrors({ general: '职位不存在' })
        } else {
          setErrors({ general: '加载职位数据失败' })
        }
      } catch (_error) {
        setErrors({ general: '网络错误，加载失败' })
      } finally {
        setLoading(false)
      }
    }

    loadJobData()
  }, [jobId])

  // 处理表单字段变化
  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // 添加职位要求
  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement('')
    }
  }

  // 移除职位要求
  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  // 添加福利待遇
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }))
      setNewBenefit('')
    }
  }

  // 移除福利待遇
  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '职位标题不能为空'
    }
    if (!formData.department.trim()) {
      newErrors.department = '部门不能为空'
    }
    if (!formData.location.trim()) {
      newErrors.location = '工作地点不能为空'
    }
    if (!formData.type.trim()) {
      newErrors.type = '工作类型不能为空'
    }
    if (!formData.experience.trim()) {
      newErrors.experience = '经验要求不能为空'
    }
    if (!formData.description.trim()) {
      newErrors.description = '职位描述不能为空'
    }
    if (formData.requirements.length === 0) {
      newErrors.requirements = '至少需要添加一个职位要求'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 保存更新
  const handleSave = async (publishStatus?: 'draft' | 'published') => {
    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/content/careers/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: publishStatus || formData.status,
        }),
      })

      if (response.ok) {
        const _result = await response.json()
        setSuccess('职位更新成功！')

        // 2秒后跳转回管理页面
        setTimeout(() => {
          router.push('/admin/forms/careers')
        }, 2000)
      } else {
        const errorData = await response.json()
        if (errorData.details) {
          // Zod验证错误
          const fieldErrors: Record<string, string> = {}
          errorData.details.forEach((detail: any) => {
            if (detail.path && detail.path.length > 0) {
              fieldErrors[detail.path[0]] = detail.message
            }
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: errorData.error || '更新失败' })
        }
      }
    } catch (_error) {
      setErrors({ general: '网络错误，更新失败' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='text-center'>
            <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin' />
            <p className='text-gray-600'>加载职位数据中...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (errors.general && !formData.id) {
    return (
      <AdminLayout>
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='text-center'>
            <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-500' />
            <h2 className='mb-2 text-xl font-semibold'>加载失败</h2>
            <p className='mb-4 text-gray-600'>{errors.general}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
            <div>
              <h1 className='text-3xl font-bold'>编辑职位</h1>
              <p className='mt-2 text-gray-600'>修改职位信息和要求</p>
            </div>
          </div>

          <div className='flex space-x-3'>
            <Button variant='outline' onClick={() => handleSave('draft')} disabled={saving}>
              <Save className='mr-2 h-4 w-4' />
              {saving ? '保存中...' : '保存草稿'}
            </Button>
            <Button onClick={() => handleSave('published')} disabled={saving}>
              <Save className='mr-2 h-4 w-4' />
              {saving ? '更新中...' : '保存并发布'}
            </Button>
          </div>
        </div>

        {/* 成功提示 */}
        {success && (
          <Alert className='border-green-200 bg-green-50'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>{success}</AlertDescription>
          </Alert>
        )}

        {/* 错误提示 */}
        {errors.general && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* 主要内容 */}
          <div className='space-y-6 lg:col-span-2'>
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <CardDescription>修改职位的基本信息</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>职位标题 *</Label>
                    <Input
                      id='title'
                      placeholder='例如：前端开发工程师'
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className='text-sm text-red-500'>{errors.title}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='department'>部门 *</Label>
                    <Input
                      id='department'
                      value={formData.department}
                      onChange={e => handleInputChange('department', e.target.value)}
                      placeholder='请输入部门名称'
                      className={errors.department ? 'border-red-500' : ''}
                      required
                    />
                    {errors.department && (
                      <p className='text-sm text-red-500'>{errors.department}</p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='location'>工作地点 *</Label>
                    <Select
                      value={formData.location}
                      onValueChange={value => handleInputChange('location', value)}
                    >
                      <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                        <SelectValue placeholder='选择工作地点' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='上海'>上海</SelectItem>
                        <SelectItem value='北京'>北京</SelectItem>
                        <SelectItem value='深圳'>深圳</SelectItem>
                        <SelectItem value='杭州'>杭州</SelectItem>
                        <SelectItem value='广州'>广州</SelectItem>
                        <SelectItem value='远程办公'>远程办公</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.location && <p className='text-sm text-red-500'>{errors.location}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='type'>工作类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={value => handleInputChange('type', value)}
                    >
                      <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder='选择工作类型' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='全职'>全职</SelectItem>
                        <SelectItem value='兼职'>兼职</SelectItem>
                        <SelectItem value='实习'>实习</SelectItem>
                        <SelectItem value='合同工'>合同工</SelectItem>
                        <SelectItem value='远程'>远程</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className='text-sm text-red-500'>{errors.type}</p>}
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='experience'>经验要求 *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={value => handleInputChange('experience', value)}
                    >
                      <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
                        <SelectValue placeholder='选择经验要求' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='不限'>不限</SelectItem>
                        <SelectItem value='应届毕业生'>应届毕业生</SelectItem>
                        <SelectItem value='1-3年'>1-3年</SelectItem>
                        <SelectItem value='3-5年'>3-5年</SelectItem>
                        <SelectItem value='5-10年'>5-10年</SelectItem>
                        <SelectItem value='10年以上'>10年以上</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.experience && (
                      <p className='text-sm text-red-500'>{errors.experience}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='salary'>薪资范围</Label>
                    <Input
                      id='salary'
                      placeholder='例如：15K-25K'
                      value={formData.salary}
                      onChange={e => handleInputChange('salary', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 职位描述 */}
            <Card>
              <CardHeader>
                <CardTitle>职位描述</CardTitle>
                <CardDescription>详细描述职位的工作内容和职责</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <Label htmlFor='description'>职位描述 *</Label>
                  <Textarea
                    id='description'
                    placeholder='请详细描述职位的工作内容、职责和要求...'
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    rows={8}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className='text-sm text-red-500'>{errors.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className='space-y-6'>
            {/* 职位要求 */}
            <Card>
              <CardHeader>
                <CardTitle>职位要求</CardTitle>
                <CardDescription>修改具体的技能和要求</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex space-x-2'>
                  <Input
                    placeholder='添加职位要求'
                    value={newRequirement}
                    onChange={e => setNewRequirement(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addRequirement()}
                  />
                  <Button size='sm' onClick={addRequirement} disabled={!newRequirement.trim()}>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>

                {errors.requirements && (
                  <p className='text-sm text-red-500'>{errors.requirements}</p>
                )}

                <div className='space-y-2'>
                  {formData.requirements.map((req, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded bg-gray-50 p-2'
                    >
                      <span className='text-sm'>{req}</span>
                      <Button size='sm' variant='ghost' onClick={() => removeRequirement(index)}>
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 福利待遇 */}
            <Card>
              <CardHeader>
                <CardTitle>福利待遇</CardTitle>
                <CardDescription>修改公司提供的福利</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex space-x-2'>
                  <Input
                    placeholder='添加福利待遇'
                    value={newBenefit}
                    onChange={e => setNewBenefit(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addBenefit()}
                  />
                  <Button size='sm' onClick={addBenefit} disabled={!newBenefit.trim()}>
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>

                <div className='space-y-2'>
                  {formData.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded bg-gray-50 p-2'
                    >
                      <span className='text-sm'>{benefit}</span>
                      <Button size='sm' variant='ghost' onClick={() => removeBenefit(index)}>
                        <X className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 发布设置 */}
            <Card>
              <CardHeader>
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='validUntil'>有效期至</Label>
                  <Input
                    id='validUntil'
                    type='date'
                    value={formData.validUntil}
                    onChange={e => handleInputChange('validUntil', e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>当前状态</Label>
                  <div className='flex space-x-2'>
                    <Badge variant={formData.status === 'draft' ? 'secondary' : 'outline'}>
                      草稿
                    </Badge>
                    <Badge variant={formData.status === 'published' ? 'default' : 'outline'}>
                      已发布
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
