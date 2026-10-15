'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Partner {
  id: string
  name: string
  logo?: string
  logoText?: string
  website?: string
  description?: string
  category?: string
  displayOrder: number
}

interface PartnersCarouselProps {
  title?: string
  speed?: number
  className?: string
  limit?: number
}

export function PartnersCarousel({
  title = '已为 500+ 企业提供专业服务',
  speed = 40,
  className = '',
  limit = 50,
}: PartnersCarouselProps) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  // 获取合作伙伴数据
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`/api/partners?limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setPartners(data.partners || [])
        } else {
          console.error('获取合作伙伴失败:', response.status)
        }
      } catch (error) {
        console.error('获取合作伙伴失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [limit])

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        {title && (
          <div className='mb-8 text-center'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{title}</p>
          </div>
        )}
        <div className='flex h-20 items-center justify-center'>
          <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-slate-600'></div>
        </div>
      </div>
    )
  }

  // 如果没有数据，显示占位符
  if (partners.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        {title && (
          <div className='mb-8 text-center'>
            <p className='text-sm text-slate-600 dark:text-slate-400'>{title}</p>
          </div>
        )}
        <div className='flex h-20 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800'>
          <div className='text-center'>
            <div className='mb-2 text-slate-400'>🏢</div>
            <p className='text-sm text-slate-500'>暂无合作伙伴数据</p>
            <p className='text-xs text-slate-400'>请在CMS中添加合作伙伴</p>
          </div>
        </div>
      </div>
    )
  }

  // 复制partners数组以创建无缝循环效果
  const duplicatedPartners = [...partners, ...partners, ...partners]

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
              x: [-112 * partners.length, 0],
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
              width: `${112 * partners.length * 3}px`,
            }}
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className='group flex h-20 w-28 flex-shrink-0 cursor-pointer items-center justify-center'
                onClick={() => partner.website && window.open(partner.website, '_blank')}
                title={partner.name}
              >
                {partner.logo ? (
                  <div className='relative h-14 w-20'>
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      className='object-contain opacity-50 grayscale filter transition-all duration-500 group-hover:opacity-80 group-hover:grayscale-0'
                    />
                  </div>
                ) : (
                  <div
                    className='flex h-14 w-20 items-center justify-center rounded-xl text-lg font-bold text-white opacity-50 shadow-sm transition-all duration-500 group-hover:opacity-80'
                    style={{
                      backgroundColor: getPartnerColor(partner.category || partner.name),
                    }}
                  >
                    {partner.logoText || partner.name.charAt(0)}
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

// 根据合作伙伴分类或名称生成颜色
function getPartnerColor(categoryOrName: string): string {
  const colors = [
    '#1e40af',
    '#e11d48',
    '#059669',
    '#0ea5e9',
    '#dc2626',
    '#374151',
    '#f59e0b',
    '#3b82f6',
    '#ef4444',
    '#22c55e',
    '#8b5cf6',
    '#f97316',
    '#06b6d4',
    '#84cc16',
    '#ec4899',
  ]

  // 基于字符串生成一致的颜色索引
  let hash = 0
  for (let i = 0; i < categoryOrName.length; i++) {
    hash = categoryOrName.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
