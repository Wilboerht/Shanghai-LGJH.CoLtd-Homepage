'use client'

import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  change?: number
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  format?: 'number' | 'percentage' | 'currency'
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  format = 'number',
}: StatsCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'currency':
        return `¥${val.toLocaleString()}`
      default:
        return val.toLocaleString()
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-600 dark:text-blue-400',
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        text: 'text-green-600 dark:text-green-400',
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        text: 'text-purple-600 dark:text-purple-400',
      },
      orange: {
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        text: 'text-orange-600 dark:text-orange-400',
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        icon: 'text-red-600 dark:text-red-400',
        text: 'text-red-600 dark:text-red-400',
      },
      gray: {
        bg: 'bg-gray-100 dark:bg-gray-900/20',
        icon: 'text-gray-600 dark:text-gray-400',
        text: 'text-gray-600 dark:text-gray-400',
      },
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  const colors = getColorClasses(color)
  const isPositiveChange = change !== undefined && change >= 0
  const changeColor = isPositiveChange ? 'text-green-600' : 'text-red-600'
  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown

  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>{title}</p>
            <div className='space-y-1'>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {formatValue(value)}
              </p>
              {change !== undefined && (
                <div className='flex items-center gap-1'>
                  <TrendIcon className={`h-3 w-3 ${changeColor}`} />
                  <span className={`text-xs font-medium ${changeColor}`}>
                    {Math.abs(change).toFixed(1)}%
                  </span>
                  <span className='text-xs text-gray-500'>较上期</span>
                </div>
              )}
            </div>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
