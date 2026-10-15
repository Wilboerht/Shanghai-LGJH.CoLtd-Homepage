'use client'

import * as React from 'react'
import { motion, backOut } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import CategorySolutions from './category-solutions'
import Link from 'next/link'
import '@/styles/solutions-hero.css'

// 解决方案接口
interface Solution {
  id: string
  title: string
  subtitle: string
  description: string
  content?: string // 新增富文本内容字段
  category: string
  features: string[]
  applications: string[]
  metrics: Array<{
    value: string
    label: string
  }>
  technologies: string[]
  benefits: string[]
  image: string
  slug: string
  gradient: string
  accentColor: string
}

interface SolutionCategory {
  id: string
  name: string
  description: string
  solutions: Solution[]
}

export default function SolutionsPage() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')
  const [solutionCategories, setSolutionCategories] = React.useState<SolutionCategory[]>([])
  const [loading, setLoading] = React.useState(true)

  // 获取解决方案数据
  React.useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/solutions')
        if (!response.ok) throw new Error('获取解决方案数据失败')

        const solutions: Solution[] = await response.json()

        // 按分类组织数据
        const categoriesMap = new Map<string, SolutionCategory>()

        solutions.forEach(solution => {
          if (!categoriesMap.has(solution.category)) {
            categoriesMap.set(solution.category, {
              id: solution.category.toLowerCase().replace(/\s+/g, '-'),
              name: solution.category,
              description: `${solution.category}相关的智能化解决方案`,
              solutions: [],
            })
          }
          categoriesMap.get(solution.category)!.solutions.push(solution)
        })

        // 定义分类排序顺序
        const categoryOrder = [
          '园区管理',
          '社区管理',
          '公共交通',
          '工业制造',
          '物流运输',
          '大健康',
          '商业综合体',
          '其他方案',
        ]

        // 按指定顺序排序分类
        const sortedCategories = categoryOrder
          .map(categoryName => categoriesMap.get(categoryName))
          .filter(category => category !== undefined) as SolutionCategory[]

        setSolutionCategories(sortedCategories)
      } catch (error) {
        console.error('获取解决方案数据失败:', error)
        setSolutionCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchSolutions()
  }, [])

  // 如果有分类参数，显示该分类的解决方案
  if (categoryId) {
    return <CategorySolutions categoryId={categoryId} />
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-slate-600 dark:text-slate-300'>加载解决方案数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950'>
      {/* Hero Section - 左右布局设计 */}
      <section className='relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/30'>
        {/* 背景装饰 */}
        <div className='absolute inset-0'>
          <div className='absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 transform rounded-full bg-blue-100/20 blur-3xl dark:bg-blue-900/10'></div>
          <div className='absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 transform rounded-full bg-indigo-100/20 blur-3xl dark:bg-indigo-900/10'></div>
        </div>

        <Container className='relative z-10 h-full'>
          <div className='grid h-full grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2'>
            {/* 左侧内容区域 */}
            <motion.div
              className='space-y-6 lg:space-y-7 lg:pr-8'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* 主标题区域 */}
              <motion.h1
                className='mb-6 font-alimama-shuhei text-3xl font-bold leading-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl'
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                定制化解决方案
              </motion.h1>

              {/* 副标题描述 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className='mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300'>
                  从智慧园区到数字社区，从工业制造到商业综合体，我们为各行业提供量身定制的智能化解决方案，助力企业实现高效运营和可持续发展
                </p>
              </motion.div>

              {/* 关键特性标签 */}
              <motion.div
                className='flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-blue-500' />
                  <span>500+ 项目交付</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <span>15年行业经验</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-orange-500' />
                  <span>98% 客户满意度</span>
                </div>
              </motion.div>
            </motion.div>

            {/* 右侧图片区域 */}
            <motion.div
              className='relative flex items-center justify-center lg:justify-end'
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            >
              <div className='relative w-full max-w-sm'>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className='relative'
                >
                  <Image
                    src='/solutions-hero-image.png'
                    alt='智能解决方案展示图'
                    width={320}
                    height={320}
                    className='h-auto w-full object-contain drop-shadow-2xl'
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* 滚动指示标 */}
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 transform'>
            <motion.div
              className='flex justify-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div
                className='group flex cursor-pointer flex-col items-center'
                onClick={() => {
                  const nextSection = document.querySelector('#solutions-categories')
                  nextSection?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className='mb-2 text-sm text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300'>
                  查看解决方案
                </span>
                <div className='animate-bounce'>
                  <svg
                    className='h-6 w-6 text-slate-400 transition-colors group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 14l-7 7m0 0l-7-7m7 7V3'
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Solution Categories Section */}
      <section
        id='solutions-categories'
        className='bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'
      >
        <Container>
          {/* Solution Categories */}
          <div className='space-y-12'>
            {solutionCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='text-center'
              >
                {/* Category Header */}
                <div className='mb-8'>
                  {/* 标题与图标 */}
                  <div className='group mb-3 flex items-center justify-center gap-3'>
                    <Link
                      href={`/solutions?category=${category.id}`}
                      className='flex items-center gap-3'
                    >
                      <h2 className='transform cursor-pointer font-alimama-shuhei text-2xl font-bold text-slate-900 transition-all duration-300 group-hover:scale-105 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 lg:text-3xl'>
                        {category.name}
                      </h2>
                      <div className='transform rounded-lg bg-slate-100 p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100 group-hover:shadow-md dark:bg-slate-700 dark:group-hover:bg-blue-900/30'>
                        <svg
                          className='h-5 w-5 text-slate-600 transition-all duration-300 group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-blue-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>

                  <p className='mx-auto mb-6 max-w-xl text-base text-slate-600 dark:text-slate-300'>
                    {category.description}
                  </p>
                </div>

                {/* Solutions Grid */}
                <div className='mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {category.solutions.map((solution, solutionIndex) => (
                    <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + solutionIndex * 0.05 }}
                      className='group'
                    >
                      <Link href={`/solutions/${solution.slug}`}>
                        <div className='transform cursor-pointer rounded-lg border border-slate-200 bg-white p-3 transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'>
                          <div className='text-center'>
                            <h4 className='mb-1.5 font-alimama-shuhei text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                              {solution.title}
                            </h4>
                            {solution.subtitle && (
                              <p className='mb-2 text-sm text-slate-500 dark:text-slate-400'>
                                {solution.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                {index < solutionCategories.length - 1 && (
                  <div className='mt-12 border-t border-slate-200 pt-12 dark:border-slate-700' />
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      {/* CTA Section */}
      <section className='bg-slate-50 py-12 dark:bg-slate-900'>
        <Container>
          <motion.div
            className='text-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='mb-3 font-alimama-shuhei text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl'>
              准备开始您的智能化转型之旅？
            </h2>
            <p className='mx-auto mb-6 max-w-2xl text-base text-slate-600 dark:text-slate-300'>
              我们的专业团队将为您提供量身定制的解决方案，助力您的企业在智能化时代取得成功
            </p>

            <div className='mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <Button className='rounded-lg bg-slate-900 px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'>
                查看产品
              </Button>

              <Button
                variant='outline'
                className='rounded-lg border-slate-300 px-6 py-2 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800'
              >
                联系我们
              </Button>
            </div>

            <div className='flex flex-col items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row'>
              <div className='flex items-center gap-1'>
                <div className='h-1 w-1 rounded-full bg-slate-400' />
                <span>500+ 成功案例</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='h-1 w-1 rounded-full bg-slate-400' />
                <span>15年行业经验</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='h-1 w-1 rounded-full bg-slate-400' />
                <span>7×24 技术支持</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
