'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`relative mx-4 max-h-[90vh] w-full overflow-hidden rounded-lg bg-white shadow-xl ${sizeClasses[size]}`}
      >
        {/* Header */}
        {title && (
          <div className='flex items-center justify-between border-b p-6'>
            <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
            <Button variant='ghost' size='sm' onClick={onClose} className='h-8 w-8 p-0'>
              <X className='h-4 w-4' />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className='max-h-[calc(90vh-80px)] overflow-y-auto'>{children}</div>
      </div>
    </div>
  )
}
