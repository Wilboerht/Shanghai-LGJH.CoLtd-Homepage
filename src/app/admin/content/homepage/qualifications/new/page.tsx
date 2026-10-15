'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

// 表单数据类型
interface QualificationFormData {
  title: string
  image: string
  displayOrder: number
}

export default function NewQualification() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  const [formData, setFormData] = useState<QualificationFormData>({
    title: '',
    image: '',
    displayOrder: 0,
  })

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
        toast.error(error.error || '图片上传失败')
      }
    } catch (_error) {
      console.error('图片上传失败:', _error)
      toast.error('图片上传失败，请重试')
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

    setLoading(true)

    try {
      const response = await fetch('/api/admin/content/qualifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('企业资质创建成功')
        router.push('/admin/content/homepage/qualifications')
      } else {
        const error = await response.json()
        toast.error(error.error || '创建失败')
      }
    } catch (_error) {
      console.error('创建失败:', _error)
      toast.error('创建失败')
    } finally {
      setLoading(false)
    }
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
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>添加企业资质</h1>
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>创建新的企业资质证书</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* 主要信息 */}
            <div className='space-y-6 lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>填写企业资质的基本信息</CardDescription>
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
                          选择图片
                        </span>
                      </Button>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <Card>
                <CardContent className='pt-6'>
                  <div className='space-y-3'>
                    <Button type='submit' className='w-full' disabled={loading}>
                      <Save className='mr-2 h-4 w-4' />
                      {loading ? '保存中...' : '保存资质'}
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
