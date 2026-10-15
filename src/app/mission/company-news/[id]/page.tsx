'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, ArrowRight, Eye } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// 数据类型定义
interface NewsDetail {
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
  createdAt: string
  updatedAt: string
}

interface RelatedNews {
  id: string
  title: string
  summary: string
  image: string
  date: string
  category: string
}

interface NewsDetailData {
  news: NewsDetail
  relatedNews: RelatedNews[]
}

export default function CompanyNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = React.useState<NewsDetailData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 获取新闻详情数据
  React.useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        const response = await fetch(`/api/mission/company-news/${resolvedParams.id}`)

        if (response.status === 404) {
          notFound()
          return
        }

        if (!response.ok) {
          throw new Error('获取新闻详情失败')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取新闻详情失败')
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetail()
  }, [params])

  // 分享功能
  const handleShare = async () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !data) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: data.news.title,
          text: data.news.summary,
          url: window.location.href,
        })
      } catch (error) {
        console.log('分享失败:', error)
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

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
          <p className='mb-4 text-red-600'>{error || '新闻不存在'}</p>
          <Link href='/mission/company-news'>
            <Button>返回新闻列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { news, relatedNews } = data

  return (
    <div className='min-h-screen bg-white'>
      {/* 返回导航 */}
      <section className='bg-gray-50 pb-8 pt-20'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <Link
              href='/mission/company-news'
              className='inline-flex items-center text-gray-600 transition-colors hover:text-gray-900'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回公司动态
            </Link>
          </div>
        </Container>
      </section>

      {/* 文章头部 */}
      <section className='py-12'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* 分类标签 */}
              <div className='mb-6'>
                <span className='inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800'>
                  {news.category}
                </span>
              </div>

              {/* 标题 */}
              <h1 className='mb-6 font-noto-serif-sc text-3xl font-light leading-tight text-gray-900 md:text-5xl'>
                {news.title}
              </h1>

              {/* 摘要 */}
              {news.summary && (
                <p className='mb-8 text-xl leading-relaxed text-gray-600'>{news.summary}</p>
              )}

              {/* 元信息 */}
              <div className='mb-8 flex flex-wrap items-center gap-6 border-b border-gray-200 pb-8 text-sm text-gray-500'>
                <div className='flex items-center'>
                  <Calendar className='mr-2 h-4 w-4' />
                  {news.date}
                </div>
                <div className='flex items-center'>
                  <User className='mr-2 h-4 w-4' />
                  {news.author}
                </div>
                <div className='flex items-center'>
                  <Clock className='mr-2 h-4 w-4' />
                  {news.readTime}
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleShare}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <Share2 className='mr-2 h-4 w-4' />
                  分享
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 主要内容 */}
      <section className='pb-16'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* 特色图片 */}
              {news.image && (
                <div className='relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl'>
                  <Image src={news.image} alt={news.title} fill className='object-cover' />
                </div>
              )}

              {/* 文章内容 */}
              <div className='prose prose-lg max-w-none'>
                <div
                  className='leading-relaxed text-gray-800'
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>

              {/* 标签 */}
              {news.tags && Array.isArray(news.tags) && news.tags.length > 0 && (
                <div className='mt-12 border-t border-gray-200 pt-8'>
                  <div className='mb-4 flex items-center gap-2'>
                    <Tag className='h-4 w-4 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700'>标签</span>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {news.tags.map((tag, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* 相关新闻 */}
      {relatedNews && relatedNews.length > 0 && (
        <section className='bg-gray-50 py-16'>
          <Container>
            <div className='mx-auto max-w-6xl'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className='mb-8 text-center font-noto-serif-sc text-2xl font-light text-gray-900 md:text-3xl'>
                  相关动态
                </h2>

                <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                  {relatedNews.map((item, index) => (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className='group cursor-pointer'
                    >
                      <Link href={`/mission/company-news/${item.id}`}>
                        <div className='relative mb-4 aspect-[4/3] overflow-hidden rounded-xl'>
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className='object-cover transition-transform duration-300 group-hover:scale-105'
                          />
                        </div>

                        <div className='space-y-3'>
                          <div className='flex items-center gap-3 text-sm text-gray-500'>
                            <span className='inline-flex items-center rounded-md bg-orange-100 px-2 py-1 text-xs text-orange-700'>
                              {item.category}
                            </span>
                            <div className='flex items-center'>
                              <Calendar className='mr-1 h-3 w-3' />
                              {item.date}
                            </div>
                          </div>

                          <h3 className='line-clamp-2 font-noto-serif-sc text-lg font-medium leading-tight text-gray-900 transition-colors group-hover:text-orange-600'>
                            {item.title}
                          </h3>

                          <p className='line-clamp-2 text-sm leading-relaxed text-gray-600'>
                            {item.summary}
                          </p>

                          <div className='flex items-center justify-between'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='p-0 text-orange-600 hover:text-orange-700'
                            >
                              <span className='mr-2'>阅读更多</span>
                              <ArrowRight className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className='py-16 md:py-24'>
        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-6 font-noto-serif-sc text-2xl font-light text-gray-900 md:text-4xl'>
                了解更多企业动态
              </h2>
              <p className='mb-8 text-lg leading-relaxed text-gray-600'>
                关注我们的最新发展，获取第一手企业资讯
              </p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/mission/company-news'>
                  <Button size='lg' className='bg-orange-600 hover:bg-orange-700'>
                    查看更多动态
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
                <Link href='/contact'>
                  <Button size='lg' variant='outline'>
                    联系我们
                    <Eye className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}
