'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import Image from 'next/image'
import { BusinessDomain } from '@/data/business'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FlipCardsProps {
  domains: BusinessDomain[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
  showControls?: boolean
  showProgress?: boolean
  showIndicators?: boolean
}

export function ScrollableCards({
  domains,
  autoPlay = true,
  autoPlayInterval = 4000,
  className,
  showControls = true,
  showProgress = true,
  showIndicators = true,
}: FlipCardsProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  const [isHovered, setIsHovered] = React.useState(false)
  const [direction, setDirection] = React.useState(0) // 1 for next, -1 for previous

  // 自动播放逻辑
  React.useEffect(() => {
    if (!isPlaying || isHovered) return

    const interval = setInterval(() => {
      handleNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, isHovered, currentIndex, autoPlayInterval])

  // 键盘导航
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex(prev => (prev + 1) % domains.length)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex(prev => (prev - 1 + domains.length) % domains.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // 简化的翻页动画变体
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <section className={cn('relative py-8 md:py-12 lg:py-16', className)}>
      <div className='relative z-10 w-full'>
        {/* 标题区域 */}
        <motion.div
          className='mb-8 px-4 text-center md:mb-12'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl'>
            核心业务领域
          </h2>
          <p className='mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300 md:text-xl'>
            临港景鸿专注于7大核心业务领域，为客户提供全方位的智能化解决方案
          </p>
        </motion.div>

        {/* 翻页卡片容器 */}
        <div
          className='relative h-[700px] w-full px-8'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className='relative h-full overflow-hidden rounded-2xl'>
            <AnimatePresence initial={false} custom={direction} mode='wait'>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{
                  x: { type: 'tween', duration: 0.3 },
                  opacity: { duration: 0.3 },
                }}
                drag='x'
                dragConstraints={{ left: -200, right: 200 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x)

                  if (swipe < -swipeConfidenceThreshold) {
                    handleNext()
                  } else if (swipe > swipeConfidenceThreshold) {
                    handlePrevious()
                  }
                }}
                className='absolute inset-0'
              >
                <FlipBusinessCard domain={domains[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 翻页箭头按钮 */}
        <>
          {/* 左箭头 */}
          <motion.button
            onClick={handlePrevious}
            className='absolute -left-8 top-1/2 z-30 flex h-16 w-16 -translate-y-1/2 items-center justify-center text-gray-600 transition-all duration-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            whileHover={{ scale: 1.2, x: -2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <ChevronLeft className='h-10 w-10' strokeWidth={3} />
          </motion.button>

          {/* 右箭头 */}
          <motion.button
            onClick={handleNext}
            className='absolute -right-8 top-1/2 z-30 flex h-16 w-16 -translate-y-1/2 items-center justify-center text-gray-600 transition-all duration-300 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            whileHover={{ scale: 1.2, x: 2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <ChevronRight className='h-10 w-10' strokeWidth={3} />
          </motion.button>
        </>

        {/* 播放/暂停按钮 */}
        {showControls && (
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className='absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-600 backdrop-blur-sm transition-all duration-300 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-400 dark:hover:text-white'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {isPlaying ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
          </motion.button>
        )}

        {/* 翻页提示 */}
        <motion.div
          className='absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm text-white backdrop-blur-sm dark:bg-white/20 dark:text-gray-200'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <ChevronLeft className='h-4 w-4' />
          <span>拖拽或点击箭头翻页</span>
          <ChevronRight className='h-4 w-4' />
        </motion.div>

        {/* 指示器 */}
        {showIndicators && (
          <motion.div
            className='mt-8 flex justify-center gap-2'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {domains.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
                  index === currentIndex
                    ? 'w-8 bg-gray-600 dark:bg-gray-400'
                    : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + 0.5 }}
              />
            ))}
          </motion.div>
        )}

        {/* 进度条 */}
        {showProgress && (
          <motion.div
            className='mx-auto mt-6 max-w-md'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className='mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
              <span>{domains[currentIndex].title}</span>
              <span>
                {currentIndex + 1} / {domains.length}
              </span>
            </div>
            <div className='h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
              <motion.div
                className='h-1 rounded-full bg-gray-600 dark:bg-gray-400'
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / domains.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// 获取业务领域对应的产品和方案
function getRelatedProductsAndSolutions(domainId: string, domainTitle: string) {
  const domainMapping: Record<string, { products: string[]; solutions: string[] }> = {
    'intelligent-products': {
      products: [
        'integrated-management-platform',
        'operation-maintenance-platform',
        'edge-computing-center',
        'big-data-center',
      ],
      solutions: ['smart-park-integrated', 'smart-building-management'],
    },
    'ai-research': {
      products: ['ai-analysis-platform', 'intelligent-recognition-system'],
      solutions: ['ai-security-solution', 'intelligent-analysis-platform'],
    },
    'digital-transformation': {
      products: ['digital-platform', 'cloud-management-system'],
      solutions: ['digital-transformation-solution', 'enterprise-digitalization'],
    },
    'intelligent-operation': {
      products: ['operation-platform', 'monitoring-system'],
      solutions: ['smart-operation-solution', 'intelligent-maintenance'],
    },
    'intelligent-engineering': {
      products: ['engineering-management-platform', 'project-control-system'],
      solutions: ['smart-construction-solution', 'engineering-digitalization'],
    },
    'fire-engineering': {
      products: ['fire-alarm-system', 'fire-control-platform'],
      solutions: ['fire-safety-solution', 'emergency-response-system'],
    },
    'risk-assessment': {
      products: ['risk-analysis-platform', 'assessment-tools'],
      solutions: ['risk-management-solution', 'safety-assessment-platform'],
    },
  }

  const mapping = domainMapping[domainId] || { products: [], solutions: [] }

  // 由于我们已经移除了硬编码数据，这里返回空数组
  // 在实际应用中，这些数据应该通过API动态获取
  const relatedProducts: any[] = []
  const relatedSolutions: any[] = []

  return { products: relatedProducts, solutions: relatedSolutions }
}

// 翻页式业务卡片组件
function FlipBusinessCard({ domain }: { domain: BusinessDomain }) {
  const Icon = domain.icon
  const [imageError, setImageError] = React.useState(false)
  const { products, solutions } = getRelatedProductsAndSolutions(domain.id, domain.title)

  return (
    <div className='relative h-full w-full overflow-hidden rounded-2xl'>
      {/* 背景图片 */}
      <div className='absolute inset-0'>
        {!imageError ? (
          <Image
            src={domain.image}
            alt={domain.title}
            fill
            className='object-cover'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-600'>
            <Icon className='h-32 w-32 text-gray-400 opacity-20' />
          </div>
        )}
      </div>

      {/* 左侧图片蒙版 */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent'></div>

      {/* 右侧白色背景 */}
      <div className='absolute bottom-0 right-0 top-0 w-full bg-gradient-to-l from-white via-white to-white/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900/80 lg:w-3/5'></div>

      <div className='relative z-10 grid h-full grid-cols-1 lg:grid-cols-5'>
        {/* 左侧 - 图片和基本信息 */}
        <div className='relative lg:col-span-2'>
          {/* 内容覆盖层 */}
          <div className='relative z-10 flex h-full flex-col justify-center p-8 lg:p-12'>
            {/* 图标 */}
            <div className='mb-6'>
              <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm'>
                <Icon className='h-10 w-10 text-gray-600' />
              </div>
            </div>

            {/* 标题和副标题 */}
            <div>
              <h3 className='mb-4 text-4xl font-bold leading-tight text-white drop-shadow-lg lg:text-5xl'>
                {domain.title}
              </h3>
              <p className='mb-6 text-xl text-white/90 drop-shadow'>{domain.subtitle}</p>
              <p className='text-lg leading-relaxed text-white/80 drop-shadow'>
                {domain.description}
              </p>
            </div>

            {/* 关键指标 */}
            <div className='mt-8 grid grid-cols-3 gap-4'>
              {domain.metrics.map((metric, index) => (
                <div
                  key={index}
                  className='rounded-lg bg-white/20 p-3 text-center backdrop-blur-sm'
                >
                  <div className='text-2xl font-bold text-white drop-shadow'>{metric.value}</div>
                  <div className='text-sm text-white/80'>{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧 - 详细信息 */}
        <div className='flex flex-col p-6 lg:col-span-3 lg:p-8'>
          <div className='flex h-full flex-col space-y-8'>
            {/* 应用场景 */}
            <div className='flex flex-col'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>应用场景</h4>
              <div className='mb-2 flex flex-wrap gap-2'>
                {domain.applications.map((app, index) => (
                  <span
                    key={index}
                    className='rounded-md bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* 相关产品和方案 */}
            <div className='flex flex-col'>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* 产品列 */}
                <div className='flex flex-col'>
                  <div className='mb-4 flex items-center'>
                    <div className='mr-2 h-3 w-3 rounded-full bg-blue-500'></div>
                    <span className='text-sm font-semibold text-blue-600 dark:text-blue-400'>
                      核心产品
                    </span>
                  </div>
                  {products.length > 0 ? (
                    <div className='space-y-3'>
                      {products.slice(0, 2).map((product, index) => (
                        <div key={`product-${index}`} className='group cursor-pointer'>
                          <div className='flex items-start rounded-lg border border-blue-100 bg-blue-50/50 p-3 transition-colors hover:bg-blue-100/70 dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:bg-blue-900/20'>
                            <div className='mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400'></div>
                            <div className='flex-1'>
                              <div className='text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300'>
                                {product.title}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {products.length > 2 && (
                        <div className='py-2 text-center'>
                          <span className='rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'>
                            +{products.length - 2} 更多
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {domain.features.slice(0, 2).map((feature, index) => (
                        <div
                          key={`feature-${index}`}
                          className='flex items-start rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50'
                        >
                          <div className='mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400'></div>
                          <div className='text-sm text-gray-700 dark:text-gray-300'>{feature}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 方案列 */}
                <div className='flex flex-col'>
                  <div className='mb-4 flex items-center'>
                    <div className='mr-2 h-3 w-3 rounded-full bg-green-500'></div>
                    <span className='text-sm font-semibold text-green-600 dark:text-green-400'>
                      解决方案
                    </span>
                  </div>
                  {solutions.length > 0 ? (
                    <div className='space-y-3'>
                      {solutions.slice(0, 2).map((solution, index) => (
                        <div key={`solution-${index}`} className='group cursor-pointer'>
                          <div className='flex items-start rounded-lg border border-green-100 bg-green-50/50 p-3 transition-colors hover:bg-green-100/70 dark:border-green-900/30 dark:bg-green-900/10 dark:hover:bg-green-900/20'>
                            <div className='mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400'></div>
                            <div className='flex-1'>
                              <div className='text-sm font-medium text-gray-900 transition-colors group-hover:text-green-700 dark:text-white dark:group-hover:text-green-300'>
                                {solution.title}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {solutions.length > 2 && (
                        <div className='py-2 text-center'>
                          <span className='rounded-full bg-green-50 px-3 py-1 text-xs text-green-600 dark:bg-green-900/20 dark:text-green-400'>
                            +{solutions.length - 2} 更多
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {domain.features.slice(2, 4).map((feature, index) => (
                        <div
                          key={`feature-${index + 2}`}
                          className='flex items-start rounded-lg border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/50'
                        >
                          <div className='mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400'></div>
                          <div className='text-sm text-gray-700 dark:text-gray-300'>{feature}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 关键指标 */}
            <div className='flex flex-col'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>关键指标</h4>
              <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
                {domain.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className='rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center dark:from-gray-700 dark:to-gray-600'
                  >
                    <div className='mb-1 text-2xl font-bold text-gray-900 dark:text-white'>
                      {metric.value}
                    </div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 项目优势 */}
            <div className='flex flex-col'>
              <h4 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>项目优势</h4>
              <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
                <div className='flex items-center rounded-lg bg-green-50 p-3 dark:bg-green-900/20'>
                  <div className='mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></div>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>专业团队支持</span>
                </div>
                <div className='flex items-center rounded-lg bg-green-50 p-3 dark:bg-green-900/20'>
                  <div className='mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></div>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>完整解决方案</span>
                </div>
                <div className='flex items-center rounded-lg bg-green-50 p-3 dark:bg-green-900/20'>
                  <div className='mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></div>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>持续技术更新</span>
                </div>
                <div className='flex items-center rounded-lg bg-green-50 p-3 dark:bg-green-900/20'>
                  <div className='mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></div>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>7×24小时服务</span>
                </div>
              </div>
            </div>

            {/* 底部操作区 */}
            <div className='mt-auto flex flex-col'>
              <div className='border-t border-gray-200 pt-6 dark:border-gray-600'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                    <span>{domain.applications.length} 应用场景</span>
                    <span>{products.length + solutions.length} 产品方案</span>
                  </div>
                  <button className='rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'>
                    了解更多
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
