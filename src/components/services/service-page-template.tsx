'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, TrendingUp, Users, Zap } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { MetricsDisplay } from '@/components/business/metrics-display'
import { FeatureList } from '@/components/business/feature-list'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

// 服务页面数据类型定义
export interface ServiceMetric {
  value: string
  label: string
  color: string
}

export interface ServiceProcess {
  step: string
  title: string
  description: string
}

export interface ServicePageData {
  // 基本信息
  id: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon

  // 核心数据
  metrics: ServiceMetric[]
  features: string[]
  process: ServiceProcess[]

  // 可选内容
  visualElements?: {
    icon: LucideIcon
    title: string
    color: string
  }[]

  // CTA配置
  cta: {
    title: string
    description: string
    primaryButton: string
    secondaryButton: string
  }
}

interface ServicePageTemplateProps {
  data: ServicePageData
}

export function ServicePageTemplate({ data }: ServicePageTemplateProps) {
  const {
    id,
    title,
    subtitle,
    description,
    icon: ServiceIcon,
    metrics,
    features,
    process,
    visualElements,
    cta,
  } = data

  // 获取背景图片路径
  const getBackgroundImage = (serviceId: string) => {
    const imageMap: Record<string, string> = {
      'digital-transformation': '/images/services/digital-transformation-hero.svg',
      'intelligent-operation': '/images/services/intelligent-operation-hero.svg',
      'intelligent-engineering': '/images/services/intelligent-engineering-hero.svg',
      'fire-engineering': '/images/services/fire-engineering-hero.svg',
      'risk-assessment': '/images/services/risk-assessment-hero.svg',
      'other-services': '/images/services/other-services-hero.svg',
    }
    return imageMap[serviceId] || '/images/services/other-services-hero.svg'
  }

  // 默认视觉元素
  const defaultVisualElements = [
    { icon: TrendingUp, title: '业务增长', color: 'blue-600' },
    { icon: Users, title: '团队协作', color: 'teal-600' },
    { icon: Zap, title: '效率提升', color: 'cyan-600' },
    { icon: CheckCircle, title: '质量保证', color: 'green-600' },
  ]

  const displayVisualElements = visualElements || defaultVisualElements

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section
        className='relative overflow-hidden py-20 md:py-32'
        style={{
          backgroundImage: `url(${getBackgroundImage(id)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className='absolute inset-0 bg-black/40'></div>

        <Container className='relative z-10'>
          <div className='mx-auto max-w-6xl'>
            <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className='mb-6 flex items-center space-x-3'>
                  <div className='rounded-xl border border-white/30 bg-white/20 p-3 backdrop-blur-sm'>
                    <ServiceIcon className='h-8 w-8 text-white' />
                  </div>
                  <div>
                    <h1 className='text-4xl font-bold text-white drop-shadow-lg md:text-5xl'>
                      {title}
                    </h1>
                    <p className='text-lg text-white/90 drop-shadow-md'>{subtitle}</p>
                  </div>
                </div>

                <p className='mb-8 text-xl leading-relaxed text-white/90 drop-shadow-md'>
                  {description}
                </p>

                <div className='flex flex-col gap-4 sm:flex-row'>
                  <Link href='/contact'>
                    <Button
                      size='lg'
                      className='bg-white text-slate-900 shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl'
                    >
                      获取专业咨询
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-white text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-slate-900'
                  >
                    下载方案手册
                  </Button>
                </div>
              </motion.div>

              {/* Right Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <MetricsDisplay
                  metrics={metrics}
                  variant='detailed'
                  animated={true}
                  className='text-white'
                />
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className='bg-white py-16 dark:bg-gray-800 md:py-24'>
        <Container>
          <div className='mx-auto max-w-7xl'>
            <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className='mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl'>
                  核心服务内容
                </h2>
                <p className='mb-8 text-lg text-gray-600 dark:text-gray-300'>
                  我们提供全方位的{title}服务，帮助企业实现业务升级和创新发展。
                </p>

                <FeatureList
                  features={features}
                  variant='detailed'
                  accentColor='blue'
                  gradient='from-blue-600 to-teal-600'
                  animated={true}
                />
              </motion.div>

              {/* Right Visual */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='relative'
              >
                <div className='flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 p-8 dark:from-blue-900 dark:to-teal-900'>
                  <div className='grid w-full grid-cols-2 gap-4'>
                    {displayVisualElements.map((element, index) => {
                      const ElementIcon = element.icon
                      return (
                        <div
                          key={index}
                          className='rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800'
                        >
                          <ElementIcon className={`h-8 w-8 text-${element.color} mb-2`} />
                          <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {element.title}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className='bg-gray-50 py-16 dark:bg-gray-900 md:py-24'>
        <Container>
          <div className='mx-auto max-w-7xl'>
            {/* Section Header */}
            <motion.div
              className='mb-16 text-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className='mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl'>
                服务实施流程
              </h2>
              <p className='mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300'>
                我们采用科学的方法论，确保{title}项目的成功实施
              </p>
            </motion.div>

            {/* Process Steps */}
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
              {process.map((step, index) => (
                <motion.div
                  key={step.step}
                  className='text-center'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className='relative mb-6'>
                    <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-lg font-bold text-white'>
                      {step.step}
                    </div>
                    {index < process.length - 1 && (
                      <div className='absolute left-full top-8 hidden h-0.5 w-full -translate-x-8 bg-gradient-to-r from-blue-300 to-teal-300 lg:block' />
                    )}
                  </div>
                  <h3 className='mb-3 text-xl font-semibold text-gray-900 dark:text-white'>
                    {step.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='bg-gradient-to-r from-blue-600 to-teal-600 py-16 md:py-24'>
        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>{cta.title}</h2>
              <p className='mb-8 text-xl text-white/90'>{cta.description}</p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/contact'>
                  <Button
                    size='lg'
                    className='bg-white text-slate-900 shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl'
                  >
                    {cta.primaryButton}
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white transition-all duration-300 hover:bg-white hover:text-slate-900'
                >
                  {cta.secondaryButton}
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}
