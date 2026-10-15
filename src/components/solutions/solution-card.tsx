'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Users, CheckCircle, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
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
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SolutionCardProps {
  solution: Solution
  index?: number
  variant?: 'default' | 'compact' | 'featured'
  className?: string
  showMetrics?: boolean
  showCTA?: boolean
  showBenefits?: boolean
}

export function SolutionCard({
  solution,
  index = 0,
  variant = 'default',
  className,
  showMetrics = true,
  showCTA = true,
  showBenefits = false,
}: SolutionCardProps) {
  // 使用默认图标，因为数据库中的solution没有icon字段
  const Icon = Package

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  }

  const hoverVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  const baseClasses = cn(
    'group relative overflow-hidden rounded-xl md:rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300',
    {
      'h-auto min-h-[350px] md:min-h-[400px]': variant === 'default',
      'h-64 md:h-72': variant === 'compact',
      'h-96 md:h-[28rem]': variant === 'featured',
    },
    className
  )

  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      whileInView='visible'
      whileHover='hover'
      viewport={{ once: true }}
      className={baseClasses}
    >
      <motion.div variants={hoverVariants} className='h-full'>
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-5 transition-opacity duration-300 group-hover:opacity-10`}
        />

        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${solution.accentColor === 'blue' ? '3B82F6' : solution.accentColor === 'green' ? '10B981' : solution.accentColor === 'purple' ? '8B5CF6' : '6B7280'}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className='relative flex h-full flex-col p-4 md:p-6'>
          {/* Header */}
          <div className='mb-3 flex items-start justify-between md:mb-4'>
            <div className='flex min-w-0 flex-1 items-center space-x-2 md:space-x-3'>
              <div
                className={`rounded-lg bg-gradient-to-br p-2 md:rounded-xl md:p-3 ${solution.gradient} flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className='h-5 w-5 text-white md:h-6 md:w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='truncate text-base font-bold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-200 md:text-lg'>
                  {solution.title}
                </h3>
                <p className='truncate text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 md:text-sm'>
                  {solution.subtitle}
                </p>
              </div>
            </div>

            <Link href={`/solutions/${solution.slug}`}>
              <Button
                variant='ghost'
                size='icon'
                className='flex-shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
              >
                <ExternalLink className='h-4 w-4' />
              </Button>
            </Link>
          </div>

          {/* Description */}
          <p className='mb-3 line-clamp-3 flex-grow text-xs leading-relaxed text-gray-600 dark:text-gray-300 md:mb-4 md:line-clamp-none md:text-sm'>
            {solution.description}
          </p>

          {/* Features */}
          {variant !== 'compact' && (
            <div className='mb-3 md:mb-4'>
              <div className='grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2'>
                {solution.features.slice(0, variant === 'featured' ? 6 : 4).map((feature, idx) => (
                  <div
                    key={idx}
                    className='flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400'
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${solution.gradient} flex-shrink-0`}
                    />
                    <span className='truncate'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications */}
          {variant === 'featured' && solution.applications && (
            <div className='mb-3 md:mb-4'>
              <h4 className='mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300'>
                应用场景
              </h4>
              <div className='flex flex-wrap gap-1'>
                {solution.applications.slice(0, 4).map((app, idx) => (
                  <span
                    key={idx}
                    className={`rounded-full bg-gradient-to-r px-2 py-1 text-xs ${solution.gradient} bg-opacity-10 text-${solution.accentColor}-700 dark:text-${solution.accentColor}-300`}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {showBenefits && solution.benefits && variant === 'featured' && (
            <div className='mb-3 md:mb-4'>
              <h4 className='mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300'>
                核心优势
              </h4>
              <div className='space-y-1'>
                {solution.benefits.slice(0, 3).map((benefit, idx) => (
                  <div
                    key={idx}
                    className='flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400'
                  >
                    <CheckCircle className='h-3 w-3 flex-shrink-0 text-green-500' />
                    <span className='truncate'>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {showMetrics && solution.metrics && solution.metrics.length > 0 && (
            <div className='mb-3 md:mb-4'>
              <div className='grid grid-cols-3 gap-2 md:gap-3'>
                {solution.metrics.map((metric, idx) => {
                  const getMetricColor = () => {
                    switch (solution.accentColor) {
                      case 'blue':
                        return 'text-blue-600 dark:text-blue-400'
                      case 'cyan':
                        return 'text-cyan-600 dark:text-cyan-400'
                      case 'orange':
                        return 'text-orange-600 dark:text-orange-400'
                      case 'slate':
                        return 'text-slate-600 dark:text-slate-400'
                      case 'emerald':
                        return 'text-emerald-600 dark:text-emerald-400'
                      case 'purple':
                        return 'text-purple-600 dark:text-purple-400'
                      case 'yellow':
                        return 'text-yellow-600 dark:text-yellow-400'
                      case 'green':
                        return 'text-green-600 dark:text-green-400'
                      default:
                        return 'text-gray-600 dark:text-gray-400'
                    }
                  }

                  return (
                    <div key={idx} className='text-center'>
                      <div className={`text-sm font-bold md:text-lg ${getMetricColor()}`}>
                        {metric.value}
                      </div>
                      <div className='truncate text-xs text-gray-500 dark:text-gray-400'>
                        {metric.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          {showCTA && (
            <div className='mt-auto'>
              <Link href={`/solutions/${solution.slug}`}>
                <Button
                  variant='outline'
                  className='w-full text-sm transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-700'
                >
                  了解详情
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
      </motion.div>
    </motion.div>
  )
}

// 紧凑版本的解决方案卡片
export function CompactSolutionCard({
  solution,
  index,
  className,
}: Omit<SolutionCardProps, 'variant'>) {
  return (
    <SolutionCard
      solution={solution}
      index={index}
      variant='compact'
      className={className}
      showMetrics={false}
      showCTA={false}
      showBenefits={false}
    />
  )
}

// 特色版本的解决方案卡片
export function FeaturedSolutionCard({
  solution,
  index,
  className,
}: Omit<SolutionCardProps, 'variant'>) {
  return (
    <SolutionCard
      solution={solution}
      index={index}
      variant='featured'
      className={className}
      showMetrics={true}
      showCTA={true}
      showBenefits={true}
    />
  )
}
