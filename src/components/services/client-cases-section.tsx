'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'
import Image from 'next/image'

// 客户Logo组件
const ClientLogo: React.FC<{ logo?: string; name: string }> = ({ logo, name }) => {
  if (logo) {
    return (
      <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white'>
        <Image
          src={logo}
          alt={`${name} logo`}
          width={48}
          height={48}
          className='h-full w-full object-contain'
          onError={e => {
            // 如果图片加载失败，显示默认占位符
            const target = e.currentTarget as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `<div class="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400 text-xs font-medium">${name.charAt(0).toUpperCase()}</div>`
            }
          }}
        />
      </div>
    )
  }

  // 如果没有logo图片，显示首字母
  return (
    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-600'>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

interface ClientCase {
  id: string
  name: string
  logo?: string
  industry: string
  title: string
  description: string
  image?: string
  metrics?: Record<string, string>
  tags?: string[]
}

interface IndustryCases {
  [key: string]: ClientCase
}

const industries = [
  { id: 'finance', name: '金融' },
  { id: 'manufacturing', name: '制造' },
  { id: 'government', name: '政府' },
  { id: 'gaming', name: '游戏' },
  { id: 'ecommerce', name: '电商' },
  { id: 'automotive', name: '汽车' },
]

export function ClientCasesSection() {
  const [industryCases, setIndustryCases] = useState<IndustryCases>({})
  const [activeIndustry, setActiveIndustry] = useState<string>('金融')
  const [loading, setLoading] = useState(true)

  // 获取客户案例数据
  useEffect(() => {
    const fetchClientCases = async () => {
      try {
        const response = await fetch('/api/client-cases?limit=20')
        if (response.ok) {
          const data = await response.json()

          // 按行业分组案例
          const groupedCases: IndustryCases = {}
          data.clientCases.forEach((clientCase: ClientCase) => {
            if (!groupedCases[clientCase.industry]) {
              groupedCases[clientCase.industry] = clientCase
            }
          })
          setIndustryCases(groupedCases)

          // 设置默认选中的行业
          const firstIndustry = Object.keys(groupedCases)[0]
          if (firstIndustry) {
            setActiveIndustry(firstIndustry)
          }
        }
      } catch (error) {
        console.error('获取客户案例失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientCases()
  }, [])

  const currentCase = industryCases[activeIndustry]

  if (loading) {
    return (
      <section className='bg-slate-50 py-16 dark:bg-slate-900'>
        <Container>
          <div className='flex h-64 items-center justify-center'>
            <div className='text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
              <p className='mt-2 text-gray-600'>加载客户案例中...</p>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (!currentCase) {
    return null
  }

  return (
    <section className='bg-slate-50 py-16 dark:bg-slate-900'>
      <Container>
        <div className='mx-auto max-w-6xl'>
          {/* 标题部分 - 居中显示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-8 text-center'
          >
            <h2 className='mb-2 text-2xl font-bold text-slate-900 dark:text-white'>
              行业实践应用，助力客户业务增长
            </h2>
            <p className='text-slate-600 dark:text-slate-400'>
              深耕各行各业，为不同领域客户提供专业定制化解决方案
            </p>
          </motion.div>

          {/* 行业选择器 - 居中显示 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className='mb-12'
          >
            <div className='flex flex-wrap justify-center gap-6'>
              {industries.map(industry => {
                const hasCase = industryCases[industry.name]
                if (!hasCase) return null

                return (
                  <button
                    key={industry.id}
                    type='button'
                    onClick={() => setActiveIndustry(industry.name)}
                    className={`relative px-3 py-1 text-base font-medium transition-colors ${
                      activeIndustry === industry.name
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    {industry.name}
                    {/* 选中的行业显示下划线 */}
                    {activeIndustry === industry.name && (
                      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white'></div>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>

          <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16'>
            {/* 左侧 - 案例信息 */}
            <div>
              <motion.div
                key={activeIndustry}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'
              >
                {/* 客户Logo和名称 */}
                <div className='flex items-center gap-4'>
                  <ClientLogo logo={currentCase.logo} name={currentCase.name} />
                  <div>
                    <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                      {currentCase.name}
                    </h3>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      {currentCase.industry}行业
                    </p>
                  </div>
                </div>

                {/* 案例标题和描述 */}
                <div>
                  <h4 className='mb-2 text-xl font-bold text-slate-900 dark:text-white'>
                    {currentCase.title}
                  </h4>
                  <p className='mb-4 leading-relaxed text-slate-600 dark:text-slate-400'>
                    {currentCase.description}
                  </p>
                </div>

                {/* 关键指标 */}
                {currentCase.metrics && (
                  <div className='flex flex-wrap justify-center gap-8 py-4'>
                    {Object.entries(currentCase.metrics)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <div key={key} className='flex flex-col items-center'>
                          <div className='mb-1 text-xl font-bold text-blue-600 dark:text-blue-400'>
                            {value as string}
                          </div>
                          <div className='whitespace-nowrap text-xs text-slate-600 dark:text-slate-400'>
                            {key}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* 右侧 - 案例图片 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className='relative'
            >
              <div className='relative overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800'>
                {currentCase.image ? (
                  <Image
                    src={currentCase.image}
                    alt={currentCase.title}
                    width={600}
                    height={400}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-96 items-center justify-center'>
                    <div className='text-center text-slate-600 dark:text-slate-400'>
                      <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-white dark:bg-slate-600'>
                        <div className='h-8 w-8 text-blue-600 dark:text-blue-400'>📊</div>
                      </div>
                      <p className='text-sm'>{currentCase.title}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
