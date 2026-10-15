'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { businessDomains } from '@/data/business'
import { ScrollableCards } from '@/components/business/scrollable-cards'
import { Container } from '@/components/ui/container'

interface ScrollableBusinessDomainsProps {
  maxItems?: number
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showProgress?: boolean
  showIndicators?: boolean
}

export function ScrollableBusinessDomains({
  maxItems = 7,
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showProgress = true,
  showIndicators = true,
}: ScrollableBusinessDomainsProps) {
  const displayDomains = maxItems ? businessDomains.slice(0, maxItems) : businessDomains

  return (
    <section className='relative py-12 md:py-16 lg:py-20'>
      {/* 简洁背景 */}
      <div className='absolute inset-0 bg-white dark:bg-gray-900' />

      <Container className='relative z-10'>
        <ScrollableCards
          domains={displayDomains}
          autoPlay={autoPlay}
          autoPlayInterval={autoPlayInterval}
          // cardsPerView 属性在 FlipCards 组件中不存在，移除
          className={className}
          showControls={showControls}
          showProgress={showProgress}
          showIndicators={showIndicators}
        />
      </Container>
    </section>
  )
}

// 预设配置的组件变体
export function AutoPlayScrollableBusinessDomains(
  props: Omit<ScrollableBusinessDomainsProps, 'autoPlay'>
) {
  return <ScrollableBusinessDomains {...props} autoPlay={true} autoPlayInterval={4000} />
}

export function ManualScrollableBusinessDomains(
  props: Omit<ScrollableBusinessDomainsProps, 'autoPlay'>
) {
  return <ScrollableBusinessDomains {...props} autoPlay={false} />
}

export function CompactScrollableBusinessDomains(props: ScrollableBusinessDomainsProps) {
  return (
    <ScrollableBusinessDomains
      {...props}
      showProgress={false}
      showIndicators={false}
      className='py-12'
    />
  )
}
