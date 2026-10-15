'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
// 解决方案接口定义
interface Solution {
  id: string
  title: string
  subtitle: string
  description: string
  content?: string // 新增富文本内容字段
  category: string
  features: string[]
  applications: string[]
  metrics: Array<{
    value: string
    label: string
  }>
  technologies: string[]
  benefits: string[]
  image: string
  slug: string
  gradient: string
  accentColor: string
}
import { SolutionCard, CompactSolutionCard, FeaturedSolutionCard } from './solution-card'
import { cn } from '@/lib/utils'

interface SolutionGridProps {
  solutions: Solution[]
  variant?: 'default' | 'compact' | 'featured' | 'masonry'
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  className?: string
  showMetrics?: boolean
  showCTA?: boolean
  showBenefits?: boolean
  maxItems?: number
}

export function SolutionGrid({
  solutions,
  variant = 'default',
  columns = { sm: 1, md: 2, lg: 3, xl: 3 },
  className,
  showMetrics = true,
  showCTA = true,
  showBenefits = false,
  maxItems,
}: SolutionGridProps) {
  const displaySolutions = maxItems ? solutions.slice(0, maxItems) : solutions

  const gridClasses = cn(
    'grid gap-4 md:gap-6',
    {
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3': variant === 'default',
      'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4':
        variant === 'compact',
      'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2': variant === 'featured',
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': variant === 'masonry',
    },
    className
  )

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

  const renderSolutionCard = (solution: Solution, index: number) => {
    const commonProps = {
      solution,
      index,
      showMetrics,
      showCTA,
      showBenefits,
    }

    switch (variant) {
      case 'compact':
        return <CompactSolutionCard key={solution.id} {...commonProps} />
      case 'featured':
        return <FeaturedSolutionCard key={solution.id} {...commonProps} />
      default:
        return <SolutionCard key={solution.id} {...commonProps} />
    }
  }

  if (variant === 'masonry') {
    return (
      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        className={cn(
          'columns-1 gap-4 space-y-4 md:columns-2 md:gap-6 md:space-y-6 lg:columns-3',
          className
        )}
      >
        {displaySolutions.map((solution, index) => (
          <div key={solution.id} className='mb-4 break-inside-avoid md:mb-6'>
            {renderSolutionCard(solution, index)}
          </div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      className={gridClasses}
    >
      {displaySolutions.map((solution, index) => renderSolutionCard(solution, index))}
    </motion.div>
  )
}

// 预设的网格布局变体
export function CompactSolutionGrid({
  solutions,
  className,
  maxItems,
}: Omit<SolutionGridProps, 'variant'>) {
  return (
    <SolutionGrid
      solutions={solutions}
      variant='compact'
      className={className}
      showMetrics={false}
      showCTA={false}
      showBenefits={false}
      maxItems={maxItems}
    />
  )
}

export function FeaturedSolutionGrid({
  solutions,
  className,
  maxItems,
}: Omit<SolutionGridProps, 'variant'>) {
  return (
    <SolutionGrid
      solutions={solutions}
      variant='featured'
      className={className}
      showMetrics={true}
      showCTA={true}
      showBenefits={true}
      maxItems={maxItems}
    />
  )
}

export function MasonrySolutionGrid({
  solutions,
  className,
  maxItems,
}: Omit<SolutionGridProps, 'variant'>) {
  return (
    <SolutionGrid
      solutions={solutions}
      variant='masonry'
      className={className}
      showMetrics={true}
      showCTA={true}
      showBenefits={false}
      maxItems={maxItems}
    />
  )
}
