'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import '@/styles/talent-pool.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  Phone,
  Mail,
  Users,
  Clock,
  UserCheck,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  X,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

interface TalentPoolItem {
  id: string
  applicantName: string
  email: string
  phone?: string
  jobTitle?: string
  department?: string
  location?: string
  currentPosition?: string
  currentCompany?: string
  expectedSalary?: string
  availability: 'AVAILABLE' | 'BUSY' | 'NOT_LOOKING' | 'CONTACTED' | 'BLACKLIST'
  rating?: number
  tags: string[]
  notes?: string
  addedReason?: string
  lastContactAt?: string
  nextFollowUp?: string
  interactionCount: number
  addedBy: string
  createdAt: string
  updatedAt: string
  resumeUrl?: string
}

interface TalentPoolData {
  talents: TalentPoolItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: {
    total: number
    availability: Record<string, number>
    rating: Record<number, number>
    averageRating: number
  }
}

export default function TalentPoolPage() {
  const [data, setData] = useState<TalentPoolData | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const isFirstLoad = useRef(true)

  // 修复滚动条消失问题
  useEffect(() => {
    // 强制保持滚动条
    document.documentElement.style.overflowY = 'scroll'
    document.body.style.overflowY = 'scroll'

    return () => {
      // 清理
      document.documentElement.style.overflowY = ''
      document.body.style.overflowY = ''
    }
  }, [])

  // 导出功能
  const handleExport = () => {
    if (selectedRows.length === 0) return

    try {
      // 获取选中的人才数据
      const selectedTalents = data?.talents.filter(talent => selectedRows.includes(talent.id)) || []

      // 准备导出数据 - 包含核心字段
      const exportData = selectedTalents.map(talent => ({
        姓名: talent.applicantName,
        邮箱: talent.email || '',
        电话: talent.phone || '',
        应聘职位: talent.jobTitle || '',
        部门: talent.department || '',
        工作地点: talent.location || '',
        当前职位: talent.currentPosition || '',
        当前公司: talent.currentCompany || '',
        期望薪资: talent.expectedSalary || '',
        可联系状态: getAvailabilityText(talent.availability),
        评级: talent.rating ? `${talent.rating}星` : '',
        技能标签: talent.tags ? talent.tags.join(', ') : '',
        备注: talent.notes || '',
        最后联系时间: talent.lastContactAt
          ? new Date(talent.lastContactAt).toLocaleDateString('zh-CN')
          : '',
        下次跟进时间: talent.nextFollowUp
          ? new Date(talent.nextFollowUp).toLocaleDateString('zh-CN')
          : '',
        互动次数: talent.interactionCount || 0,
        创建时间: new Date(talent.createdAt).toLocaleDateString('zh-CN'),
        更新时间: new Date(talent.updatedAt).toLocaleDateString('zh-CN'),
      }))

      // 转换为CSV格式
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => `"${(row as any)[header] || ''}"`).join(',')
        ),
      ].join('\n')

      // 创建下载链接
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `人才储备库_${new Date().toLocaleDateString('zh-CN')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 清除选择
      setSelectedRows([])
      setSelectAll(false)
    } catch (_error) {
      console.error('导出失败:', _error)
      alert('导出失败，请重试')
    }
  }

  // 获取状态文本
  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return '可联系'
      case 'CONTACTED':
        return '已联系'
      case 'BUSY':
        return '忙碌中'
      case 'NOT_LOOKING':
        return '暂不考虑'
      default:
        return availability
    }
  }

  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500) // 0.5秒 防抖延迟，快速响应

    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchTalents = useCallback(async () => {
    // 使用ref来检查是否是初次加载
    if (isFirstLoad.current) {
      setInitialLoading(true)
    } else {
      setSearching(true)
    }

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(availabilityFilter !== 'all' && { availability: availabilityFilter }),
        ...(ratingFilter !== 'all' && { rating: ratingFilter }),
        ...(departmentFilter !== 'all' && { department: departmentFilter }),
      })

      const response = await fetch(`/api/admin/talent-pool?${params}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
        isFirstLoad.current = false // 标记已完成首次加载
      } else {
        console.error('获取人才储备库数据失败')
      }
    } catch (_error) {
      console.error('获取人才储备库数据失败:', _error)
    } finally {
      setInitialLoading(false)
      setSearching(false)
    }
  }, [
    debouncedSearchTerm,
    availabilityFilter,
    ratingFilter,
    departmentFilter,
    page,
    sortBy,
    sortOrder,
  ])

  useEffect(() => {
    fetchTalents()
  }, [fetchTalents])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className='ml-1 h-3 w-3 text-gray-400' />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className='ml-1 h-3 w-3 text-blue-600' />
    ) : (
      <ArrowDown className='ml-1 h-3 w-3 text-blue-600' />
    )
  }

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

  const _formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // 删除单个人才记录
  const handleDeleteTalent = async (talentId: string, talentName: string) => {
    if (!confirm(`确定要删除 ${talentName} 的记录吗？此操作不可撤销。`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/talent-pool/${talentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // 删除成功，重新获取数据
        await fetchTalents()
        alert('删除成功')
      } else {
        const error = await response.json()
        alert(`删除失败: ${error.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('删除人才记录失败:', error)
      alert('删除失败，请重试')
    }
  }

  // 批量删除人才记录
  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) return

    if (!confirm(`确定要删除选中的 ${selectedRows.length} 项记录吗？此操作不可撤销。`)) {
      return
    }

    try {
      // 并行删除所有选中的记录
      const deletePromises = selectedRows.map(talentId =>
        fetch(`/api/admin/talent-pool/${talentId}`, {
          method: 'DELETE',
        })
      )

      const responses = await Promise.all(deletePromises)

      // 检查是否所有删除都成功
      const failedDeletes = responses.filter(response => !response.ok)

      if (failedDeletes.length === 0) {
        // 全部删除成功
        setSelectedRows([])
        setSelectAll(false)
        await fetchTalents()
        alert(`成功删除 ${selectedRows.length} 项记录`)
      } else {
        // 部分删除失败
        const successCount = responses.length - failedDeletes.length
        await fetchTalents()
        alert(`删除完成：成功 ${successCount} 项，失败 ${failedDeletes.length} 项`)
      }
    } catch (error) {
      console.error('批量删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  if (initialLoading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <div className='loading-spinner mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600'></div>
              <p className='mt-4 text-lg text-gray-600 dark:text-gray-400'>加载人才数据中...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white dark:bg-gray-950'>
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>人才储备库</h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            共 {data?.stats?.total || 0} 位候选人
          </p>
        </div>

        <div className='mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <div className='rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm dark:border-gray-800 dark:bg-gray-900'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>总人才</p>
                <p className='text-2xl font-semibold text-gray-900 dark:text-white'>
                  {data?.stats?.total || 0}
                </p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20'>
                <Users className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm dark:border-gray-800 dark:bg-gray-900'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>可联系</p>
                <p className='text-2xl font-semibold text-green-600 dark:text-green-400'>
                  {data?.stats?.availability?.AVAILABLE || 0}
                </p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20'>
                <UserCheck className='h-5 w-5 text-green-600 dark:text-green-400' />
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm dark:border-gray-800 dark:bg-gray-900'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>平均评级</p>
                <p className='text-2xl font-semibold text-yellow-600 dark:text-yellow-400'>
                  {data?.stats?.averageRating?.toFixed(1) || '0.0'}
                </p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20'>
                <Star className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm dark:border-gray-800 dark:bg-gray-900'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>待跟进</p>
                <p className='text-2xl font-semibold text-orange-600 dark:text-orange-400'>
                  {data?.talents?.filter(
                    t => t.nextFollowUp && new Date(t.nextFollowUp) <= new Date()
                  ).length || 0}
                </p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20'>
                <Clock className='h-5 w-5 text-orange-600 dark:text-orange-400' />
              </div>
            </div>
          </div>
        </div>

        <div className='mb-6 flex flex-col gap-4 sm:flex-row'>
          <div className='relative max-w-md flex-1'>
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                searching ? 'animate-pulse text-blue-500' : 'text-gray-400'
              }`}
            />
            <Input
              placeholder='搜索姓名、邮箱、技能...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='rounded-lg border-gray-200 bg-white pl-10 dark:border-gray-700 dark:bg-gray-900'
            />
            {searching && (
              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600'></div>
              </div>
            )}
          </div>
          <div className='flex items-center space-x-3'>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className='w-36 rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'>
                <SelectValue placeholder='筛选状态' />
              </SelectTrigger>
              <SelectContent
                className='z-50 max-h-60 overflow-y-auto'
                side='bottom'
                align='start'
                sideOffset={4}
              >
                <SelectItem value='all'>全部状态</SelectItem>
                <SelectItem value='AVAILABLE'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                    <span>可联系</span>
                  </div>
                </SelectItem>
                <SelectItem value='CONTACTED'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                    <span>已联系</span>
                  </div>
                </SelectItem>
                <SelectItem value='BUSY'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                    <span>忙碌中</span>
                  </div>
                </SelectItem>
                <SelectItem value='NOT_LOOKING'>
                  <div className='flex items-center space-x-2'>
                    <div className='h-2 w-2 rounded-full bg-gray-500'></div>
                    <span>暂不考虑</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className='w-36 rounded-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'>
                <SelectValue placeholder='筛选评级' />
              </SelectTrigger>
              <SelectContent
                className='z-50 max-h-60 overflow-y-auto'
                side='bottom'
                align='start'
                sideOffset={4}
              >
                <SelectItem value='all'>全部评级</SelectItem>
                <SelectItem value='5'>
                  <div className='flex items-center space-x-2 whitespace-nowrap'>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      ))}
                    </div>
                    <span className='whitespace-nowrap'>5星</span>
                  </div>
                </SelectItem>
                <SelectItem value='4'>
                  <div className='flex items-center space-x-2 whitespace-nowrap'>
                    <div className='flex'>
                      {[1, 2, 3, 4].map(i => (
                        <Star key={i} className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      ))}
                      <Star className='h-3 w-3 text-gray-300' />
                    </div>
                    <span className='whitespace-nowrap'>4星</span>
                  </div>
                </SelectItem>
                <SelectItem value='3'>
                  <div className='flex items-center space-x-2 whitespace-nowrap'>
                    <div className='flex'>
                      {[1, 2, 3].map(i => (
                        <Star key={i} className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      ))}
                      {[4, 5].map(i => (
                        <Star key={i} className='h-3 w-3 text-gray-300' />
                      ))}
                    </div>
                    <span className='whitespace-nowrap'>3星</span>
                  </div>
                </SelectItem>
                <SelectItem value='2'>
                  <div className='flex items-center space-x-2 whitespace-nowrap'>
                    <div className='flex'>
                      {[1, 2].map(i => (
                        <Star key={i} className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      ))}
                      {[3, 4, 5].map(i => (
                        <Star key={i} className='h-3 w-3 text-gray-300' />
                      ))}
                    </div>
                    <span className='whitespace-nowrap'>2星</span>
                  </div>
                </SelectItem>
                <SelectItem value='1'>
                  <div className='flex items-center space-x-2 whitespace-nowrap'>
                    <div className='flex'>
                      <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      {[2, 3, 4, 5].map(i => (
                        <Star key={i} className='h-3 w-3 text-gray-300' />
                      ))}
                    </div>
                    <span className='whitespace-nowrap'>1星</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'>
          <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-800'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>人才列表</h2>
                {searching && (
                  <div className='flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400'>
                    <div className='h-3 w-3 animate-spin rounded-full border border-blue-200 border-t-blue-600'></div>
                    <span>搜索中...</span>
                  </div>
                )}
              </div>
              {selectedRows.length > 0 && (
                <span className='text-sm text-blue-600 dark:text-blue-400'>
                  {selectedRows.length} 项已选择
                </span>
              )}
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-800/50'>
                <tr>
                  <th className='w-12 px-4 py-3 text-center'>
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={checked => {
                        setSelectAll(!!checked)
                        if (checked) {
                          setSelectedRows(data?.talents.map(t => t.id) || [])
                        } else {
                          setSelectedRows([])
                        }
                      }}
                    />
                  </th>
                  <th className='w-16 px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300'>
                    #
                  </th>
                  <th
                    className='cursor-pointer px-4 py-3 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    onClick={() => handleSort('applicantName')}
                  >
                    <div className='flex items-center justify-center space-x-1'>
                      <span>姓名</span>
                      {getSortIcon('applicantName')}
                    </div>
                  </th>
                  <th
                    className='cursor-pointer px-4 py-3 text-center text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    onClick={() => handleSort('availability')}
                  >
                    <div className='flex items-center justify-center space-x-1'>
                      <span>状态</span>
                      {getSortIcon('availability')}
                    </div>
                  </th>
                  <th className='px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300'>
                    联系方式
                  </th>
                  <th className='px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300'>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                {data?.talents.map((talent, index) => (
                  <tr
                    key={talent.id}
                    className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  >
                    <td className='px-4 py-4 text-center'>
                      <Checkbox
                        checked={selectedRows.includes(talent.id)}
                        onCheckedChange={checked => {
                          if (checked) {
                            setSelectedRows([...selectedRows, talent.id])
                          } else {
                            setSelectedRows(selectedRows.filter(id => id !== talent.id))
                            setSelectAll(false)
                          }
                        }}
                      />
                    </td>
                    <td className='px-4 py-4 text-center font-mono text-sm text-gray-400 dark:text-gray-500'>
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className='px-4 py-4 text-center'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {talent.applicantName}
                      </div>
                    </td>
                    <td className='px-4 py-4 text-center'>
                      {getAvailabilityBadge(talent.availability)}
                    </td>
                    <td className='px-4 py-4 text-center'>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-center text-sm text-gray-900 dark:text-white'>
                          <Mail className='mr-1 h-3 w-3 text-blue-600' />
                          <span className='truncate'>{talent.email}</span>
                        </div>
                        {talent.phone && (
                          <div className='flex items-center justify-center text-sm text-gray-600 dark:text-gray-400'>
                            <Phone className='mr-1 h-3 w-3 text-green-600' />
                            {talent.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-4 text-center'>
                      <div className='flex items-center justify-center space-x-1'>
                        <Button asChild variant='outline' size='sm' title='查看详情'>
                          <Link href={`/admin/careers/talent-pool/${talent.id}`}>
                            <Eye className='h-3 w-3' />
                          </Link>
                        </Button>
                        <Button asChild variant='outline' size='sm' title='编辑信息'>
                          <Link href={`/admin/careers/talent-pool/${talent.id}/edit`}>
                            <Edit className='h-3 w-3' />
                          </Link>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          title='删除记录'
                          className='border-red-200 text-red-600 hover:bg-red-50'
                          onClick={() => handleDeleteTalent(talent.id, talent.applicantName)}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data?.talents.length === 0 && (
              <div className='py-12 text-center'>
                <Users className='mx-auto mb-4 h-12 w-12 text-gray-300' />
                <p className='text-gray-500'>暂无人才数据</p>
                <p className='mt-1 text-sm text-gray-400'>请调整筛选条件或添加新的人才</p>
              </div>
            )}
          </div>
        </div>

        {data && data.pagination.pages > 1 && (
          <div className='mt-8 flex items-center justify-between'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              第 {page} 页，共 {data.pagination.pages} 页
            </p>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className='h-8 px-3 text-sm'
              >
                上一页
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage(Math.min(data.pagination.pages, page + 1))}
                disabled={page === data.pagination.pages}
                className='h-8 px-3 text-sm'
              >
                下一页
              </Button>
            </div>
          </div>
        )}

        {/* 悬浮的批量操作工具栏 */}
        {selectedRows.length > 0 && (
          <div className='fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform'>
            <div className='rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800'>
              <div className='flex items-center space-x-6'>
                <div className='flex items-center space-x-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                    <span className='text-sm font-semibold text-blue-600 dark:text-blue-400'>
                      {selectedRows.length}
                    </span>
                  </div>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    已选择 {selectedRows.length} 项
                  </span>
                </div>

                <div className='h-6 w-px bg-gray-200 dark:bg-gray-600'></div>

                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 text-xs'
                    onClick={handleExport}
                    disabled={selectedRows.length === 0}
                  >
                    <Download className='mr-1 h-3 w-3' />
                    导出
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 border-red-200 text-xs text-red-600 hover:bg-red-50'
                    onClick={handleBatchDelete}
                  >
                    <Trash2 className='mr-1 h-3 w-3' />
                    删除
                  </Button>
                </div>

                <div className='h-6 w-px bg-gray-200 dark:bg-gray-600'></div>

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setSelectedRows([])
                    setSelectAll(false)
                  }}
                  className='h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  title='取消选择'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
