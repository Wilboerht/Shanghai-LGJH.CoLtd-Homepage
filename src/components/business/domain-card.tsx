'use client'

import * as React from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { BusinessDomain } from '@/data/business'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DomainCardProps {
  domain: BusinessDomain
  index?: number
  variant?: 'default' | 'compact' | 'featured'
  className?: string
  showMetrics?: boolean
  showCTA?: boolean
}

export function DomainCard({
  domain,
  index = 0,
  variant = 'default',
  className,
  showMetrics = true,
  showCTA = true,
}: DomainCardProps) {
  const Icon = domain.icon

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  }

  const hoverVariants: Variants = {
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
      'h-auto min-h-[300px] md:min-h-[350px]': variant === 'default',
      'h-56 md:h-64': variant === 'compact',
      'h-80 md:h-96': variant === 'featured',
    },
    className
  )

  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      whileInView='visible'
      whileHover='hover'
      viewport={{ once: true, margin: '-50px' }}
      className={baseClasses}
    >
      <motion.div variants={hoverVariants} className='h-full'>
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-5 transition-opacity duration-300 group-hover:opacity-10`}
        />

        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${domain.accentColor === 'blue' ? '3B82F6' : domain.accentColor === 'green' ? '10B981' : domain.accentColor === 'purple' ? '8B5CF6' : '6B7280'}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className='relative flex h-full flex-col p-4 md:p-6'>
          {/* Header */}
          <div className='mb-3 flex items-start justify-between md:mb-4'>
            <div className='flex min-w-0 flex-1 items-center space-x-2 md:space-x-3'>
              <div
                className={`rounded-lg bg-gradient-to-br p-2 md:rounded-xl md:p-3 ${domain.gradient} flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className='h-5 w-5 text-white md:h-6 md:w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='truncate text-base font-bold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-200 md:text-lg'>
                  {domain.title}
                </h3>
                <p className='truncate text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 md:text-sm'>
                  {domain.subtitle}
                </p>
              </div>
            </div>

            {domain.href && (
              <Link href={domain.href}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                >
                  <ExternalLink className='h-4 w-4' />
                </Button>
              </Link>
            )}
          </div>

          {/* Description */}
          <p className='mb-3 line-clamp-3 flex-grow text-xs leading-relaxed text-gray-600 dark:text-gray-300 md:mb-4 md:line-clamp-none md:text-sm'>
            {domain.description}
          </p>

          {/* Features */}
          {variant !== 'compact' && (
            <div className='mb-3 md:mb-4'>
              <div className='grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2'>
                {domain.features.slice(0, variant === 'featured' ? 6 : 4).map((feature, idx) => (
                  <div
                    key={idx}
                    className='flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400'
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${domain.gradient} flex-shrink-0`}
                    />
                    <span className='truncate'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {showMetrics && domain.metrics && domain.metrics.length > 0 && (
            <div className='mb-3 md:mb-4'>
              <div className='grid grid-cols-3 gap-2 md:gap-3'>
                {domain.metrics.map((metric, idx) => {
                  const getMetricColor = () => {
                    switch (domain.accentColor) {
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
          {showCTA && domain.href && (
            <div className='mt-auto'>
              <Link href={domain.href}>
                <Button
                  variant='outline'
                  className='w-full transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-700'
                >
                  了解更多
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

// 紧凑版本的业务领域卡片
export function CompactDomainCard({ domain, index, className }: Omit<DomainCardProps, 'variant'>) {
  return (
    <DomainCard
      domain={domain}
      index={index}
      variant='compact'
      className={className}
      showMetrics={false}
      showCTA={false}
    />
  )
}

// 特色版本的业务领域卡片
export function FeaturedDomainCard({ domain, index, className }: Omit<DomainCardProps, 'variant'>) {
  return (
    <DomainCard
      domain={domain}
      index={index}
      variant='featured'
      className={className}
      showMetrics={true}
      showCTA={true}
    />
  )
}
