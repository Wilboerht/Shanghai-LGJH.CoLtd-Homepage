'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui/container'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { businessDomains, BusinessDomain } from '@/data/business'
import { DomainFeatureList } from '@/components/business/feature-list'
import { DomainMetrics } from '@/components/business/metrics-display'

export function BusinessCategories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? businessDomains.length - 1 : prevIndex - 1))
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === businessDomains.length - 1 ? 0 : prevIndex + 1))
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === businessDomains.length - 1 ? 0 : prevIndex + 1))
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? businessDomains.length - 1 : prevIndex - 1))
      } else if (event.key === 'ArrowRight') {
        setCurrentIndex(prevIndex => (prevIndex === businessDomains.length - 1 ? 0 : prevIndex + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentDomain = businessDomains[currentIndex]
  const Icon = currentDomain.icon

  return (
    <section className='relative overflow-hidden bg-gray-100 py-16 dark:bg-gray-800'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-300/30 to-gray-400/30 dark:from-gray-600/30 dark:to-gray-700/30' />
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container>
        <div className='mx-auto max-w-7xl'>
          {/* Header */}
          <motion.div
            className='mb-12 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className='mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl'>
              核心业务领域
            </h2>
            <p className='mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
              临港景鸿专注于安防科技创新，为客户提供全方位的安全防护解决方案
            </p>
          </motion.div>

          {/* Main Content */}
          <div
            className='relative'
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              className='group absolute -left-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600'
              aria-label='Previous business category'
            >
              <ChevronLeft className='h-6 w-6 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white' />
            </button>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className='group absolute -right-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-600'
              aria-label='Next business category'
            >
              <ChevronRight className='h-6 w-6 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white' />
            </button>

            <AnimatePresence mode='wait'>
              <motion.div
                key={currentDomain.id}
                className='grid min-h-[400px] grid-cols-1 items-center gap-8 px-12 lg:grid-cols-2'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
              >
                {/* Left Side - Content */}
                <div className='space-y-6'>
                  <div className='flex items-center space-x-4'>
                    <div
                      className={`rounded-2xl bg-gradient-to-br p-4 ${currentDomain.gradient} shadow-lg`}
                    >
                      <Icon className='h-8 w-8 text-white' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold text-gray-900 dark:text-white md:text-3xl'>
                        {currentDomain.title}
                      </h3>
                      <p className='text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                        {currentDomain.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
                    {currentDomain.description}
                  </p>

                  {/* Features */}
                  <DomainFeatureList
                    features={currentDomain.features.slice(0, 4)}
                    accentColor={currentDomain.accentColor}
                    gradient={currentDomain.gradient}
                  />

                  {/* Metrics */}
                  {currentDomain.metrics && currentDomain.metrics.length > 0 && (
                    <DomainMetrics
                      metrics={currentDomain.metrics}
                      accentColor={currentDomain.accentColor}
                    />
                  )}
                </div>

                {/* Right Side - Visual */}
                <div className='relative'>
                  <div className='relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-700'>
                    {/* Actual image with fallback */}
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

                    {/* Fallback/Overlay for when image is missing or loading */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentDomain.gradient} ${currentDomain.image ? 'opacity-40' : 'opacity-80'}`}
                    />
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Icon className='h-24 w-24 text-white/60' />
                    </div>

                    {/* Tech Grid Overlay */}
                    <div className='absolute inset-0 opacity-30'>
                      <div className='grid h-full w-full grid-cols-8 grid-rows-6 gap-1 p-4'>
                        {Array.from({ length: 48 }).map((_, i) => {
                          // 使用确定性的透明度避免水合不匹配
                          const opacity = (i * 7 + 13) % 10 > 7 ? 1 : 0.3
                          return (
                            <motion.div
                              key={i}
                              className='rounded-sm bg-white/20'
                              initial={{ opacity: 0 }}
                              animate={{ opacity }}
                              transition={{
                                duration: 2,
                                delay: i * 0.05,
                                repeat: Infinity,
                                repeatType: 'reverse',
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Domain Tabs */}
            <div className='mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-7'>
              {businessDomains.map((domain, index) => {
                const TabIcon = domain.icon
                return (
                  <button
                    key={domain.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-lg p-3 text-center transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <TabIcon className='mx-auto mb-1 h-5 w-5' />
                    <span className='text-xs font-medium'>{domain.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
