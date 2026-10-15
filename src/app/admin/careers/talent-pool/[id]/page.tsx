'use client'

import React, { useState, useEffect } from 'react'
import '@/styles/talent-pool.css'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Star,
  // Phone,
  // Mail,
  // MapPin,
  // Briefcase,
  // Calendar,
  Download,
  Edit,
  MessageSquare,
  Plus,
  // User,
  // Building,
  // DollarSign,
  // Clock,
  // FileText,
  Trash2,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface TalentDetail {
  id: string
  applicantName: string
  email: string
  phone?: string
  introduction?: string
  resumeUrl?: string
  resumeName?: string
  resumeType?: string
  resumeSize?: number
  originalApplication: {
    id: string
    jobTitle?: string
    department?: string
    location?: string
    jobType?: string
    experience?: string
    salary?: string
    status: string
    appliedAt: string
  }
  currentPosition?: string
  currentCompany?: string
  expectedSalary?: string
  availability: string
  rating?: number
  tags: string[]
  notes?: string
  addedReason?: string
  lastContactAt?: string
  nextFollowUp?: string
  addedBy: string
  addedByEmail: string
  createdAt: string
  updatedAt: string
  interactions: Array<{
    id: string
    type: string
    content: string
    nextAction?: string
    scheduledAt?: string
    createdBy: string
    createdAt: string
  }>
}

export default function TalentDetailPage() {
  const params = useParams()
  const [talent, setTalent] = useState<TalentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddInteraction, setShowAddInteraction] = useState(false)
  const [interactionForm, setInteractionForm] = useState({
    type: 'NOTE',
    content: '',
  })

  const fetchTalentDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/talent-pool/${params.id}`)
      if (response.ok) {
        const result = await response.json()
        setTalent(result.talent)
      } else {
        console.error('获取人才详情失败')
      }
    } catch (_error) {
      console.error('获取人才详情失败:', _error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchTalentDetail()
    }
  }, [params.id])

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return <Badge className='availability-badge availability-available'>可联系</Badge>
      case 'CONTACTED':
        return <Badge className='availability-badge availability-contacted'>已联系</Badge>
      case 'BUSY':
        return <Badge className='availability-badge availability-busy'>忙碌中</Badge>
      case 'NOT_LOOKING':
        return <Badge className='availability-badge availability-not-looking'>暂不考虑</Badge>
      case 'BLACKLIST':
        return <Badge className='availability-badge availability-blacklist'>黑名单</Badge>
      default:
        return <Badge variant='outline'>{availability}</Badge>
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`rating-star h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInteractionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      EMAIL: '邮件沟通',
      PHONE: '电话沟通',
      INTERVIEW: '面试',
      NOTE: '备注记录',
      FOLLOW_UP: '跟进记录',
    }
    return typeMap[type] || type
  }

  const handleAddInteraction = async () => {
    if (!interactionForm.content.trim()) {
      alert('请填写互动内容')
      return
    }

    try {
      const response = await fetch(`/api/admin/talent-pool/${params.id}/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interactionForm),
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        setShowAddInteraction(false)
        setInteractionForm({
          type: 'NOTE',
          content: '',
        })
        fetchTalentDetail() // 重新加载数据
      } else {
        const error = await response.json()
        alert(`添加失败: ${error.error}`)
      }
    } catch (_error) {
      console.error('添加互动记录失败:', _error)
      alert('操作失败，请重试')
    }
  }

  const handleDeleteInteraction = async (interactionId: string) => {
    if (!confirm('确定要删除这条互动记录吗？')) {
      return
    }

    try {
      const response = await fetch(
        `/api/admin/talent-pool/${params.id}/interactions/${interactionId}`,
        {
          method: 'DELETE',
        }
      )

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        fetchTalentDetail() // 重新加载数据
      } else {
        const error = await response.json()
        alert(`删除失败: ${error.error}`)
      }
    } catch (_error) {
      console.error('删除互动记录失败:', _error)
      alert('操作失败，请重试')
    }
  }

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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* 简洁的头部导航 */}
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' size='sm' asChild>
              <Link href='/admin/careers/talent-pool'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                返回
              </Link>
            </Button>
            <div>
              <div className='flex items-center gap-3'>
                <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                  {talent.applicantName}
                </h1>
                {getAvailabilityBadge(talent.availability)}
                {renderStars(talent.rating)}
              </div>
              <p className='mt-1 text-sm text-gray-500'>
                {talent.currentPosition && talent.currentCompany
                  ? `${talent.currentPosition} @ ${talent.currentCompany}`
                  : talent.originalApplication.jobTitle}
              </p>
            </div>
          </div>
          <Button asChild size='sm'>
            <Link href={`/admin/careers/talent-pool/${talent.id}/edit`}>
              <Edit className='mr-2 h-4 w-4' />
              编辑
            </Link>
          </Button>
        </div>

        {/* 实用主义的内容布局 */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* 主要信息区域 */}
          <div className='space-y-6 lg:col-span-2'>
            {/* 基本信息 - 紧凑的信息展示 */}
            <div className='overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
              <div className='border-b border-gray-100 px-6 py-4 dark:border-gray-700'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>基本信息</h2>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {/* 联系信息 */}
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                      <span className='text-sm font-medium text-gray-500'>邮箱</span>
                      <span className='text-sm text-gray-900 dark:text-white'>{talent.email}</span>
                    </div>
                    {talent.phone && (
                      <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                        <span className='text-sm font-medium text-gray-500'>电话</span>
                        <span className='text-sm text-gray-900 dark:text-white'>
                          {talent.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 职业信息 */}
                  <div className='space-y-3'>
                    {talent.currentCompany && (
                      <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                        <span className='text-sm font-medium text-gray-500'>当前公司</span>
                        <span className='text-sm text-gray-900 dark:text-white'>
                          {talent.currentCompany}
                        </span>
                      </div>
                    )}
                    {talent.currentPosition && (
                      <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                        <span className='text-sm font-medium text-gray-500'>当前职位</span>
                        <span className='text-sm text-gray-900 dark:text-white'>
                          {talent.currentPosition}
                        </span>
                      </div>
                    )}
                    {talent.expectedSalary && (
                      <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                        <span className='text-sm font-medium text-gray-500'>期望薪资</span>
                        <span className='text-sm text-gray-900 dark:text-white'>
                          {talent.expectedSalary}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 技能标签 */}
                {talent.tags.length > 0 && (
                  <div className='mt-6 border-t border-gray-100 pt-4 dark:border-gray-700'>
                    <div className='mb-3 flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-500'>技能标签</span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {talent.tags.map((tag, index) => (
                        <Badge key={index} variant='secondary' className='text-xs'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 简历下载 */}
                {talent.resumeUrl && (
                  <div className='mt-6 border-t border-gray-100 pt-4 dark:border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium text-gray-500'>简历文件</span>
                      <Button variant='outline' size='sm' asChild>
                        <a href={talent.resumeUrl} target='_blank' rel='noopener noreferrer'>
                          <Download className='mr-2 h-4 w-4' />
                          下载
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 自我介绍 */}
            {talent.introduction && (
              <div className='overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
                <div className='border-b border-gray-100 px-6 py-4 dark:border-gray-700'>
                  <h2 className='text-lg font-medium text-gray-900 dark:text-white'>自我介绍</h2>
                </div>
                <div className='p-6'>
                  <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
                    {talent.introduction}
                  </p>
                </div>
              </div>
            )}

            {/* 原申请信息 */}
            <div className='overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
              <div className='border-b border-gray-100 px-6 py-4 dark:border-gray-700'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>原申请信息</h2>
              </div>
              <div className='p-6'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                    <span className='text-sm font-medium text-gray-500'>申请职位</span>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {talent.originalApplication.jobTitle || '未知职位'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                    <span className='text-sm font-medium text-gray-500'>工作地点</span>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {talent.originalApplication.location || '未知地点'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                    <span className='text-sm font-medium text-gray-500'>所属部门</span>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {talent.originalApplication.department || '未知部门'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between py-2'>
                    <span className='text-sm font-medium text-gray-500'>申请时间</span>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {formatDate(talent.originalApplication.appliedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：操作面板 */}
          <div className='space-y-6'>
            {/* 管理信息 */}
            <div className='overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
              <div className='border-b border-gray-100 px-6 py-4 dark:border-gray-700'>
                <h2 className='text-lg font-medium text-gray-900 dark:text-white'>管理信息</h2>
              </div>
              <div className='p-6'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                    <span className='text-sm font-medium text-gray-500'>添加人</span>
                    <span className='text-sm text-gray-900 dark:text-white'>{talent.addedBy}</span>
                  </div>
                  <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                    <span className='text-sm font-medium text-gray-500'>加入时间</span>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {formatDate(talent.createdAt)}
                    </span>
                  </div>
                  {talent.lastContactAt && (
                    <div className='flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700'>
                      <span className='text-sm font-medium text-gray-500'>最后联系</span>
                      <span className='text-sm text-gray-900 dark:text-white'>
                        {formatDate(talent.lastContactAt)}
                      </span>
                    </div>
                  )}
                  {talent.nextFollowUp && (
                    <div className='flex items-center justify-between py-2'>
                      <span className='text-sm font-medium text-gray-500'>下次跟进</span>
                      <span
                        className={`text-sm font-medium ${
                          new Date(talent.nextFollowUp) <= new Date()
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {formatDate(talent.nextFollowUp)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 备注信息 */}
            {talent.notes && (
              <div className='overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
                <div className='border-b border-gray-100 px-6 py-4 dark:border-gray-700'>
                  <h2 className='text-lg font-medium text-gray-900 dark:text-white'>备注信息</h2>
                </div>
                <div className='p-6'>
                  <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
                    {talent.notes}
                  </p>
                </div>
              </div>
            )}
            {/* 互动记录 */}
            <div className='overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
              <div className='border-b border-gray-100 px-6 py-4 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <h2 className='text-lg font-medium text-gray-900 dark:text-white'>互动记录</h2>
                    <Badge variant='secondary' className='text-xs'>
                      {talent.interactions.length} 条
                    </Badge>
                  </div>
                  <Dialog open={showAddInteraction} onOpenChange={setShowAddInteraction}>
                    <DialogTrigger asChild>
                      <Button size='sm'>
                        <Plus className='mr-2 h-4 w-4' />
                        添加记录
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>添加互动记录</DialogTitle>
                        <DialogDescription>
                          记录与 {talent.applicantName} 的沟通情况
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div className='space-y-2'>
                          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            互动类型
                          </label>
                          <Select
                            value={interactionForm.type}
                            onValueChange={value =>
                              setInteractionForm(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='选择互动类型' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='EMAIL'>📧 邮件沟通</SelectItem>
                              <SelectItem value='PHONE'>📞 电话沟通</SelectItem>
                              <SelectItem value='INTERVIEW'>🎯 面试记录</SelectItem>
                              <SelectItem value='NOTE'>📝 备注记录</SelectItem>
                              <SelectItem value='FOLLOW_UP'>🔄 跟进记录</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-2'>
                          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            互动内容
                          </label>
                          <Textarea
                            placeholder='请详细描述沟通内容、讨论要点、达成的共识等...'
                            value={interactionForm.content}
                            onChange={e =>
                              setInteractionForm(prev => ({ ...prev, content: e.target.value }))
                            }
                            rows={4}
                            className='resize-none'
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant='outline' onClick={() => setShowAddInteraction(false)}>
                          取消
                        </Button>
                        <Button onClick={handleAddInteraction}>添加记录</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className='max-h-64 overflow-y-auto'>
                {talent.interactions.length === 0 ? (
                  <div className='px-6 py-12 text-center'>
                    <MessageSquare className='mx-auto mb-4 h-12 w-12 text-gray-300' />
                    <p className='mb-2 text-sm text-gray-500'>暂无互动记录</p>
                    <p className='text-xs text-gray-400'>
                      点击上方"添加记录"按钮开始记录与候选人的沟通
                    </p>
                  </div>
                ) : (
                  <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                    {talent.interactions.map((interaction, index) => (
                      <div
                        key={interaction.id}
                        className='px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30'
                      >
                        {/* 互动头部 */}
                        <div className='mb-3 flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <Badge variant='outline' className='text-xs font-medium'>
                              {getInteractionTypeLabel(interaction.type)}
                            </Badge>
                            <span className='text-xs text-gray-500'>
                              {formatDate(interaction.createdAt)}
                            </span>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteInteraction(interaction.id)}
                            className='h-6 w-6 p-0 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20'
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>

                        {/* 互动内容 */}
                        <div className='whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-gray-100'>
                          {interaction.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
