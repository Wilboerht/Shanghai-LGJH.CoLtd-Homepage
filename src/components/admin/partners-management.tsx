'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
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
import { Plus, MoreHorizontal, Edit, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface Partner {
  id: string
  name: string
  logo?: string
  logoText?: string
  website?: string
  description?: string
  category?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  creator?: { name: string }
  updater?: { name: string }
}

const categories = ['技术合作伙伴', '战略合作伙伴', '渠道合作伙伴', '供应商', '客户', '其他']

// 辅助函数：获取Logo颜色对应的CSS类
const getLogoColorClass = (logoColor?: string): string => {
  const colorClasses: Record<string, string> = {
    '#3b82f6': 'bg-blue-600',
    '#ef4444': 'bg-red-500',
    '#10b981': 'bg-emerald-500',
    '#f59e0b': 'bg-amber-500',
    '#8b5cf6': 'bg-violet-500',
    '#06b6d4': 'bg-cyan-500',
    '#84cc16': 'bg-lime-500',
    '#f97316': 'bg-orange-500',
    '#ec4899': 'bg-pink-500',
    '#6366f1': 'bg-indigo-500',
  }

  return logoColor && colorClasses[logoColor] ? colorClasses[logoColor] : 'bg-blue-600'
}

export function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    logoText: '',
    website: '',
    description: '',
    category: '',
    displayOrder: 0,
    isActive: true,
  })

  // 获取合作伙伴列表
  const fetchPartners = async () => {
    try {
      // 获取所有合作伙伴，设置一个较大的limit值
      const response = await fetch('/api/admin/content/partners?limit=100')
      if (response.ok) {
        const data = await response.json()
        setPartners(data.partners)
      }
    } catch (error) {
      console.error('获取合作伙伴失败:', error)
      toast.error('获取合作伙伴失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      logoText: '',
      website: '',
      description: '',
      category: '',
      displayOrder: 0,
      isActive: true,
    })
    setEditingPartner(null)
  }

  // 打开编辑对话框
  const openEditDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner)
      setFormData({
        name: partner.name,
        logo: partner.logo || '',
        logoText: partner.logoText || '',
        website: partner.website || '',
        description: partner.description || '',
        category: partner.category || '',
        displayOrder: partner.displayOrder,
        isActive: partner.isActive,
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  // 保存合作伙伴
  const handleSave = async () => {
    try {
      const url = editingPartner
        ? `/api/admin/content/partners/${editingPartner.id}`
        : '/api/admin/content/partners'

      const method = editingPartner ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingPartner ? '合作伙伴更新成功' : '合作伙伴创建成功')
        setIsDialogOpen(false)
        fetchPartners()
      } else {
        const error = await response.json()
        toast.error(error.error || '操作失败')
      }
    } catch (error) {
      console.error('保存失败:', error)
      toast.error('保存失败')
    }
  }

  // 删除合作伙伴
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个合作伙伴吗？')) return

    try {
      const response = await fetch(`/api/admin/content/partners/${id}`, {
        method: 'DELETE',
        credentials: 'include', // 确保包含session cookies
      })

      if (response.ok) {
        toast.success('合作伙伴删除成功')
        fetchPartners()
      } else {
        const error = await response.json()
        toast.error(error.error || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  // 统计数据
  const getStatsData = () => {
    const total = partners.length
    const active = partners.filter(p => p.isActive).length
    const inactive = total - active
    const categories = [...new Set(partners.map(p => p.category).filter(Boolean))].length

    return { total, active, inactive, categories }
  }

  const stats = getStatsData()

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-2 text-gray-600'>加载合作伙伴中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* 统计卡片 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-blue-600'>{stats.total}</div>
          <div className='text-sm text-gray-600'>总合作伙伴</div>
        </div>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-green-600'>{stats.active}</div>
          <div className='text-sm text-gray-600'>启用中</div>
        </div>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-gray-600'>{stats.inactive}</div>
          <div className='text-sm text-gray-600'>已禁用</div>
        </div>
        <div className='rounded-lg border bg-white p-4'>
          <div className='text-2xl font-bold text-purple-600'>{stats.categories}</div>
          <div className='text-sm text-gray-600'>分类数量</div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900'>合作伙伴列表</h2>
          <p className='text-sm text-gray-600'>管理服务页面的合作伙伴展示</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className='mr-2 h-4 w-4' />
              新增合作伙伴
            </Button>
          </DialogTrigger>
          <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>{editingPartner ? '编辑合作伙伴' : '新增合作伙伴'}</DialogTitle>
              <DialogDescription>
                {editingPartner ? '修改合作伙伴的信息和展示设置' : '添加新的合作伙伴到展示列表'}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name'>合作伙伴名称</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder='请输入合作伙伴名称'
                  />
                </div>
                <div>
                  <Label htmlFor='category'>分类</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='选择分类' />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ImageUpload
                value={formData.logo}
                onChange={url => setFormData({ ...formData, logo: url })}
                label='合作伙伴Logo'
                placeholder='输入Logo图片URL或上传图片'
                helpText='建议使用透明背景的PNG格式图片，尺寸建议为正方形或横向矩形，文件大小不超过5MB'
                accept='image/*'
                maxSize={5}
              />

              <div>
                <Label htmlFor='logoText'>Logo文字（备选）</Label>
                <Input
                  id='logoText'
                  value={formData.logoText}
                  onChange={e => setFormData({ ...formData, logoText: e.target.value })}
                  placeholder='如果没有Logo图片，可输入文字作为备选显示'
                />
              </div>

              <div>
                <Label htmlFor='website'>官网地址</Label>
                <Input
                  id='website'
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  placeholder='请输入官网地址'
                />
              </div>

              <div>
                <Label htmlFor='description'>描述</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder='请输入合作伙伴描述'
                  rows={3}
                />
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
                    placeholder='数字越小越靠前'
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

              <div className='flex justify-end space-x-2 pt-4'>
                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSave}>{editingPartner ? '更新' : '创建'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 合作伙伴列表 */}
      <div className='rounded-lg border bg-white'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>合作伙伴名称</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>官网</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>顺序</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map(partner => (
              <TableRow key={partner.id}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    {partner.logoText && (
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white ${getLogoColorClass(
                          '#3b82f6'
                        )}`}
                      >
                        {partner.logoText}
                      </div>
                    )}
                    {partner.logo && (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className='h-8 w-8 rounded object-contain'
                      />
                    )}
                    {partner.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{partner.category || '未分类'}</Badge>
                </TableCell>
                <TableCell>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-blue-600 hover:text-blue-800'
                    >
                      <ExternalLink className='h-3 w-3' />
                      访问
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={partner.isActive ? 'default' : 'secondary'}>
                    {partner.isActive ? '启用' : '禁用'}
                  </Badge>
                </TableCell>
                <TableCell>{partner.displayOrder}</TableCell>
                <TableCell>{new Date(partner.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => openEditDialog(partner)}>
                        <Edit className='mr-2 h-4 w-4' />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(partner.id)}
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

      {partners.length === 0 && (
        <div className='py-8 text-center'>
          <p className='text-gray-600'>暂无合作伙伴数据</p>
        </div>
      )}
    </div>
  )
}
