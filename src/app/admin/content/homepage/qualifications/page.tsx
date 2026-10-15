'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Edit, Trash2, Eye, Upload, X, ArrowLeft } from 'lucide-react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  // DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// 企业资质类型定义
interface Qualification {
  id: string
  title: string
  description?: string
  image?: string
  category: string
  issuer?: string
  issueDate?: string
  expiryDate?: string
  certificateNumber?: string
  displayOrder: number
  isActive: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  creator?: {
    id: string
    name: string
    email: string
  }
}

// 表单数据类型
interface QualificationFormData {
  title: string
  image: string
  displayOrder: number
}

export default function QualificationsManagement() {
  const router = useRouter()
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 弹窗状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  // 表单数据
  const [formData, setFormData] = useState<QualificationFormData>({
    title: '',
    image: '',
    displayOrder: 0,
  })

  // 获取企业资质列表
  const fetchQualifications = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/content/qualifications?${params}`)
      if (response.ok) {
        const data = await response.json()
        setQualifications(data.qualifications)
        setTotalPages(data.pagination.pages)
      } else {
        toast.error('获取企业资质失败')
      }
    } catch (_error) {
      console.error('获取企业资质失败:', _error)
      toast.error('获取企业资质失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQualifications()
  }, [currentPage, searchTerm])

  // 重置表单
  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
      displayOrder: 0,
    })
    setImagePreview('')
  }

  // 打开添加弹窗
  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  // 打开编辑弹窗
  const openEditDialog = (qualification: Qualification) => {
    setEditingQualification(qualification)
    setFormData({
      title: qualification.title || '',
      image: qualification.image || '',
      displayOrder: qualification.displayOrder || 0,
    })
    setImagePreview(qualification.image || '')
    setIsEditDialogOpen(true)
  }

  // 处理表单字段变化
  const handleInputChange = (field: keyof QualificationFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  // 处理图片上传
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('请选择有效的图片文件 (JPG, PNG, GIF, WebP, AVIF)')
      return
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('图片文件大小不能超过 10MB')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploadType', 'qualifications') // 标识为企业资质图片

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setImagePreview(data.url)
        setFormData(prev => ({
          ...prev,
          image: data.url,
        }))
        toast.success('图片上传成功')
      } else {
        const error = await response.json()
        console.error('上传失败:', error)

        // 根据HTTP状态码显示不同的错误信息
        if (response.status === 413) {
          toast.error('文件过大，请选择较小的图片文件')
        } else if (response.status === 400) {
          toast.error(error.error || '文件格式不支持')
        } else if (response.status === 507) {
          toast.error('服务器存储空间不足，请联系管理员')
        } else {
          toast.error(error.error || '图片上传失败')
        }
      }
    } catch (_error) {
      console.error('图片上传失败:', _error)

      // 网络错误或其他异常
      if (_error instanceof TypeError && _error.message.includes('fetch')) {
        toast.error('网络连接失败，请检查网络后重试')
      } else {
        toast.error('图片上传失败，请重试')
      }
    } finally {
      setLoading(false)
    }

    // 清空input值，允许重复选择同一文件
    event.target.value = ''
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('请输入资质名称')
      return
    }

    setFormLoading(true)

    try {
      const url = editingQualification
        ? `/api/admin/content/qualifications/${editingQualification.id}`
        : '/api/admin/content/qualifications'

      const method = editingQualification ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingQualification ? '企业资质更新成功' : '企业资质创建成功')
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setEditingQualification(null)
        fetchQualifications()
      } else {
        const error = await response.json()
        toast.error(error.error || '操作失败')
      }
    } catch (_error) {
      console.error('操作失败:', _error)
      toast.error('操作失败')
    } finally {
      setFormLoading(false)
    }
  }

  // 删除企业资质
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个企业资质吗？')) return

    try {
      const response = await fetch(`/api/admin/content/qualifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('企业资质删除成功')
        fetchQualifications()
      } else {
        toast.error('删除失败')
      }
    } catch (_error) {
      console.error('删除失败:', _error)
      toast.error('删除失败')
    }
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 返回按钮 */}
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            onClick={() => router.push('/admin/content/homepage')}
            className='flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            返回首页管理
          </Button>
        </div>

        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>企业资质管理</h1>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              管理企业资质证书和认证信息
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <Button variant='outline' size='sm' asChild>
              <Link href='/' target='_blank'>
                <Eye className='mr-2 h-4 w-4' />
                预览首页
              </Link>
            </Button>
            <Button onClick={openAddDialog}>
              <Plus className='mr-2 h-4 w-4' />
              添加资质
            </Button>
          </div>
        </div>

        {/* 搜索 */}
        <Card>
          <CardHeader>
            <CardTitle>搜索</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='搜索资质名称...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </CardContent>
        </Card>

        {/* 企业资质列表 */}
        <Card>
          <CardHeader>
            <CardTitle>企业资质列表</CardTitle>
            <CardDescription>共 {qualifications.length} 个企业资质</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <div className='text-center'>
                  <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
                  <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>加载中...</p>
                </div>
              </div>
            ) : qualifications.length === 0 ? (
              <div className='py-8 text-center'>
                <p className='text-gray-500 dark:text-gray-400'>暂无企业资质</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>资质信息</TableHead>
                      <TableHead>排序</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qualifications.map(qualification => (
                      <TableRow key={qualification.id}>
                        <TableCell>
                          <div className='flex items-center space-x-3'>
                            <div className='h-12 w-12 overflow-hidden rounded-lg bg-gray-100'>
                              {qualification.image ? (
                                <Image
                                  src={qualification.image}
                                  alt={qualification.title}
                                  width={48}
                                  height={48}
                                  className='h-full w-full object-contain'
                                />
                              ) : (
                                <div className='flex h-full items-center justify-center text-gray-400'>
                                  📜
                                </div>
                              )}
                            </div>
                            <div>
                              <div className='font-medium'>{qualification.title}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{qualification.displayOrder}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center space-x-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => openEditDialog(qualification)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDelete(qualification.id)}
                              className='text-red-600 hover:text-red-700'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 添加资质弹窗 */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>添加企业资质</DialogTitle>
              <DialogDescription>创建新的企业资质证书</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-6'>
                <div>
                  <Label htmlFor='title'>资质名称 *</Label>
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder='请输入资质名称'
                    required
                  />
                </div>

                {/* 图片上传区域 */}
                <div>
                  <Label>资质图片</Label>
                  <div className='mt-2 space-y-4'>
                    {imagePreview ? (
                      <div className='relative'>
                        <Image
                          src={imagePreview}
                          alt='资质预览'
                          width={200}
                          height={150}
                          className='w-full max-w-xs rounded-lg border object-contain'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-2 top-2 bg-white/80 hover:bg-white'
                          onClick={() => {
                            setImagePreview('')
                            setFormData(prev => ({ ...prev, image: '' }))
                          }}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400'>
                        <div className='text-center'>
                          <Upload className='mx-auto h-8 w-8 text-gray-400' />
                          <p className='mt-2 text-sm text-gray-500'>点击上传资质图片</p>
                          <p className='text-xs text-gray-400'>支持 JPG、PNG 格式</p>
                        </div>
                      </div>
                    )}

                    <Input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='hidden'
                      id='image-upload'
                    />
                    <Label htmlFor='image-upload' className='cursor-pointer'>
                      <Button type='button' variant='outline' className='w-full' asChild>
                        <span>
                          <Upload className='mr-2 h-4 w-4' />
                          {imagePreview ? '更换图片' : '选择图片'}
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor='displayOrder'>显示顺序</Label>
                  <Input
                    id='displayOrder'
                    type='number'
                    value={formData.displayOrder}
                    onChange={e => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                    placeholder='0'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={formLoading}
                >
                  取消
                </Button>
                <Button type='submit' disabled={formLoading}>
                  {formLoading ? '保存中...' : '保存'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 编辑资质弹窗 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>编辑企业资质</DialogTitle>
              <DialogDescription>修改企业资质证书信息</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-6'>
                <div>
                  <Label htmlFor='edit-title'>资质名称 *</Label>
                  <Input
                    id='edit-title'
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    placeholder='请输入资质名称'
                    required
                  />
                </div>

                <div>
                  <Label>资质图片</Label>
                  <div className='mt-2 space-y-4'>
                    {imagePreview ? (
                      <div className='relative'>
                        <Image
                          src={imagePreview}
                          alt='资质预览'
                          width={200}
                          height={150}
                          className='w-full max-w-sm rounded-lg border object-contain'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-2 top-2 bg-white/80 hover:bg-white'
                          onClick={() => {
                            setImagePreview('')
                            setFormData(prev => ({ ...prev, image: '' }))
                          }}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <Label htmlFor='edit-image-upload' className='cursor-pointer'>
                        <div className='flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400 hover:bg-blue-50'>
                          <div className='text-center'>
                            <Upload className='mx-auto h-8 w-8 text-gray-400' />
                            <p className='mt-2 text-sm font-medium text-gray-600'>点击选择图片</p>
                            <p className='text-xs text-gray-400'>
                              支持 JPG, PNG, GIF 格式，最大 5MB
                            </p>
                          </div>
                        </div>
                      </Label>
                    )}

                    <Input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='hidden'
                      id='edit-image-upload'
                    />
                    <Label htmlFor='edit-image-upload' className='cursor-pointer'>
                      <Button type='button' variant='outline' className='w-full' asChild>
                        <span>
                          <Upload className='mr-2 h-4 w-4' />
                          {imagePreview ? '更换图片' : '选择图片'}
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor='edit-displayOrder'>显示顺序</Label>
                  <Input
                    id='edit-displayOrder'
                    type='number'
                    value={formData.displayOrder}
                    onChange={e => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                    placeholder='0'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={formLoading}
                >
                  取消
                </Button>
                <Button type='submit' disabled={formLoading}>
                  {formLoading ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
