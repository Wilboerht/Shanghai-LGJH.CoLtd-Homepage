'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'

interface FontOption {
  value: string
  label: string
  family: string
}

interface FontSelectorProps {
  value: string
  onChange: (value: string) => void
  label: string
  options: FontOption[]
}

export function FontSelector({ value, onChange, label, options }: FontSelectorProps) {
  return (
    <div>
      <Label htmlFor={`font-${label}`}>{label}</Label>
      <select
        id={`font-${label}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        className='mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
        aria-label={`选择${label}`}
        title={`选择${label}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* 字体预览 */}
      <div className='mt-2 rounded-md border bg-gray-50 p-3'>
        <p
          className={`text-lg ${value}`}
          style={{ fontFamily: options.find(opt => opt.value === value)?.family }}
        >
          字体预览 Font Preview 123
        </p>
      </div>
    </div>
  )
}
