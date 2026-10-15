'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
  decimals?: number
}

export function AnimatedNumber({
  value,
  duration = 2000,
  className = '',
  suffix = '',
  prefix = '',
  decimals = 0,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    setIsAnimating(true)
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Enhanced easing function for more dramatic effect
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const currentValue = value * easeOutExpo

      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    // Add a small delay before starting animation
    const startDelay = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, 100)

    return () => {
      clearTimeout(startDelay)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isInView, value, duration])

  const formatNumber = (num: number) => {
    return num.toFixed(decimals)
  }

  return (
    <div ref={ref} className={className}>
      <motion.span
        animate={isAnimating ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, repeat: isAnimating ? Infinity : 0, repeatType: 'reverse' }}
      >
        {prefix}
        {formatNumber(displayValue)}
        {suffix}
      </motion.span>
    </div>
  )
}

interface SlotMachineNumberProps {
  value: string
  className?: string
  delay?: number
}

export function SlotMachineNumber({ value, className = '', delay = 0 }: SlotMachineNumberProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isInView) return

    const timer = setTimeout(() => {
      let currentIndex = 0
      const targetValue = value
      const duration = 1500 // Total animation duration
      const steps = 20 // Number of animation steps
      const stepDuration = duration / steps

      const animate = () => {
        if (currentIndex < steps) {
          // Generate deterministic intermediate values for slot machine effect
          if (currentIndex < steps - 1) {
            const pseudoRandomValue = ((currentIndex * 7 + parseInt(value) * 3) % 10).toString()
            setDisplayValue(pseudoRandomValue)
          } else {
            // Final value
            setDisplayValue(targetValue)
          }

          currentIndex++
          setTimeout(animate, stepDuration)
        }
      }

      animate()
    }, delay)

    return () => clearTimeout(timer)
  }, [mounted, isInView, value, delay])

  return (
    <div ref={ref} className={className}>
      <motion.span
        key={displayValue}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {displayValue}
      </motion.span>
    </div>
  )
}

interface AnimatedStatProps {
  value: string
  suffix?: string
  prefix?: string
  label: string
  className?: string
  delay?: number
}

export function AnimatedStat({
  value,
  suffix = '',
  prefix = '',
  label,
  className = '',
  delay = 0,
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Extract numeric part and non-numeric parts
  const numericMatch = value.match(/(\d+\.?\d*)/)
  const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0
  const beforeNumber = value.substring(0, value.indexOf(numericMatch?.[1] || ''))
  const afterNumber = value.substring(
    value.indexOf(numericMatch?.[1] || '') + (numericMatch?.[1]?.length || 0)
  )

  // Determine if this is a ranking stat for special styling
  const isRanking = className.includes('ranking-stat')
  const numberClassName = isRanking
    ? 'text-2xl md:text-3xl font-bold text-red-600 mb-2'
    : 'text-3xl md:text-4xl font-bold text-red-600 mb-2'

  return (
    <motion.div
      ref={ref}
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
      transition={{
        duration: 0.8,
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
    >
      <motion.div
        className={numberClassName}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        {prefix}
        {beforeNumber}
        {isRanking && numericValue ? (
          <span className='text-3xl md:text-4xl'>
            <AnimatedNumber
              value={numericValue}
              duration={2000}
              decimals={value.includes('.') ? 1 : 0}
              className='inline'
            />
          </span>
        ) : (
          <AnimatedNumber
            value={numericValue}
            duration={2000}
            decimals={value.includes('.') ? 1 : 0}
            className='inline'
          />
        )}
        {afterNumber}
        {suffix}
      </motion.div>
      <motion.div
        className='text-sm text-gray-600 dark:text-gray-400'
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.5 }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </motion.div>
  )
}
