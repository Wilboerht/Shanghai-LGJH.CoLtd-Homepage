'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface SolutionHeroProps {
  badge?: {
    icon: LucideIcon
    text: string
    color?: string
  }
  title: string
  subtitle?: string
  description: string
  metrics?: Array<{
    value: string
    label: string
  }>
  primaryAction?: {
    text: string
    href: string
    icon?: LucideIcon
  }
  secondaryAction?: {
    text: string
    href?: string
    icon?: LucideIcon
    onClick?: () => void
  }
  visualElement?: React.ReactNode
  backgroundGradient?: string
  accentColor?: string
}

export function SolutionHero({
  badge,
  title,
  subtitle,
  description,
  metrics,
  primaryAction,
  secondaryAction,
  visualElement,
  backgroundGradient = 'from-slate-900 via-blue-900 to-indigo-900',
  accentColor = 'blue',
}: SolutionHeroProps) {
  const BadgeIcon = badge?.icon
  const PrimaryIcon = primaryAction?.icon
  const SecondaryIcon = secondaryAction?.icon

  const colorClasses = {
    blue: {
      badge: 'bg-blue-500/20 border-blue-400/30 text-blue-300',
      accent: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
      outline: 'border-blue-400/30 text-blue-300 hover:bg-blue-500/10',
    },
    red: {
      badge: 'bg-red-500/20 border-red-400/30 text-red-300',
      accent: 'text-red-400',
      button: 'bg-red-600 hover:bg-red-700',
      outline: 'border-red-400/30 text-red-300 hover:bg-red-500/10',
    },
    green: {
      badge: 'bg-green-500/20 border-green-400/30 text-green-300',
      accent: 'text-green-400',
      button: 'bg-green-600 hover:bg-green-700',
      outline: 'border-green-400/30 text-green-300 hover:bg-green-500/10',
    },
    purple: {
      badge: 'bg-purple-500/20 border-purple-400/30 text-purple-300',
      accent: 'text-purple-400',
      button: 'bg-purple-600 hover:bg-purple-700',
      outline: 'border-purple-400/30 text-purple-300 hover:bg-purple-500/10',
    },
  }

  const colors = colorClasses[accentColor as keyof typeof colorClasses] || colorClasses.blue

  return (
    <section
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br ${backgroundGradient}`}
    >
      {/* Background Effects */}
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent'></div>
        {/* Subtle pattern overlay */}
        <div
          className='absolute inset-0 opacity-5'
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      <Container className='relative z-10'>
        <div className='grid min-h-screen grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20'>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className='space-y-8 lg:space-y-10'
          >
            {/* Badge */}
            {badge && (
              <motion.div
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm ${colors.badge}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {BadgeIcon && <BadgeIcon className='mr-2 h-4 w-4' />}
                {badge.text}
              </motion.div>
            )}

            {/* Title */}
            <div>
              <h1 className='mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl'>
                {title}
                {subtitle && <span className={`block ${colors.accent} mt-2`}>{subtitle}</span>}
              </h1>

              <p className='max-w-2xl text-xl leading-relaxed text-gray-200 md:text-2xl'>
                {description}
              </p>
            </div>

            {/* Metrics */}
            {metrics && metrics.length > 0 && (
              <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    className='text-center'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <div className={`mb-1 text-2xl font-bold md:text-3xl ${colors.accent}`}>
                      {metric.value}
                    </div>
                    <div className='text-sm text-gray-400'>{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Actions */}
            <motion.div
              className='flex flex-col gap-6 sm:flex-row'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {primaryAction && (
                <Link href={primaryAction.href}>
                  <Button
                    size='lg'
                    className={`${colors.button} rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105`}
                  >
                    {PrimaryIcon && <PrimaryIcon className='mr-3 h-6 w-6' />}
                    {primaryAction.text}
                  </Button>
                </Link>
              )}

              {secondaryAction && (
                <>
                  {secondaryAction.href ? (
                    <Link href={secondaryAction.href}>
                      <Button
                        size='lg'
                        variant='outline'
                        className={`${colors.outline} rounded-xl px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                      >
                        {SecondaryIcon && <SecondaryIcon className='mr-3 h-6 w-6' />}
                        {secondaryAction.text}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size='lg'
                      variant='outline'
                      className={`${colors.outline} rounded-xl px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                      onClick={secondaryAction.onClick}
                    >
                      {SecondaryIcon && <SecondaryIcon className='mr-3 h-6 w-6' />}
                      {secondaryAction.text}
                    </Button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            className='relative flex items-center justify-center'
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
          >
            {visualElement || (
              <div className='flex aspect-square w-full max-w-lg items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-12 shadow-2xl backdrop-blur-sm'>
                <div className='text-8xl text-white/50'>🚀</div>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
