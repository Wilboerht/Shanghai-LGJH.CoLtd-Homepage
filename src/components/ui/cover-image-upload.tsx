'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from './image-upload'
import { Upload, ExternalLink, Image as ImageIcon, X, Edit, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  fileSize: number
  url: string
  altText?: string
  metadata?: any
  createdAt: string
  uploader: {
    id: string
    name: string
    email: string
  }
}

interface CoverImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
  label?: string
  placeholder?: string
  uploadType?: string // 添加上传类型参数
  showMediaLibrary?: boolean // 是否显示媒体库选项卡
}

export function CoverImageUpload({
  value = '',
  onChange,
  className,
  label = '封面图片',
  placeholder = '请选择或输入图片URL',
  uploadType = 'service-background', // 默认上传类型
  showMediaLibrary = true, // 默认显示媒体库
}: CoverImageUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [activeTab, setActiveTab] = useState('url')
  const [isDragOver, setIsDragOver] = useState(false)

  // 同步外部传入的value和内部的imageUrl状态
  useEffect(() => {
    setImageUrl(value || '')
  }, [value])

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onChange(imageUrl.trim())
      handleClose()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 文件大小检查 (20MB)
    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('文件过大，请选择小于20MB的图片文件')
      return
    }

    // 文件类型检查
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
    ]
    if (!allowedTypes.includes(file.type)) {
      toast.error('不支持的文件格式，请选择JPG、PNG、GIF、WebP或AVIF格式的图片')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploadType', uploadType) // 添加上传类型

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
        handleClose()
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
    } catch (error) {
      console.error('上传错误:', error)
      toast.error('网络错误，请检查网络连接后重试')
    } finally {
      setUploading(false)
    }
  }

  const handleMediaSelect = useCallback(
    (media: MediaFile) => {
      onChange(media.url)
      setIsMediaPickerOpen(false)
    },
    [onChange]
  )

  const handleClose = () => {
    setImageUrl('')
    setPreviewError(false)
    setActiveTab('url')
    setIsDialogOpen(false)
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    } else {
      setIsDialogOpen(true)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  const handleEdit = () => {
    setImageUrl(value)
    setIsDialogOpen(true)
  }

  // 拖拽事件处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find(file => file.type.startsWith('image/'))

      if (!imageFile) {
        toast.error('请拖拽图片文件')
        return
      }

      // 文件大小检查 (20MB)
      const maxSize = 20 * 1024 * 1024
      if (imageFile.size > maxSize) {
        toast.error('文件过大，请选择小于20MB的图片文件')
        return
      }

      // 文件类型检查
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/avif',
      ]
      if (!allowedTypes.includes(imageFile.type)) {
        toast.error('不支持的文件格式，请选择JPG、PNG、GIF、WebP或AVIF格式的图片')
        return
      }

      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('uploadType', uploadType) // 添加上传类型

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          onChange(data.url)
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
      } catch (error) {
        console.error('上传错误:', error)
        toast.error('网络错误，请检查网络连接后重试')
      } finally {
        setUploading(false)
      }
    },
    [onChange, uploadType]
  )

  return (
    <div className={cn('space-y-2', className)}>
      <Label>{label}</Label>

      {value ? (
        // 显示当前图片
        <div className='space-y-3'>
          <div className='group relative overflow-hidden rounded-lg border bg-gray-50'>
            <img
              src={value}
              alt='封面图片'
              className='h-48 w-full object-cover'
              onError={() => setPreviewError(true)}
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all duration-200 group-hover:bg-opacity-30 group-hover:opacity-100'>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  size='sm'
                  variant='secondary'
                  onClick={handleEdit}
                  className='bg-white bg-opacity-90 hover:bg-opacity-100'
                >
                  <Edit className='mr-1 h-4 w-4' />
                  编辑
                </Button>
                <Button
                  type='button'
                  size='sm'
                  variant='secondary'
                  onClick={() => window.open(value, '_blank')}
                  className='bg-white bg-opacity-90 hover:bg-opacity-100'
                >
                  <Eye className='mr-1 h-4 w-4' />
                  预览
                </Button>
                <Button
                  type='button'
                  size='sm'
                  variant='destructive'
                  onClick={handleRemove}
                  className='bg-red-500 bg-opacity-90 hover:bg-opacity-100'
                >
                  <X className='mr-1 h-4 w-4' />
                  移除
                </Button>
              </div>
            </div>
          </div>
          <div className='break-all text-sm text-gray-600'>{value}</div>
        </div>
      ) : (
        // 显示上传区域
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
            uploading && 'pointer-events-none opacity-50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading && (
            <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-80'>
              <div className='text-center'>
                <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
                <p className='text-sm text-gray-600'>上传中...</p>
              </div>
            </div>
          )}

          {isDragOver ? (
            <>
              <Upload className='mx-auto mb-4 h-12 w-12 text-blue-500' />
              <p className='mb-4 font-medium text-blue-600'>上传图片</p>
            </>
          ) : (
            <>
              <ImageIcon className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <p className='mb-2 text-gray-600'>{placeholder}</p>
              <p className='mb-2 text-sm text-gray-500'>点击选择图片文件上传</p>
              <div className='mb-4 space-y-1 text-xs text-gray-400'>
                <p>支持：JPG、PNG、GIF、WebP、AVIF</p>
                <p>大小：最大 20MB</p>
              </div>
              <Button type='button' onClick={() => setIsDialogOpen(true)} disabled={uploading}>
                <Upload className='mr-2 h-4 w-4' />
                选择图片
              </Button>
            </>
          )}
        </div>
      )}

      {/* 图片选择对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>选择封面图片</DialogTitle>
            <DialogDescription>通过外部链接、上传文件或媒体库选择封面图片</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className={`grid w-full ${showMediaLibrary ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value='url' className='flex items-center gap-2'>
                <ExternalLink className='h-4 w-4' />
                外部链接
              </TabsTrigger>
              <TabsTrigger value='upload' className='flex items-center gap-2'>
                <Upload className='h-4 w-4' />
                上传图片
              </TabsTrigger>
              {showMediaLibrary && (
                <TabsTrigger value='library' className='flex items-center gap-2'>
                  <ImageIcon className='h-4 w-4' />
                  媒体库
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value='url' className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='cover-image-url'>图片URL</Label>
                <div className='flex gap-2'>
                  <Input
                    id='cover-image-url'
                    value={imageUrl}
                    onChange={e => {
                      setImageUrl(e.target.value)
                      setPreviewError(false)
                    }}
                    placeholder='https://example.com/image.jpg'
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText()
                        if (text && (text.startsWith('http') || text.startsWith('data:'))) {
                          setImageUrl(text)
                          setPreviewError(false)
                        }
                      } catch (err) {
                        // 忽略剪贴板权限错误
                      }
                    }}
                    title='从剪贴板粘贴URL'
                  >
                    粘贴
                  </Button>
                </div>
              </div>

              {/* 预览 */}
              {imageUrl && !previewError && (
                <div className='space-y-2'>
                  <Label>预览</Label>
                  <div className='rounded-md border bg-gray-50 p-2'>
                    <img
                      src={imageUrl}
                      alt='预览'
                      className='h-32 max-w-full rounded object-contain'
                      onError={() => setPreviewError(true)}
                    />
                  </div>
                </div>
              )}

              {previewError && (
                <div className='text-sm text-red-600'>无法加载图片预览，请检查URL是否正确</div>
              )}

              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  取消
                </Button>
                <Button type='button' onClick={handleUrlInsert} disabled={!imageUrl.trim()}>
                  确定
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='upload' className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='cover-image-file'>选择图片文件</Label>
                <Input
                  id='cover-image-file'
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif'
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <div className='space-y-1 text-xs text-gray-500'>
                  <p>• 支持格式：JPG、PNG、GIF、WebP、AVIF</p>
                  <p>• 文件大小：最大 20MB</p>
                  <p>• 建议尺寸：16:9 或 4:3 比例，至少 800x450 像素</p>
                </div>
              </div>

              {uploading && (
                <div className='flex items-center gap-2 text-sm text-blue-600'>
                  <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500'></div>
                  上传中...
                </div>
              )}

              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  取消
                </Button>
              </div>
            </TabsContent>

            {showMediaLibrary && (
              <TabsContent value='library' className='space-y-4'>
                <div className='text-center'>
                  <p className='mb-4 text-sm text-gray-600'>从媒体库中选择已上传的图片</p>
                  <Button
                    type='button'
                    onClick={() => {
                      // 先关闭当前对话框，然后延迟打开媒体选择器
                      setIsDialogOpen(false)
                      // 使用setTimeout确保对话框完全关闭后再打开媒体选择器
                      setTimeout(() => {
                        setIsMediaPickerOpen(true)
                      }, 100)
                    }}
                    className='w-full'
                  >
                    <ImageIcon className='mr-2 h-4 w-4' />
                    打开媒体库
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 媒体选择器对话框 */}
      {/* MediaPickerDialog组件不存在，暂时注释
      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={handleMediaSelect}
        filter="image"
        title="选择封面图片"
      />
      */}
    </div>
  )
}
