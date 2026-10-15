'use client'

import * as React from 'react'
import { motion, Variants } from 'framer-motion'
import { BusinessDomain } from '@/data/business'
import { DomainCard, CompactDomainCard, FeaturedDomainCard } from './domain-card'
import { cn } from '@/lib/utils'

interface DomainGridProps {
  domains: BusinessDomain[]
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
  maxItems?: number
}

export function DomainGrid({
  domains,
  variant = 'default',
  columns = { sm: 1, md: 2, lg: 3, xl: 3 },
  className,
  showMetrics = true,
  showCTA = true,
  maxItems,
}: DomainGridProps) {
  const displayDomains = maxItems ? domains.slice(0, maxItems) : domains

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        ease: 'easeOut',
      },
    },
  }

  const renderDomainCard = (domain: BusinessDomain, index: number) => {
    const commonProps = {
      domain,
      index,
      showMetrics,
      showCTA,
    }

    switch (variant) {
      case 'compact':
        return <CompactDomainCard key={domain.id} {...commonProps} />
      case 'featured':
        return <FeaturedDomainCard key={domain.id} {...commonProps} />
      default:
        return <DomainCard key={domain.id} {...commonProps} />
    }
  }

  if (variant === 'masonry') {
    return (
      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
        className={cn(
          'columns-1 gap-4 space-y-4 md:columns-2 md:gap-6 md:space-y-6 lg:columns-3',
          className
        )}
      >
        {displayDomains.map((domain, index) => (
          <div key={domain.id} className='mb-4 break-inside-avoid md:mb-6'>
            {renderDomainCard(domain, index)}
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
      viewport={{ once: true, margin: '-100px' }}
      className={gridClasses}
    >
      {displayDomains.map((domain, index) => renderDomainCard(domain, index))}
    </motion.div>
  )
}

// 预设的网格布局变体
export function CompactDomainGrid({
  domains,
  className,
  maxItems,
}: Omit<DomainGridProps, 'variant'>) {
  return (
    <DomainGrid
      domains={domains}
      variant='compact'
      className={className}
      showMetrics={false}
      showCTA={false}
      maxItems={maxItems}
    />
  )
}

export function FeaturedDomainGrid({
  domains,
  className,
  maxItems,
}: Omit<DomainGridProps, 'variant'>) {
  return (
    <DomainGrid
      domains={domains}
      variant='featured'
      className={className}
      showMetrics={true}
      showCTA={true}
      maxItems={maxItems}
    />
  )
}

export function MasonryDomainGrid({
  domains,
  className,
  maxItems,
}: Omit<DomainGridProps, 'variant'>) {
  return (
    <DomainGrid
      domains={domains}
      variant='masonry'
      className={className}
      showMetrics={true}
      showCTA={true}
      maxItems={maxItems}
    />
  )
}
