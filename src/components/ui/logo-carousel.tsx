'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface LogoItem {
  name: string
  logo?: string
  logoText?: string
  logoColor?: string
}

interface LogoCarouselProps {
  logos: LogoItem[]
  title?: string
  speed?: number
  className?: string
}

export function LogoCarousel({
  logos,
  title = '已为 500+ 企业提供专业服务',
  speed = 30,
  className = '',
}: LogoCarouselProps) {
  // 复制logos数组以创建无缝循环效果
  const duplicatedLogos = [...logos, ...logos, ...logos]

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {title && (
        <div className='mb-8 text-center'>
          <p className='text-sm text-slate-600 dark:text-slate-400'>{title}</p>
        </div>
      )}

      <div className='relative'>
        {/* 渐变遮罩 */}
        <div className='absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80' />
        <div className='absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80' />

        {/* 传送带容器 */}
        <div className='flex overflow-hidden py-4'>
          <motion.div
            className='flex items-center gap-12'
            animate={{
              x: [-112 * logos.length, 0],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: speed,
                ease: 'linear',
              },
            }}
            style={{
              width: `${112 * logos.length * 3}px`,
            }}
          >
            {duplicatedLogos.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className='group flex h-20 w-28 flex-shrink-0 items-center justify-center'
              >
                {item.logo ? (
                  <div className='relative h-14 w-20'>
                    <Image
                      src={item.logo}
                      alt={`${item.name} logo`}
                      fill
                      className='object-contain opacity-50 grayscale filter transition-all duration-500 group-hover:opacity-80 group-hover:grayscale-0'
                    />
                  </div>
                ) : (
                  <div
                    className='flex h-14 w-20 items-center justify-center rounded-xl text-xl font-bold text-white opacity-50 shadow-sm transition-all duration-500 group-hover:opacity-80'
                    style={{ backgroundColor: item.logoColor || '#64748b' }}
                  >
                    {item.logoText || item.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// 默认的企业logo数据
export const defaultCompanyLogos: LogoItem[] = [
  { name: '上海浦东机场', logoText: '浦东', logoColor: '#1e40af' },
  { name: '上海虹桥机场', logoText: '虹桥', logoColor: '#e11d48' },
  { name: '中国移动', logoText: '移动', logoColor: '#059669' },
  { name: '中国电信', logoText: '电信', logoColor: '#0ea5e9' },
  { name: '国家电网', logoText: '电网', logoColor: '#dc2626' },
  { name: '中石化', logoText: '石化', logoColor: '#374151' },
  { name: '招商银行', logoText: '招行', logoColor: '#f59e0b' },
  { name: '工商银行', logoText: '工行', logoColor: '#3b82f6' },
  { name: '华为技术', logoText: '华为', logoColor: '#ef4444' },
  { name: '腾讯科技', logoText: '腾讯', logoColor: '#22c55e' },
  { name: '阿里巴巴', logoText: '阿里', logoColor: '#f59e0b' },
  { name: '百度科技', logoText: '百度', logoColor: '#3b82f6' },
  { name: '京东集团', logoText: '京东', logoColor: '#dc2626' },
  { name: '美团科技', logoText: '美团', logoColor: '#f59e0b' },
  { name: '滴滴出行', logoText: '滴滴', logoColor: '#f59e0b' },
  { name: '字节跳动', logoText: '字节', logoColor: '#1f2937' },
]
