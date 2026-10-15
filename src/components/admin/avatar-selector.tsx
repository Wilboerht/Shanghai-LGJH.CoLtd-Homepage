'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Upload, X, Camera, RefreshCw } from 'lucide-react'

interface AvatarSelectorProps {
  value?: string | null
  onChange: (url: string | null) => void
  onUploadSuccess?: (url: string) => void
  trigger?: React.ReactNode
}

export function AvatarSelector({ value, onChange, onUploadSuccess, trigger }: AvatarSelectorProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB')
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
        const media = await response.json()

        // 直接使用上传的图片URL
        onChange(media.url)
        setOpen(false)

        // 如果提供了上传成功回调，调用它来自动保存
        if (onUploadSuccess) {
          onUploadSuccess(media.url)
        } else {
          alert('头像上传成功！请点击"保存更改"按钮保存到数据库。')
        }
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

  // 移除头像
  const handleRemove = () => {
    onChange(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='outline' className='w-full'>
            <Camera className='mr-2 h-4 w-4' />
            选择头像
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Camera className='h-5 w-5' />
            上传头像
          </DialogTitle>
          <DialogDescription>选择或上传新的头像图片</DialogDescription>
        </DialogHeader>

        {/* 上传区域 */}
        <div className='space-y-4'>
          <div className='rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600'>
            <div className='space-y-4'>
              <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
                <Upload className='h-8 w-8 text-gray-400' />
              </div>
              <div>
                <p className='text-lg font-medium text-gray-900 dark:text-white'>上传头像</p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  支持 JPG、PNG、GIF 格式，文件大小不超过 5MB
                </p>
              </div>
              <input
                type='file'
                accept='image/*'
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileUpload(file)
                  }
                }}
                className='hidden'
                id='avatar-upload'
                aria-label='选择头像文件'
                title='选择头像文件'
              />
              <Button
                type='button'
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploading}
                className='min-w-[120px]'
              >
                {uploading ? (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                    上传中...
                  </>
                ) : (
                  <>
                    <Upload className='mr-2 h-4 w-4' />
                    选择文件
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className='flex items-center justify-between border-t pt-4'>
          <Button
            variant='outline'
            onClick={handleRemove}
            className='border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400'
          >
            <X className='mr-2 h-4 w-4' />
            移除头像
          </Button>

          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
