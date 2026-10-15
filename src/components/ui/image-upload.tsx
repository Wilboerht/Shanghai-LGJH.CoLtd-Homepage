'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  helpText?: string
  accept?: string
  maxSize?: number // in MB
  uploadType?: string // 上传类型，用于水印处理
}

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = '输入图片URL或上传图片',
  helpText,
  accept = 'image/*',
  maxSize = 5,
  uploadType = 'research',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 检查是否为视频文件
  const isVideoFile = (url: string) => {
    return /\.(mp4|mov|avi|mkv|webm|ogg)$/i.test(url) || url.includes('video')
  }

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`文件大小不能超过 ${maxSize}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('uploadType', uploadType)

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include', // 确保包含session cookies
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
        toast.success(`图片上传成功${data.processingTime ? ` (${data.processingTime}ms)` : ''}`)
      } else {
        const error = await response.json()
        console.error('上传失败:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
        })
        toast.error(error.error || `上传失败 (${response.status})`)
      }
    } catch (error) {
      console.error('上传请求失败:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('网络连接失败，请检查网络连接')
      } else {
        toast.error('上传失败，请重试')
      }
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

  // 处理拖拽
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)

    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    } else {
      toast.error('请选择图片文件')
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  // 清除图片
  const handleClear = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className='space-y-2'>
      <Label>{label}</Label>

      {/* URL输入框 */}
      <div className='flex gap-2'>
        <Input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className='flex-1'
        />
        {value && (
          <Button type='button' variant='outline' size='sm' onClick={handleClear}>
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {/* 上传区域 */}
      <div
        className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        aria-label={`${label}上传区域`}
      >
        {value ? (
          <div className='space-y-2'>
            <div className='relative mx-auto h-20 w-20'>
              {isVideoFile(value) ? (
                <video
                  src={value}
                  className='h-full w-full rounded object-contain'
                  muted
                  playsInline
                  onError={() => {
                    toast.error('视频加载失败')
                  }}
                />
              ) : (
                <Image
                  src={value}
                  alt='预览'
                  fill
                  className='rounded object-contain'
                  onError={() => {
                    toast.error('图片加载失败')
                  }}
                />
              )}
            </div>
            <p className='text-sm text-gray-600'>{isVideoFile(value) ? '视频预览' : '图片预览'}</p>
          </div>
        ) : (
          <div className='space-y-2'>
            <ImageIcon className='mx-auto h-8 w-8 text-gray-400' />
            <p className='text-sm text-gray-600'>点击上传</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          onChange={handleFileSelect}
          className='hidden'
          aria-label={`上传${label}`}
          title={`选择${label}文件`}
        />

        <Button
          type='button'
          variant='outline'
          size='sm'
          className='mt-2'
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className='mr-2 h-4 w-4' />
          {uploading ? '上传中...' : '选择文件'}
        </Button>
      </div>

      {helpText && <p className='text-sm text-gray-500'>{helpText}</p>}
    </div>
  )
}
