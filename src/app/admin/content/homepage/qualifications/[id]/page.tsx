'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, X, Trash2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

// 表单数据类型
interface QualificationFormData {
  title: string
  description: string
  image: string
  category: string
  issuer: string
  issueDate: string
  expiryDate: string
  certificateNumber: string
  displayOrder: number
  isActive: boolean
  featured: boolean
}

interface EditQualificationProps {
  params: Promise<{ id: string }>
}

export default function EditQualification({ params }: EditQualificationProps) {
  const router = useRouter()
  const [qualificationId, setQualificationId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [formData, setFormData] = useState<QualificationFormData>({
    title: '',
    description: '',
    image: '',
    category: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    certificateNumber: '',
    displayOrder: 0,
    isActive: true,
    featured: false,
  })

  // 获取参数
  useEffect(() => {
    params.then(({ id }) => {
      setQualificationId(id)
    })
  }, [params])

  // 获取企业资质详情
  useEffect(() => {
    if (!qualificationId) return

    const fetchQualification = async () => {
      try {
        const response = await fetch(`/api/admin/content/qualifications/${qualificationId}`)
        if (response.ok) {
          const qualification = await response.json()
          setFormData({
            title: qualification.title || '',
            description: qualification.description || '',
            image: qualification.image || '',
            category: qualification.category || '',
            issuer: qualification.issuer || '',
            issueDate: qualification.issueDate ? qualification.issueDate.split('T')[0] : '',
            expiryDate: qualification.expiryDate ? qualification.expiryDate.split('T')[0] : '',
            certificateNumber: qualification.certificateNumber || '',
            displayOrder: qualification.displayOrder || 0,
            isActive: qualification.isActive ?? true,
            featured: qualification.featured ?? false,
          })
          setImagePreview(qualification.image || '')
        } else {
          toast.error('获取企业资质详情失败')
          router.push('/admin/content/homepage/qualifications')
        }
      } catch (_error) {
        console.error('获取企业资质详情失败:', _error)
        toast.error('获取企业资质详情失败')
        router.push('/admin/content/homepage/qualifications')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchQualification()
  }, [qualificationId, router])

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

    // 这里应该实现实际的图片上传逻辑
    // 暂时使用本地预览
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      setImagePreview(result)
      setFormData(prev => ({
        ...prev,
        image: result, // 实际应用中这里应该是上传后的URL
      }))
    }
    reader.readAsDataURL(file)
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('请输入资质名称')
      return
    }

    if (!formData.category.trim()) {
      toast.error('请选择资质类别')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/content/qualifications/${qualificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('企业资质更新成功')
        router.push('/admin/content/homepage/qualifications')
      } else {
        const error = await response.json()
        toast.error(error.error || '更新失败')
      }
    } catch (_error) {
      console.error('更新失败:', _error)
      toast.error('更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 删除企业资质
  const handleDelete = async () => {
    if (!confirm('确定要删除这个企业资质吗？此操作不可恢复。')) return

    setLoading(true)

    try {
      const response = await fetch(`/api/admin/content/qualifications/${qualificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('企业资质删除成功')
        router.push('/admin/content/homepage/qualifications')
      } else {
        toast.error('删除失败')
      }
    } catch (_error) {
      console.error('删除失败:', _error)
      toast.error('删除失败')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
            <p className='mt-4 text-gray-600 dark:text-gray-400'>加载企业资质详情中...</p>
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
            <Button variant='ghost' size='sm' asChild>
              <Link href='/admin/content/homepage/qualifications'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                返回列表
              </Link>
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>编辑企业资质</h1>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>修改企业资质证书信息</p>
            </div>
          </div>
          <Button variant='destructive' onClick={handleDelete} disabled={loading}>
            <Trash2 className='mr-2 h-4 w-4' />
            删除资质
          </Button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* 主要信息 */}
            <div className='space-y-6 lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>修改企业资质的基本信息</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
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

                  <div>
                    <Label htmlFor='description'>资质描述</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={e => handleInputChange('description', e.target.value)}
                      placeholder='请输入资质描述'
                      rows={3}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <Label htmlFor='category'>资质类别 *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={value => handleInputChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='选择资质类别' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='安全生产'>安全生产</SelectItem>
                          <SelectItem value='建筑业企业资质'>建筑业企业资质</SelectItem>
                          <SelectItem value='施工单位资质'>施工单位资质</SelectItem>
                          <SelectItem value='经营许可'>经营许可</SelectItem>
                          <SelectItem value='质量管理'>质量管理</SelectItem>
                          <SelectItem value='环境管理'>环境管理</SelectItem>
                          <SelectItem value='职业健康安全'>职业健康安全</SelectItem>
                          <SelectItem value='高新技术'>高新技术</SelectItem>
                          <SelectItem value='软件企业'>软件企业</SelectItem>
                          <SelectItem value='系统集成'>系统集成</SelectItem>
                          <SelectItem value='安防工程'>安防工程</SelectItem>
                          <SelectItem value='消防工程'>消防工程</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor='issuer'>颁发机构</Label>
                      <Input
                        id='issuer'
                        value={formData.issuer}
                        onChange={e => handleInputChange('issuer', e.target.value)}
                        placeholder='请输入颁发机构'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                      <Label htmlFor='issueDate'>颁发日期</Label>
                      <Input
                        id='issueDate'
                        type='date'
                        value={formData.issueDate}
                        onChange={e => handleInputChange('issueDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor='expiryDate'>有效期至</Label>
                      <Input
                        id='expiryDate'
                        type='date'
                        value={formData.expiryDate}
                        onChange={e => handleInputChange('expiryDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='certificateNumber'>证书编号</Label>
                    <Input
                      id='certificateNumber'
                      value={formData.certificateNumber}
                      onChange={e => handleInputChange('certificateNumber', e.target.value)}
                      placeholder='请输入证书编号'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 侧边栏 */}
            <div className='space-y-6'>
              {/* 资质图片 */}
              <Card>
                <CardHeader>
                  <CardTitle>资质图片</CardTitle>
                  <CardDescription>上传资质证书图片</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {imagePreview ? (
                      <div className='relative'>
                        <Image
                          src={imagePreview}
                          alt='资质预览'
                          width={200}
                          height={150}
                          className='w-full rounded-lg border object-contain'
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-2 top-2'
                          onClick={() => {
                            setImagePreview('')
                            setFormData(prev => ({ ...prev, image: '' }))
                          }}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300'>
                        <div className='text-center'>
                          <Upload className='mx-auto h-8 w-8 text-gray-400' />
                          <p className='mt-2 text-sm text-gray-500'>点击上传图片</p>
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
                </CardContent>
              </Card>

              {/* 显示设置 */}
              <Card>
                <CardHeader>
                  <CardTitle>显示设置</CardTitle>
                  <CardDescription>配置资质的显示选项</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <Label htmlFor='displayOrder'>显示顺序</Label>
                    <Input
                      id='displayOrder'
                      type='number'
                      value={formData.displayOrder}
                      onChange={e =>
                        handleInputChange('displayOrder', parseInt(e.target.value) || 0)
                      }
                      placeholder='0'
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div>
                      <Label htmlFor='isActive'>启用状态</Label>
                      <p className='text-sm text-gray-500'>是否启用此资质</p>
                    </div>
                    <Switch
                      id='isActive'
                      checked={formData.isActive}
                      onCheckedChange={checked => handleInputChange('isActive', checked)}
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div>
                      <Label htmlFor='featured'>首页展示</Label>
                      <p className='text-sm text-gray-500'>是否在首页展示</p>
                    </div>
                    <Switch
                      id='featured'
                      checked={formData.featured}
                      onCheckedChange={checked => handleInputChange('featured', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <Card>
                <CardContent className='pt-6'>
                  <div className='space-y-3'>
                    <Button type='submit' className='w-full' disabled={loading}>
                      <Save className='mr-2 h-4 w-4' />
                      {loading ? '保存中...' : '保存更改'}
                    </Button>
                    <Button type='button' variant='outline' className='w-full' asChild>
                      <Link href='/admin/content/homepage/qualifications'>取消</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
