'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Partner {
  id: string
  name: string
  logo?: string
  logoText?: string
  website?: string
  description?: string
  category?: string
}

export function PartnersCarousel() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  // 获取合作伙伴数据
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners?limit=100')
        if (response.ok) {
          const data = await response.json()
          setPartners(data.partners)
        }
      } catch (error) {
        console.error('获取合作伙伴失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  // 合作伙伴内容组件
  const PartnerContent: React.FC<{ partner: Partner }> = ({ partner }) => {
    if (partner.logo) {
      return (
        <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
          <Image
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={120}
            height={48}
            className='h-12 w-auto max-w-[140px] object-contain opacity-70 transition-opacity duration-300 hover:opacity-100'
            onError={e => {
              const target = e.currentTarget as HTMLImageElement
              const parent = target.parentElement
              if (parent) {
                target.style.display = 'none'
                const fallback = document.createElement('div')
                fallback.className =
                  'flex items-center justify-center text-base font-semibold text-gray-500 dark:text-gray-400 h-12'
                fallback.textContent = partner.logoText || partner.name
                parent.appendChild(fallback)
              }
            }}
          />
          <span className='text-center text-sm font-medium text-gray-600 dark:text-gray-400'>
            {partner.name}
          </span>
        </div>
      )
    }

    return (
      <div className='flex h-full w-full flex-col items-center justify-center space-y-2'>
        <div className='flex h-12 items-center justify-center text-base font-semibold text-gray-500 dark:text-gray-400'>
          {partner.logoText || partner.name}
        </div>
        <span className='text-center text-sm font-medium text-gray-600 dark:text-gray-400'>
          {partner.name}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className='mt-8'
      >
        <div className='mb-6 text-center'>
          <h3 className='mb-2 text-lg font-semibold text-slate-900 dark:text-white'>合作伙伴</h3>
          <div className='inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      </motion.div>
    )
  }

  if (partners.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className='mt-8'
      >
        <div className='mb-6 text-center'>
          <h3 className='mb-2 text-lg font-semibold text-slate-900 dark:text-white'>合作伙伴</h3>
          <p className='text-sm text-slate-600 dark:text-slate-400'>已为众多企业提供专业服务</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      <div className='mb-12 text-center'>
        <h2 className='mb-2 text-2xl font-bold text-slate-900 dark:text-white'>合作伙伴</h2>
        <p className='text-slate-600 dark:text-slate-400'>
          已为 {partners.length}+ 企业提供专业服务
        </p>
      </div>

      {/* 单行滚动合作伙伴容器 */}
      <div className='relative overflow-hidden'>
        <div className='animate-scroll flex space-x-16 whitespace-nowrap hover:[animation-play-state:paused]'>
          {/* 第一组合作伙伴 */}
          <div className='flex shrink-0 items-center space-x-16'>
            {partners.map((partner, index) => (
              <div
                key={`partner-first-${partner.id}-${index}`}
                className='flex h-20 w-40 cursor-pointer items-center justify-center px-6 transition-transform duration-300 hover:scale-105'
                title={partner.name}
              >
                {partner.website ? (
                  <a
                    href={partner.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-full w-full items-center justify-center'
                    aria-label={`访问 ${partner.name} 官网`}
                  >
                    <PartnerContent partner={partner} />
                  </a>
                ) : (
                  <PartnerContent partner={partner} />
                )}
              </div>
            ))}
          </div>

          {/* 重复用于无缝循环 */}
          <div className='flex shrink-0 items-center space-x-16'>
            {partners.map((partner, index) => (
              <div
                key={`partner-second-${partner.id}-${index}`}
                className='flex h-20 w-40 cursor-pointer items-center justify-center px-6 transition-transform duration-300 hover:scale-105'
                title={partner.name}
              >
                {partner.website ? (
                  <a
                    href={partner.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-full w-full items-center justify-center'
                    aria-label={`访问 ${partner.name} 官网`}
                  >
                    <PartnerContent partner={partner} />
                  </a>
                ) : (
                  <PartnerContent partner={partner} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
