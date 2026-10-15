'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Feature {
  title: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  highlighted?: boolean
}

interface FeatureListProps {
  features: string[] | Feature[]
  variant?: 'default' | 'compact' | 'detailed' | 'grid'
  accentColor?: string
  gradient?: string
  className?: string
  animated?: boolean
  columns?: number
  showIcons?: boolean
  iconType?: 'check' | 'star' | 'arrow' | 'zap' | 'dot'
}

export function FeatureList({
  features,
  variant = 'default',
  accentColor = 'blue',
  gradient = 'from-blue-600 to-cyan-600',
  className,
  animated = true,
  columns = 2,
  showIcons = true,
  iconType = 'check',
}: FeatureListProps) {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  const getIcon = (feature?: Feature) => {
    if (!showIcons) return null

    // 如果feature有自定义图标，使用自定义图标
    if (feature && typeof feature === 'object' && feature.icon) {
      const CustomIcon = feature.icon
      return <CustomIcon className='h-4 w-4' />
    }

    // 否则使用默认图标类型
    switch (iconType) {
      case 'star':
        return <Star className='h-4 w-4' />
      case 'arrow':
        return <ArrowRight className='h-4 w-4' />
      case 'zap':
        return <Zap className='h-4 w-4' />
      case 'dot':
        return <div className='h-2 w-2 rounded-full' />
      case 'check':
      default:
        return <Check className='h-4 w-4' />
    }
  }

  const getContainerClasses = () => {
    switch (variant) {
      case 'compact':
        return 'space-y-2'
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-${columns} gap-3`
      case 'detailed':
        return 'space-y-4'
      default:
        return 'space-y-3'
    }
  }

  const getItemClasses = (feature?: Feature) => {
    const isHighlighted = feature && typeof feature === 'object' && feature.highlighted

    const baseClasses = 'flex items-start space-x-3 group'

    switch (variant) {
      case 'compact':
        return cn(baseClasses, 'text-sm')
      case 'detailed':
        return cn(
          baseClasses,
          'p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors',
          {
            'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700':
              isHighlighted,
          }
        )
      default:
        return baseClasses
    }
  }

  const getIconClasses = (feature?: Feature) => {
    const isHighlighted = feature && typeof feature === 'object' && feature.highlighted

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

    const baseClasses = cn('flex-shrink-0 mt-0.5', {
      [colorMap[accentColor] || colorMap.blue]: !isHighlighted,
      'text-white': isHighlighted && iconType !== 'dot',
    })

    if (iconType === 'dot') {
      return cn(baseClasses, `bg-gradient-to-r ${gradient}`, {
        'mt-2': variant === 'default' || variant === 'grid',
        'mt-1.5': variant === 'compact',
        'mt-2.5': variant === 'detailed',
      })
    }

    if (isHighlighted) {
      return cn(baseClasses, `p-1 rounded-full bg-gradient-to-r ${gradient} shadow-lg`)
    }

    return baseClasses
  }

  const normalizeFeatures = (): Feature[] => {
    return features.map(feature => {
      if (typeof feature === 'string') {
        return { title: feature }
      }
      return feature
    })
  }

  const normalizedFeatures = normalizeFeatures()

  const MotionContainer = animated ? motion.div : 'div'
  const MotionItem = animated ? motion.div : 'div'

  const containerProps = animated
    ? {
        variants: containerVariants,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
      }
    : {}

  const itemProps = animated
    ? {
        variants: itemVariants,
      }
    : {}

  return (
    <MotionContainer {...containerProps} className={cn(getContainerClasses(), className)}>
      {normalizedFeatures.map((feature, index) => (
        <MotionItem key={index} {...itemProps} className={getItemClasses(feature)}>
          {/* Icon */}
          <div className={getIconClasses(feature)}>{getIcon(feature)}</div>

          {/* Content */}
          <div className='min-w-0 flex-1'>
            <div
              className={cn('font-medium text-gray-900 dark:text-white', {
                'text-sm': variant === 'compact',
                'text-base': variant === 'default' || variant === 'grid',
                'text-lg': variant === 'detailed',
              })}
            >
              {feature.title}
            </div>

            {variant === 'detailed' && feature.description && (
              <div className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                {feature.description}
              </div>
            )}
          </div>
        </MotionItem>
      ))}
    </MotionContainer>
  )
}

// 预设的特性列表变体
export function CompactFeatureList({
  features,
  accentColor,
  className,
}: Omit<FeatureListProps, 'variant'>) {
  return (
    <FeatureList
      features={features}
      variant='compact'
      accentColor={accentColor}
      className={className}
      animated={true}
      showIcons={true}
      iconType='dot'
    />
  )
}

export function GridFeatureList({
  features,
  accentColor,
  gradient,
  columns = 2,
  className,
}: Omit<FeatureListProps, 'variant'>) {
  return (
    <FeatureList
      features={features}
      variant='grid'
      accentColor={accentColor}
      gradient={gradient}
      columns={columns}
      className={className}
      animated={true}
      showIcons={true}
      iconType='check'
    />
  )
}

export function DetailedFeatureList({
  features,
  accentColor,
  gradient,
  className,
}: Omit<FeatureListProps, 'variant'>) {
  return (
    <FeatureList
      features={features}
      variant='detailed'
      accentColor={accentColor}
      gradient={gradient}
      className={className}
      animated={true}
      showIcons={true}
      iconType='star'
    />
  )
}

// 业务领域专用的特性列表
export function DomainFeatureList({
  features,
  accentColor = 'blue',
  gradient = 'from-blue-600 to-cyan-600',
  className,
}: {
  features: string[]
  accentColor?: string
  gradient?: string
  className?: string
}) {
  return (
    <FeatureList
      features={features}
      variant='grid'
      accentColor={accentColor}
      gradient={gradient}
      columns={2}
      className={className}
      animated={true}
      showIcons={true}
      iconType='dot'
    />
  )
}
