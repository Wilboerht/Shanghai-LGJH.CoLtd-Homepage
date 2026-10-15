'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface GradientConfig {
  enabled: boolean
  colors: string[]
  direction: string
}

interface GradientPickerProps {
  value: GradientConfig
  onChange: (value: GradientConfig) => void
  label: string
}

const gradientDirections = [
  { value: 'to right', label: '从左到右' },
  { value: 'to left', label: '从右到左' },
  { value: 'to bottom', label: '从上到下' },
  { value: 'to top', label: '从下到上' },
  { value: 'to bottom right', label: '对角线（左上到右下）' },
  { value: 'to bottom left', label: '对角线（右上到左下）' },
  { value: 'to top right', label: '对角线（左下到右上）' },
  { value: 'to top left', label: '对角线（右下到左上）' },
]

export function GradientPicker({ value, onChange, label }: GradientPickerProps) {
  const addColor = () => {
    if (value.colors.length < 5) {
      onChange({
        ...value,
        colors: [...value.colors, '#ffffff'],
      })
    }
  }

  const removeColor = (index: number) => {
    if (value.colors.length > 2) {
      const newColors = value.colors.filter((_, i) => i !== index)
      onChange({
        ...value,
        colors: newColors,
      })
    }
  }

  const updateColor = (index: number, color: string) => {
    const newColors = [...value.colors]
    newColors[index] = color
    onChange({
      ...value,
      colors: newColors,
    })
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id={`gradient-${label}`}
          checked={value.enabled}
          onChange={e => onChange({ ...value, enabled: e.target.checked })}
          className='rounded'
          aria-label={`启用${label}`}
          title={`启用${label}`}
        />
        <Label htmlFor={`gradient-${label}`}>{label}</Label>
      </div>

      {value.enabled && (
        <div className='space-y-3 border-l-2 border-gray-200 pl-6'>
          {/* 渐变方向 */}
          <div>
            <Label>渐变方向</Label>
            <select
              value={value.direction}
              onChange={e => onChange({ ...value, direction: e.target.value })}
              className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              aria-label='选择渐变方向'
              title='选择渐变方向'
            >
              {gradientDirections.map(dir => (
                <option key={dir.value} value={dir.value}>
                  {dir.label}
                </option>
              ))}
            </select>
          </div>

          {/* 颜色列表 */}
          <div>
            <Label>渐变颜色</Label>
            <div className='mt-2 space-y-2'>
              {value.colors.map((color, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <input
                    type='color'
                    value={color}
                    onChange={e => updateColor(index, e.target.value)}
                    className='h-8 w-10 rounded border'
                    aria-label={`渐变颜色 ${index + 1}`}
                    title={`渐变颜色 ${index + 1}`}
                  />
                  <Input
                    value={color}
                    onChange={e => updateColor(index, e.target.value)}
                    placeholder='#ffffff'
                    className='flex-1'
                  />
                  {value.colors.length > 2 && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeColor(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}

              {value.colors.length < 5 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addColor}
                  className='w-full'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  添加颜色
                </Button>
              )}
            </div>
          </div>

          {/* 渐变预览 */}
          <div>
            <Label>预览效果</Label>
            <div
              className='mt-2 flex h-12 items-center justify-center rounded border font-bold text-white'
              style={{
                backgroundImage: `linear-gradient(${value.direction}, ${value.colors.join(', ')})`,
              }}
            >
              渐变预览
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
