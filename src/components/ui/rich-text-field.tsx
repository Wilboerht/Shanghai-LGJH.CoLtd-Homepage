'use client'

import React from 'react'

import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { cn } from '@/lib/utils'

interface RichTextFieldProps {
  label?: string
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  height?: number
  disabled?: boolean
  required?: boolean
  error?: string
  description?: string
  className?: string
  id?: string
}

export function RichTextField({
  label,
  value,
  onChange,
  placeholder,
  height = 300,
  disabled = false,
  required = false,
  error,
  description,
  className,
  id,
}: RichTextFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(required && "after:ml-1 after:text-red-500 after:content-['*']")}
        >
          {label}
        </Label>
      )}

      {description && <p className='text-sm text-gray-700 dark:text-gray-300'>{description}</p>}

      <RichTextEditor
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        height={height}
        disabled={disabled}
      />

      {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
    </div>
  )
}

export default RichTextField
