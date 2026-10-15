'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb,
  Settings,
  TrendingUp,
  Shield,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
// import { ModernServiceData } from './modern-service-template'
// 临时定义类型，因为模板文件不存在
interface ModernServiceData {
  title: string
  subtitle?: string
  description?: string
  hero?: any
  learning?: any
  courseInfo?: any
  about?: any
  cta?: any
}
import { ArticleAboutSection } from './article-about-section'
import Link from 'next/link'

interface UnifiedServicePageProps {
  data: ModernServiceData
}

export function UnifiedServicePage({ data }: UnifiedServicePageProps) {
  // 获取背景图片URL，优先使用data中的backgroundImage，否则使用默认规则
  const getBackgroundImage = () => {
    if ((data as any).backgroundImage) {
      return (data as any).backgroundImage
    }

    const imageMap: Record<string, string> = {
      'digital-transformation': '/images/services/digital-transformation-bg.jpg',
      'intelligent-operation': '/images/services/intelligent-operation-bg.png',
      'intelligent-engineering': '/images/services/intelligent-engineering-bg.jpg',
      'fire-engineering': '/images/services/fire-engineering-bg.png',
      'risk-assessment': '/images/services/risk-assessment-bg.png',
      'other-services': '/images/services/other-services-bg.jpg',
    }
    return imageMap[(data as any).id] || `/images/services/${(data as any).id}-bg.jpg`
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        {/* 背景图片 */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: `url(${getBackgroundImage()})`,
          }}
        >
          {/* 深色遮罩层，确保文字可读性 */}
          <div className='absolute inset-0 bg-black/50'></div>
        </div>

        {/* 动态背景装饰 */}
        <div className='absolute inset-0'>
          <div className='absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/10 blur-3xl'></div>
          <div className='absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 animate-pulse rounded-full bg-indigo-500/10 blur-3xl delay-1000'></div>
          <div className='absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-cyan-500/5 blur-2xl delay-500'></div>

          {/* 网格背景 */}
          <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]'></div>
        </div>

        {/* 给导航栏预留空间 */}
        <div className='relative pt-20 lg:pt-24'>
          {/* 面包屑导航 */}
          <Container className='pb-4 pt-6'>
            <nav className='flex items-center space-x-2 text-sm text-white/60'>
              <Link href='/services' className='transition-colors hover:text-white/80'>
                所有服务
              </Link>
              <span>›</span>
              <Link href='/services' className='transition-colors hover:text-white/80'>
                专业服务
              </Link>
              <span>›</span>
              <span className='text-white/90'>{data.title}</span>
            </nav>
          </Container>

          {/* 主要内容区域 */}
          <Container className='pb-12 lg:pb-16'>
            <div className='grid grid-cols-1 items-center gap-8 py-8 lg:grid-cols-2 lg:gap-12 lg:py-12'>
              {/* 左侧内容 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className='text-white'
              >
                <div className='space-y-6'>
                  {/* 服务标签 */}
                  <div className='inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-2 shadow-xl backdrop-blur-sm'>
                    <CheckCircle className='h-4 w-4 text-blue-300' />
                    <span className='text-sm font-medium text-blue-200 drop-shadow-lg'>
                      {(data as any).category}
                    </span>
                  </div>

                  {/* 主标题区域 */}
                  <div className='space-y-4'>
                    <h1 className='text-3xl font-bold leading-tight tracking-tight drop-shadow-2xl lg:text-4xl xl:text-5xl'>
                      {data.hero.title}
                    </h1>
                    <p className='text-lg font-medium leading-relaxed text-white/90 drop-shadow-xl lg:text-xl'>
                      {data.hero.subtitle}
                    </p>
                  </div>

                  {/* 服务描述 */}
                  <p className='text-base leading-relaxed text-white/80 drop-shadow-lg lg:text-lg'>
                    {data.hero.description}
                  </p>

                  {/* CTA按钮 */}
                  <div className='pt-2'>
                    <Link href='/contact'>
                      <Button
                        size='lg'
                        className='group relative rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-500/25'
                      >
                        <span className='flex items-center justify-center'>
                          {data.cta.buttonText}
                          <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1' />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* 右侧卡片 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='space-y-4'
              >
                <div className='space-y-4'>
                  {/* 动态关键指标 */}
                  {(data as any).metrics &&
                  Array.isArray((data as any).metrics) &&
                  (data as any).metrics.length > 0 ? (
                    <div className='grid grid-cols-2 gap-4'>
                      {(data as any).metrics.slice(0, 4).map((metric: any, index: number) => (
                        <div
                          key={index}
                          className='rounded-lg border border-white/30 bg-white/20 p-4 shadow-lg backdrop-blur-md'
                        >
                          <div className='flex items-center gap-3'>
                            {index === 0 && <TrendingUp className='h-6 w-6 text-green-400' />}
                            {index === 1 && <CheckCircle className='h-6 w-6 text-blue-400' />}
                            {index === 2 && <Target className='h-6 w-6 text-purple-400' />}
                            {index === 3 && <Shield className='h-6 w-6 text-orange-400' />}
                            <div>
                              <p className='font-semibold text-white'>{metric.value}</p>
                              <p className='text-sm text-white/70'>{metric.label}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // 默认指标（当数据库中没有metrics时）
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='rounded-lg border border-white/30 bg-white/20 p-4 shadow-lg backdrop-blur-md'>
                        <div className='flex items-center gap-3'>
                          <TrendingUp className='h-6 w-6 text-green-400' />
                          <div>
                            <p className='font-semibold text-white'>80%</p>
                            <p className='text-sm text-white/70'>效率提升</p>
                          </div>
                        </div>
                      </div>
                      <div className='rounded-lg border border-white/30 bg-white/20 p-4 shadow-lg backdrop-blur-md'>
                        <div className='flex items-center gap-3'>
                          <CheckCircle className='h-6 w-6 text-blue-400' />
                          <div>
                            <p className='font-semibold text-white'>60%</p>
                            <p className='text-sm text-white/70'>成本降低</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 服务特色 */}
                  <div className='rounded-lg border border-white/30 bg-white/20 p-4 shadow-lg backdrop-blur-md'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600'>
                        <Shield className='h-6 w-6 text-white' />
                      </div>
                      <div className='min-w-0'>
                        <p className='font-semibold text-white'>专业保障</p>
                        <p className='text-sm text-white/80'>10年+行业经验</p>
                        <p className='text-xs text-white/60'>200+成功案例</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </div>
      </div>

      {/* 关于此服务 - 文章式 */}
      <ArticleAboutSection data={data.about} />

      {/* 服务流程部分 */}
      <div className='py-16 lg:py-20'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>服务流程</h2>
            <p className='mx-auto max-w-2xl text-base text-gray-600'>科学的方法论，确保服务成功</p>
          </motion.div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                step: '01',
                title: '需求分析',
                description: '深入了解客户需求',
                icon: Target,
              },
              {
                step: '02',
                title: '方案设计',
                description: '制定专业解决方案',
                icon: Lightbulb,
              },
              {
                step: '03',
                title: '项目实施',
                description: '专业团队执行落地',
                icon: Settings,
              },
              {
                step: '04',
                title: '持续优化',
                description: '跟踪效果持续改进',
                icon: TrendingUp,
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='relative'
              >
                <div className='relative overflow-hidden rounded-xl bg-white p-6 text-center'>
                  {/* 数字编号作为背景 */}
                  <div className='absolute right-4 top-4 select-none text-6xl font-bold text-blue-50'>
                    {step.step}
                  </div>

                  {/* 内容区域 */}
                  <div className='relative z-10'>
                    {/* 图标 */}
                    <step.icon className='mx-auto mb-4 h-10 w-10 text-blue-600' />

                    {/* 标题 */}
                    <h3 className='mb-2 text-lg font-semibold text-gray-900'>{step.title}</h3>

                    {/* 描述 */}
                    <p className='text-sm text-gray-600'>{step.description}</p>
                  </div>
                </div>

                {/* 简化的连接箭头 */}
                {index < 3 && (
                  <div className='absolute -right-3 top-1/2 hidden -translate-y-1/2 transform lg:block'>
                    <ArrowRight className='h-6 w-6 stroke-2 text-gray-400' />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* 服务内容部分 */}
      <div className='py-12 lg:py-16'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            {/* 服务内容 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-8 text-center text-3xl font-bold text-gray-900'>
                {data.learning.title}
              </h2>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {data.learning.objectives.map((objective: any, index: number) => (
                  <div
                    key={index}
                    className='flex items-center justify-center gap-3 p-4 text-center'
                  >
                    <CheckCircle className='h-5 w-5 flex-shrink-0 text-blue-600' />
                    <p className='text-gray-700'>{objective}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* CTA Section */}
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

        {/* 内容区域 */}
        <Container className='relative z-10'>
          <div className='mx-auto max-w-5xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-6 font-noto-serif-sc text-2xl font-light text-gray-900 md:text-3xl lg:text-4xl'>
                开启您的专业服务之旅
              </h2>
              <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl'>
                我们致力于通过专业的服务，帮助企业实现业务目标， 提升运营效率，创造更大的商业价值。
              </p>

              <div className='flex justify-center'>
                <Link href='/contact'>
                  <Button
                    size='lg'
                    className='group bg-blue-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl'
                  >
                    联系我们
                    <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
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
