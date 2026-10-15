'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SlotMachineDigitProps {
  targetDigit: string
  delay?: number
  duration?: number
  className?: string
}

function SlotMachineDigit({
  targetDigit,
  delay = 0,
  duration = 1500,
  className = '',
}: SlotMachineDigitProps) {
  const [currentDigit, setCurrentDigit] = useState('0')
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !isInView) return

    const timer = setTimeout(() => {
      setIsAnimating(true)

      // If target is not a digit, just set it directly
      if (!/\d/.test(targetDigit)) {
        setCurrentDigit(targetDigit)
        setIsAnimating(false)
        return
      }

      // Performance optimization: reduce animation complexity on slower devices
      const isSlowDevice =
        typeof navigator !== 'undefined' &&
        navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency < 4

      const target = parseInt(targetDigit)
      let current = 0
      // Reduce animation steps for faster animation
      const baseSteps = isSlowDevice ? 5 : 8
      const steps = Math.min(12, Math.max(baseSteps, duration / 150))
      const stepDuration = duration / steps

      const animate = () => {
        if (current < steps) {
          if (current < steps - 2) {
            // Use a deterministic sequence instead of Math.random() to avoid hydration mismatch
            const pseudoRandomDigit = ((current * 7 + target * 3) % 10).toString()
            setCurrentDigit(pseudoRandomDigit)
          } else if (current === steps - 2) {
            // Show a close number before final
            const closeDigit = target > 0 ? (target - 1).toString() : '9'
            setCurrentDigit(closeDigit)
          } else {
            // Final target digit
            setCurrentDigit(targetDigit)
            setTimeout(() => setIsAnimating(false), 100) // Quick delay to show final bounce
          }

          current++
          // Faster progression with less slowdown
          const multiplier = current > steps - 2 ? 1.5 : 0.6
          setTimeout(animate, stepDuration * multiplier)
        }
      }

      animate()
    }, delay)

    return () => clearTimeout(timer)
  }, [mounted, isInView, targetDigit, delay, duration])

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      <motion.span
        key={currentDigit}
        initial={{ y: -15, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.15,
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        className='inline-block'
        style={{
          color: isAnimating ? '#dc2626' : 'inherit',
          textShadow: isAnimating
            ? '0 0 12px rgba(220, 38, 38, 0.5), 0 0 24px rgba(220, 38, 38, 0.2)'
            : 'none',
          fontWeight: isAnimating ? 'bold' : 'inherit',
          transition: 'color 0.15s ease, text-shadow 0.15s ease, font-weight 0.15s ease',
        }}
      >
        <motion.span
          animate={isAnimating ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{
            duration: 0.2,
            type: 'tween',
            ease: 'easeInOut',
          }}
          className='inline-block'
        >
          {currentDigit}
        </motion.span>
      </motion.span>
    </span>
  )
}

interface SlotMachineNumberProps {
  value: string
  className?: string
  delay?: number
  duration?: number
}

export function SlotMachineNumber({
  value,
  className = '',
  delay = 0,
  duration = 500,
}: SlotMachineNumberProps) {
  const digits = value.split('')

  return (
    <span className={className}>
      {digits.map((digit, index) => (
        <SlotMachineDigit
          key={index}
          targetDigit={digit}
          delay={delay + index * 50} // Faster stagger
          duration={duration}
          className=''
        />
      ))}
    </span>
  )
}

interface EnhancedAnimatedStatProps {
  value: string
  suffix?: string
  prefix?: string
  label: string
  className?: string
  delay?: number
}

export function EnhancedAnimatedStat({
  value,
  suffix = '',
  prefix = '',
  label,
  className = '',
  delay = 0,
}: EnhancedAnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Extract numeric part and non-numeric parts
  const numericMatch = value.match(/(\d+\.?\d*)/)
  const numericPart = numericMatch ? numericMatch[1] : ''
  const beforeNumber = value.substring(0, value.indexOf(numericPart))
  const afterNumber = value.substring(value.indexOf(numericPart) + numericPart.length)

  // Determine if this is a ranking stat for special styling
  const isRanking = className.includes('ranking-stat')
  const numberClassName = isRanking
    ? 'text-2xl md:text-3xl font-bold text-red-600'
    : 'text-3xl md:text-4xl font-bold text-red-600'

  return (
    <motion.div
      ref={ref}
      className={`text-center ${className} relative flex min-h-[80px] flex-col items-center justify-start`}
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.8 }}
      transition={{
        duration: 0.8,
        delay,
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
    >
      {/* Background glow effect */}
      <motion.div
        className='from-red-500/8 absolute inset-0 rounded-xl bg-gradient-to-r to-red-600/5 blur-2xl'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1.2, delay: delay + 0.5 }}
      />

      {/* Subtle border effect */}
      <motion.div
        className='absolute inset-0 rounded-lg border border-gray-200/20 dark:border-gray-700/20'
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
      />

      <motion.div
        className={`${numberClassName} relative z-10 flex min-h-[40px] flex-shrink-0 items-center justify-center`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
        style={{ lineHeight: '1.2' }}
      >
        {prefix}
        {beforeNumber}
        {isRanking && numericPart ? (
          <span className='text-3xl md:text-4xl'>
            <SlotMachineNumber value={numericPart} delay={delay * 1000 + 500} duration={1000} />
          </span>
        ) : numericPart ? (
          <SlotMachineNumber value={numericPart} delay={delay * 1000 + 500} duration={1000} />
        ) : null}
        {afterNumber}
        {suffix}
      </motion.div>
      <motion.div
        className='relative z-10 mt-1 flex min-h-[30px] flex-grow items-start justify-center text-sm text-gray-600 dark:text-gray-400'
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.7 }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </motion.div>
  )
}
