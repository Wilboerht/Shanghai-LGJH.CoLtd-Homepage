'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Calendar,
  User,
  Tag,
  Download,
  FileText,
  Star,
  ChevronRight,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Clock,
  Users,
  Award,
  Library,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface Research {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  categoryName: string
  content: string
  image?: string
  slug: string
  publishedAt: Date | string
  tags: string[]
  authors: Array<{
    name: string
    title?: string
    email?: string
    avatar?: string
  }>
  attachments: Array<{
    name: string
    url: string
    type?: string
  }>
  featured: boolean
  updatedAt: Date | string
}

interface RelatedResearch {
  id: string
  title: string
  description: string
  slug: string
  category: string
  categoryName: string
  publishedAt: Date | string
  tags: string[]
  featured: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  categoryName: string
}

interface ResearchDetailClientProps {
  research: Research
  category: Category
  relatedResearch: RelatedResearch[]
}

export default function ResearchDetailClient({
  research,
  category,
  relatedResearch,
}: ResearchDetailClientProps) {
  // 格式化日期
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // 根据分类获取对应的链接
  const getCategoryLink = (category: string) => {
    const categoryLinks: Record<string, string> = {
      AI_RESEARCH: '/research/ai-research',
      INNOVATION: '/research/innovation',
      PAPERS: '/research/papers',
      ACHIEVEMENTS: '/research/achievements',
    }
    return categoryLinks[category] || '/research'
  }

  // 根据分类获取主题色配置
  const getCategoryTheme = (category: string) => {
    const themes: Record<string, any> = {
      AI_RESEARCH: {
        gradient: 'from-indigo-50 via-white to-blue-50',
        primary: 'indigo',
        secondary: 'blue',
        badgeClass: 'border-indigo-200 bg-indigo-50 text-indigo-700',
        iconColor: 'text-indigo-600',
        accentColor: 'from-indigo-500 to-blue-500',
      },
      INNOVATION: {
        gradient: 'from-amber-50 via-white to-orange-50',
        primary: 'amber',
        secondary: 'orange',
        badgeClass: 'border-amber-200 bg-amber-50 text-amber-700',
        iconColor: 'text-amber-600',
        accentColor: 'from-amber-500 to-orange-500',
      },
      PAPERS: {
        gradient: 'from-slate-50 via-white to-gray-50',
        primary: 'slate',
        secondary: 'gray',
        badgeClass: 'border-slate-200 bg-slate-50 text-slate-700',
        iconColor: 'text-slate-600',
        accentColor: 'from-slate-500 to-gray-500',
      },
      ACHIEVEMENTS: {
        gradient: 'from-emerald-50 via-white to-green-50',
        primary: 'emerald',
        secondary: 'green',
        badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        iconColor: 'text-emerald-600',
        accentColor: 'from-emerald-500 to-green-500',
      },
    }
    return themes[category] || themes['AI_RESEARCH']
  }

  const theme = getCategoryTheme(research.category)

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
        <div className='bg-grid-slate-100 absolute inset-0 -z-10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]'></div>
        <Container>
          <div className='pb-8 pt-16 md:pb-12 md:pt-20'>
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-6'
            >
              <nav className='flex items-center space-x-2 text-sm text-gray-600'>
                <Link href='/' className={`hover:${theme.iconColor} transition-colors`}>
                  首页
                </Link>
                <ChevronRight className='h-4 w-4' />
                <Link href='/research' className={`hover:${theme.iconColor} transition-colors`}>
                  研究中心
                </Link>
                <ChevronRight className='h-4 w-4' />
                <Link
                  href={getCategoryLink(research.category)}
                  className={`hover:${theme.iconColor} transition-colors`}
                >
                  {research.categoryName}
                </Link>
                <ChevronRight className='h-4 w-4' />
                <span className='line-clamp-1 font-medium text-gray-900'>{research.title}</span>
              </nav>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='mx-auto max-w-4xl text-center'
            >
              {/* 学术分类和标识 */}
              <div className='mb-8 flex items-center justify-center gap-4'>
                <Badge
                  variant='outline'
                  className='border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-700'
                >
                  {research.categoryName}
                </Badge>
                {research.featured && (
                  <Badge className='border-amber-300 bg-amber-100 px-3 py-1 text-amber-800'>
                    <Star className='mr-1 h-3 w-3 fill-current' />
                    重点研究
                  </Badge>
                )}
              </div>

              {/* 学术标题 */}
              <h1 className='mx-auto mb-4 max-w-3xl font-serif text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-4xl'>
                {research.title}
              </h1>

              {/* 英文副标题 */}
              {research.subtitle && (
                <h2 className='mx-auto mb-8 max-w-2xl text-base font-medium italic leading-relaxed text-gray-600 md:text-lg'>
                  {research.subtitle}
                </h2>
              )}

              {/* 学术元信息 */}
              <div className='mx-auto mb-8 max-w-3xl rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50 p-6'>
                <div className='grid grid-cols-1 gap-4 text-center md:grid-cols-2'>
                  <div className='flex items-center justify-center text-sm text-gray-600'>
                    <Calendar className='mr-2 h-4 w-4 text-gray-500' />
                    <span className='font-medium'>发表日期:</span>
                    <span className='ml-2'>{formatDate(research.publishedAt)}</span>
                  </div>
                  <div className='flex items-center justify-center text-sm text-gray-600'>
                    <Clock className='mr-2 h-4 w-4 text-gray-500' />
                    <span className='font-medium'>最后更新:</span>
                    <span className='ml-2'>{formatDate(research.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* 摘要 */}
              <div
                className={`mb-8 rounded-xl border-l-4 border-${theme.primary}-500 bg-gradient-to-r from-${theme.primary}-50 to-${theme.secondary}-50 mx-auto max-w-4xl p-6`}
              >
                <h3 className='mb-3 flex items-center justify-center font-serif text-lg font-semibold text-gray-900'>
                  <BookOpen className={`mr-2 h-5 w-5 ${theme.iconColor}`} />
                  研究摘要
                  <span className='ml-2 text-sm font-normal text-gray-500'>Research Abstract</span>
                </h3>
                <p className='text-center text-base leading-relaxed text-gray-700'>
                  {research.description}
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 学术内容 */}
      <section className='bg-white py-8 md:py-12'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* 研究内容 */}
              <div className='mb-12'>
                <div className='mb-6 text-center'>
                  <div
                    className={`inline-flex items-center rounded-full bg-${theme.primary}-100 mb-3 px-3 py-1.5`}
                  >
                    <FileText className={`mr-2 h-4 w-4 ${theme.iconColor}`} />
                    <span className={`text-xs font-medium text-${theme.primary}-800`}>
                      Research Content
                    </span>
                  </div>
                  <h2 className='mb-2 font-serif text-2xl font-bold text-gray-900'>研究内容</h2>
                  <div
                    className={`h-0.5 w-16 bg-gradient-to-r ${theme.accentColor} mx-auto rounded-full`}
                  ></div>
                </div>
                <div className='prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ol:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700'>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{research.content}</ReactMarkdown>
                </div>
              </div>

              {/* 关键词 */}
              {research.tags.length > 0 && (
                <div className='mb-10 rounded-xl border border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50 p-5'>
                  <h3 className='mb-4 flex items-center justify-center font-serif text-lg font-semibold text-gray-900'>
                    <Tag className={`mr-2 h-5 w-5 ${theme.iconColor}`} />
                    关键词
                    <span className='ml-2 text-sm font-normal text-gray-500'>Keywords</span>
                  </h3>
                  <div className='flex flex-wrap justify-center gap-2'>
                    {research.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className={`${theme.badgeClass} hover:bg-${theme.primary}-100 cursor-default px-4 py-2 text-sm font-medium transition-colors`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 研究团队详情 */}
              {research.authors.length > 0 && (
                <div className='mb-12'>
                  <div className='mb-6 text-center'>
                    <div
                      className={`inline-flex items-center rounded-full bg-${theme.primary}-100 mb-3 px-3 py-1.5`}
                    >
                      <Users className={`mr-2 h-4 w-4 ${theme.iconColor}`} />
                      <span className={`text-xs font-medium text-${theme.primary}-800`}>
                        Research Team
                      </span>
                    </div>
                    <h3 className='mb-2 font-serif text-xl font-bold text-gray-900'>研究团队</h3>
                    <div
                      className={`h-0.5 w-12 bg-gradient-to-r ${theme.accentColor} mx-auto rounded-full`}
                    ></div>
                  </div>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {research.authors.map((author, index) => (
                      <Card
                        key={index}
                        className='border border-gray-200 transition-shadow hover:shadow-md'
                      >
                        <CardContent className='p-6'>
                          <div className='flex items-start space-x-4'>
                            <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100'>
                              {author.avatar ? (
                                <img
                                  src={author.avatar}
                                  alt={author.name}
                                  className='h-full w-full object-cover'
                                  onError={e => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    target.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null}
                              <div
                                className={`flex h-full w-full items-center justify-center ${author.avatar ? 'hidden' : ''}`}
                              >
                                <div
                                  className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-${theme.primary}-100 to-${theme.secondary}-100`}
                                >
                                  <span className={`text-xl font-bold ${theme.iconColor}`}>
                                    {author.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='flex-1'>
                              <div className='mb-1 font-serif text-lg font-semibold text-gray-900'>
                                {author.name}
                              </div>
                              {author.title && (
                                <div className='mb-2 text-sm font-medium text-gray-600'>
                                  {author.title}
                                </div>
                              )}
                              {author.email && (
                                <div className='text-sm text-gray-500'>{author.email}</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 相关研究文献 */}
      {relatedResearch.length > 0 && (
        <section className='bg-gradient-to-br from-slate-50 via-white to-gray-50 py-10 md:py-12'>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className='mb-12 text-center'>
                <div className='mb-4 flex items-center justify-center'>
                  <Library className='mr-2 h-6 w-6 text-indigo-600' />
                  <h2 className='font-serif text-3xl font-bold text-gray-900'>相关研究文献</h2>
                </div>
                <p className='mb-2 text-gray-600'>Related Research Literature</p>
                <div className='mx-auto mb-4 h-0.5 w-16 bg-indigo-600'></div>
                <p className='mx-auto max-w-2xl text-gray-600'>
                  探索与本研究相关的其他学术成果和研究方向
                </p>
              </div>

              <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                {relatedResearch.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className='group h-full border border-gray-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg'>
                      <CardContent className='p-6'>
                        <div className='mb-4 flex items-center justify-between'>
                          <Badge
                            variant='outline'
                            className='border-indigo-200 bg-indigo-50 text-indigo-700'
                          >
                            {item.categoryName}
                          </Badge>
                          {item.featured && (
                            <Badge className='border-amber-300 bg-amber-100 text-amber-800'>
                              <Star className='mr-1 h-3 w-3 fill-current' />
                              重点
                            </Badge>
                          )}
                        </div>

                        <h3 className='mb-3 font-serif text-lg font-semibold leading-tight text-gray-900 transition-colors group-hover:text-indigo-600'>
                          <Link href={`/research/${item.slug}`} className='hover:underline'>
                            {item.title}
                          </Link>
                        </h3>

                        <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600'>
                          {item.description}
                        </p>

                        <div className='mb-4 flex flex-wrap gap-1'>
                          {(item.tags || []).slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant='secondary' className='text-xs'>
                              {tag}
                            </Badge>
                          ))}
                          {(item.tags || []).length > 3 && (
                            <Badge variant='secondary' className='text-xs'>
                              +{(item.tags || []).length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center text-xs text-gray-500'>
                            <Calendar className='mr-1 h-3 w-3' />
                            {formatDate(item.publishedAt)}
                          </div>
                          <Link href={`/research/${item.slug}`}>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-indigo-600 hover:text-indigo-700'
                            >
                              阅读更多
                              <ArrowRight className='ml-1 h-3 w-3' />
                            </Button>
                          </Link>
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
    </div>
  )
}
