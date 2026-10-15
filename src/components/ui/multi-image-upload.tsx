'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon, Plus, GripVertical } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

interface ImageItem {
  id: string
  url: string
  alt?: string
}

interface MultiImageUploadProps {
  value?: ImageItem[]
  onChange: (value: ImageItem[]) => void
  label: string
  helpText?: string
  accept?: string
  maxSize?: number // in MB
  maxImages?: number
}

export function MultiImageUpload({
  value = [],
  onChange,
  label,
  helpText,
  accept = 'image/*',
  maxSize = 5,
  maxImages = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (value.length + files.length > maxImages) {
      toast.error(`最多只能上传 ${maxImages} 张图片`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async file => {
        // 检查文件大小
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`文件 ${file.name} 大小超过 ${maxSize}MB`)
        }

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
          throw new Error(`文件 ${file.name} 不是有效的图片格式`)
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('uploadType', 'product') // 指定上传类型为产品图片

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || '上传失败')
        }

        const result = await response.json()
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: result.url,
          alt: file.name,
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      onChange([...value, ...uploadedImages])
      toast.success(`成功上传 ${uploadedImages.length} 张图片`)
    } catch (error) {
      console.error('上传失败:', error)
      toast.error(error instanceof Error ? error.message : '上传失败')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)

    const files = event.dataTransfer.files
    if (files.length > 0) {
      const fakeEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(fakeEvent)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const addImageByUrl = () => {
    if (!newImageUrl.trim()) {
      toast.error('请输入图片URL')
      return
    }

    if (value.length >= maxImages) {
      toast.error(`最多只能添加 ${maxImages} 张图片`)
      return
    }

    const newImage: ImageItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: newImageUrl.trim(),
      alt: '产品图片',
    }

    onChange([...value, newImage])
    setNewImageUrl('')
    toast.success('图片添加成功')
  }

  const removeImage = (id: string) => {
    onChange(value.filter(img => img.id !== id))
    toast.success('图片已移除')
  }

  const updateImageAlt = (id: string, alt: string) => {
    onChange(value.map(img => (img.id === id ? { ...img, alt } : img)))
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onChange(newImages)
  }

  return (
    <div className='space-y-4'>
      <Label className='text-sm font-medium'>{label}</Label>

      {/* 上传区域 */}
      <div className='space-y-4'>
        {/* 文件上传 */}
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <ImageIcon className='mx-auto mb-4 h-12 w-12 text-gray-400' />
          <div className='space-y-2'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>点击选择文件</p>
            <p className='text-xs text-gray-500'>
              支持 JPG、PNG、WebP 格式，单个文件不超过 {maxSize}MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept={accept}
            multiple
            onChange={handleFileSelect}
            className='hidden'
            aria-label={`上传${label}`}
          />

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-4'
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || value.length >= maxImages}
          >
            <Upload className='mr-2 h-4 w-4' />
            {uploading ? '上传中...' : '选择文件'}
          </Button>
        </div>

        {/* URL输入 */}
        <div className='flex gap-2'>
          <Input
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            placeholder='或输入图片URL地址'
            onKeyPress={e => e.key === 'Enter' && addImageByUrl()}
          />
          <Button
            type='button'
            variant='outline'
            onClick={addImageByUrl}
            disabled={!newImageUrl.trim() || value.length >= maxImages}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* 图片列表 */}
      {value.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='text-sm font-medium'>
              已添加的图片 ({value.length}/{maxImages})
            </Label>
            {value.length > 1 && <p className='text-xs text-gray-500'> </p>}
          </div>

          <div className='grid gap-3'>
            {value.map((image, index) => (
              <Card key={image.id} className='p-3'>
                <div className='flex items-start gap-3'>
                  {value.length > 1 && (
                    <div className='flex h-20 flex-col items-center justify-center'>
                      <GripVertical className='h-4 w-4 cursor-move text-gray-400' />
                    </div>
                  )}

                  <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800'>
                    <Image
                      src={image.url}
                      alt={image.alt || '产品图片'}
                      fill
                      className='object-cover'
                      onError={e => {
                        e.currentTarget.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDOTQuNDc3MiA3MCA5MCA3NC40NzcyIDkwIDgwVjEyMEM5MCA5NC40NzcyIDk0LjQ3NzIgOTAgMTAwIDkwSDEyMEMxMjUuNTIzIDkwIDEzMCA5NC40NzcyIDEzMCAxMDBWMTIwQzEzMCAxMjUuNTIzIDEyNS41MjMgMTMwIDEyMCAxMzBIMTAwQzk0LjQ3NzIgMTMwIDkwIDEyNS41MjMgOTAgMTIwVjgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                      }}
                    />
                  </div>

                  <div className='flex-1 space-y-2'>
                    <Input
                      value={image.alt || ''}
                      onChange={e => updateImageAlt(image.id, e.target.value)}
                      placeholder='图片描述（可选）'
                      className='text-sm'
                    />
                    <p className='break-all text-xs text-gray-500'>{image.url}</p>
                  </div>

                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeImage(image.id)}
                    className='text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {helpText && <p className='text-sm text-gray-500'>{helpText}</p>}
    </div>
  )
}
