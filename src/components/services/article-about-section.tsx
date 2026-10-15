'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { Quote, List, Image as ImageIcon, Type, Minus } from 'lucide-react'

// 文章式关于服务的数据类型
export interface ArticleAboutData {
  title: string
  subtitle?: string
  description?: string
  content?: string // 富文本内容
  details?: string[] // 向后兼容
  sections?: Array<{
    id: string
    type: 'text' | 'image' | 'list' | 'quote' | 'divider'
    title?: string
    content?: string
    imageUrl?: string
    imageAlt?: string
    items?: string[]
    order: number
  }>
}

interface ArticleAboutSectionProps {
  data: ArticleAboutData
}

export function ArticleAboutSection({ data }: ArticleAboutSectionProps) {
  // 渲染不同类型的内容块
  const renderSection = (section: NonNullable<ArticleAboutData['sections']>[0], index: number) => {
    const baseDelay = index * 0.1

    switch (section.type) {
      case 'text':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: baseDelay }}
            className='prose prose-lg max-w-none'
          >
            {section.title && (
              <h3 className='mb-4 text-2xl font-semibold text-gray-900'>{section.title}</h3>
            )}
            <div
              className='leading-relaxed text-gray-700'
              dangerouslySetInnerHTML={{ __html: section.content || '' }}
            />
          </motion.div>
        )

      case 'image':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: baseDelay }}
            className='my-8'
          >
            {section.title && (
              <h3 className='mb-4 text-center text-xl font-semibold text-gray-900'>
                {section.title}
              </h3>
            )}
            <div className='relative overflow-hidden rounded-lg shadow-lg'>
              <Image
                src={section.imageUrl || ''}
                alt={section.imageAlt || section.title || ''}
                width={800}
                height={400}
                className='h-auto w-full'
              />
            </div>
          </motion.div>
        )

      case 'list':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: baseDelay }}
            className='my-6'
          >
            {section.title && (
              <h3 className='mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900'>
                <List className='h-5 w-5 text-blue-600' />
                {section.title}
              </h3>
            )}
            <ul className='space-y-3'>
              {section.items?.map((item, itemIndex) => (
                <motion.li
                  key={itemIndex}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: baseDelay + itemIndex * 0.05 }}
                  className='flex items-start gap-3 text-gray-700'
                >
                  <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600'></div>
                  <span className='leading-relaxed'>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )

      case 'quote':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: baseDelay }}
            className='my-8'
          >
            <div className='rounded-r-lg border-l-4 border-blue-600 bg-blue-50 p-6'>
              <Quote className='mb-4 h-8 w-8 text-blue-600' />
              <blockquote className='text-lg italic leading-relaxed text-gray-800'>
                {section.content}
              </blockquote>
              {section.title && (
                <cite className='mt-4 block text-sm font-medium text-gray-600'>
                  — {section.title}
                </cite>
              )}
            </div>
          </motion.div>
        )

      case 'divider':
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: baseDelay }}
            className='my-8 flex items-center justify-center'
          >
            <div className='flex w-full max-w-md items-center gap-4'>
              <div className='h-px flex-1 bg-gradient-to-r from-transparent to-gray-300'></div>
              <Minus className='h-4 w-4 text-gray-400' />
              <div className='h-px flex-1 bg-gradient-to-l from-transparent to-gray-300'></div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  // 如果有新的sections数据，使用文章式布局
  const hasArticleContent = data.sections && data.sections.length > 0

  // 如果有富文本content，也使用文章式布局
  const hasRichContent = data.content && data.content.trim() !== ''

  return (
    <div className='py-16 lg:py-20'>
      <Container>
        <div className='mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* 标题和副标题 */}
            <div className='mb-12 text-center'>
              <h2 className='mb-4 text-3xl font-bold text-gray-900'>{data.title}</h2>
              {data.subtitle && (
                <p className='mx-auto mb-6 max-w-3xl text-lg text-gray-600'>{data.subtitle}</p>
              )}

              {/* 简短描述 */}
              {data.description && (
                <p className='mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-gray-700'>
                  {data.description}
                </p>
              )}
            </div>

            {/* 文章式内容 - 移除卡片样式 */}
            <div className='max-w-none'>
              {/* 富文本内容 */}
              {hasRichContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className='prose prose-lg mb-8 max-w-none'
                >
                  <div
                    className='leading-relaxed text-gray-700'
                    dangerouslySetInnerHTML={{ __html: data.content || '' }}
                  />
                </motion.div>
              )}

              {/* 模块化内容块 */}
              {hasArticleContent && (
                <div className='space-y-8'>
                  {data.sections
                    ?.sort((a, b) => a.order - b.order)
                    .map((section, index) => renderSection(section, index))}
                </div>
              )}

              {/* 向后兼容：如果没有新内容，显示原有的details - 完全移除边框和背景 */}
              {!hasArticleContent && !hasRichContent && data.details && data.details.length > 0 && (
                <div className='space-y-6'>
                  {data.details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className='text-center'
                    >
                      <p className='mx-auto max-w-3xl text-lg leading-relaxed text-gray-700'>
                        {detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
