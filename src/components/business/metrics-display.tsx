'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Metric {
  value: string
  label: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  description?: string
  color?: string
}

interface MetricsDisplayProps {
  metrics: Metric[]
  variant?: 'default' | 'compact' | 'detailed' | 'horizontal'
  className?: string
  animated?: boolean
  showTrend?: boolean
}

export function MetricsDisplay({
  metrics,
  variant = 'default',
  className,
  animated = true,
  showTrend = false,
}: MetricsDisplayProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className='h-4 w-4 text-green-500' />
      case 'down':
        return <TrendingDown className='h-4 w-4 text-red-500' />
      case 'neutral':
        return <Minus className='h-4 w-4 text-gray-500' />
      default:
        return null
    }
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      case 'neutral':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  const getGridClasses = () => {
    switch (variant) {
      case 'compact':
        return 'grid grid-cols-2 md:grid-cols-4 gap-4'
      case 'horizontal':
        return 'flex flex-wrap gap-6'
      case 'detailed':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-6'
    }
  }

  const getItemClasses = (metric: Metric) => {
    const baseClasses = 'text-center'

    switch (variant) {
      case 'compact':
        return cn(baseClasses, 'p-3')
      case 'horizontal':
        return cn(baseClasses, 'flex-1 min-w-[120px] p-4')
      case 'detailed':
        return cn(
          baseClasses,
          'p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300'
        )
      default:
        return cn(baseClasses, 'p-4')
    }
  }

  const renderMetric = (metric: Metric, index: number) => {
    const itemClasses = getItemClasses(metric)

    return (
      <motion.div
        key={index}
        variants={animated ? itemVariants : undefined}
        className={itemClasses}
      >
        {/* Value */}
        <div className='mb-2'>
          <div
            className={cn(
              'font-bold',
              {
                'text-2xl md:text-3xl': variant === 'default' || variant === 'detailed',
                'text-xl md:text-2xl': variant === 'compact',
                'text-lg md:text-xl': variant === 'horizontal',
              },
              metric.color || 'text-blue-600 dark:text-blue-400'
            )}
          >
            {metric.value}
          </div>

          {/* Trend */}
          {showTrend && metric.trend && (
            <div className='mt-1 flex items-center justify-center space-x-1'>
              {getTrendIcon(metric.trend)}
              {metric.trendValue && (
                <span className={cn('text-sm font-medium', getTrendColor(metric.trend))}>
                  {metric.trendValue}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Label */}
        <div
          className={cn('font-medium text-gray-600 dark:text-gray-400', {
            'text-sm': variant === 'compact' || variant === 'horizontal',
            'text-base': variant === 'default' || variant === 'detailed',
          })}
        >
          {metric.label}
        </div>

        {/* Description */}
        {variant === 'detailed' && metric.description && (
          <div className='mt-2 text-sm text-gray-500 dark:text-gray-500'>{metric.description}</div>
        )}
      </motion.div>
    )
  }

  const MotionContainer = animated ? motion.div : 'div'
  const containerProps = animated
    ? {
        variants: containerVariants,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
      }
    : {}

  return (
    <MotionContainer {...containerProps} className={cn(getGridClasses(), className)}>
      {metrics.map((metric, index) => renderMetric(metric, index))}
    </MotionContainer>
  )
}

// 预设的指标展示变体
export function CompactMetrics({ metrics, className }: Omit<MetricsDisplayProps, 'variant'>) {
  return (
    <MetricsDisplay
      metrics={metrics}
      variant='compact'
      className={className}
      animated={true}
      showTrend={false}
    />
  )
}

export function DetailedMetrics({ metrics, className }: Omit<MetricsDisplayProps, 'variant'>) {
  return (
    <MetricsDisplay
      metrics={metrics}
      variant='detailed'
      className={className}
      animated={true}
      showTrend={true}
    />
  )
}

export function HorizontalMetrics({ metrics, className }: Omit<MetricsDisplayProps, 'variant'>) {
  return (
    <MetricsDisplay
      metrics={metrics}
      variant='horizontal'
      className={className}
      animated={true}
      showTrend={false}
    />
  )
}

// 业务领域专用的指标展示
export function DomainMetrics({
  metrics,
  accentColor = 'blue',
  className,
}: {
  metrics: Array<{ value: string; label: string }>
  accentColor?: string
  className?: string
}) {
  // 使用安全的颜色映射
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    slate: 'text-slate-600 dark:text-slate-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
    violet: 'text-violet-600 dark:text-violet-400',
    amber: 'text-amber-600 dark:text-amber-400',
  }

  const formattedMetrics = metrics.map(metric => ({
    ...metric,
    color: colorMap[accentColor] || colorMap.blue,
  }))

  return (
    <MetricsDisplay
      metrics={formattedMetrics}
      variant='default'
      className={className}
      animated={true}
      showTrend={false}
    />
  )
}
