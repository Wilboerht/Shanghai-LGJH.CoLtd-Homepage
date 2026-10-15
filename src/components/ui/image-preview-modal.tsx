'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProtectedImage } from '@/components/ui/protected-image'

interface ImagePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  imageAlt: string
  title?: string
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
  title,
}: ImagePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl p-0'>
        <DialogHeader className='p-4 pb-2'>
          <DialogTitle className='text-lg font-semibold'>{title || imageAlt}</DialogTitle>
          <DialogDescription>预览图片详情，支持缩放和查看完整内容</DialogDescription>
        </DialogHeader>

        {/* 图片显示区域 */}
        <div className='flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900'>
          <div className='relative flex min-h-[70vh] items-center justify-center overflow-hidden p-4'>
            <div className='relative max-h-full max-w-full'>
              <ProtectedImage
                src={imageUrl}
                alt={imageAlt}
                width={1200}
                height={800}
                className='max-h-[70vh] max-w-full object-contain'
                priority
              />

              {/* 前端水印覆盖层 - 平铺效果 */}
              <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* 创建平铺水印网格 */}
                <div className='absolute inset-0 grid grid-cols-4 grid-rows-5 gap-0 opacity-25'>
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className='watermark-rotated flex select-none items-center justify-center text-xs font-medium text-gray-500'
                    >
                      仅供网页展示，不做任何经营用途
                    </div>
                  ))}
                </div>

                {/* 额外的错位水印层 */}
                <div className='absolute inset-0 grid translate-x-12 translate-y-8 transform grid-cols-3 grid-rows-4 gap-0 opacity-20'>
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className='watermark-rotated flex select-none items-center justify-center text-xs font-medium text-gray-600'
                    >
                      仅供网页展示，不做任何经营用途
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for using image preview
export function useImagePreview() {
  const [isOpen, setIsOpen] = useState(false)
  const [imageData, setImageData] = useState<{
    url: string
    alt: string
    title?: string
  }>({ url: '', alt: '' })

  const openPreview = (url: string, alt: string, title?: string) => {
    setImageData({ url, alt, title })
    setIsOpen(true)
  }

  const closePreview = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    imageData,
    openPreview,
    closePreview,
  }
}
