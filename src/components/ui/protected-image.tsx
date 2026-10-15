'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProtectedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  onError?: () => void
}

export function ProtectedImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  sizes,
  priority,
  onError,
}: ProtectedImageProps) {
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const imageElement = imageRef.current

    if (!imageElement) return

    // 禁用右键菜单
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // 禁用拖拽
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // 禁用选择
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    // 禁用键盘快捷键 (Ctrl+S, Ctrl+A, F12等)
    const handleKeyDown = (e: KeyboardEvent): void => {
      // 禁用 F12 (开发者工具)
      if (e.key === 'F12') {
        e.preventDefault()
        return
      }

      // 禁用 Ctrl+S (保存)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        return
      }

      // 禁用 Ctrl+A (全选)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault()
        return
      }

      // 禁用 Ctrl+U (查看源代码)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        return
      }

      // 禁用 Ctrl+Shift+I (开发者工具)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return
      }

      // 禁用 Ctrl+Shift+J (控制台)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return
      }

      // 禁用 Ctrl+Shift+C (元素选择器)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return
      }
    }

    // 添加事件监听器
    imageElement.addEventListener('contextmenu', handleContextMenu)
    imageElement.addEventListener('dragstart', handleDragStart)
    imageElement.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('keydown', handleKeyDown)

    // 清理函数
    return () => {
      imageElement.removeEventListener('contextmenu', handleContextMenu)
      imageElement.removeEventListener('dragstart', handleDragStart)
      imageElement.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleImageError = () => {
    setImageError(true)
    onError?.()
  }

  return (
    <div
      ref={imageRef}
      className={cn(
        'select-none', // 禁用文本选择
        'pointer-events-auto', // 确保可以接收事件
        fill ? 'absolute inset-0' : 'relative', // 根据fill属性调整定位
        className
      )}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        // WebkitUserDrag: 'none' as any, // 移除不支持的CSS属性
        KhtmlUserSelect: 'none',
      }}
    >
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            'pointer-events-none select-none', // 禁用选择和指针事件
            fill ? 'object-contain' : '', // 当使用fill时，确保图片按比例缩放
            className
          )}
          sizes={sizes}
          priority={priority}
          onError={handleImageError}
          draggable={false} // 禁用拖拽
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            // WebkitUserDrag: 'none' as any, // 移除不支持的CSS属性
            KhtmlUserSelect: 'none',
          }}
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-600'>
          <span className='text-gray-400'>图片加载失败</span>
        </div>
      )}

      {/* 透明遮罩层，进一步防止交互 */}
      <div
        className='absolute inset-0 z-10 bg-transparent'
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          pointerEvents: 'auto',
        }}
        onContextMenu={e => e.preventDefault()}
        onDragStart={e => e.preventDefault()}
        onMouseDown={e => {
          if (e.detail > 1) {
            // 防止多次点击选择
            e.preventDefault()
          }
        }}
      />
    </div>
  )
}
