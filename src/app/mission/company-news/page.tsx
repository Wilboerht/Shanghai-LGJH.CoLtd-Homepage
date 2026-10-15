'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  Filter,
  ExternalLink,
  TrendingUp,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  Grid3X3,
  List,
  MessageCircle,
  Hash,
  Facebook,
  Linkedin,
  Rss,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
// 数据类型定义
interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  image: string
  date: string
  category: string
  tags: string[]
  author: string
  readTime: string
  featured: boolean
}

interface NewsCategory {
  id: string
  name: string
  count: number
}

interface CompanyNewsData {
  module: {
    id: string
    title: string
    subtitle: string
    description: string
  } | null
  news: NewsItem[]
  categories: NewsCategory[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CompanyNewsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [data, setData] = React.useState<CompanyNewsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  // 获取数据
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/mission/company-news?${params.toString()}`)
      if (!response.ok) {
        throw new Error('获取数据失败')
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, searchTerm])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-orange-600'></div>
          <p className='text-gray-600'>加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <p className='mb-4 text-red-600'>{error || '数据加载失败'}</p>
          <Button onClick={() => fetchData()}>重新加载</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Campaign-style Header */}
      <section className='bg-white pb-6 pt-28'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            {/* Navigation and Search */}
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
                  首页
                </Link>
                <span className='text-gray-400'>/</span>
                <Link href='/mission' className='text-sm text-gray-600 hover:text-gray-900'>
                  企业使命
                </Link>
                <span className='text-gray-400'>/</span>
                <span className='text-sm text-gray-900'>公司动态</span>
              </div>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <input
                    type='text'
                    placeholder='搜索新闻...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-64 rounded border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-gray-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>

            {/* Page Title - Campaign Style */}
            <div className='border-b border-gray-200 pb-6'>
              <h1 className='mb-2 text-4xl font-bold text-gray-900'>公司动态</h1>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content - Campaign Style Layout */}
      <section className='py-8'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
              {/* Left Column - Main Content */}
              <div className='lg:col-span-2'>
                {data?.news.length === 0 ? (
                  <div className='py-20 text-center'>
                    <p className='text-gray-500'>没有找到相关新闻</p>
                  </div>
                ) : (
                  <div className='space-y-8'>
                    {data.news.map((news, index) => (
                      <motion.article
                        key={news.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className='group border-b border-gray-200 pb-8 last:border-b-0'
                      >
                        <Link href={`/mission/company-news/${news.id}`} className='block'>
                          <div className='flex gap-6'>
                            {/* Image */}
                            <div className='relative h-48 w-72 flex-shrink-0 overflow-hidden'>
                              <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className='object-cover'
                              />
                            </div>

                            {/* Content */}
                            <div className='min-w-0 flex-1 pl-4'>
                              {/* Date and Author */}
                              <div className='mb-1 text-xs uppercase text-gray-500'>
                                {news.date}
                              </div>
                              <div className='mb-3 text-xs text-gray-500'>{news.author}</div>

                              {/* Title */}
                              <h2 className='mb-3 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-600'>
                                {news.title}
                              </h2>

                              {/* Summary */}
                              <p className='line-clamp-3 text-sm leading-relaxed text-gray-600'>
                                {news.summary}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Sidebar - Campaign Style */}
              <div className='lg:col-span-1'>
                <div className='sticky top-24 space-y-8'>
                  {/* Follow Us Section */}
                  <div className='bg-gray-50 p-6'>
                    <h3 className='mb-4 text-center text-lg font-bold text-gray-900'>关注我们</h3>
                    <div className='flex justify-center gap-2'>
                      <div className='group relative'>
                        <button
                          className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 transition-colors hover:bg-gray-100'
                          title='微信'
                        >
                          <MessageCircle className='h-4 w-4' />
                        </button>
                        {/* WeChat QR Code Tooltip */}
                        <div className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <div className='min-w-[160px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg'>
                            <div className='flex flex-col items-center'>
                              <Image
                                src='/images/QR code.png'
                                alt='微信二维码'
                                width={120}
                                height={120}
                                className='rounded'
                              />
                              <p className='mt-2 text-center text-sm text-gray-600'>扫码关注微信</p>
                            </div>
                          </div>
                          {/* Arrow */}
                          <div className='absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-white'></div>
                        </div>
                      </div>
                      <button
                        className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 transition-colors hover:bg-gray-100'
                        title='微博'
                      >
                        <Hash className='h-4 w-4' />
                      </button>
                      <button
                        className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 transition-colors hover:bg-gray-100'
                        title='Facebook'
                      >
                        <Facebook className='h-4 w-4' />
                      </button>
                      <button
                        className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 transition-colors hover:bg-gray-100'
                        title='LinkedIn'
                      >
                        <Linkedin className='h-4 w-4' />
                      </button>
                      <button
                        className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 transition-colors hover:bg-gray-100'
                        title='RSS'
                      >
                        <Rss className='h-4 w-4' />
                      </button>
                    </div>
                  </div>

                  {/* Most Read Section */}
                  <div>
                    <h3 className='mb-6 text-lg font-bold text-gray-900'>阅读次数最多</h3>
                    <div className='space-y-6'>
                      {data?.news.slice(0, 5).map((news, index) => (
                        <div
                          key={news.id}
                          className='group flex gap-4 border-b border-gray-100 pb-4 last:border-b-0'
                        >
                          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-700'>
                            {index + 1}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <Link href={`/mission/company-news/${news.id}`}>
                              <h4 className='mb-2 line-clamp-3 text-sm font-medium leading-tight text-gray-900 transition-colors group-hover:text-blue-600'>
                                {news.title}
                              </h4>
                            </Link>
                            <p className='text-xs text-gray-500'>{news.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className='bg-gray-50 py-16'>
        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>订阅我们的新闻通讯</h2>
            <p className='mb-8 text-gray-600'>第一时间获取公司最新动态和行业资讯</p>
            <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
              <div className='max-w-md flex-1'>
                <input
                  type='email'
                  placeholder='输入您的邮箱地址'
                  className='w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                />
              </div>
              <Button className='bg-blue-600 px-8 hover:bg-blue-700'>订阅</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
