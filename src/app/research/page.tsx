'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  ArrowRight,
  Calendar,
  ChevronRight,
  FileText,
  Star,
  User,
  Search,
  Library,
  Brain,
  Lightbulb,
  FlaskConical,
  BookMarked,
  Atom,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'

// 研究数据接口
interface Research {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  categoryName: string
  image?: string
  slug: string
  publishedAt: string
  tags?: string[]
  authors?: Array<{
    name: string
    title?: string
    email?: string
  }>
  featured: boolean
  sortOrder: number
}

// 分类映射 - 学术风格
const categoryConfig = {
  AI_RESEARCH: {
    name: 'AI研究与应用',
    icon: Brain,
    color: 'from-indigo-600 to-blue-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-900',
    description: '人工智能理论研究与实际应用',
    academicField: 'Artificial Intelligence & Machine Learning',
    href: '/research/ai-research',
  },
  INNOVATION: {
    name: '技术创新',
    icon: Lightbulb,
    color: 'from-amber-600 to-orange-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    description: '前沿技术创新与工程实践',
    academicField: 'Innovation & Engineering',
    href: '/research/innovation',
  },
  ACHIEVEMENTS: {
    name: '研发成果',
    icon: FlaskConical,
    color: 'from-emerald-600 to-green-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-900',
    description: '重要科研成果与技术突破',
    academicField: 'Research Achievements',
    href: '/research/achievements',
  },
  PAPERS: {
    name: '学术论文',
    icon: BookMarked,
    color: 'from-slate-600 to-gray-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-900',
    description: '同行评议学术论文与技术报告',
    academicField: 'Academic Publications',
    href: '/research/papers',
  },
}

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 获取研究数据
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory)
        }
        if (searchTerm) {
          params.append('search', searchTerm)
        }

        const response = await fetch(`/api/research?${params}`)
        if (!response.ok) throw new Error('获取研究数据失败')

        const data = await response.json()
        setResearch(data.research || [])
      } catch (error) {
        console.error('获取研究数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResearch()
  }, [selectedCategory, searchTerm])

  // 按分类组织研究数据
  const researchByCategory = React.useMemo(() => {
    const categories = Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>
    return categories.map(categoryKey => {
      const config = categoryConfig[categoryKey]
      const categoryResearch = research.filter(item => item.category === categoryKey)
      return {
        key: categoryKey,
        ...config,
        research: categoryResearch,
        count: categoryResearch.length,
      }
    })
  }, [research])

  // 特色研究
  const featuredResearch = research.filter(item => item.featured)

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section with Background Image */}
      <section className='relative overflow-hidden border-b border-gray-200 pt-28 sm:pt-32'>
        {/* Background Image */}
        <div className='absolute inset-0'>
          <Image
            src='/images/research-hero-bg.jpg'
            alt='研究中心背景'
            fill
            className='object-cover object-center'
            priority
          />
          {/* Gradient Overlay - 非常浅的蓝色蒙版 */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-900/25 via-blue-800/20 to-slate-900/25'></div>
          {/* Additional blur overlay for better text readability */}
          <div className='absolute inset-0 backdrop-blur-[0.25px]'></div>
        </div>

        <Container>
          <div className='relative z-10 py-8 md:py-12'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='mx-auto max-w-5xl'
            >
              {/* 学术标题区域 */}
              <div className='mb-10 text-center'>
                <div className='mb-4'>
                  <Library className='mx-auto mb-3 h-12 w-12 text-white' />
                  <h1 className='mb-2 font-serif text-3xl font-semibold text-white drop-shadow-md md:text-4xl'>
                    临港景鸿学术研究中心
                  </h1>
                  <p className='text-base font-medium text-blue-100'>
                    Research Center for Advanced Technology
                  </p>
                </div>

                <div className='mx-auto max-w-3xl'>
                  <p className='mb-3 text-base leading-relaxed text-gray-100'>
                    致力于前沿技术研究与学术创新，推动人工智能、工程技术、科研成果转化与学术论文发表
                  </p>
                  <p className='text-sm leading-relaxed text-blue-200'>
                    构建产学研一体化的创新生态体系，促进理论研究与实际应用的深度融合
                  </p>
                </div>
              </div>

              {/* 学术统计面板 */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm'>
                  <div className='mb-1 text-2xl font-semibold text-blue-300'>{research.length}</div>
                  <div className='text-xs font-medium text-gray-200'>Research Projects</div>
                  <div className='text-xs text-blue-200'>研究项目</div>
                </div>
                <div className='rounded-lg border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm'>
                  <div className='mb-1 text-2xl font-semibold text-green-300'>
                    {featuredResearch.length}
                  </div>
                  <div className='text-xs font-medium text-gray-200'>Featured Studies</div>
                  <div className='text-xs text-blue-200'>重点研究</div>
                </div>
                <div className='rounded-lg border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm'>
                  <div className='mb-1 text-2xl font-semibold text-orange-300'>
                    {researchByCategory.reduce((sum, cat) => sum + cat.count, 0)}
                  </div>
                  <div className='text-xs font-medium text-gray-200'>Total Publications</div>
                  <div className='text-xs text-blue-200'>总发表数</div>
                </div>
                <div className='rounded-lg border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm'>
                  <div className='mb-1 text-2xl font-semibold text-gray-200'>4</div>
                  <div className='text-xs font-medium text-gray-200'>Research Fields</div>
                  <div className='text-xs text-blue-200'>研究领域</div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 学术搜索和筛选 */}
      <section className='border-b border-gray-200 bg-white py-6'>
        <Container>
          <div className='mx-auto max-w-3xl'>
            <div className='mb-5 text-center'>
              <h2 className='mb-1 font-serif text-lg font-medium text-gray-800'>研究文献检索</h2>
              <p className='text-sm text-gray-500'>Academic Literature Search</p>
            </div>

            <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
              <div className='flex flex-col gap-3 md:flex-row'>
                <div className='relative flex-1'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                  <Input
                    placeholder='输入关键词搜索研究标题、摘要或内容...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='h-10 rounded-md border-gray-300 pl-10 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
                  />
                </div>

                {/* 使用原生 select 替代 Radix UI Select */}
                <div className='relative'>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className='h-10 w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 md:w-[180px]'
                    aria-label='选择研究领域'
                    title='选择研究领域'
                  >
                    <option value='all'>全部研究领域</option>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className='pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 transform text-gray-400' />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 重点研究展示 */}
      {featuredResearch.length > 0 && (
        <section className='bg-gray-50 py-12'>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className='mb-8 text-center'>
                <div className='mb-2 flex items-center justify-center'>
                  <Star className='mr-2 h-5 w-5 text-amber-600' />
                  <h2 className='font-serif text-2xl font-semibold text-gray-800'>重点研究项目</h2>
                </div>
                <p className='mb-4 text-sm text-gray-500'>Featured Research Projects</p>
                <p className='mx-auto max-w-2xl text-sm text-gray-600'>
                  展示本研究中心的重点研究项目和突出学术成果
                </p>
              </div>

              <div className='mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2'>
                {featuredResearch.slice(0, 4).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className='group h-full overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg'>
                      <CardContent className='flex h-full flex-col p-6'>
                        {/* 头部区域 */}
                        <div className='mb-4 flex items-start justify-between'>
                          <div className='flex items-center space-x-3'>
                            <div
                              className={`h-10 w-10 rounded-lg bg-gradient-to-br ${categoryConfig[item.category as keyof typeof categoryConfig]?.color} flex items-center justify-center`}
                            >
                              {React.createElement(
                                categoryConfig[item.category as keyof typeof categoryConfig]
                                  ?.icon || FileText,
                                {
                                  className: 'h-5 w-5 text-white',
                                }
                              )}
                            </div>
                            <div>
                              <Badge
                                variant='secondary'
                                className='mb-1 border-0 bg-gray-100 text-xs text-gray-700'
                              >
                                {item.categoryName}
                              </Badge>
                              <div className='flex items-center text-amber-500'>
                                <Star className='mr-1 h-3 w-3 fill-current' />
                                <span className='text-xs text-gray-600'>重点研究</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 标题区域 */}
                        <div className='mb-4 flex-grow'>
                          <h3 className='mb-2 line-clamp-2 font-serif text-lg font-semibold leading-tight text-gray-900'>
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <p className='mb-3 line-clamp-2 text-sm italic text-gray-600'>
                              {item.subtitle}
                            </p>
                          )}
                          <p className='line-clamp-3 text-sm leading-relaxed text-gray-700'>
                            {item.description}
                          </p>
                        </div>

                        {/* 底部信息 */}
                        <div className='mt-auto space-y-3'>
                          {/* 研究团队 */}
                          {item.authors && item.authors.length > 0 && (
                            <div className='flex items-center space-x-2'>
                              <Users className='h-4 w-4 text-gray-500' />
                              <div className='min-w-0 flex-1'>
                                <div className='mb-1 text-xs text-gray-500'>研究团队</div>
                                <div className='truncate text-sm text-gray-700'>
                                  {item.authors.map(author => author.name).join(', ')}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 发表日期和操作 */}
                          <div className='flex items-center justify-between border-t border-gray-100 pt-3'>
                            <div className='flex items-center text-sm text-gray-500'>
                              <Calendar className='mr-2 h-4 w-4' />
                              {formatDate(item.publishedAt)}
                            </div>
                            <Link href={`/research/${item.slug}`}>
                              <Button
                                size='sm'
                                variant='outline'
                                className='border-blue-300 text-blue-600 hover:bg-blue-50'
                              >
                                阅读论文
                                <ArrowRight className='ml-2 h-4 w-4' />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>
      )}

      {/* 学术研究分类展示 */}
      <section className='bg-white py-12'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='mb-10 text-center'>
              <div className='mb-2 flex items-center justify-center'>
                <Atom className='mr-2 h-5 w-5 text-blue-600' />
                <h2 className='font-serif text-2xl font-semibold text-gray-800'>
                  技术研发成果展示
                </h2>
              </div>
              <p className='mb-4 text-sm text-gray-500'>Academic Research Fields</p>
              <p className='mx-auto max-w-3xl text-sm leading-relaxed text-gray-600'>
                本研究中心专注于多个前沿技术领域的深入研究，致力于推动学术创新与技术进步
              </p>
            </div>

            <div className='space-y-12'>
              {researchByCategory.map((category, categoryIndex) => {
                if (category.research.length === 0) return null

                const IconComponent = category.icon

                return (
                  <motion.div
                    key={category.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                    className='space-y-6'
                  >
                    {/* 学术分类标题 */}
                    <Link href={category.href} className='block'>
                      <div
                        className={`${category.bgColor} ${category.borderColor} cursor-pointer rounded-r-lg border-l-4 p-6`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-4'>
                            <div className={`rounded-lg bg-gradient-to-br p-3 ${category.color}`}>
                              <IconComponent className='h-6 w-6 text-white' />
                            </div>
                            <div>
                              <h3
                                className={`font-serif text-lg font-semibold ${category.textColor} mb-1`}
                              >
                                {category.name}
                              </h3>
                              <p className='mb-1 text-sm font-medium text-gray-600'>
                                {category.academicField}
                              </p>
                              <p className='text-sm text-gray-600'>{category.description}</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className={`text-2xl font-semibold ${category.textColor} mb-1`}>
                              {category.count}
                            </div>
                            <div className='text-xs text-gray-600'>研究项目</div>
                            <div className='mt-2 flex items-center text-xs text-gray-500'>
                              <span>查看详情</span>
                              <ChevronRight className='ml-1 h-3 w-3' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* 学术论文列表 */}
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                      {category.research.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card className='h-full border border-gray-200 bg-white transition-all duration-300 hover:shadow-md'>
                            <CardContent className='p-5'>
                              <div className='mb-4 flex items-start justify-between'>
                                <div className='flex items-center space-x-2'>
                                  <div
                                    className={`h-3 w-3 rounded-full bg-gradient-to-r ${category.color}`}
                                  ></div>
                                  <Badge
                                    variant='outline'
                                    className={`${category.borderColor} ${category.textColor} bg-white text-xs`}
                                  >
                                    {item.categoryName}
                                  </Badge>
                                </div>
                                {item.featured && (
                                  <div className='flex items-center text-amber-500'>
                                    <Star className='h-4 w-4 fill-current' />
                                  </div>
                                )}
                              </div>

                              <h4 className='mb-2 line-clamp-2 font-serif text-base font-semibold leading-tight text-gray-900'>
                                {item.title}
                              </h4>

                              {item.subtitle && (
                                <p className='mb-2 line-clamp-1 text-sm italic text-gray-600'>
                                  {item.subtitle}
                                </p>
                              )}

                              <p className='mb-3 line-clamp-3 text-sm leading-relaxed text-gray-700'>
                                {item.description}
                              </p>

                              {item.tags && item.tags.length > 0 && (
                                <div className='mb-4 flex flex-wrap gap-1'>
                                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant='secondary'
                                      className='border-0 bg-gray-100 text-xs text-gray-700'
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {item.tags.length > 3 && (
                                    <Badge
                                      variant='secondary'
                                      className='border-0 bg-gray-100 text-xs text-gray-700'
                                    >
                                      +{item.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {item.authors && item.authors.length > 0 && (
                                <div className='mb-4 flex items-start rounded-lg bg-gray-50 p-3'>
                                  <User className='mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500' />
                                  <div>
                                    <div className='mb-1 text-xs text-gray-500'>作者</div>
                                    <div className='line-clamp-2 text-sm font-medium text-gray-700'>
                                      {item.authors.map(author => author.name).join(', ')}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
                                <div className='flex items-center text-sm text-gray-500'>
                                  <Calendar className='mr-1 h-4 w-4' />
                                  {formatDate(item.publishedAt)}
                                </div>
                                <Link href={`/research/${item.slug}`}>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    className='border-gray-300 text-gray-700 hover:bg-gray-50'
                                  >
                                    阅读论文
                                    <ArrowRight className='ml-2 h-4 w-4' />
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* 学术风格加载状态 */}
            {loading && (
              <div className='py-12 text-center'>
                <div className='mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                  <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600'></div>
                </div>
                <h3 className='mb-1 font-serif text-base font-medium text-gray-800'>
                  正在加载研究文献
                </h3>
                <p className='text-sm text-gray-500'>Loading Academic Literature...</p>
              </div>
            )}

            {/* 学术风格空状态 */}
            {!loading && research.length === 0 && (
              <div className='py-12 text-center'>
                <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                  <BookMarked className='h-6 w-6 text-gray-400' />
                </div>
                <h3 className='mb-2 font-serif text-base font-medium text-gray-800'>
                  暂无研究文献
                </h3>
                <p className='mb-2 text-sm text-gray-500'>No Research Literature Available</p>
                <p className='mx-auto max-w-md text-sm text-gray-500'>
                  当前没有符合条件的研究文献，请尝试调整搜索条件或联系研究中心管理员
                </p>
              </div>
            )}
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
