'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Star } from 'lucide-react'
import Link from 'next/link'

interface TalentDetail {
  id: string
  applicantName: string
  email: string
  phone?: string
  introduction?: string
  currentPosition?: string
  currentCompany?: string
  expectedSalary?: string
  availability: string
  rating?: number
  tags: string[]
  notes?: string
  addedReason?: string
  nextFollowUp?: string
}

export default function EditTalentPage() {
  const params = useParams()
  const router = useRouter()
  const [talent, setTalent] = useState<TalentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    introduction: '',
    currentPosition: '',
    currentCompany: '',
    expectedSalary: '',
    availability: 'AVAILABLE',
    rating: 3,
    tags: '',
    notes: '',
    addedReason: '',
    nextFollowUp: '',
  })

  // 兼容历史值到当前API枚举值
  const normalizeAvailability = (value: string) => {
    if (value === 'NOT_INTERESTED') return 'NOT_LOOKING'
    if (value === 'HIRED') return 'CONTACTED'
    return value
  }

  const talentId = params.id as string

  // 获取人才详情
  const fetchTalentDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/talent-pool/${talentId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`获取人才详情失败: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const talentData = data.talent || data
      setTalent(talentData)

      // 填充表单数据
      setFormData({
        applicantName: talentData.applicantName || '',
        email: talentData.email || '',
        phone: talentData.phone || '',
        introduction: talentData.introduction || '',
        currentPosition: talentData.currentPosition || '',
        currentCompany: talentData.currentCompany || '',
        expectedSalary: talentData.expectedSalary || '',
        availability: normalizeAvailability(talentData.availability || 'AVAILABLE'),
        rating: talentData.rating || 3,
        tags: Array.isArray(talentData.tags) ? talentData.tags.join(', ') : '',
        notes: talentData.notes || '',
        addedReason: talentData.addedReason || '',
        nextFollowUp: talentData.nextFollowUp
          ? new Date(talentData.nextFollowUp).toISOString().slice(0, 16)
          : '',
      })
    } catch (error) {
      console.error('获取人才详情失败:', error)
      alert('获取人才详情失败: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  // 保存修改
  const handleSave = async () => {
    try {
      setSaving(true)

      const updateData = {
        ...formData,
        availability: normalizeAvailability(formData.availability),
        tags: formData.tags, // 发送字符串，让API处理
        rating: Number(formData.rating),
      }

      const response = await fetch(`/api/admin/talent-pool/${talentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API错误响应:', errorText)
        try {
          const error = JSON.parse(errorText)
          throw new Error(error.error || '更新失败')
        } catch {
          throw new Error(`更新失败: ${response.status} - ${errorText}`)
        }
      }

      alert('保存成功！')
      router.push(`/admin/careers/talent-pool/${talentId}`)
    } catch (error) {
      console.error('保存失败:', error)
      alert(error instanceof Error ? error.message : '保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (talentId) {
      fetchTalentDetail()
    }
  }, [talentId])

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-2 text-gray-600'>加载中...</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className='py-12 text-center'>
        <p className='text-gray-500'>人才信息不存在</p>
        <Button asChild className='mt-4'>
          <Link href='/admin/careers/talent-pool'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            返回人才库
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 头部导航 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/admin/careers/talent-pool/${talentId}`}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回详情
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>编辑人才信息</h1>
            <p className='text-sm text-gray-500'>{talent.applicantName}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className='mr-2 h-4 w-4' />
          {saving ? '保存中...' : '保存修改'}
        </Button>
      </div>

      {/* 紧凑清晰的表单设计 */}
      <div className='rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900'>
        <div className='border-b border-gray-100 px-6 py-4 dark:border-gray-800'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-white'>人才信息编辑</h2>
        </div>

        <div className='p-6'>
          <div className='space-y-6'>
            {/* 基本信息 */}
            <div className='space-y-4'>
              <h3 className='border-b border-gray-100 pb-2 text-sm font-medium text-gray-900 dark:border-gray-800 dark:text-white'>
                基本信息
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='applicantName'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    姓名 <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='applicantName'
                    value={formData.applicantName}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, applicantName: e.target.value }))
                    }
                    placeholder='请输入姓名'
                    className='h-9'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='email'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    邮箱 <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder='请输入邮箱'
                    className='h-9'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='phone'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    电话
                  </Label>
                  <Input
                    id='phone'
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder='请输入电话号码'
                    className='h-9'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='availability'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    可用状态
                  </Label>
                  <Select
                    value={formData.availability}
                    onValueChange={value => setFormData(prev => ({ ...prev, availability: value }))}
                  >
                    <SelectTrigger className='h-9'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='AVAILABLE'>可联系</SelectItem>
                      <SelectItem value='BUSY'>忙碌中</SelectItem>
                      <SelectItem value='NOT_LOOKING'>暂不考虑</SelectItem>
                      <SelectItem value='CONTACTED'>已联系</SelectItem>
                      <SelectItem value='BLACKLIST'>黑名单</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='introduction'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  个人介绍
                </Label>
                <Textarea
                  id='introduction'
                  value={formData.introduction}
                  onChange={e => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
                  placeholder='请输入个人介绍'
                  rows={3}
                  className='resize-none'
                />
              </div>
            </div>

            {/* 职业信息 */}
            <div className='space-y-4'>
              <h3 className='border-b border-gray-100 pb-2 text-sm font-medium text-gray-900 dark:border-gray-800 dark:text-white'>
                职业信息
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='currentPosition'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    当前职位
                  </Label>
                  <Input
                    id='currentPosition'
                    value={formData.currentPosition}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, currentPosition: e.target.value }))
                    }
                    placeholder='请输入当前职位'
                    className='h-9'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='currentCompany'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    当前公司
                  </Label>
                  <Input
                    id='currentCompany'
                    value={formData.currentCompany}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, currentCompany: e.target.value }))
                    }
                    placeholder='请输入当前公司'
                    className='h-9'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='expectedSalary'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    期望薪资
                  </Label>
                  <Input
                    id='expectedSalary'
                    value={formData.expectedSalary}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, expectedSalary: e.target.value }))
                    }
                    placeholder='如：15K-25K'
                    className='h-9'
                  />
                </div>
              </div>
            </div>

            {/* 评级和标签 */}
            <div className='space-y-4'>
              <h3 className='border-b border-gray-100 pb-2 text-sm font-medium text-gray-900 dark:border-gray-800 dark:text-white'>
                评级和标签
              </h3>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='rating'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    人才评级
                  </Label>
                  <div className='flex items-center space-x-3'>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, rating: Number(value) }))
                      }
                    >
                      <SelectTrigger className='h-9 w-24'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1'>1星</SelectItem>
                        <SelectItem value='2'>2星</SelectItem>
                        <SelectItem value='3'>3星</SelectItem>
                        <SelectItem value='4'>4星</SelectItem>
                        <SelectItem value='5'>5星</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= formData.rating
                              ? 'fill-current text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='nextFollowUp'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    下次跟进
                  </Label>
                  <Input
                    id='nextFollowUp'
                    type='datetime-local'
                    value={formData.nextFollowUp}
                    onChange={e => setFormData(prev => ({ ...prev, nextFollowUp: e.target.value }))}
                    className='h-9'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='tags'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  技能标签
                  <span className='ml-2 text-xs text-gray-500'>
                    例如：React, TypeScript, Node.js
                  </span>
                </Label>
                <Input
                  id='tags'
                  value={formData.tags}
                  onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder='请输入技能标签，用逗号分隔'
                  className='h-9'
                />
              </div>
            </div>

            {/* 备注信息 */}
            <div className='space-y-4'>
              <h3 className='border-b border-gray-100 pb-2 text-sm font-medium text-gray-900 dark:border-gray-800 dark:text-white'>
                备注信息
              </h3>
              <div className='grid grid-cols-1 gap-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='addedReason'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    加入原因
                  </Label>
                  <Textarea
                    id='addedReason'
                    value={formData.addedReason}
                    onChange={e => setFormData(prev => ({ ...prev, addedReason: e.target.value }))}
                    placeholder='为什么将此人才加入储备库'
                    rows={2}
                    className='resize-none'
                  />
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='notes'
                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    备注信息
                  </Label>
                  <Textarea
                    id='notes'
                    value={formData.notes}
                    onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder='其他备注信息'
                    rows={3}
                    className='resize-none'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className='flex justify-end space-x-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50'>
          <Button variant='outline' asChild className='h-9'>
            <Link href={`/admin/careers/talent-pool/${talentId}`}>取消</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving} className='h-9'>
            <Save className='mr-2 h-4 w-4' />
            {saving ? '保存中...' : '保存修改'}
          </Button>
        </div>
      </div>
    </div>
  )
}
