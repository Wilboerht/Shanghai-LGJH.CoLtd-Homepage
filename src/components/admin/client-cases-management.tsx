'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, MoreHorizontal, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { ImageUpload } from '@/components/ui/image-upload'
import { MetricsPreview, MetricsSuggestions } from '@/components/admin/metrics-preview'

interface ClientCase {
  id: string
  name: string
  logo?: string
  industry: string
  title: string
  description: string
  image?: string
  metrics?: string
  tags?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  creator?: { name: string }
  updater?: { name: string }
}

const industries = [
  // 基础设施与交通
  '交通运输',
  '机场港口',
  '轨道交通',
  '公路桥梁',
  '城市基建',

  // 制造与工业
  '智能制造',
  '工业4.0',
  '汽车制造',
  '航空航天',
  '新能源',
  '化工石化',

  // 数字经济
  '金融科技',
  '电子商务',
  '互联网',
  '游戏娱乐',
  '数字媒体',
  '人工智能',

  // 公共服务
  '政府机构',
  '公共安全',
  '应急管理',
  '智慧城市',
  '数字政务',

  // 民生服务
  '医疗健康',
  '教育培训',
  '文化旅游',
  '体育健身',
  '社区服务',

  // 商业服务
  '商业综合体',
  '零售连锁',
  '酒店餐饮',
  '物流仓储',
  '房地产',

  // 能源环保
  '电力能源',
  '水务环保',
  '绿色建筑',
  '节能减排',
  '循环经济',

  // 其他
  '园区管理',
  '科技园区',
  '产业园区',
  '其他行业',
]

export function ClientCasesManagement() {
  const [clientCases, setClientCases] = useState<ClientCase[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCase, setEditingCase] = useState<ClientCase | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    title: '',
    description: '',
    image: '',
    metrics: '',
    tags: '',
    displayOrder: 0,
    isActive: true,
  })

  // 新增状态用于友好的输入方式
  const [metricsInputs, setMetricsInputs] = useState([{ label: '', value: '' }])
  const [tagInputs, setTagInputs] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  // 处理指标输入的辅助函数
  const addMetricInput = () => {
    setMetricsInputs([...metricsInputs, { label: '', value: '' }])
  }

  const removeMetricInput = (index: number) => {
    if (metricsInputs.length > 1) {
      setMetricsInputs(metricsInputs.filter((_, i) => i !== index))
    }
  }

  const updateMetricInput = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...metricsInputs]
    updated[index][field] = value
    setMetricsInputs(updated)

    // 同步更新formData.metrics
    const metricsObj: Record<string, string> = {}
    updated.forEach(metric => {
      if (metric.label && metric.value) {
        metricsObj[metric.label] = metric.value
      }
    })
    setFormData(prev => ({ ...prev, metrics: JSON.stringify(metricsObj) }))
  }

  // 处理标签输入的辅助函数
  const addTag = () => {
    if (newTag.trim() && !tagInputs.includes(newTag.trim())) {
      const updatedTags = [...tagInputs, newTag.trim()]
      setTagInputs(updatedTags)
      setFormData(prev => ({ ...prev, tags: updatedTags.join(', ') }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tagInputs.filter(tag => tag !== tagToRemove)
    setTagInputs(updatedTags)
    setFormData(prev => ({ ...prev, tags: updatedTags.join(', ') }))
  }

  // 获取客户案例列表
  const fetchClientCases = async () => {
    try {
      const response = await fetch('/api/admin/content/client-cases')
      if (response.ok) {
        const data = await response.json()
        setClientCases(data.clientCases)
      }
    } catch (error) {
      console.error('获取客户案例失败:', error)
      toast.error('获取客户案例失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientCases()
  }, [])

  // 打开编辑对话框
  const openEditDialog = (clientCase?: ClientCase) => {
    if (clientCase) {
      setEditingCase(clientCase)
      setFormData({
        name: clientCase.name,
        logo: clientCase.logo || '',
        industry: clientCase.industry,
        title: clientCase.title,
        description: clientCase.description,
        image: clientCase.image || '',
        metrics: clientCase.metrics || '',
        tags: clientCase.tags || '',
        displayOrder: clientCase.displayOrder,
        isActive: clientCase.isActive,
      })

      // 初始化指标输入
      try {
        const metricsData = clientCase.metrics ? JSON.parse(clientCase.metrics) : {}
        const metricsArray = Object.entries(metricsData).map(([label, value]) => ({
          label,
          value: String(value),
        }))
        setMetricsInputs(metricsArray.length > 0 ? metricsArray : [{ label: '', value: '' }])
      } catch {
        setMetricsInputs([{ label: '', value: '' }])
      }

      // 初始化标签输入
      const tagsArray = clientCase.tags
        ? clientCase.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
        : []
      setTagInputs(tagsArray)
    } else {
      setEditingCase(null)
      setFormData({
        name: '',
        logo: '',
        industry: '',
        title: '',
        description: '',
        image: '',
        metrics: '',
        tags: '',
        displayOrder: 0,
        isActive: true,
      })

      // 重置友好输入组件状态
      setMetricsInputs([{ label: '', value: '' }])
      setTagInputs([])
      setNewTag('')
    }
    setIsDialogOpen(true)
  }

  // 保存客户案例
  const handleSave = async () => {
    try {
      const url = editingCase
        ? `/api/admin/content/client-cases/${editingCase.id}`
        : '/api/admin/content/client-cases'

      const method = editingCase ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingCase ? '客户案例更新成功' : '客户案例创建成功')
        setIsDialogOpen(false)
        fetchClientCases()
      } else {
        const error = await response.json()
        toast.error(error.error || '操作失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      toast.error('保存失败')
    }
  }

  // 删除客户案例
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个客户案例吗？')) return

    try {
      const response = await fetch(`/api/admin/content/client-cases/${id}`, {
        method: 'DELETE',
        credentials: 'include', // 确保包含session cookies
      })

      if (response.ok) {
        toast.success('客户案例删除成功')
        fetchClientCases()
      } else {
        toast.error('删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-2 text-gray-600'>加载中...</p>
        </div>
      </div>
    )
  }

  // 计算统计数据
  const totalCases = clientCases.length
  const activeCases = clientCases.filter(c => c.isActive).length
  const industryStats = clientCases.reduce(
    (acc, c) => {
      acc[c.industry] = (acc[c.industry] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className='space-y-6'>
      {/* 统计卡片 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-blue-600'>{totalCases}</div>
          <div className='text-sm text-gray-600'>总案例数</div>
        </div>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-green-600'>{activeCases}</div>
          <div className='text-sm text-gray-600'>启用案例</div>
        </div>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-orange-600'>
            {Object.keys(industryStats).length}
          </div>
          <div className='text-sm text-gray-600'>覆盖行业</div>
        </div>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-purple-600'>
            {Object.values(industryStats).length > 0
              ? Math.max(...Object.values(industryStats))
              : 0}
          </div>
          <div className='text-sm text-gray-600'>最多案例行业</div>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold text-gray-900'>客户案例管理</h2>
          <p className='text-gray-600'>
            管理行业实践应用模块的客户案例展示，包括关键指标和成功案例
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className='mr-2 h-4 w-4' />
              新增案例
            </Button>
          </DialogTrigger>
          <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>{editingCase ? '编辑客户案例' : '新增客户案例'}</DialogTitle>
              <DialogDescription>
                {editingCase
                  ? '修改客户案例的详细信息和展示内容'
                  : '添加新的客户成功案例到展示列表'}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name'>客户名称</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder='输入客户名称'
                  />
                </div>
                <div>
                  <Label htmlFor='industry'>行业分类</Label>
                  <div className='relative'>
                    <Input
                      id='industry'
                      value={formData.industry}
                      onChange={e => setFormData({ ...formData, industry: e.target.value })}
                      placeholder='输入或选择行业分类'
                      list='industry-suggestions'
                    />
                    <datalist id='industry-suggestions'>
                      {industries.map(industry => (
                        <option key={industry} value={industry} />
                      ))}
                    </datalist>
                  </div>
                  <p className='mt-1 text-xs text-gray-500'>
                    可以从建议列表中选择，也可以自由输入新的行业分类
                  </p>
                </div>
              </div>

              <ImageUpload
                value={formData.logo}
                onChange={url => setFormData({ ...formData, logo: url })}
                label='客户Logo图片'
                placeholder='输入Logo图片URL或上传图片'
                helpText='建议使用透明背景的PNG格式图片，尺寸建议为正方形，文件大小不超过5MB'
                accept='image/*'
                maxSize={5}
              />

              <div>
                <Label htmlFor='title'>案例标题</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder='输入案例标题'
                />
              </div>

              <div>
                <Label htmlFor='description'>案例描述</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder='输入案例描述'
                  rows={3}
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={url => setFormData({ ...formData, image: url })}
                label='案例图片'
                placeholder='输入案例图片URL或上传图片（可选）'
                helpText='用于在案例展示中显示的图片，建议使用16:9或4:3比例的图片，文件大小不超过5MB'
                accept='image/*'
                maxSize={5}
              />

              <div className='space-y-4'>
                <div>
                  <Label className='text-base font-medium'>关键指标</Label>
                  <p className='mb-3 text-sm text-gray-600'>
                    添加客户案例的关键成果指标，最多支持4个指标
                  </p>

                  <div className='space-y-3'>
                    {metricsInputs.map((metric, index) => (
                      <div key={index} className='flex items-end gap-2'>
                        <div className='flex-1'>
                          <Label htmlFor={`metric-label-${index}`} className='text-sm'>
                            指标名称
                          </Label>
                          <Input
                            id={`metric-label-${index}`}
                            value={metric.label}
                            onChange={e => updateMetricInput(index, 'label', e.target.value)}
                            placeholder='如：效率提升、成本降低'
                          />
                        </div>
                        <div className='flex-1'>
                          <Label htmlFor={`metric-value-${index}`} className='text-sm'>
                            指标数值
                          </Label>
                          <Input
                            id={`metric-value-${index}`}
                            value={metric.value}
                            onChange={e => updateMetricInput(index, 'value', e.target.value)}
                            placeholder='如：80%、200+、24×7'
                          />
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeMetricInput(index)}
                          disabled={metricsInputs.length === 1}
                          className='mb-0'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}

                    {metricsInputs.length < 4 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={addMetricInput}
                        className='w-full'
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        添加指标
                      </Button>
                    )}
                  </div>
                </div>

                {/* 指标预览 */}
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                  <MetricsPreview metricsJson={formData.metrics} />
                  <MetricsSuggestions />
                </div>
              </div>

              <div>
                <Label className='text-base font-medium'>标签</Label>
                <p className='mb-3 text-sm text-gray-600'>
                  为案例添加相关标签，便于分类和搜索（可选）
                </p>

                <div className='space-y-3'>
                  {/* 标签输入 */}
                  <div className='flex gap-2'>
                    <Input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      placeholder='输入新标签'
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={addTag}
                      disabled={!newTag.trim()}
                    >
                      添加
                    </Button>
                  </div>

                  {/* 已添加的标签 */}
                  {tagInputs.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {tagInputs.map((tag, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='flex items-center gap-1 px-2 py-1'
                        >
                          {tag}
                          <button
                            type='button'
                            onClick={() => removeTag(tag)}
                            className='ml-1 hover:text-red-500'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='displayOrder'>显示顺序</Label>
                  <Input
                    id='displayOrder'
                    type='number'
                    value={formData.displayOrder}
                    onChange={e =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <Switch
                    id='isActive'
                    checked={formData.isActive}
                    onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor='isActive'>启用状态</Label>
                </div>
              </div>

              <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSave}>{editingCase ? '更新' : '创建'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='rounded-lg border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>客户名称</TableHead>
              <TableHead>行业</TableHead>
              <TableHead>案例标题</TableHead>
              <TableHead>关键指标</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>顺序</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientCases.map(clientCase => (
              <TableRow key={clientCase.id}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {clientCase.logo ? (
                      <div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white'>
                        <Image
                          src={clientCase.logo}
                          alt={`${clientCase.name} logo`}
                          width={32}
                          height={32}
                          className='h-full w-full object-contain'
                          onError={e => {
                            const target = e.currentTarget as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium">${clientCase.name.charAt(0).toUpperCase()}</div>`
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className='flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-sm font-bold text-gray-600'>
                        {clientCase.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {clientCase.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{clientCase.industry}</Badge>
                </TableCell>
                <TableCell className='max-w-xs truncate'>{clientCase.title}</TableCell>
                <TableCell className='max-w-xs'>
                  {clientCase.metrics ? (
                    <div className='text-sm'>
                      {(() => {
                        try {
                          const metrics = JSON.parse(clientCase.metrics)
                          const entries = Object.entries(metrics).slice(0, 4) // 最多显示4个
                          if (entries.length > 0) {
                            return (
                              <div className='space-y-1'>
                                <div className='flex flex-wrap gap-2'>
                                  {entries.map(([key, value], index) => (
                                    <span
                                      key={index}
                                      className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700'
                                    >
                                      {String(value)} {key}
                                    </span>
                                  ))}
                                </div>
                                {entries.length === 4 && (
                                  <div className='text-xs text-gray-500'>显示前4项指标</div>
                                )}
                              </div>
                            )
                          }
                        } catch {
                          return <span className='text-xs text-red-500'>JSON格式错误</span>
                        }
                        return '无'
                      })()}
                    </div>
                  ) : (
                    <span className='text-gray-400'>无</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={clientCase.isActive ? 'default' : 'secondary'}>
                    {clientCase.isActive ? '启用' : '禁用'}
                  </Badge>
                </TableCell>
                <TableCell>{clientCase.displayOrder}</TableCell>
                <TableCell>{new Date(clientCase.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => openEditDialog(clientCase)}>
                        <Edit className='mr-2 h-4 w-4' />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(clientCase.id)}
                        className='text-red-600'
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
