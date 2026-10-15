'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { Container } from '@/components/ui/container'

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

// 合作伙伴Logo组件 - 只显示logo，统一视觉大小
const PartnerLogo: React.FC<{ partner: Partner }> = ({ partner }) => {
  if (partner.logo) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={160}
          height={80}
          className='h-16 w-auto max-w-[160px] object-contain opacity-60 grayscale filter transition-all duration-300 hover:opacity-90 hover:grayscale-0'
          onError={e => {
            const target = e.currentTarget as HTMLImageElement
            const parent = target.parentElement
            if (parent) {
              target.style.display = 'none'
              const fallback = document.createElement('div')
              fallback.className =
                'flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500 w-full h-16 bg-gray-100 dark:bg-gray-800 rounded-lg'
              fallback.textContent = partner.logoText || partner.name.substring(0, 2).toUpperCase()
              parent.appendChild(fallback)
            }
          }}
        />
      </div>
    )
  }

  // 没有logo时显示文字logo
  return (
    <div className='flex h-16 w-full items-center justify-center rounded-lg bg-gray-100 opacity-60 transition-all duration-300 hover:opacity-90 dark:bg-gray-800'>
      <span className='text-xl font-bold text-gray-600 dark:text-gray-400'>
        {partner.logoText || partner.name.substring(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

export function Partners() {
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

  if (loading) {
    return (
      <section className='bg-white py-16 dark:bg-slate-900 md:py-20'>
        <Container>
          <div className='mx-auto max-w-7xl'>
            <motion.div
              className='-mx-6 mb-20 md:-mx-12 lg:-mx-24'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className='mb-8 px-6 text-center md:px-12 lg:px-24'>
                <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl'>
                  汇聚伙伴力量 共建创新生态
                </h3>
              </div>
              <div className='text-center'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                <p className='mt-2 text-gray-600'>加载合作伙伴中...</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    )
  }

  if (partners.length === 0) {
    return (
      <section className='bg-white py-16 dark:bg-slate-900 md:py-20'>
        <Container>
          <div className='mx-auto max-w-7xl'>
            <motion.div
              className='-mx-6 mb-20 md:-mx-12 lg:-mx-24'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className='mb-8 px-6 text-center md:px-12 lg:px-24'>
                <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl'>
                  汇聚伙伴力量 共建创新生态
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>已为众多企业提供专业服务</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    )
  }
  // 使用单行显示所有合作伙伴

  return (
    <section className='bg-white py-16 dark:bg-slate-900 md:py-20'>
      <Container>
        <div className='mx-auto max-w-7xl'>
          {/* Partners Scrolling Section */}
          <motion.div
            className='-mx-6 mb-20 md:-mx-12 lg:-mx-24'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className='mb-8 px-6 text-center md:px-12 lg:px-24'>
              <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl'>
                汇聚伙伴力量 共建创新生态
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                已为 {partners.length}+ 企业提供专业服务
              </p>
            </div>

            {/* Logo滚动带 - 从左向右，只显示logo */}
            <div className='relative overflow-hidden py-6'>
              {/* 创建连续的logo流 */}
              <div className='animate-scroll-left-to-right flex items-center space-x-16 whitespace-nowrap hover:[animation-play-state:paused]'>
                {/* 重复足够多次确保无缝循环 */}
                {Array.from({ length: 6 }, (_, groupIndex) =>
                  partners.map((partner, partnerIndex) => (
                    <div
                      key={`partner-${groupIndex}-${partner.id}-${partnerIndex}`}
                      className='flex h-20 w-40 flex-shrink-0 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-110'
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
                          <PartnerLogo partner={partner} />
                        </a>
                      ) : (
                        <PartnerLogo partner={partner} />
                      )}
                    </div>
                  ))
                ).flat()}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
