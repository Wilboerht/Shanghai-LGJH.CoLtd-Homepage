'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  ShoppingCart,
  FileText,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock,
  Shield,
  Headphones,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import Link from 'next/link'

const businessServices = [
  {
    icon: ShoppingCart,
    title: '产品购买',
    description: '直接购买我们的智能化产品，享受专业的售前售后服务',
    features: ['在线选购', '快速下单', '安全支付', '物流跟踪'],
    href: '/business/purchase',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: FileText,
    title: '获取方案',
    description: '获取定制化的解决方案，满足您的特定业务需求',
    features: ['需求分析', '方案设计', '报价评估', '实施规划'],
    href: '/solutions',
    color: 'from-green-500 to-emerald-500',
  },
]

const advantages = [
  {
    icon: Star,
    title: '专业品质',
    description: '多年行业经验，确保产品和服务的专业品质',
  },
  {
    icon: Users,
    title: '专家团队',
    description: '资深技术专家团队，提供全方位技术支持',
  },
  {
    icon: Clock,
    title: '快速响应',
    description: '7×24小时客服支持，快速响应客户需求',
  },
  {
    icon: Shield,
    title: '安全保障',
    description: '完善的质量保证体系，确保交付安全可靠',
  },
  {
    icon: Headphones,
    title: '贴心服务',
    description: '从咨询到实施的全程贴心服务体验',
  },
  {
    icon: CheckCircle,
    title: '成功案例',
    description: '丰富的成功案例，值得信赖的合作伙伴',
  },
]

export default function BusinessPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900'>
      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 md:py-32'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 dark:from-blue-900/40 dark:to-indigo-900/40' />

        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className='mb-6 flex items-center justify-center space-x-3'>
                <div className='rounded-xl bg-blue-500 p-3'>
                  <CreditCard className='h-8 w-8 text-white' />
                </div>
                <h1 className='text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl'>
                  商业服务
                </h1>
              </div>
              <p className='mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl'>
                专业的商业服务，为您提供产品购买和定制化解决方案
              </p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/business/purchase'>
                  <Button
                    size='lg'
                    className='bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl'
                  >
                    立即购买
                    <ShoppingCart className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
                <Link href='/solutions'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20'
                  >
                    获取方案
                    <FileText className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Business Services */}
      <section className='bg-white py-16 dark:bg-gray-800 md:py-24'>
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
                商业服务
              </h2>
              <p className='mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300'>
                选择适合您的商业服务模式，我们为您提供专业的支持
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {businessServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.title}
                    className='group relative rounded-2xl bg-gray-50 p-8 transition-all duration-300 hover:shadow-xl dark:bg-gray-700'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className='mb-6 flex items-center space-x-4'>
                      <div className={`bg-gradient-to-r p-4 ${service.color} rounded-xl`}>
                        <Icon className='h-8 w-8 text-white' />
                      </div>
                      <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {service.title}
                      </h3>
                    </div>
                    <p className='mb-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className='mb-8'>
                      <h4 className='mb-3 font-semibold text-gray-900 dark:text-white'>
                        服务特色：
                      </h4>
                      <ul className='space-y-2'>
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className='flex items-center text-gray-600 dark:text-gray-300'
                          >
                            <CheckCircle className='mr-3 h-4 w-4 flex-shrink-0 text-green-500' />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Link href={service.href}>
                      <Button
                        className='w-full transition-transform duration-300 group-hover:scale-105'
                        size='lg'
                      >
                        了解详情
                        <ArrowRight className='ml-2 h-5 w-5' />
                      </Button>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Advantages */}
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
                选择我们的优势
              </h2>
              <p className='mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300'>
                专业、可靠、高效的商业服务，为您的业务发展保驾护航
              </p>
            </motion.div>

            {/* Advantages Grid */}
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {advantages.map((advantage, index) => {
                const Icon = advantage.icon
                return (
                  <motion.div
                    key={advantage.title}
                    className='rounded-xl bg-white p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
                      <Icon className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                    </div>
                    <h3 className='mb-3 text-xl font-bold text-gray-900 dark:text-white'>
                      {advantage.title}
                    </h3>
                    <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                      {advantage.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='bg-gradient-to-r from-blue-600 to-indigo-600 py-16 dark:from-blue-800 dark:to-indigo-800 md:py-24'>
        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>开始您的商业合作</h2>
              <p className='mb-8 text-lg text-blue-100'>联系我们，获取专业的商业服务和技术支持</p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/contact'>
                  <Button
                    size='lg'
                    className='bg-white text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl'
                  >
                    联系我们
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                >
                  在线咨询
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}
