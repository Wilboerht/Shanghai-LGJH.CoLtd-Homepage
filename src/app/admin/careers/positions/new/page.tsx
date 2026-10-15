'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function NewJobPositionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    description: '',
    requirements: [''],
    benefits: [''],
    tags: '',
    isHot: false,
    isUrgent: false,
    status: 'published',
  })

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field: 'requirements' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  const removeArrayItem = (field: 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 过滤空的要求和福利
      const cleanedRequirements = formData.requirements.filter(req => req.trim())
      const cleanedBenefits = formData.benefits.filter(benefit => benefit.trim())

      // 验证必填字段
      if (!formData.title.trim()) {
        alert('请填写职位名称')
        return
      }
      if (!formData.department) {
        alert('请选择所属部门')
        return
      }
      if (!formData.location.trim()) {
        alert('请填写工作地点')
        return
      }
      if (!formData.type) {
        alert('请选择职位类型')
        return
      }
      if (!formData.experience) {
        alert('请选择工作经验要求')
        return
      }
      if (!formData.description.trim()) {
        alert('请填写职位描述')
        return
      }
      if (cleanedRequirements.length === 0) {
        alert('请至少添加一个职位要求')
        return
      }

      const cleanedData = {
        ...formData,
        requirements: cleanedRequirements,
        benefits: cleanedBenefits,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
          .join(','),
      }

      const response = await fetch('/api/admin/content/careers/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      })

      if (response.ok) {
        const _result = await response.json()
        alert('职位创建成功！')
        router.push('/admin/careers/positions')
      } else {
        const error = await response.json()
        console.error('创建职位失败:', error)
        if (error.details && Array.isArray(error.details)) {
          // 显示验证错误详情
          const errorMessages = error.details.map((detail: any) => detail.message).join('\n')
          alert(`创建失败:\n${errorMessages}`)
        } else {
          alert(`创建失败: ${error.error || '未知错误'}`)
        }
      }
    } catch (_error) {
      console.error('创建职位失败:', _error)
      alert('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* 头部导航 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='outline' size='sm' asChild>
            <Link href='/admin/careers/positions'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回职位列表
            </Link>
          </Button>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>新增职位</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* 左侧：基本信息 */}
          <div className='space-y-6 lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='title'>职位名称 *</Label>
                    <Input
                      id='title'
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      placeholder='请输入职位名称'
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='department'>所属部门 *</Label>
                    <Input
                      id='department'
                      value={formData.department}
                      onChange={e => handleInputChange('department', e.target.value)}
                      placeholder='请输入所属部门'
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='location'>工作地点 *</Label>
                    <Input
                      id='location'
                      value={formData.location}
                      onChange={e => handleInputChange('location', e.target.value)}
                      placeholder='如：上海临港'
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor='type'>职位类型 *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={value => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='选择类型' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='全职'>全职</SelectItem>
                        <SelectItem value='兼职'>兼职</SelectItem>
                        <SelectItem value='实习'>实习</SelectItem>
                        <SelectItem value='合同工'>合同工</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='experience'>工作经验 *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={value => handleInputChange('experience', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='选择经验要求' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='不限'>不限</SelectItem>
                        <SelectItem value='1年以下'>1年以下</SelectItem>
                        <SelectItem value='1-3年'>1-3年</SelectItem>
                        <SelectItem value='3-5年'>3-5年</SelectItem>
                        <SelectItem value='5-10年'>5-10年</SelectItem>
                        <SelectItem value='10年以上'>10年以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='salary'>薪资范围</Label>
                    <Input
                      id='salary'
                      value={formData.salary}
                      onChange={e => handleInputChange('salary', e.target.value)}
                      placeholder='如：15K-25K'
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='tags'>技能标签</Label>
                  <Input
                    id='tags'
                    value={formData.tags}
                    onChange={e => handleInputChange('tags', e.target.value)}
                    placeholder='用逗号分隔，如：React,TypeScript,Node.js'
                  />
                </div>

                <div>
                  <Label htmlFor='description'>职位描述 *</Label>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder='请详细描述职位职责和工作内容'
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 职位要求 */}
            <Card>
              <CardHeader>
                <CardTitle>职位要求</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className='flex items-center space-x-2'>
                      <Input
                        value={req}
                        onChange={e => handleArrayChange('requirements', index, e.target.value)}
                        placeholder={`要求 ${index + 1}`}
                      />
                      {formData.requirements.length > 1 && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeArrayItem('requirements', index)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => addArrayItem('requirements')}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    添加要求
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 福利待遇 */}
            <Card>
              <CardHeader>
                <CardTitle>福利待遇</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className='flex items-center space-x-2'>
                      <Input
                        value={benefit}
                        onChange={e => handleArrayChange('benefits', index, e.target.value)}
                        placeholder={`福利 ${index + 1}`}
                      />
                      {formData.benefits.length > 1 && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeArrayItem('benefits', index)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => addArrayItem('benefits')}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    添加福利
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：设置选项 */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='isHot'>热门职位</Label>
                  <Switch
                    id='isHot'
                    checked={formData.isHot}
                    onCheckedChange={checked => handleInputChange('isHot', checked)}
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='isUrgent'>急招职位</Label>
                  <Switch
                    id='isUrgent'
                    checked={formData.isUrgent}
                    onCheckedChange={checked => handleInputChange('isUrgent', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor='status'>发布状态</Label>
                  <Select
                    value={formData.status}
                    onValueChange={value => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='published'>已发布</SelectItem>
                      <SelectItem value='draft'>草稿</SelectItem>
                      <SelectItem value='archived'>已归档</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className='space-y-2'>
              <Button type='submit' className='w-full' disabled={loading}>
                <Save className='mr-2 h-4 w-4' />
                {loading ? '创建中...' : '创建职位'}
              </Button>
              <Button type='button' variant='outline' className='w-full' asChild>
                <Link href='/admin/careers/positions'>取消</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
