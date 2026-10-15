'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface FreshHeroBackgroundProps {
  children: React.ReactNode
  theme?: 'blue' | 'green' | 'purple' | 'orange'
}

export function FreshHeroBackground({ children, theme = 'blue' }: FreshHeroBackgroundProps) {
  const themeColors = {
    blue: {
      primary: 'from-slate-50 via-blue-50 to-indigo-100',
      accent1: 'bg-blue-200/30',
      accent2: 'bg-indigo-200/20',
      accent3: 'bg-sky-200/25',
      dot: 'bg-blue-300/40',
      line: 'stroke-blue-200/50',
    },
    green: {
      primary: 'from-emerald-50 via-green-50 to-teal-100',
      accent1: 'bg-emerald-200/30',
      accent2: 'bg-green-200/20',
      accent3: 'bg-teal-200/25',
      dot: 'bg-emerald-300/40',
      line: 'stroke-emerald-200/50',
    },
    purple: {
      primary: 'from-purple-50 via-violet-50 to-indigo-100',
      accent1: 'bg-purple-200/30',
      accent2: 'bg-violet-200/20',
      accent3: 'bg-indigo-200/25',
      dot: 'bg-purple-300/40',
      line: 'stroke-purple-200/50',
    },
    orange: {
      primary: 'from-orange-50 via-amber-50 to-yellow-100',
      accent1: 'bg-orange-200/30',
      accent2: 'bg-amber-200/20',
      accent3: 'bg-yellow-200/25',
      dot: 'bg-orange-300/40',
      line: 'stroke-orange-200/50',
    },
  }

  const colors = themeColors[theme]

  return (
    <section
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br ${colors.primary}`}
    >
      {/* 主背景层 */}
      <div className='absolute inset-0'>
        {/* 柔和的径向渐变 */}
        <div
          className='absolute inset-0'
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 50%, transparent 100%)',
          }}
        ></div>

        {/* 动态几何形状 */}
        <motion.div
          className={`absolute left-20 top-20 h-32 w-32 ${colors.accent1} rounded-full blur-xl`}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className={`absolute right-32 top-1/3 h-24 w-24 ${colors.accent2} rounded-full blur-lg`}
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        <motion.div
          className={`absolute bottom-1/4 left-1/3 h-20 w-20 ${colors.accent3} rounded-full blur-lg`}
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* 网格点阵 */}
        <div className='absolute inset-0 opacity-30'>
          <div
            className='h-full w-full'
            style={{
              backgroundImage: `radial-gradient(circle, ${theme === 'blue' ? '#3b82f6' : theme === 'green' ? '#10b981' : theme === 'purple' ? '#8b5cf6' : '#f97316'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px',
            }}
          />
        </div>

        {/* SVG 装饰线条 */}
        <svg className='absolute inset-0 h-full w-full' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'>
              <path d='M 60 0 L 0 0 0 60' fill='none' className={colors.line} strokeWidth='0.5' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#grid)' opacity='0.3' />

          {/* 动态曲线 */}
          <motion.path
            d='M0,300 Q400,200 800,300 T1600,300'
            fill='none'
            className={colors.line}
            strokeWidth='2'
            opacity='0.4'
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />

          <motion.path
            d='M0,500 Q600,400 1200,500 T2400,500'
            fill='none'
            className={colors.line}
            strokeWidth='1.5'
            opacity='0.3'
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, ease: 'easeInOut', delay: 0.5 }}
          />
        </svg>

        {/* 浮动粒子 */}
        {[...Array(12)].map((_, i) => {
          // 使用确定性的位置和动画参数避免水合不匹配
          const leftPos = (i * 37) % 100
          const topPos = (i * 23 + 17) % 100
          const duration = 3 + ((i * 13) % 20) / 10
          const delay = ((i * 7) % 20) / 10

          return (
            <motion.div
              key={i}
              className={`absolute h-2 w-2 ${colors.dot} rounded-full`}
              style={{
                left: `${leftPos}%`,
                top: `${topPos}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }}
            />
          )
        })}

        {/* 光晕效果 */}
        <div className='absolute inset-0'>
          <motion.div
            className='absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/20 blur-3xl'
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className='absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-white/15 blur-3xl'
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </div>

        {/* 顶部渐变遮罩 */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5'></div>
      </div>

      {/* 内容区域 */}
      <div className='relative z-10 w-full'>{children}</div>
    </section>
  )
}
