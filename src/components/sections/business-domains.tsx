'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Filter, Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { businessDomains, businessCategories } from '@/data/business'
import { DomainGrid, CompactDomainGrid } from '@/components/business/domain-grid'
import { DomainFeatureList } from '@/components/business/feature-list'
import { DomainMetrics } from '@/components/business/metrics-display'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface BusinessDomainsProps {
  variant?: 'default' | 'compact' | 'featured' | 'carousel'
  showFilter?: boolean
  showViewToggle?: boolean
  maxItems?: number
  className?: string
}

export function BusinessDomains({
  variant = 'default',
  showFilter = false,
  showViewToggle = false,
  maxItems,
  className,
}: BusinessDomainsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true)
  const [isScrolling, setIsScrolling] = React.useState(false)

  // 触摸手势状态
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isSwipeInProgress, setIsSwipeInProgress] = React.useState(false)

  // 过滤业务领域
  const filteredDomains = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return businessDomains
    }

    const categoryDomains = businessCategories[selectedCategory as keyof typeof businessCategories]
    return categoryDomains || []
  }, [selectedCategory])

  // 显示的业务领域（考虑 maxItems 限制）
  const displayDomains = React.useMemo(() => {
    const domains = filteredDomains
    return maxItems ? domains.slice(0, maxItems) : domains
  }, [filteredDomains, maxItems])

  // 导航函数
  const goToNext = React.useCallback(() => {
    if (displayDomains.length <= 1) return
    setCurrentIndex(prevIndex => (prevIndex === displayDomains.length - 1 ? 0 : prevIndex + 1))
  }, [displayDomains.length])

  const goToPrevious = React.useCallback(() => {
    if (displayDomains.length <= 1) return
    setCurrentIndex(prevIndex => (prevIndex === 0 ? displayDomains.length - 1 : prevIndex - 1))
  }, [displayDomains.length])

  // 触摸手势处理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (variant !== 'carousel') return
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (variant !== 'carousel') return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (variant !== 'carousel') return
    setIsDragging(false)
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setIsSwipeInProgress(true)
      goToNext()
    } else if (isRightSwipe) {
      setIsSwipeInProgress(true)
      goToPrevious()
    }
  }

  // 重置滑动状态
  React.useEffect(() => {
    if (!isSwipeInProgress) return

    const timeout = setTimeout(() => {
      setIsSwipeInProgress(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [touchStart, touchEnd, isSwipeInProgress, displayDomains.length, goToNext, goToPrevious])

  // 滚动检测 - 滚动时暂停自动播放
  React.useEffect(() => {
    if (variant !== 'carousel') return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [variant])

  // 自动播放功能 - 优化滚动检测
  React.useEffect(() => {
    if (!isAutoPlaying || variant !== 'carousel' || displayDomains.length <= 1 || isScrolling)
      return

    const interval = setInterval(() => {
      // 检查页面是否可见和是否在滚动
      if (document.visibilityState === 'visible' && !isSwipeInProgress && !isScrolling) {
        setCurrentIndex(prevIndex => (prevIndex === displayDomains.length - 1 ? 0 : prevIndex + 1))
      }
    }, 6000) // 增加到6秒，给用户更多时间阅读

    return () => clearInterval(interval)
  }, [isAutoPlaying, variant, displayDomains.length, isSwipeInProgress, isScrolling])

  // 键盘导航
  React.useEffect(() => {
    if (variant !== 'carousel') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext, variant])

  const currentDomain = displayDomains[currentIndex]

  // 确保 currentIndex 在有效范围内
  React.useEffect(() => {
    if (displayDomains.length > 0 && currentIndex >= displayDomains.length) {
      setCurrentIndex(0)
    }
  }, [displayDomains.length, currentIndex])

  return (
    <section
      className={cn('relative overflow-hidden bg-gray-50 py-16 dark:bg-gray-900', className)}
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-300/30 to-cyan-400/30 dark:from-blue-600/30 dark:to-cyan-700/30' />
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container>
        <div className='relative z-10'>
          {/* Header */}
          <motion.div
            className='mb-8 text-center md:mb-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1], // 平滑的缓动
            }}
          >
            <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white md:mb-6 md:text-3xl lg:text-4xl'>
              核心业务领域
            </h2>
            <p className='mx-auto max-w-3xl px-4 text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg'>
              临港景鸿专注于7大核心业务领域，为客户提供全方位的智能化解决方案和专业服务
            </p>
          </motion.div>

          {/* Filter and View Controls */}
          {(showFilter || showViewToggle) && (
            <motion.div
              className='mb-6 flex flex-col items-center justify-between space-y-4 px-4 md:mb-8 lg:flex-row lg:space-y-0'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Category Filter */}
              {showFilter && (
                <div className='flex flex-wrap items-center gap-2'>
                  <Filter className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-sm transition-all duration-200',
                        selectedCategory === 'all'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      )}
                    >
                      全部
                    </button>
                    {Object.keys(businessCategories).map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                          'rounded-full px-3 py-1.5 text-sm transition-all duration-200',
                          selectedCategory === category
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View Toggle */}
              {showViewToggle && (
                <div className='flex items-center gap-2 rounded-lg bg-gray-200 p-1 dark:bg-gray-700'>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'rounded-md p-2 transition-all duration-200',
                      viewMode === 'grid'
                        ? 'bg-white text-blue-500 shadow-sm dark:bg-gray-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    )}
                  >
                    <Grid3X3 className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'rounded-md p-2 transition-all duration-200',
                      viewMode === 'list'
                        ? 'bg-white text-blue-500 shadow-sm dark:bg-gray-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    )}
                  >
                    <List className='h-4 w-4' />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Business Domains Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1], // 平滑缓动
            }}
          >
            {variant === 'carousel' ? (
              <div className='relative'>
                {/* 轮播容器 */}
                <div
                  className='relative overflow-hidden rounded-xl md:rounded-2xl'
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence mode='wait'>
                    {currentDomain && (
                      <motion.div
                        key={currentDomain.id}
                        className={cn(
                          'grid min-h-[400px] touch-pan-y select-none grid-cols-1 items-center gap-6 px-4 md:min-h-[500px] md:gap-8 md:px-12 lg:grid-cols-2'
                        )}
                        initial={{
                          opacity: 0,
                          x: 60,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -60,
                        }}
                        transition={{
                          duration: isDragging ? 0.2 : 0.5,
                          ease: [0.25, 0.1, 0.25, 1], // 平滑的缓动曲线
                          opacity: { duration: isDragging ? 0.15 : 0.4 },
                          x: { duration: isDragging ? 0.2 : 0.5 },
                        }}
                      >
                        {/* 左侧内容 */}
                        <motion.div
                          className='space-y-4 md:space-y-6'
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.1,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        >
                          {/* 标题和图标 */}
                          <div className='flex items-center space-x-3 md:space-x-4'>
                            <div
                              className={`rounded-xl bg-gradient-to-br p-3 md:rounded-2xl md:p-4 ${currentDomain.gradient} shadow-lg`}
                            >
                              <currentDomain.icon className='h-6 w-6 text-white md:h-8 md:w-8' />
                            </div>
                            <div>
                              <h3 className='text-xl font-bold text-gray-900 dark:text-white md:text-2xl lg:text-3xl'>
                                {currentDomain.title}
                              </h3>
                              <p className='text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 md:text-sm'>
                                {currentDomain.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* 描述 */}
                          <p className='text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg'>
                            {currentDomain.description}
                          </p>

                          {/* 特性列表 */}
                          <DomainFeatureList
                            features={currentDomain.features.slice(0, 4)}
                            accentColor={currentDomain.accentColor}
                            gradient={currentDomain.gradient}
                          />

                          {/* 指标展示 */}
                          {currentDomain.metrics && currentDomain.metrics.length > 0 && (
                            <DomainMetrics
                              metrics={currentDomain.metrics}
                              accentColor={currentDomain.accentColor}
                            />
                          )}
                        </motion.div>

                        {/* 右侧图片 */}
                        <motion.div
                          className='relative'
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.2,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        >
                          {/* 图片容器 */}
                          <div className='relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-700 md:rounded-2xl'>
                            {/* 实际图片 */}
                            <div className='absolute inset-0 z-10'>
                              <Image
                                src={currentDomain.image}
                                alt={currentDomain.title}
                                fill
                                className='object-cover'
                                priority
                                onError={() => {
                                  console.log(`Failed to load image: ${currentDomain.image}`)
                                }}
                              />
                            </div>

                            {/* 渐变覆盖层 */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${currentDomain.gradient} ${currentDomain.image ? 'opacity-40' : 'opacity-80'}`}
                            />
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <currentDomain.icon className='h-16 w-16 text-white/60 md:h-24 md:w-24' />
                            </div>

                            {/* 科技网格动画 - 简化版本 */}
                            <div className='absolute inset-0 opacity-20'>
                              <div className='grid h-full w-full grid-cols-8 grid-rows-6 gap-1 p-3 md:p-4'>
                                {Array.from({ length: 48 }).map((_, i) => (
                                  <motion.div
                                    key={`${currentDomain.id}-${i}`}
                                    className='rounded-sm bg-white/20'
                                    animate={{
                                      opacity: [0.2, 0.8, 0.2],
                                    }}
                                    transition={{
                                      duration: 2 + (i % 3),
                                      delay: i * 0.05,
                                      repeat: Infinity,
                                      repeatType: 'reverse',
                                      ease: 'easeInOut',
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 业务领域标签 - 只在有多个项目时显示 */}
                {displayDomains.length > 1 && (
                  <motion.div
                    className='mt-6 grid grid-cols-2 gap-2 px-4 md:mt-8 md:grid-cols-3 lg:grid-cols-7'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    {displayDomains.map((domain, index) => {
                      const TabIcon = domain.icon
                      return (
                        <button
                          key={domain.id}
                          onClick={() => setCurrentIndex(index)}
                          className={`rounded-lg p-2 text-center transition-all duration-300 ease-out md:p-3 ${
                            index === currentIndex
                              ? 'scale-105 bg-gray-200 text-gray-900 shadow-md dark:bg-gray-600 dark:text-white'
                              : 'bg-gray-50 text-gray-600 hover:scale-105 hover:bg-gray-100 hover:text-gray-800 hover:shadow-sm dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300'
                          }`}
                        >
                          <TabIcon className='mx-auto mb-1 h-4 w-4 md:h-5 md:w-5' />
                          <span className='text-xs font-medium'>{domain.title}</span>
                        </button>
                      )
                    })}
                  </motion.div>
                )}

                {/* 移动端滑动提示和页面指示器 */}
                {displayDomains.length > 1 && (
                  <motion.div
                    className='mt-4 flex flex-col items-center space-y-2 px-4 md:hidden'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    {/* 页面指示器 */}
                    <div className='flex space-x-2'>
                      {displayDomains.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={cn(
                            'h-2 w-2 rounded-full transition-all duration-300 ease-out',
                            index === currentIndex
                              ? 'w-6 scale-110 bg-blue-500 dark:bg-blue-400'
                              : 'bg-gray-300 hover:scale-125 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                          )}
                          aria-label={`切换到第${index + 1}个业务领域`}
                        />
                      ))}
                    </div>

                    {/* 滑动提示 */}
                    <div className='flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400'>
                      <div className='flex space-x-1'>
                        <div className='h-1 w-1 animate-pulse rounded-full bg-gray-400'></div>
                        <div
                          className='h-1 w-1 animate-pulse rounded-full bg-gray-400'
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                        <div
                          className='h-1 w-1 animate-pulse rounded-full bg-gray-400'
                          style={{ animationDelay: '0.4s' }}
                        ></div>
                      </div>
                      <span>
                        左右滑动切换 ({currentIndex + 1}/{displayDomains.length})
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : variant === 'compact' ? (
              <CompactDomainGrid domains={displayDomains} />
            ) : (
              <DomainGrid domains={displayDomains} variant={variant} />
            )}
          </motion.div>

          {/* Statistics - 只在非轮播模式下显示 */}
          {variant !== 'carousel' && (
            <motion.div
              className='mb-6 grid grid-cols-2 gap-4 px-4 md:mb-8 md:grid-cols-4 md:gap-6'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className='rounded-lg bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-gray-800/50'>
                <div className='mb-1 text-2xl font-bold text-blue-600 dark:text-blue-400 md:mb-2 md:text-3xl'>
                  7
                </div>
                <div className='text-xs text-gray-600 dark:text-gray-400 md:text-sm'>
                  核心业务领域
                </div>
              </div>
              <div className='rounded-lg bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-gray-800/50'>
                <div className='mb-1 text-2xl font-bold text-green-600 dark:text-green-400 md:mb-2 md:text-3xl'>
                  1000+
                </div>
                <div className='text-xs text-gray-600 dark:text-gray-400 md:text-sm'>成功项目</div>
              </div>
              <div className='rounded-lg bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-gray-800/50'>
                <div className='mb-1 text-2xl font-bold text-purple-600 dark:text-purple-400 md:mb-2 md:text-3xl'>
                  500+
                </div>
                <div className='text-xs text-gray-600 dark:text-gray-400 md:text-sm'>合作客户</div>
              </div>
              <div className='rounded-lg bg-white/50 p-4 text-center backdrop-blur-sm dark:bg-gray-800/50'>
                <div className='mb-1 text-2xl font-bold text-orange-600 dark:text-orange-400 md:mb-2 md:text-3xl'>
                  99%
                </div>
                <div className='text-xs text-gray-600 dark:text-gray-400 md:text-sm'>
                  客户满意度
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          {!maxItems && (
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Button
                size='lg'
                className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl'
              >
                了解更多业务详情
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  )
}

// 预设的业务领域展示变体
export function CompactBusinessDomains({
  maxItems = 4,
  className,
}: Omit<BusinessDomainsProps, 'variant'>) {
  return (
    <BusinessDomains
      variant='compact'
      maxItems={maxItems}
      className={className}
      showFilter={false}
      showViewToggle={false}
    />
  )
}

export function FeaturedBusinessDomains({
  maxItems = 6,
  className,
}: Omit<BusinessDomainsProps, 'variant'>) {
  return (
    <BusinessDomains
      variant='featured'
      maxItems={maxItems}
      className={className}
      showFilter={true}
      showViewToggle={false}
    />
  )
}

export function FullBusinessDomains({
  className,
}: Omit<BusinessDomainsProps, 'variant' | 'maxItems'>) {
  return (
    <BusinessDomains
      variant='default'
      className={className}
      showFilter={true}
      showViewToggle={true}
    />
  )
}

export function CarouselBusinessDomains({
  maxItems = 7,
  className,
}: Omit<BusinessDomainsProps, 'variant'>) {
  return (
    <BusinessDomains
      variant='carousel'
      maxItems={maxItems}
      className={className}
      showFilter={false}
      showViewToggle={false}
    />
  )
}
