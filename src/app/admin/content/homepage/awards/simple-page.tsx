'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Upload, X, Eye, Star, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Award {
  id: string
  title: string
  image?: string
  displayOrder: number
  isActive: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

interface FormData {
  title: string
  image: string
  displayOrder: number
  isActive: boolean
  featured: boolean
}

const initialFormData: FormData = {
  title: '',
  image: '',
  displayOrder: 0,
  isActive: true,
  featured: true,
}

export default function SimpleAwardsManagement() {
  const router = useRouter()
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAward, setEditingAward] = useState<Award | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formLoading, setFormLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  // 获取荣誉奖项列表
  const fetchAwards = async () => {
    try {
      const response = await fetch('/api/admin/content/awards?page=1&limit=100')
      if (response.ok) {
        const data = await response.json()
        setAwards(data.awards || [])
      }
    } catch (_error) {
      console.error('获取奖项失败:', _error)
      toast.error('获取奖项失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAwards()
  }, [])

  // 重置表单
  const resetForm = () => {
    setFormData(initialFormData)
    setImagePreview('')
    setEditingAward(null)
  }

  // 处理表单输入
  const handleInputChange = (field: keyof FormData, value: unknown) => {
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

    // 验证文件大小 (10MB) - 与后端保持一致
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('图片文件大小不能超过 10MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploadType', 'awards') // 标识为奖项图片

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
      setUploading(false)
    }

    // 清空input值，允许重复选择同一文件
    event.target.value = ''
  }

  // 打开添加对话框
  const openAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  // 打开编辑对话框
  const openEditDialog = (award: Award) => {
    setEditingAward(award)
    setFormData({
      title: award.title,
      image: award.image || '',
      displayOrder: award.displayOrder,
      isActive: award.isActive,
      featured: award.featured,
    })
    setImagePreview(award.image || '')
    setIsEditDialogOpen(true)
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const url = editingAward
        ? `/api/admin/content/awards/${editingAward.id}`
        : '/api/admin/content/awards'

      const method = editingAward ? 'PUT' : 'POST'

      // 只发送必要的数据，为了兼容现有API，添加所有必需字段的默认值
      const submitData = {
        title: formData.title,
        description: formData.title, // 使用标题作为描述
        image: formData.image,
        category: '荣誉奖项', // 默认类别
        issuer: '', // 空字符串
        awardDate: '', // 空字符串
        year: '', // 空字符串
        level: '', // 空字符串
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
        featured: formData.featured,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '操作失败')
      }

      toast.success(editingAward ? '荣誉奖项更新成功' : '荣誉奖项创建成功')
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      resetForm()
      fetchAwards()
    } catch (error: unknown) {
      console.error('提交失败:', error)
      toast.error((error as any).message || '操作失败')
    } finally {
      setFormLoading(false)
    }
  }

  // 删除荣誉奖项
  const handleDelete = async (award: Award) => {
    if (!confirm(`确定要删除荣誉奖项"${award.title}"吗？`)) return

    try {
      const response = await fetch(`/api/admin/content/awards/${award.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '删除失败')
      }

      toast.success('荣誉奖项删除成功')
      fetchAwards()
    } catch (error: unknown) {
      console.error('删除失败:', error)
      toast.error((error as any).message || '删除失败')
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-2 text-gray-600'>加载中...</p>
        </div>
      </div>
    )
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
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>荣誉奖项管理</h1>
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
              管理首页展示的企业荣誉奖项（只需要标题和图片）
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => window.open('/', '_blank')}>
              <Eye className='mr-2 h-4 w-4' />
              预览首页
            </Button>
            <Button onClick={openAddDialog}>
              <Plus className='mr-2 h-4 w-4' />
              添加奖项
            </Button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <Star className='h-4 w-4 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>总奖项数</p>
                  <p className='text-2xl font-bold'>{awards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <Eye className='h-4 w-4 text-green-600' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>首页展示</p>
                  <p className='text-2xl font-bold'>{awards.filter(a => a.featured).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-lg bg-yellow-100 p-2'>
                  <Star className='h-4 w-4 text-yellow-600' />
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>启用状态</p>
                  <p className='text-2xl font-bold'>{awards.filter(a => a.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 奖项列表 */}
        <Card>
          <CardHeader>
            <CardTitle>奖项列表</CardTitle>
          </CardHeader>
          <CardContent>
            {awards.length === 0 ? (
              <div className='py-8 text-center'>
                <p className='text-gray-500'>暂无奖项数据</p>
                <Button onClick={openAddDialog} className='mt-4'>
                  <Plus className='mr-2 h-4 w-4' />
                  添加第一个奖项
                </Button>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {awards.map(award => (
                  <div key={award.id} className='space-y-3 rounded-lg border p-4'>
                    {/* 奖项图片 */}
                    <div className='relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100'>
                      {award.image ? (
                        <Image
                          src={award.image}
                          alt={award.title}
                          fill
                          className='object-contain p-2'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                      ) : (
                        <div className='flex h-full items-center justify-center text-gray-400'>
                          <div className='text-center'>
                            <div className='mb-2 text-4xl'>🏆</div>
                            <div className='text-xs'>无图片</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 奖项信息 */}
                    <div className='space-y-2'>
                      <h3 className='line-clamp-2 text-sm font-medium'>{award.title}</h3>

                      <div className='flex items-center gap-2'>
                        {award.featured && (
                          <Badge variant='default' className='text-xs'>
                            <Star className='mr-1 h-3 w-3' />
                            首页
                          </Badge>
                        )}
                        {!award.isActive && (
                          <Badge variant='secondary' className='text-xs'>
                            禁用
                          </Badge>
                        )}
                      </div>

                      <div className='text-xs text-muted-foreground'>
                        排序: {award.displayOrder}
                      </div>

                      <div className='flex gap-1 pt-2'>
                        <Button size='sm' variant='outline' onClick={() => openEditDialog(award)}>
                          <Edit className='h-3 w-3' />
                        </Button>
                        <Button size='sm' variant='outline' onClick={() => handleDelete(award)}>
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 添加奖项对话框 */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>添加荣誉奖项</DialogTitle>
              <DialogDescription>只需要填写奖项名称和上传图片</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='title'>奖项名称 *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder='请输入奖项名称'
                  required
                />
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

              <div>
                <Label>奖项图片</Label>
                <div className='space-y-2'>
                  <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                  />

                  {imagePreview ? (
                    <div className='relative'>
                      <div className='relative aspect-[3/4] w-32 overflow-hidden rounded-lg bg-gray-100'>
                        <Image src={imagePreview} alt='预览' fill className='object-contain p-1' />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-1 top-1 bg-white/80 hover:bg-white'
                          onClick={() => {
                            setImagePreview('')
                            setFormData(prev => ({ ...prev, image: '' }))
                          }}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <Label htmlFor='image-upload' className='cursor-pointer'>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full'
                      asChild
                      disabled={uploading}
                    >
                      <span>
                        <Upload className='mr-2 h-4 w-4' />
                        {uploading ? '上传中...' : imagePreview ? '更换图片' : '选择图片'}
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <input
                  id='featured'
                  type='checkbox'
                  checked={formData.featured}
                  onChange={e => handleInputChange('featured', e.target.checked)}
                  className='rounded'
                />
                <Label htmlFor='featured'>在首页展示</Label>
              </div>

              <div className='flex items-center space-x-2'>
                <input
                  id='isActive'
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={e => handleInputChange('isActive', e.target.checked)}
                  className='rounded'
                />
                <Label htmlFor='isActive'>启用状态</Label>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <Button type='button' variant='outline' onClick={() => setIsAddDialogOpen(false)}>
                  取消
                </Button>
                <Button type='submit' disabled={formLoading}>
                  {formLoading ? '创建中...' : '创建'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 编辑奖项对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>编辑荣誉奖项</DialogTitle>
              <DialogDescription>修改奖项名称和图片</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='edit-title'>奖项名称 *</Label>
                <Input
                  id='edit-title'
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder='请输入奖项名称'
                  required
                />
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

              <div>
                <Label>奖项图片</Label>
                <div className='space-y-2'>
                  <input
                    id='edit-image-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                  />

                  {imagePreview ? (
                    <div className='relative'>
                      <div className='relative aspect-[3/4] w-32 overflow-hidden rounded-lg bg-gray-100'>
                        <Image src={imagePreview} alt='预览' fill className='object-contain p-1' />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-1 top-1 bg-white/80 hover:bg-white'
                          onClick={() => {
                            setImagePreview('')
                            setFormData(prev => ({ ...prev, image: '' }))
                          }}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <Label htmlFor='edit-image-upload' className='cursor-pointer'>
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full'
                      asChild
                      disabled={uploading}
                    >
                      <span>
                        <Upload className='mr-2 h-4 w-4' />
                        {uploading ? '上传中...' : imagePreview ? '更换图片' : '选择图片'}
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <input
                  id='edit-featured'
                  type='checkbox'
                  checked={formData.featured}
                  onChange={e => handleInputChange('featured', e.target.checked)}
                  className='rounded'
                />
                <Label htmlFor='edit-featured'>在首页展示</Label>
              </div>

              <div className='flex items-center space-x-2'>
                <input
                  id='edit-isActive'
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={e => handleInputChange('isActive', e.target.checked)}
                  className='rounded'
                />
                <Label htmlFor='edit-isActive'>启用状态</Label>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <Button type='button' variant='outline' onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button type='submit' disabled={formLoading}>
                  {formLoading ? '更新中...' : '更新'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
