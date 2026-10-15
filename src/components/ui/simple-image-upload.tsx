'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload, ExternalLink, X, Image as ImageIcon } from 'lucide-react'

interface SimpleImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  placeholder?: string
  accept?: string
  maxSize?: number // MB
  className?: string
}

export function SimpleImageUpload({
  value,
  onChange,
  onRemove,
  placeholder = '选择图片或输入图片URL',
  accept = 'image/*',
  maxSize = 5,
  className = '',
}: SimpleImageUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [activeTab, setActiveTab] = useState('url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`文件大小不能超过${maxSize}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
        setIsDialogOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || '上传失败')
      }
    } catch (error) {
      console.error('上传失败:', error)
      alert('上传失败')
    } finally {
      setUploading(false)
    }
  }

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // 处理URL输入
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setIsDialogOpen(false)
    }
  }

  // 处理拖拽上传
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  return (
    <div className={className}>
      {/* 当前图片显示 */}
      {value && (
        <div className='relative mb-4 inline-block'>
          <img
            src={value}
            alt='预览'
            className='max-h-48 max-w-xs rounded-lg border object-cover'
          />
          {onRemove && (
            <Button
              type='button'
              variant='destructive'
              size='sm'
              className='absolute -right-2 -top-2 h-6 w-6 rounded-full p-0'
              onClick={onRemove}
            >
              <X className='h-3 w-3' />
            </Button>
          )}
        </div>
      )}

      {/* 选择图片按钮 */}
      <Button
        type='button'
        variant='outline'
        onClick={() => setIsDialogOpen(true)}
        className='w-full'
      >
        <ImageIcon className='mr-2 h-4 w-4' />
        {value ? '更换图片' : '选择图片'}
      </Button>

      {/* 图片选择对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>选择图片</DialogTitle>
            <DialogDescription>通过外部链接或上传文件来选择图片</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='url' className='flex items-center gap-2'>
                <ExternalLink className='h-4 w-4' />
                图片URL
              </TabsTrigger>
              <TabsTrigger value='upload' className='flex items-center gap-2'>
                <Upload className='h-4 w-4' />
                上传文件
              </TabsTrigger>
            </TabsList>

            <TabsContent value='url' className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='imageUrl'>图片URL</Label>
                <Input
                  id='imageUrl'
                  type='url'
                  placeholder='https://example.com/image.jpg'
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                />
              </div>
              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button type='button' onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                  确定
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='upload' className='space-y-4'>
              <div
                className='rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400'
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                <p className='mb-2 text-sm text-gray-600'>点击选择文件</p>
                <p className='mb-4 text-xs text-gray-500'>
                  支持 JPG、PNG、WebP、AVIF 格式，最大 {maxSize}MB
                </p>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? '上传中...' : '选择文件'}
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept={accept}
                  onChange={handleFileSelect}
                  className='hidden'
                />
              </div>
              <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
