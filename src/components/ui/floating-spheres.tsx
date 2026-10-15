'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Shield, Camera, Users, Brain } from 'lucide-react'

interface FloatingSphere {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  gradient: string
  description: string
  position: {
    x: number
    y: number
  }
}

const spheres: FloatingSphere[] = [
  {
    id: 'fire',
    title: '消防',
    icon: <Shield className='h-8 w-8' />,
    color: 'from-red-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-red-500/20 to-orange-500/20',
    description: '消防安全防护',
    position: { x: 20, y: 25 },
  },
  {
    id: 'tech',
    title: '技防',
    icon: <Camera className='h-8 w-8' />,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    description: '技术防范系统',
    position: { x: 70, y: 20 },
  },
  {
    id: 'human',
    title: '人防',
    icon: <Users className='h-8 w-8' />,
    color: 'from-green-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
    description: '人员防护体系',
    position: { x: 25, y: 75 },
  },
  {
    id: 'smart',
    title: '智防',
    icon: <Brain className='h-8 w-8' />,
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    description: '智能防护平台',
    position: { x: 75, y: 70 },
  },
]

export function FloatingSpheres() {
  return (
    <div className='relative h-96 w-full overflow-hidden'>
      {/* 背景装饰 */}
      <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10' />

      {/* 漂浮的小球 */}
      {spheres.map((sphere, index) => (
        <motion.div
          key={sphere.id}
          className='group absolute cursor-pointer'
          style={{
            left: `${sphere.position.x}%`,
            top: `${sphere.position.y}%`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: -50,
            y: -50,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            x: -50,
            y: -50,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: index * 0.2,
            type: 'spring',
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
          animate={{
            y: [-50 + Math.sin(index * 0.5) * 15, -50 + Math.sin(index * 0.5 + Math.PI) * 15],
            x: [-50 + Math.cos(index * 0.3) * 8, -50 + Math.cos(index * 0.3 + Math.PI) * 8],
            rotate: [0, 360],
            transition: {
              y: {
                duration: 4 + index * 0.8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
              x: {
                duration: 5 + index * 0.6,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
              rotate: {
                duration: 20 + index * 5,
                repeat: Infinity,
                ease: 'linear',
              },
            },
          }}
        >
          {/* 小球主体 */}
          <div
            className={`
            relative h-28 w-28 rounded-full
            ${sphere.gradient}
            hover:shadow-3xl flex items-center
            justify-center border
            border-white/30 shadow-2xl
            backdrop-blur-sm transition-all duration-500
            group-hover:scale-105
            group-hover:border-white/50
          `}
          >
            {/* 外层光环 */}
            <div
              className={`
              absolute -inset-2 rounded-full
              bg-gradient-to-br ${sphere.color}
              animate-pulse opacity-10
              blur-md transition-all
              duration-500 group-hover:opacity-20
            `}
            />

            {/* 内层光环 */}
            <div
              className={`
              absolute -inset-1 rounded-full
              bg-gradient-to-br ${sphere.color}
              opacity-15 blur-sm
              transition-all duration-500
              group-hover:opacity-25
            `}
            />

            {/* 图标容器 */}
            <div
              className={`
              relative z-10 bg-gradient-to-br text-white ${sphere.color}
              rounded-full p-3 shadow-lg
              transition-all duration-300 group-hover:shadow-xl
            `}
            >
              {sphere.icon}
            </div>

            {/* 闪烁点 */}
            <div className='absolute right-2 top-2 h-2 w-2 animate-ping rounded-full bg-white/60' />
            <div className='absolute bottom-3 left-3 h-1 w-1 animate-pulse rounded-full bg-white/40' />
          </div>

          {/* 标题和描述 */}
          <div className='absolute left-1/2 top-full mt-2 -translate-x-1/2 transform text-center'>
            <h3 className='mb-1 text-lg font-bold text-gray-800 dark:text-white'>{sphere.title}</h3>
            <p className='whitespace-nowrap text-sm text-gray-600 dark:text-gray-300'>
              {sphere.description}
            </p>
          </div>

          {/* 连接线动画 */}
          <motion.div
            className='absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white/50'
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          />
        </motion.div>
      ))}

      {/* 中心标题 */}
      <motion.div
        className='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center'
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className='relative'>
          {/* 背景光晕 */}
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl' />

          {/* 内容 */}
          <div className='relative rounded-2xl border border-white/20 bg-white/80 px-6 py-4 shadow-xl backdrop-blur-sm dark:bg-gray-900/80'>
            <h3 className='mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent'>
              四防合一
            </h3>
            <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>
              全方位安全防护体系
            </p>
          </div>
        </div>
      </motion.div>

      {/* 连接线网络 */}
      <svg className='pointer-events-none absolute inset-0 h-full w-full'>
        <defs>
          <linearGradient id='lineGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='rgba(59, 130, 246, 0.3)' />
            <stop offset='100%' stopColor='rgba(147, 51, 234, 0.3)' />
          </linearGradient>
        </defs>

        {/* 连接线 */}
        {spheres.map((sphere, index) => (
          <motion.line
            key={`line-${index}`}
            x1='50%'
            y1='50%'
            x2={`${sphere.position.x}%`}
            y2={`${sphere.position.y}%`}
            stroke='url(#lineGradient)'
            strokeWidth='1'
            strokeDasharray='5,5'
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.5,
              delay: 1 + index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  )
}
