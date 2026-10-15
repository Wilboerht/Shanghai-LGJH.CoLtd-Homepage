'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Building,
  Clock,
  User,
  Search,
  Filter,
  RefreshCw,
  Star,
  Eye,
  MoreHorizontal,
} from 'lucide-react'

interface CompanyLocation {
  id: string
  name: string
  type: string
  address: string
  phone?: string
  email?: string
  longitude?: number
  latitude?: number
  description?: string
  isDefault: boolean
  isActive: boolean
  sortOrder: number
  businessHours?: any
  contactPerson?: string
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const LOCATION_TYPES = {
  HEADQUARTERS: '总部',
  BRANCH: '分公司',
  OFFICE: '办公室',
  SHOWROOM: '展厅',
  WAREHOUSE: '仓库',
  FACTORY: '工厂',
  SERVICE_CENTER: '服务中心',
  OTHER: '其他',
}

const LOCATION_TYPE_COLORS = {
  HEADQUARTERS: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  BRANCH: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  OFFICE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  SHOWROOM: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  WAREHOUSE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  FACTORY: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
  SERVICE_CENTER: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300',
  OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<CompanyLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<CompanyLocation | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // 分页和筛选
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    isActive: 'all',
    sortBy: 'sortOrder',
    sortOrder: 'asc',
  })

  // 新地址表单
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'OFFICE',
    address: '',
    phone: '',
    email: '',
    longitude: '',
    latitude: '',
    description: '',
    isDefault: false,
    isActive: true,
    sortOrder: 0,
    contactPerson: '',
    businessHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { closed: true },
      sunday: { closed: true },
    },
  })

  // 获取地址列表
  const fetchLocations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.type && filters.type !== 'all') params.append('type', filters.type)
      if (filters.isActive && filters.isActive !== 'all')
        params.append('isActive', filters.isActive)

      const response = await fetch(`/api/admin/locations?${params}`)
      if (!response.ok) throw new Error('获取数据失败')

      const data = await response.json()
      setLocations(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error('获取地址列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 创建地址
  const createLocation = async () => {
    setSaving(true)
    try {
      const locationData = {
        ...newLocation,
        longitude: newLocation.longitude ? parseFloat(newLocation.longitude) : undefined,
        latitude: newLocation.latitude ? parseFloat(newLocation.latitude) : undefined,
      }

      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建失败')
      }

      await fetchLocations()
      setIsAddDialogOpen(false)
      resetNewLocationForm()
    } catch (error) {
      console.error('创建地址失败:', error)
      alert(error instanceof Error ? error.message : '创建地址失败')
    } finally {
      setSaving(false)
    }
  }

  // 重置新地址表单
  const resetNewLocationForm = () => {
    setNewLocation({
      name: '',
      type: 'OFFICE',
      address: '',
      phone: '',
      email: '',
      longitude: '',
      latitude: '',
      description: '',
      isDefault: false,
      isActive: true,
      sortOrder: 0,
      contactPerson: '',
      businessHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { closed: true },
        sunday: { closed: true },
      },
    })
  }

  // 删除地址
  const deleteLocation = async (id: string) => {
    if (!confirm('确定要删除这个地址吗？')) return

    try {
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '删除失败')
      }

      await fetchLocations()
    } catch (error) {
      console.error('删除地址失败:', error)
      alert(error instanceof Error ? error.message : '删除地址失败')
    }
  }

  // 切换地址状态
  const toggleLocationStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) throw new Error('更新失败')

      await fetchLocations()
    } catch (error) {
      console.error('更新地址状态失败:', error)
    }
  }

  // 编辑地址
  const updateLocation = async (id: string, data: any) => {
    setSaving(true)
    try {
      console.log('Sending update data:', JSON.stringify(data, null, 2)) // 调试信息
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('API Error:', JSON.stringify(error, null, 2)) // 调试信息
        console.error('Validation details:', error.details) // 详细验证错误
        throw new Error(error.message || '更新地址失败')
      }

      await fetchLocations()
    } catch (error) {
      console.error('更新地址失败:', error)
      throw error
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [pagination.page, filters])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  // 编辑表单组件
  const EditLocationForm = ({
    location,
    onSuccess,
    onCancel,
  }: {
    location: CompanyLocation
    onSuccess: () => void
    onCancel: () => void
  }) => {
    // 使用独立的状态管理编辑表单
    const [formData, setFormData] = useState({
      name: '',
      type: 'OFFICE',
      address: '',
      phone: '',
      email: '',
      longitude: '',
      latitude: '',
      description: '',
      isDefault: false,
      isActive: true,
      sortOrder: 0,
      contactPerson: '',
      businessHours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { closed: true },
        sunday: { closed: true },
      },
    })

    // 初始化编辑表单数据
    useEffect(() => {
      if (location && location.id && location.type) {
        console.log('Location data:', location)
        console.log('Location type:', location.type)
        console.log('Available types:', Object.keys(LOCATION_TYPES))

        const newFormData = {
          name: location.name,
          type: location.type,
          address: location.address,
          phone: location.phone || '',
          email: location.email || '',
          longitude: location.longitude?.toString() || '',
          latitude: location.latitude?.toString() || '',
          description: location.description || '',
          isDefault: location.isDefault,
          isActive: location.isActive,
          sortOrder: location.sortOrder,
          contactPerson: location.contactPerson || '',
          businessHours: (() => {
            try {
              return typeof location.businessHours === 'string'
                ? JSON.parse(location.businessHours)
                : location.businessHours || {
                    monday: { open: '09:00', close: '18:00' },
                    tuesday: { open: '09:00', close: '18:00' },
                    wednesday: { open: '09:00', close: '18:00' },
                    thursday: { open: '09:00', close: '18:00' },
                    friday: { open: '09:00', close: '18:00' },
                    saturday: { closed: true },
                    sunday: { closed: true },
                  }
            } catch (e) {
              console.warn('Failed to parse businessHours:', e)
              return {
                monday: { open: '09:00', close: '18:00' },
                tuesday: { open: '09:00', close: '18:00' },
                wednesday: { open: '09:00', close: '18:00' },
                thursday: { open: '09:00', close: '18:00' },
                friday: { open: '09:00', close: '18:00' },
                saturday: { closed: true },
                sunday: { closed: true },
              }
            }
          })(),
        }

        console.log('Setting form data:', newFormData)
        setFormData(newFormData)
      }
    }, [location?.id]) // 只依赖location.id

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!formData.name.trim() || !formData.address.trim()) {
        alert('请填写必填字段')
        return
      }

      try {
        const data = {
          ...formData,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        }

        await updateLocation(location.id, data)
        onSuccess()
      } catch (error) {
        alert(error instanceof Error ? error.message : '更新地址失败')
      }
    }

    return (
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label htmlFor='edit-name'>地址名称 *</Label>
            <Input
              id='edit-name'
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder='如：总部、上海分公司'
              required
            />
          </div>

          <div>
            <Label htmlFor='edit-type'>地址类型</Label>
            <Select
              key={`select-${location?.id}-${formData.type}`} // 强制重新渲染
              value={formData.type}
              onValueChange={value => {
                console.log('Type changed to:', value)
                setFormData(prev => ({ ...prev, type: value }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='选择地址类型' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOCATION_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              当前值: {formData.type} | 显示:{' '}
              {formData.type && LOCATION_TYPES[formData.type as keyof typeof LOCATION_TYPES]}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor='edit-address'>详细地址 *</Label>
          <Textarea
            id='edit-address'
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder='请输入详细地址'
            rows={2}
            required
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label htmlFor='edit-phone'>联系电话</Label>
            <Input
              id='edit-phone'
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder='+86 138xxxxxxxx'
            />
          </div>

          <div>
            <Label htmlFor='edit-email'>联系邮箱</Label>
            <Input
              id='edit-email'
              type='email'
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder='contact@company.com'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label htmlFor='edit-longitude'>经度</Label>
            <Input
              id='edit-longitude'
              type='number'
              step='any'
              value={formData.longitude}
              onChange={e => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
              placeholder='121.4737'
            />
          </div>

          <div>
            <Label htmlFor='edit-latitude'>纬度</Label>
            <Input
              id='edit-latitude'
              type='number'
              step='any'
              value={formData.latitude}
              onChange={e => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
              placeholder='31.2304'
            />
          </div>
        </div>

        <div>
          <Label htmlFor='edit-contactPerson'>联系人</Label>
          <Input
            id='edit-contactPerson'
            value={formData.contactPerson}
            onChange={e => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
            placeholder='联系人姓名'
          />
        </div>

        <div>
          <Label htmlFor='edit-description'>地址描述</Label>
          <Textarea
            id='edit-description'
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder='地址的详细描述或备注'
            rows={3}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label htmlFor='edit-sortOrder'>排序顺序</Label>
            <Input
              id='edit-sortOrder'
              type='number'
              value={formData.sortOrder}
              onChange={e =>
                setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))
              }
              placeholder='0'
            />
          </div>

          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='edit-isDefault'
                checked={formData.isDefault}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
              <Label htmlFor='edit-isDefault'>设为默认地址</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Switch
                id='edit-isActive'
                checked={formData.isActive}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor='edit-isActive'>启用此地址</Label>
            </div>
          </div>
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='button' variant='outline' onClick={onCancel}>
            取消
          </Button>
          <Button type='submit' disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>地址管理</h1>
            <p className='text-gray-600 dark:text-gray-400'>管理公司的多个地址信息</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                添加地址
              </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>添加新地址</DialogTitle>
                <DialogDescription>填写地址信息，包括位置坐标和联系方式</DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='name'>地址名称 *</Label>
                    <Input
                      id='name'
                      value={newLocation.name}
                      onChange={e => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                      placeholder='如：总部、上海分公司'
                    />
                  </div>

                  <div>
                    <Label htmlFor='type'>地址类型</Label>
                    <Select
                      value={newLocation.type}
                      onValueChange={value => setNewLocation(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LOCATION_TYPES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor='address'>详细地址 *</Label>
                  <Textarea
                    id='address'
                    value={newLocation.address}
                    onChange={e => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                    placeholder='请输入详细地址'
                    rows={2}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='phone'>联系电话</Label>
                    <Input
                      id='phone'
                      value={newLocation.phone}
                      onChange={e => setNewLocation(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder='+86 138xxxxxxxx'
                    />
                  </div>

                  <div>
                    <Label htmlFor='email'>联系邮箱</Label>
                    <Input
                      id='email'
                      type='email'
                      value={newLocation.email}
                      onChange={e => setNewLocation(prev => ({ ...prev, email: e.target.value }))}
                      placeholder='contact@company.com'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='longitude'>经度</Label>
                    <Input
                      id='longitude'
                      type='number'
                      step='any'
                      value={newLocation.longitude}
                      onChange={e =>
                        setNewLocation(prev => ({ ...prev, longitude: e.target.value }))
                      }
                      placeholder='121.4737'
                    />
                  </div>

                  <div>
                    <Label htmlFor='latitude'>纬度</Label>
                    <Input
                      id='latitude'
                      type='number'
                      step='any'
                      value={newLocation.latitude}
                      onChange={e =>
                        setNewLocation(prev => ({ ...prev, latitude: e.target.value }))
                      }
                      placeholder='31.2304'
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor='contactPerson'>联系人</Label>
                  <Input
                    id='contactPerson'
                    value={newLocation.contactPerson}
                    onChange={e =>
                      setNewLocation(prev => ({ ...prev, contactPerson: e.target.value }))
                    }
                    placeholder='联系人姓名'
                  />
                </div>

                <div>
                  <Label htmlFor='description'>地址描述</Label>
                  <Textarea
                    id='description'
                    value={newLocation.description}
                    onChange={e =>
                      setNewLocation(prev => ({ ...prev, description: e.target.value }))
                    }
                    placeholder='地址的详细描述或备注'
                    rows={3}
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label htmlFor='sortOrder'>排序顺序</Label>
                    <Input
                      id='sortOrder'
                      type='number'
                      value={newLocation.sortOrder}
                      onChange={e =>
                        setNewLocation(prev => ({
                          ...prev,
                          sortOrder: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder='0'
                    />
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Switch
                        id='isDefault'
                        checked={newLocation.isDefault}
                        onCheckedChange={checked =>
                          setNewLocation(prev => ({ ...prev, isDefault: checked }))
                        }
                      />
                      <Label htmlFor='isDefault'>设为默认地址</Label>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Switch
                        id='isActive'
                        checked={newLocation.isActive}
                        onCheckedChange={checked =>
                          setNewLocation(prev => ({ ...prev, isActive: checked }))
                        }
                      />
                      <Label htmlFor='isActive'>启用此地址</Label>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                  <Button
                    variant='outline'
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={saving}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={createLocation}
                    disabled={saving || !newLocation.name || !newLocation.address}
                  >
                    {saving ? '保存中...' : '保存'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 筛选和搜索 */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Filter className='h-5 w-5' />
              筛选和搜索
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
              <div>
                <Label htmlFor='search'>搜索</Label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500' />
                  <Input
                    id='search'
                    placeholder='搜索地址名称、地址...'
                    value={filters.search}
                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className='pl-10'
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='type'>地址类型</Label>
                <Select
                  value={filters.type}
                  onValueChange={value =>
                    setFilters(prev => ({ ...prev, type: value === 'all' ? '' : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='所有类型' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>所有类型</SelectItem>
                    {Object.entries(LOCATION_TYPES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='status'>状态</Label>
                <Select
                  value={filters.isActive}
                  onValueChange={value =>
                    setFilters(prev => ({ ...prev, isActive: value === 'all' ? '' : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='所有状态' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>所有状态</SelectItem>
                    <SelectItem value='true'>启用</SelectItem>
                    <SelectItem value='false'>禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-end'>
                <Button
                  variant='outline'
                  onClick={fetchLocations}
                  className='flex items-center gap-2'
                >
                  <RefreshCw className='h-4 w-4' />
                  刷新
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 地址列表 */}
        <Card>
          <CardHeader>
            <CardTitle>地址列表</CardTitle>
            <CardDescription>
              共 {pagination.total} 个地址，第 {pagination.page} / {pagination.totalPages} 页
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>地址</TableHead>
                    <TableHead>联系方式</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='py-8 text-center'>
                        <RefreshCw className='mx-auto mb-2 h-6 w-6 animate-spin' />
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : locations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='py-8 text-center text-gray-500 dark:text-gray-400'
                      >
                        暂无地址数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    locations.map(location => (
                      <TableRow key={location.id}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                            <div>
                              <div className='font-medium'>{location.name}</div>
                              {location.isDefault && (
                                <Badge variant='outline' className='text-xs'>
                                  <Star className='mr-1 h-3 w-3' />
                                  默认
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              LOCATION_TYPE_COLORS[
                                location.type as keyof typeof LOCATION_TYPE_COLORS
                              ]
                            }
                          >
                            {LOCATION_TYPES[location.type as keyof typeof LOCATION_TYPES]}
                          </Badge>
                        </TableCell>
                        <TableCell className='max-w-xs truncate'>{location.address}</TableCell>
                        <TableCell>
                          <div className='space-y-1 text-sm'>
                            {location.phone && (
                              <div className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                {location.phone}
                              </div>
                            )}
                            {location.email && (
                              <div className='flex items-center gap-1'>
                                <Mail className='h-3 w-3' />
                                {location.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={location.isActive}
                            onCheckedChange={checked => toggleLocationStatus(location.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setSelectedLocation(location)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setSelectedLocation(location)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => deleteLocation(location.id)}
                              disabled={location.isDefault}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 查看地址对话框 */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>地址详情</DialogTitle>
            </DialogHeader>
            {selectedLocation && (
              <div className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      地址名称
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>{selectedLocation.name}</p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      地址类型
                    </Label>
                    <div className='mt-1'>
                      <Badge
                        className={
                          LOCATION_TYPE_COLORS[
                            selectedLocation.type as keyof typeof LOCATION_TYPE_COLORS
                          ]
                        }
                      >
                        {LOCATION_TYPES[selectedLocation.type as keyof typeof LOCATION_TYPES]}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    详细地址
                  </Label>
                  <p className='mt-1 text-gray-900 dark:text-gray-100'>
                    {selectedLocation.address}
                  </p>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      联系电话
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {selectedLocation.phone || '未设置'}
                    </p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      联系邮箱
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {selectedLocation.email || '未设置'}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      经度
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {selectedLocation.longitude || '未设置'}
                    </p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      纬度
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {selectedLocation.latitude || '未设置'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    联系人
                  </Label>
                  <p className='mt-1 text-gray-900 dark:text-gray-100'>
                    {selectedLocation.contactPerson || '未设置'}
                  </p>
                </div>

                {selectedLocation.description && (
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      地址描述
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {selectedLocation.description}
                    </p>
                  </div>
                )}

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      排序顺序
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {selectedLocation.sortOrder}
                    </p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      默认地址
                    </Label>
                    <div className='mt-1'>
                      <Badge variant={selectedLocation.isDefault ? 'default' : 'outline'}>
                        {selectedLocation.isDefault ? '是' : '否'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      状态
                    </Label>
                    <div className='mt-1'>
                      <Badge variant={selectedLocation.isActive ? 'default' : 'secondary'}>
                        {selectedLocation.isActive ? '启用' : '禁用'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      创建时间
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {formatDate(selectedLocation.createdAt)}
                    </p>
                  </div>
                  <div>
                    <Label className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                      更新时间
                    </Label>
                    <p className='mt-1 text-gray-900 dark:text-gray-100'>
                      {formatDate(selectedLocation.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 编辑地址对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>编辑地址</DialogTitle>
              <DialogDescription>修改地址信息，包括位置坐标和联系方式</DialogDescription>
            </DialogHeader>
            {selectedLocation && (
              <EditLocationForm
                location={selectedLocation}
                onSuccess={() => {
                  setIsEditDialogOpen(false)
                  setSelectedLocation(null)
                  fetchLocations()
                }}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedLocation(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
