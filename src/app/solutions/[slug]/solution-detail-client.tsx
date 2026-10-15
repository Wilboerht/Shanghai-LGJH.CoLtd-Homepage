'use client'

import * as React from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Target,
  Zap,
  Users,
  Glasses,
  Building,
  Factory,
  Truck,
  Heart,
  Shield,
  Cpu,
  Smartphone,
  Wifi,
  Database,
  Cloud,
  BarChart3,
  Settings,
  Monitor,
  Camera,
  Lock,
  AlertTriangle,
  Wrench,
  Headphones,
  Grid3X3,
  Layers,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import '@/styles/solution-content.css'
// 解决方案接口定义 - 与数据库模型保持一致
interface Solution {
  id: string
  title: string
  subtitle?: string
  description?: string
  content?: string // 富文本内容字段
  category: string
  features?: string[]
  applications?: string[]
  metrics?: Array<{
    value: string
    label: string
  }>
  technologies?: string[]
  benefits?: string[]
  image?: string
  slug: string
  gradient?: string
  accentColor?: string
  createdAt?: Date
  updatedAt?: Date
}

const iconMap = {
  Glasses,
  Building,
  Factory,
  Truck,
  Heart,
  Shield,
  Cpu,
  Smartphone,
  Wifi,
  Database,
  Cloud,
  BarChart3,
  Settings,
  Monitor,
  Camera,
  Lock,
  AlertTriangle,
  Wrench,
  Headphones,
  Grid3X3,
  Layers,
  Target,
  Zap,
  Users,
  CheckCircle,
}

interface SolutionDetailClientProps {
  solution: Omit<Solution, 'icon'>
  category: { id: string; name: string; description: string; iconName?: string } | undefined
  relatedSolutions: (Omit<Solution, 'icon'> & { iconName?: string })[]
  solutionIconName: string
}

export default function SolutionDetailClient({
  solution,
  category,
  relatedSolutions,
  solutionIconName,
}: SolutionDetailClientProps) {
  const Icon = iconMap[solutionIconName as keyof typeof iconMap] || Glasses

  return (
    <div className='min-h-screen bg-white dark:bg-slate-900'>
      {/* 添加顶部间距以适应固定的统一导航栏 */}
      <div className='pt-20 sm:pt-24'>
        {/* Header */}
        <section className='pb-8'>
          <Container>
            {/* Navigation */}
            <div className='mb-6'>
              <Link
                href='/solutions'
                className='inline-flex items-center text-sm text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                返回解决方案
              </Link>
            </div>

            <div className='mx-auto max-w-4xl'>
              {/* Title Section */}
              <div className='text-center'>
                {category && (
                  <div className='mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'>
                    <Icon className='mr-2 h-4 w-4' />
                    {category.name}
                  </div>
                )}

                <h1 className='mb-3 text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-3xl'>
                  {solution.title}
                </h1>

                {solution.subtitle && (
                  <p className='mb-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg'>
                    {solution.subtitle}
                  </p>
                )}

                {solution.description && (
                  <p className='leading-relaxed text-slate-500 dark:text-slate-400'>
                    {solution.description}
                  </p>
                )}
              </div>

              {/* Key Metrics */}
              {solution.metrics && solution.metrics.length > 0 && (
                <div className='mt-8'>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {solution.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className='rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800'
                      >
                        <div className='mb-1 text-xl font-bold text-slate-900 dark:text-white md:text-2xl'>
                          {metric.value}
                        </div>
                        <div className='text-xs text-slate-600 dark:text-slate-400 md:text-sm'>
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* Applications Section - 应用场景 */}
        {solution.applications && solution.applications.length > 0 && (
          <section className='border-y border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 py-6 dark:border-slate-700 dark:from-slate-800 dark:to-slate-700'>
            <Container>
              <div className='mx-auto max-w-5xl text-center'>
                <div className='flex flex-wrap justify-center gap-2'>
                  {solution.applications.map((application, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:ring-slate-500 dark:hover:ring-slate-400'
                    >
                      <div className='mr-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                      {application}
                    </span>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Main Content - 详情介绍 */}
        {solution.content && solution.content.trim() && (
          <section className='bg-white py-16 dark:bg-slate-900'>
            <Container>
              <div className='mx-auto max-w-4xl'>
                <h2 className='mb-8 text-center text-2xl font-semibold text-slate-900 dark:text-white'>
                  详情介绍
                </h2>
                <div className='prose prose-slate max-w-none dark:prose-invert prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-blue-600 prose-strong:text-slate-900 prose-ol:text-slate-600 prose-ul:text-slate-600 prose-li:text-slate-600 prose-img:rounded-lg prose-img:shadow-lg prose-headings:dark:text-white prose-p:dark:text-slate-300 prose-a:dark:text-blue-400 prose-strong:dark:text-white prose-ol:dark:text-slate-300 prose-ul:dark:text-slate-300 prose-li:dark:text-slate-300'>
                  <div
                    dangerouslySetInnerHTML={{ __html: solution.content }}
                    className='solution-content'
                  />
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Features - 核心功能 */}
        {solution.features && solution.features.length > 0 && (
          <section className='bg-white py-12 dark:bg-slate-900'>
            <Container>
              <div className='mx-auto max-w-4xl'>
                <h2 className='mb-8 flex items-center justify-center text-2xl font-semibold text-slate-900 dark:text-white'>
                  <CheckCircle className='mr-3 h-6 w-6 text-blue-600' />
                  核心功能
                </h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {solution.features.map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-center rounded-lg bg-slate-50 p-4 shadow-sm dark:bg-slate-800'
                    >
                      <div className='mr-3 h-2 w-2 rounded-full bg-blue-500'></div>
                      <span className='text-sm text-slate-700 dark:text-slate-300'>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Technologies - 核心技术 */}
        {solution.technologies && solution.technologies.length > 0 && (
          <section className='bg-slate-50 py-12 dark:bg-slate-800'>
            <Container>
              <div className='mx-auto max-w-4xl'>
                <h2 className='mb-8 flex items-center justify-center text-2xl font-semibold text-slate-900 dark:text-white'>
                  <Zap className='mr-3 h-6 w-6 text-purple-600' />
                  核心技术
                </h2>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                  {solution.technologies.map((technology, index) => (
                    <div
                      key={index}
                      className='rounded-lg border border-purple-200 bg-white p-4 text-center dark:border-purple-800 dark:bg-slate-700'
                    >
                      <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                        {technology}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Benefits - 核心优势 */}
        {solution.benefits && solution.benefits.length > 0 && (
          <section className='bg-white py-12 dark:bg-slate-900'>
            <Container>
              <div className='mx-auto max-w-4xl'>
                <h2 className='mb-8 flex items-center justify-center text-2xl font-semibold text-slate-900 dark:text-white'>
                  <Users className='mr-3 h-6 w-6 text-orange-600' />
                  核心优势
                </h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {solution.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className='flex items-center rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20'
                    >
                      <div className='mr-3 h-2 w-2 rounded-full bg-orange-500'></div>
                      <span className='text-sm text-slate-700 dark:text-slate-300'>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Related Solutions */}
        {relatedSolutions.length > 0 && (
          <section className='bg-white py-16 dark:bg-slate-900'>
            <Container>
              <div className='mx-auto max-w-5xl'>
                <div className='mb-12 text-center'>
                  <h2 className='mb-4 text-2xl font-semibold text-slate-900 dark:text-white'>
                    相关解决方案
                  </h2>
                  <p className='mx-auto max-w-2xl text-slate-600 dark:text-slate-400'>
                    探索更多相关的解决方案，为您的业务需求提供全方位的技术支持
                  </p>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {relatedSolutions.map(relatedSolution => {
                    const RelatedIcon =
                      iconMap[relatedSolution.iconName as keyof typeof iconMap] || Glasses
                    return (
                      <Link key={relatedSolution.id} href={`/solutions/${relatedSolution.slug}`}>
                        <div className='group rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:hover:border-blue-600'>
                          <div className='mb-4 flex items-center gap-4'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50'>
                              <RelatedIcon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                            </div>
                            <div className='flex-1'>
                              <h3 className='font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                                {relatedSolution.title}
                              </h3>
                            </div>
                            <ArrowLeft className='h-5 w-5 rotate-180 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500' />
                          </div>
                          <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                            {relatedSolution.subtitle}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* CTA */}
        <section className='md:py-18 relative overflow-hidden py-12'>
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

          <Container className='relative z-10'>
            <div className='mx-auto max-w-4xl'>
              <div className='grid grid-cols-1 items-center gap-6 lg:grid-cols-2'>
                {/* Left Content */}
                <div>
                  <h2 className='mb-4 text-2xl font-bold text-slate-900 md:text-3xl'>
                    {solution.slug === 'smart-community-platform'
                      ? '打造智慧社区，守护美好生活'
                      : '与我们共赴新技术的时代'}
                  </h2>
                  <p className='mb-6 text-base leading-relaxed text-slate-600'>
                    {solution.slug === 'smart-community-platform'
                      ? '集成环境监测、智能安防、物业服务于一体，为您的社区提供全方位智慧化管理解决方案，让居民享受安全舒适的现代化生活体验'
                      : '专业顾问一对一服务，量身定制解决方案，让您的企业在数字化浪潮中抢占先机'}
                  </p>
                  <div className='flex flex-col gap-4 sm:flex-row'>
                    <Link href='/contact'>
                      <Button className='bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl'>
                        {solution.slug === 'smart-community-platform' ? '申请社区试点' : '立即咨询'}
                      </Button>
                    </Link>
                    {solution.slug === 'smart-community-platform' && (
                      <Button
                        variant='outline'
                        className='border-slate-300 px-6 py-2.5 font-semibold text-slate-700 shadow-lg transition-all duration-300 hover:bg-slate-50 hover:shadow-xl'
                      >
                        环境监测演示
                      </Button>
                    )}
                  </div>
                </div>

                {/* Right Image */}
                <div className='flex justify-center lg:justify-end'>
                  <div className='w-48'>
                    <img
                      src='/vctrly-business-illustrations-20.png'
                      alt='客户服务'
                      className='h-auto w-full'
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  )
}
