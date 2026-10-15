'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionDividerProps {
  variant?: 'default' | 'gradient' | 'dots' | 'wave'
  className?: string
  color?: 'gray' | 'blue' | 'slate'
}

export function SectionDivider({
  variant = 'default',
  className,
  color = 'gray',
}: SectionDividerProps) {
  const colorClasses = {
    gray: 'from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    blue: 'from-blue-200 via-blue-300 to-blue-200 dark:from-blue-800 dark:via-blue-700 dark:to-blue-800',
    slate:
      'from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700',
  }

  if (variant === 'gradient') {
    return (
      <motion.div
        className={cn('relative h-px w-full', className)}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={cn('h-full w-full bg-gradient-to-r', colorClasses[color])} />
      </motion.div>
    )
  }

  if (variant === 'dots') {
    return (
      <motion.div
        className={cn('flex items-center justify-center space-x-2 py-8', className)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className={cn('h-1.5 w-1.5 rounded-full', {
              'bg-gray-300 dark:bg-gray-600': color === 'gray',
              'bg-blue-300 dark:bg-blue-600': color === 'blue',
              'bg-slate-300 dark:bg-slate-600': color === 'slate',
            })}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    )
  }

  if (variant === 'wave') {
    return (
      <motion.div
        className={cn('relative h-4 w-full overflow-hidden', className)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <svg
          className='absolute inset-0 h-full w-full'
          viewBox='0 0 1200 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M0,12 Q300,0 600,12 T1200,12'
            stroke='currentColor'
            strokeWidth='1'
            fill='none'
            className={cn({
              'text-gray-300 dark:text-gray-600': color === 'gray',
              'text-blue-300 dark:text-blue-600': color === 'blue',
              'text-slate-300 dark:text-slate-600': color === 'slate',
            })}
          />
        </svg>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      className={cn('relative h-px w-full', className)}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div
        className={cn('h-full w-full', {
          'bg-gray-200 dark:bg-gray-700': color === 'gray',
          'bg-blue-200 dark:bg-blue-700': color === 'blue',
          'bg-slate-200 dark:bg-slate-700': color === 'slate',
        })}
      />
    </motion.div>
  )
}
