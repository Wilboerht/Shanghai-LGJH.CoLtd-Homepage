'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Package,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Star,
  Truck,
  Shield,
  Phone,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import Link from 'next/link'

const productCategories = [
  {
    icon: Package,
    title: '智能数字化产品',
    description: '核心数字化产品，助力企业数字化转型',
    products: ['数据分析平台', '智能监控系统', '自动化控制设备'],
    price: '¥50,000 起',
    href: '/products?category=digital-products',
  },
  {
    icon: Package,
    title: 'AI智能设计',
    description: 'AI驱动的设计产品，提升设计效率',
    products: ['智能设计软件', 'AI辅助工具', '自动化设计系统'],
    price: '¥30,000 起',
    href: '/products?category=ai-design',
  },
  {
    icon: Package,
    title: '智能医疗',
    description: '医疗健康智能产品，改善医疗服务质量',
    products: ['医疗监测设备', '智能诊断系统', '健康管理平台'],
    price: '¥80,000 起',
    href: '/products?category=smart-medical',
  },
  {
    icon: Package,
    title: '智慧养老',
    description: '养老服务智能产品，提升养老服务水平',
    products: ['智能看护系统', '健康监测设备', '紧急呼叫系统'],
    price: '¥40,000 起',
    href: '/products?category=smart-elderly-care',
  },
]

const purchaseSteps = [
  {
    step: 1,
    title: '产品选择',
    description: '浏览产品目录，选择适合的产品',
    icon: Package,
  },
  {
    step: 2,
    title: '需求确认',
    description: '与销售顾问确认具体需求',
    icon: MessageCircle,
  },
  {
    step: 3,
    title: '报价确认',
    description: '获取详细报价和合同条款',
    icon: CreditCard,
  },
  {
    step: 4,
    title: '订单支付',
    description: '签署合同并完成付款',
    icon: CheckCircle,
  },
  {
    step: 5,
    title: '产品交付',
    description: '产品生产、测试和交付',
    icon: Truck,
  },
]

const services = [
  {
    icon: Shield,
    title: '质量保证',
    description: '所有产品均通过严格质量检测，提供质量保证',
  },
  {
    icon: Truck,
    title: '快速交付',
    description: '高效的生产和物流体系，确保快速交付',
  },
  {
    icon: Phone,
    title: '技术支持',
    description: '专业技术团队提供全方位技术支持服务',
  },
  {
    icon: Star,
    title: '售后服务',
    description: '完善的售后服务体系，让您无后顾之忧',
  },
]

export default function PurchasePage() {
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
                  <ShoppingCart className='h-8 w-8 text-white' />
                </div>
                <h1 className='text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl'>
                  产品购买
                </h1>
              </div>
              <p className='mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl'>
                选购我们的智能化产品，享受专业的销售和售后服务
              </p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button
                  size='lg'
                  className='bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl'
                >
                  查看产品目录
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20'
                >
                  联系销售顾问
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Product Categories */}
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
                产品分类
              </h2>
              <p className='mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300'>
                选择适合您需求的产品分类，获取详细的产品信息和报价
              </p>
            </motion.div>

            {/* Categories Grid */}
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              {productCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <motion.div
                    key={category.title}
                    className='rounded-2xl bg-gray-50 p-8 transition-shadow duration-300 hover:shadow-lg dark:bg-gray-700'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className='mb-6 flex items-center space-x-4'>
                      <div className='rounded-xl bg-blue-100 p-3 dark:bg-blue-900'>
                        <Icon className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                          {category.title}
                        </h3>
                        <p className='font-semibold text-blue-600 dark:text-blue-400'>
                          {category.price}
                        </p>
                      </div>
                    </div>
                    <p className='mb-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                      {category.description}
                    </p>

                    {/* Products */}
                    <div className='mb-6'>
                      <h4 className='mb-3 font-semibold text-gray-900 dark:text-white'>
                        主要产品：
                      </h4>
                      <ul className='space-y-2'>
                        {category.products.map((product, idx) => (
                          <li
                            key={idx}
                            className='flex items-center text-gray-600 dark:text-gray-300'
                          >
                            <CheckCircle className='mr-3 h-4 w-4 flex-shrink-0 text-green-500' />
                            {product}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Link href={category.href}>
                      <Button className='w-full' size='lg'>
                        查看详情
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

      {/* Purchase Process */}
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
                购买流程
              </h2>
              <p className='mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300'>
                简单明了的购买流程，让您轻松完成产品采购
              </p>
            </motion.div>

            {/* Process Steps */}
            <div className='relative'>
              {/* Process Line */}
              <div className='absolute left-0 right-0 top-1/2 hidden h-0.5 -translate-y-1/2 transform bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 lg:block' />

              <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5'>
                {purchaseSteps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <motion.div
                      key={step.step}
                      className='relative text-center'
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {/* Step Number */}
                      <div className='relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white'>
                        {step.step}
                      </div>

                      {/* Step Content */}
                      <div>
                        <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                          {step.title}
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
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
                服务保障
              </h2>
              <p className='mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300'>
                完善的服务体系，为您的购买决策提供全方位保障
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.title}
                    className='rounded-xl bg-gray-50 p-6 text-center dark:bg-gray-700'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
                      <Icon className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                    </div>
                    <h3 className='mb-3 text-xl font-bold text-gray-900 dark:text-white'>
                      {service.title}
                    </h3>
                    <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                      {service.description}
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
              <h2 className='mb-6 text-3xl font-bold text-white md:text-4xl'>立即开始购买</h2>
              <p className='mb-8 text-lg text-blue-100'>
                联系我们的销售团队，获取专业的产品咨询和购买服务
              </p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/contact'>
                  <Button
                    size='lg'
                    className='bg-white text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl'
                  >
                    联系销售
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
                <Link href='/products'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-white text-white hover:bg-white/10'
                  >
                    浏览产品
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
