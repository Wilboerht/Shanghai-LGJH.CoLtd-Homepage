'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Calendar,
  FlaskConical,
  Star,
  User,
  Search,
  Loader2,
  BookOpen,
  Trophy,
  Cpu,
  Shield,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// 数据类型定义
interface ResearchItem {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  content: string
  image?: string
  slug: string
  status: string
  publishedAt: string
  tags: string[]
  authors: string[]
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function AchievementsPage() {
  const [researchData, setResearchData] = useState<ResearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // 获取成果数据
  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/research?category=ACHIEVEMENTS')
        if (!response.ok) {
          throw new Error('获取研究数据失败')
        }
        const data = await response.json()
        setResearchData(data.research || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchResearchData()
  }, [])

  // 搜索过滤
  const filteredResearch = researchData.filter(
    item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className='min-h-screen bg-white'>
        <Container className='py-20'>
          <div className='flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-emerald-600' />
            <span className='ml-2 text-gray-600'>加载中...</span>
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-white'>
        <Container className='py-20'>
          <div className='text-center'>
            <p className='mb-4 text-red-600'>{error}</p>
            <Button onClick={() => window.location.reload()}>重试</Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50'>
        <div className='bg-grid-slate-100 absolute inset-0 -z-10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]'></div>
        <Container>
          <div className='pb-12 pt-20 md:pb-16 md:pt-24'>
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-8'
            >
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <Link href='/' className='transition-colors hover:text-emerald-600'>
                  首页
                </Link>
                <ChevronRight className='h-4 w-4' />
                <Link href='/research' className='transition-colors hover:text-emerald-600'>
                  研究中心
                </Link>
                <ChevronRight className='h-4 w-4' />
                <span className='font-medium text-gray-900'>研发成果</span>
              </div>
            </motion.div>

            <div className='grid items-center gap-8 lg:grid-cols-12'>
              {/* Left Content */}
              <div className='lg:col-span-8'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {/* Category Badge */}
                  <div className='mb-6'>
                    <div className='inline-flex items-center space-x-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-800'>
                      <FlaskConical className='h-4 w-4' />
                      <span>研发成果展示</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className='mb-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl'>
                    研发成果与突破
                  </h1>

                  {/* Subtitle */}
                  <p className='mb-6 text-xl font-medium text-gray-600'>
                    Research Achievements & Breakthroughs
                  </p>

                  {/* Description */}
                  <p className='mb-8 max-w-2xl text-lg leading-relaxed text-gray-700'>
                    展示重要科研成果与技术突破，包括产品化成果、技术专利、系统平台等具有实际应用价值的研发成果，体现我们的创新能力和技术实力。
                  </p>

                  {/* Features */}
                  <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center space-x-2 text-gray-600'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                        <Trophy className='h-4 w-4 text-emerald-600' />
                      </div>
                      <span className='font-medium'>技术突破</span>
                    </div>
                    <div className='flex items-center space-x-2 text-gray-600'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                        <Cpu className='h-4 w-4 text-emerald-600' />
                      </div>
                      <span className='font-medium'>产品化成果</span>
                    </div>
                    <div className='flex items-center space-x-2 text-gray-600'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100'>
                        <Shield className='h-4 w-4 text-emerald-600' />
                      </div>
                      <span className='font-medium'>专利保护</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Visual */}
              <div className='lg:col-span-4'>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className='relative'
                >
                  <div className='relative h-64 w-full lg:h-80'>
                    {/* Main Icon */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl'>
                        <FlaskConical className='h-16 w-16 text-white' />
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className='absolute right-4 top-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg'>
                      <Trophy className='h-6 w-6 text-white' />
                    </div>
                    <div className='absolute bottom-8 left-4 flex h-10 w-10 animate-bounce items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500 shadow-lg'>
                      <Cpu className='h-5 w-5 text-white' />
                    </div>
                    <div className='absolute left-0 top-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg'>
                      <Shield className='h-4 w-4 text-white' />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Research Content */}
      <section className='py-6 md:py-8'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='mb-8 text-center'
            >
              <h2 className='mb-3 font-serif text-2xl font-semibold text-gray-900 md:text-3xl'>
                研发成果展示
              </h2>
              <p className='mx-auto max-w-2xl text-gray-600'>
                展示我们在各个技术领域取得的重要成果和技术突破
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='mb-10'
            >
              <div className='relative mx-auto max-w-lg'>
                <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <Input
                  type='text'
                  placeholder='搜索研发成果、技术领域或研发团队...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='rounded-lg border-gray-300 py-3 pl-12 text-base focus:border-emerald-500 focus:ring-emerald-500'
                />
              </div>
            </motion.div>

            {/* Research Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filteredResearch.length === 0 ? (
                <div className='py-16 text-center'>
                  <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100'>
                    <BookOpen className='h-10 w-10 text-gray-400' />
                  </div>
                  <h3 className='mb-2 text-lg font-medium text-gray-900'>没有找到匹配的成果</h3>
                  <p className='mx-auto max-w-sm text-gray-500'>
                    请尝试调整搜索关键词，或浏览所有研发成果
                  </p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {/* Results Summary */}
                  <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
                    <p className='text-sm text-gray-600'>
                      找到{' '}
                      <span className='font-medium text-gray-900'>{filteredResearch.length}</span>{' '}
                      项研发成果
                    </p>
                    <div className='text-xs text-gray-500'>按重要性和发布时间排序</div>
                  </div>

                  {/* Projects Grid */}
                  <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {filteredResearch.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className='group h-full border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg'>
                          <CardContent className='p-6'>
                            <div className='mb-4 flex items-start justify-between'>
                              <div className='flex items-center space-x-3'>
                                <div className='h-2 w-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600'></div>
                                <Badge
                                  variant='outline'
                                  className='border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-800'
                                >
                                  研发成果
                                </Badge>
                              </div>
                              {item.featured && (
                                <div className='flex items-center text-emerald-500'>
                                  <Star className='h-4 w-4 fill-current' />
                                </div>
                              )}
                            </div>

                            <h3 className='mb-3 font-serif text-lg font-semibold text-gray-900 transition-colors group-hover:text-emerald-600'>
                              {item.title}
                            </h3>

                            <p className='mb-4 line-clamp-3 text-sm text-gray-600'>
                              {item.description}
                            </p>

                            <div className='mb-4 flex flex-wrap gap-2'>
                              {item.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant='secondary' className='text-xs'>
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant='secondary' className='text-xs'>
                                  +{item.tags.length - 3}
                                </Badge>
                              )}
                            </div>

                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-4 text-xs text-gray-500'>
                                <div className='flex items-center space-x-1'>
                                  <User className='h-3 w-3' />
                                  <span>{item.authors.join(', ')}</span>
                                </div>
                                <div className='flex items-center space-x-1'>
                                  <Calendar className='h-3 w-3' />
                                  <span>
                                    {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                                  </span>
                                </div>
                              </div>
                              <Link
                                href={`/research/${item.slug}`}
                                className='text-sm font-medium text-emerald-600 hover:text-emerald-700'
                              >
                                查看详情 →
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}
