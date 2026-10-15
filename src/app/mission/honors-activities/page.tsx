'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

// 数据类型定义
interface Honor {
  id: string
  title: string
  category: string
  year: string
  description: string
  image: string
  issuer: string
}

interface Activity {
  id: string
  title: string
  date: string
  type: string
  description: string
  image: string
  participants: string
  impact: string
}

interface HonorsActivitiesData {
  module: {
    id: string
    title: string
    subtitle: string
    description: string
    achievements?: Array<{
      value: string
      label: string
    }>
    icon?: string
    image?: string
    highlights?: string[]
    features?: string[]
    gradient?: string
    accentColor?: string
  }
  honors: Honor[]
  activities: Activity[]
  stats: {
    totalHonors: number
    totalActivities: number
    totalParticipants: number
  }
}

export default function HonorsActivitiesPage() {
  const [data, setData] = React.useState<HonorsActivitiesData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 获取数据
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mission/honors-activities')
        if (!response.ok) {
          throw new Error('获取数据失败')
        }
        const result = await response.json()
        console.log('荣誉活动数据加载成功:', result)
        setData(result)
      } catch (err) {
        console.error('获取荣誉活动数据失败:', err)
        setError(err instanceof Error ? err.message : '获取数据失败')
        // 不再使用模拟数据，让用户知道真实的错误状态
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600'></div>
          <p className='text-gray-600'>加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100'>
            <span className='text-4xl'>⚠️</span>
          </div>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>数据加载失败</h2>
          <p className='mb-4 text-red-600'>{error}</p>
          <Button onClick={() => window.location.reload()}>重新加载</Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
            <span className='text-4xl'>📄</span>
          </div>
          <h2 className='mb-2 text-xl font-semibold text-gray-900'>暂无数据</h2>
          <p className='mb-4 text-gray-600'>荣誉活动数据正在准备中，请稍后再试。</p>
          <Button onClick={() => window.location.reload()}>重新加载</Button>
        </div>
      </div>
    )
  }

  // 合并荣誉和活动数据，按时间排序
  const allItems = [
    ...(data.honors || []).map(honor => ({
      ...honor,
      type: 'honor' as const,
      date: (honor as any).date || `${honor.year}-12-31`, // 使用实际日期，如果没有则默认年底
      displayDate: honor.year,
    })),
    ...(data.activities || []).map(activity => ({
      ...activity,
      type: 'activity' as const,
      displayDate: activity.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // 检查是否有数据
  const hasData = allItems.length > 0

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='pb-8 pt-32'>
        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className='mb-6 text-3xl font-bold text-gray-900 md:text-4xl'>
                {data.module.title || '发展历程'}
              </h1>
              <p className='text-lg leading-relaxed text-gray-600 md:text-xl'>
                {data.module.description || '记录我们的成长足迹，见证每一个重要时刻和荣誉成就'}
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 统一时间线 */}
      <section className='py-12'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            {!hasData ? (
              /* 空状态 */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='py-16 text-center'
              >
                <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
                  <span className='text-4xl'>🏆</span>
                </div>
                <h3 className='mb-2 text-xl font-semibold text-gray-900'>暂无荣誉活动数据</h3>
                <p className='text-gray-600'>我们正在努力收集和整理相关信息，敬请期待。</p>
              </motion.div>
            ) : (
              /* 按年份分组显示所有项目 */
              Object.entries(
                allItems.reduce(
                  (acc, item) => {
                    const year =
                      item.type === 'honor' ? item.year : item.date ? item.date.slice(0, 4) : '未知'
                    if (!acc[year]) acc[year] = []
                    acc[year].push(item)
                    return acc
                  },
                  {} as Record<string, typeof allItems>
                )
              )
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([year, items]) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='relative mb-16'
                  >
                    {/* 年份水印 */}
                    <div className='pointer-events-none absolute -top-10 left-0 select-none'>
                      <span
                        className='text-9xl font-bold leading-none'
                        style={{
                          WebkitTextStroke: '2px #e5e7eb',
                          color: 'transparent',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}
                      >
                        {year}
                      </span>
                    </div>

                    {/* 该年度的项目列表 */}
                    <div className='relative z-10 space-y-4 pt-8'>
                      {items.map(item => (
                        <div key={`${item.type}-${item.id}`} className='flex gap-6'>
                          {/* 左侧日期 */}
                          <div className='w-20 flex-shrink-0 text-right'>
                            <span className='text-sm font-medium text-gray-500'>
                              {item.type === 'honor'
                                ? item.date
                                  ? item.date.slice(5, 7) + '月'
                                  : '12月'
                                : item.date
                                  ? item.date.slice(5)
                                  : '12-31'}
                            </span>
                          </div>

                          {/* 右侧内容 */}
                          <div className='flex-1'>
                            <h3 className='mb-2 text-lg font-bold text-gray-900'>{item.title}</h3>
                            <p className='text-sm leading-relaxed text-gray-600'>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))
            )}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className='relative overflow-hidden py-16 md:py-24'>
        {/* 背景图片 */}
        <div className='absolute inset-0'>
          <Image
            src='/images/tech-background.jpg'
            alt='科技背景'
            fill
            className='object-cover object-bottom'
            sizes='100vw'
            priority
          />
          {/* 渐变遮罩 */}
          <div className='absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/80'></div>
        </div>

        {/* 内容区域 */}
        <Container className='relative z-10'>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900 md:text-3xl'>
              责任担当，荣誉见证
            </h2>
            <p className='mb-8 text-lg leading-relaxed text-gray-600 md:text-xl'>
              我们将继续秉承责任担当的理念，积极参与社会活动，为行业发展和社会进步贡献力量。
            </p>
            <div className='flex justify-center gap-6'>
              <Button size='lg' className='bg-emerald-600 hover:bg-emerald-700'>
                了解更多
              </Button>
              <Button size='lg' variant='outline'>
                联系我们
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
