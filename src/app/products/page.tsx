'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

import CategoryProducts from './category-products'
import Link from 'next/link'
import Image from 'next/image'

// 产品分类接口
interface ProductCategory {
  id: string
  name: string
  description: string
  products: Array<{
    id: string
    title: string
    subtitle?: string
    slug: string
    status: 'available' | 'coming-soon' | 'discontinued'
  }>
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')
  const [productCategories, setProductCategories] = React.useState<ProductCategory[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 获取产品数据
  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error(`HTTP ${response.status}: 获取产品数据失败`)

      const data = await response.json()
      setProductCategories(data.categories || [])
    } catch (error) {
      console.error('获取产品数据失败:', error)
      setError(error instanceof Error ? error.message : '获取产品数据失败')
      setProductCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // 如果有分类参数，显示该分类的产品
  if (categoryId) {
    return <CategoryProducts categoryId={categoryId} />
  }

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950'>
      {/* Hero Section - 参考 solutions 页面设计 */}
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
                重新定义 智能产品体验
              </motion.h1>

              {/* 副标题描述 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className='mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300'>
                  探索我们的核心产品领域，每一个都经过精心设计，为您的业务带来前所未有的智能化体验
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
                  <span>6大产品分类</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500' />
                  <span>50+ 核心产品</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-orange-500' />
                  <span>99% 客户满意度</span>
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
                    src='/products-hero-image.png'
                    alt='智能产品展示图'
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
                  const nextSection = document.querySelector('#products-categories')
                  nextSection?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span className='mb-2 text-xs text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300'>
                  探索产品
                </span>
                <motion.div
                  className='text-slate-400 transition-colors group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 14l-7 7m0 0l-7-7m7 7V3'
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Product Categories Section */}
      <section id='products-categories' className='py-20'>
        <Container>
          {loading ? (
            <div className='py-12 text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
              <p className='mt-4 text-slate-600 dark:text-slate-400'>加载产品数据中...</p>
            </div>
          ) : productCategories.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-slate-600 dark:text-slate-400'>暂无产品数据</p>
            </div>
          ) : (
            /* Product Categories */
            <div className='space-y-12'>
              {productCategories.map((category, index) => (
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
                        href={`/products?category=${category.id}`}
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

                  {/* Products Grid */}
                  <div className='mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {category.products.map((product, productIndex) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + productIndex * 0.05 }}
                        className='group'
                      >
                        <Link href={`/products/${product.slug}`}>
                          <div className='transform cursor-pointer rounded-lg border border-slate-200 bg-white p-3 transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'>
                            <div className='text-center'>
                              <h4 className='mb-1.5 font-alimama-shuhei text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                                {product.title}
                              </h4>
                              {product.subtitle && (
                                <p className='mb-2 text-sm text-slate-500 dark:text-slate-400'>
                                  {product.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  {index < productCategories.length - 1 && (
                    <div className='mt-12 border-t border-slate-200 pt-12 dark:border-slate-700' />
                  )}
                </motion.div>
              ))}
            </div>
          )}
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
              准备开始您的数字化转型之旅？
            </h2>
            <p className='mx-auto mb-6 max-w-2xl text-base text-slate-600 dark:text-slate-300'>
              我们的专业团队将为您提供量身定制的解决方案，助力您的企业在数字化时代取得成功
            </p>

            <div className='mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <Button className='rounded-lg bg-slate-900 px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'>
                查看解决方案
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
