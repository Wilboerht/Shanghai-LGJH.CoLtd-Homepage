'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LucideIcon,
  Monitor,
  Database,
  Activity,
  Heart,
  Zap,
  Wifi,
  Star,
  Play,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Shield,
  Gauge,
  Users,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  Download,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'

interface ImageItem {
  id: string
  url: string
  alt?: string
}

interface ProductData {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  images?: ImageItem[]
  category: string
  features: string[]
  specifications: Array<{
    name: string
    value: string
  }>
  applications: string[]
  benefits: string[]
  gradient: string
  accentColor: string
  slug: string
  status: 'available' | 'coming-soon' | 'discontinued'
  tags: string[]
}

interface RecommendedProduct {
  id: string
  title: string
  subtitle?: string
  image: string
  slug: string
  status: string
}

interface ProductDetailClientProps {
  product: ProductData
  recommendedProducts: RecommendedProduct[]
  iconName: string
}

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Database,
  Activity,
  Heart,
  Zap,
  Wifi,
}

export default function ProductDetailClient({
  product,
  recommendedProducts,
  iconName,
}: ProductDetailClientProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const Icon = iconMap[iconName] || Monitor

  // 从产品数据中获取图片库
  const productImages = React.useMemo(() => {
    if (product.images && product.images.length > 0) {
      // 使用产品的多张图片
      return product.images.map(img => img.url)
    } else if (product.image) {
      // 向后兼容：如果只有单张图片，使用单张图片
      return [product.image]
    } else {
      // 默认图片
      return ['/images/products/default-product.jpg']
    }
  }, [product.images, product.image])

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950'>
      {/* 添加顶部间距以适应固定的统一导航栏 */}
      <div className='pt-20 sm:pt-24'>
        {/* Hero Section */}
        <section className='py-20'>
          <Container>
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              {/* Left Content */}
              <motion.div
                className='space-y-8'
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className='flex gap-2'>
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant='secondary' className='text-xs'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Title and Subtitle */}
                <div className='space-y-4'>
                  <h1 className='font-alimama-shuhei text-4xl font-bold leading-tight text-slate-900 dark:text-white lg:text-5xl'>
                    {product.title}
                  </h1>
                  <p className='text-xl leading-relaxed text-slate-600 dark:text-slate-300'>
                    {product.subtitle}
                  </p>
                </div>

                {/* Key Features */}
                {product.features && product.features.length > 0 && (
                  <div className='space-y-3'>
                    <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                      核心特性
                    </h3>
                    <div className='grid grid-cols-2 gap-3'>
                      {product.features.slice(0, 4).map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                          className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300'
                        >
                          <CheckCircle className='h-4 w-4 flex-shrink-0 text-green-500' />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <motion.div
                  className='flex flex-col gap-4 sm:flex-row'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Link href='/contact'>
                    <Button size='lg' className='bg-blue-600 text-white hover:bg-blue-700'>
                      <MessageCircle className='mr-2 h-5 w-5' />
                      立即咨询
                    </Button>
                  </Link>
                  <Button
                    size='lg'
                    variant='outline'
                    onClick={() => {
                      const element = document.getElementById('product-overview')
                      element?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <ExternalLink className='mr-2 h-5 w-5' />
                    查看详情
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Image Gallery */}
              <motion.div
                className='relative'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className='relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'>
                  <Image
                    src={productImages[selectedImageIndex]}
                    alt={product.title}
                    fill
                    className='object-cover'
                    priority
                  />

                  {/* Image Navigation */}
                  {productImages.length > 1 && (
                    <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2'>
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          type='button'
                          onClick={() => setSelectedImageIndex(index)}
                          className={`h-3 w-3 rounded-full transition-all ${
                            index === selectedImageIndex
                              ? 'bg-white shadow-lg'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`查看产品图片 ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Floating Info Cards */}
                <motion.div
                  className='absolute -bottom-6 -left-6 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30'>
                      <Award className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>
                        行业领先
                      </p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>技术创新奖</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className='absolute -right-6 -top-6 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='rounded-lg bg-green-100 p-2 dark:bg-green-900/30'>
                      <Users className='h-5 w-5 text-green-600 dark:text-green-400' />
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-slate-900 dark:text-white'>1000+</p>
                      <p className='text-xs text-slate-500 dark:text-slate-400'>企业用户</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Main Content with Tabs */}
        <section id='product-overview' className='py-16'>
          <Container>
            <motion.div
              className='mx-auto max-w-6xl'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
                <TabsList className='mb-8 grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4'>
                  <TabsTrigger value='overview' className='flex items-center gap-2'>
                    <Lightbulb className='h-4 w-4' />
                    <span className='hidden sm:inline'>产品概述</span>
                  </TabsTrigger>
                  <TabsTrigger value='specifications' className='flex items-center gap-2'>
                    <Gauge className='h-4 w-4' />
                    <span className='hidden sm:inline'>技术规格</span>
                  </TabsTrigger>
                  <TabsTrigger value='applications' className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    <span className='hidden sm:inline'>应用场景</span>
                  </TabsTrigger>
                  <TabsTrigger value='benefits' className='flex items-center gap-2'>
                    <Award className='h-4 w-4' />
                    <span className='hidden sm:inline'>产品优势</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='mt-0'>
                  <div className='space-y-8'>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-3'>
                          <div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30'>
                            <Icon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                          </div>
                          产品详细介绍
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-6'>
                        {product.description ? (
                          <div className='prose prose-slate max-w-none dark:prose-invert'>
                            <div
                              className={`leading-relaxed text-slate-600 dark:text-slate-300 ${
                                !showFullDescription ? 'line-clamp-4' : ''
                              }`}
                              dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                            {product.description.length > 200 && (
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className='mt-4 text-blue-600 hover:text-blue-700'
                              >
                                {showFullDescription ? (
                                  <>
                                    <ChevronUp className='mr-2 h-4 w-4' />
                                    收起
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className='mr-2 h-4 w-4' />
                                    展开更多
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className='py-8 text-center'>
                            <p className='text-slate-500 dark:text-slate-400'>暂无详细介绍</p>
                          </div>
                        )}

                        {/* Core Features Grid */}
                        {product.features && product.features.length > 0 && (
                          <div className='space-y-4'>
                            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
                              核心功能特性
                            </h3>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                              {product.features.map((feature, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.4, delay: index * 0.1 }}
                                  className='flex items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50'
                                >
                                  <CheckCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-500' />
                                  <span className='text-sm text-slate-700 dark:text-slate-300'>
                                    {feature}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value='specifications' className='mt-0'>
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-3'>
                          <div className='rounded-lg bg-green-100 p-2 dark:bg-green-900/30'>
                            <Gauge className='h-6 w-6 text-green-600 dark:text-green-400' />
                          </div>
                          技术规格参数
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {product.specifications && product.specifications.length > 0 ? (
                          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            {product.specifications.map((spec, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className='flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50'
                              >
                                <span className='font-medium text-slate-600 dark:text-slate-400'>
                                  {spec.name}
                                </span>
                                <span className='text-lg font-bold text-slate-900 dark:text-white'>
                                  {spec.value}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className='py-8 text-center'>
                            <p className='text-slate-500 dark:text-slate-400'>暂无技术规格信息</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value='applications' className='mt-0'>
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-3'>
                          <div className='rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30'>
                            <Users className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                          </div>
                          应用场景
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {product.applications && product.applications.length > 0 ? (
                          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                            {product.applications.map((app, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className='rounded-lg bg-slate-50 p-4 text-center transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'
                              >
                                <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                                  <Activity className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                                </div>
                                <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                                  {app}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className='py-8 text-center'>
                            <p className='text-slate-500 dark:text-slate-400'>暂无应用场景信息</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value='benefits' className='mt-0'>
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-3'>
                          <div className='rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30'>
                            <Award className='h-6 w-6 text-orange-600 dark:text-orange-400' />
                          </div>
                          产品优势
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {product.benefits && product.benefits.length > 0 ? (
                          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            {product.benefits.map((benefit, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className='flex items-start gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50'
                              >
                                <div className='flex-shrink-0 rounded-lg bg-green-100 p-2 dark:bg-green-900/30'>
                                  <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                                </div>
                                <div>
                                  <h4 className='mb-1 font-semibold text-slate-900 dark:text-white'>
                                    {benefit}
                                  </h4>
                                  <p className='text-sm text-slate-600 dark:text-slate-400'>
                                    为您的业务带来显著提升
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className='py-8 text-center'>
                            <p className='text-slate-500 dark:text-slate-400'>暂无产品优势信息</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </Container>
        </section>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className='py-16'>
            <Container>
              <motion.div
                className='mx-auto max-w-6xl'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className='mb-12 text-center'>
                  <h2 className='mb-4 font-alimama-shuhei text-2xl font-bold text-slate-900 dark:text-white md:text-3xl'>
                    相关产品推荐
                  </h2>
                  <p className='text-slate-600 dark:text-slate-300'>您可能还对这些产品感兴趣</p>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {recommendedProducts.map((recProduct, index) => (
                    <motion.div
                      key={recProduct.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className='group cursor-pointer transition-all duration-300 hover:shadow-lg'>
                        <Link href={`/products/${recProduct.slug}`}>
                          <CardContent className='p-6'>
                            <div className='space-y-4'>
                              {/* Product Image Placeholder */}
                              <div className='flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'>
                                <Monitor className='h-12 w-12 text-slate-400' />
                              </div>

                              {/* Product Info */}
                              <div className='space-y-2'>
                                <h4 className='font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                                  {recProduct.title}
                                </h4>
                                <p className='line-clamp-2 text-sm text-slate-600 dark:text-slate-400'>
                                  {recProduct.subtitle || '专业的智能化解决方案'}
                                </p>
                              </div>

                              {/* View Details Link */}
                              <div className='flex items-center justify-end'>
                                <div className='flex items-center text-sm font-medium text-blue-600 transition-all group-hover:gap-2 dark:text-blue-400'>
                                  <span>查看详情</span>
                                  <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Container>
          </section>
        )}

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

          <Container className='relative z-10'>
            <div className='mx-auto max-w-4xl'>
              <div className='grid grid-cols-1 items-center gap-6 lg:grid-cols-2'>
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className='mb-4 text-2xl font-bold text-slate-900 md:text-3xl'>
                    准备体验{product.title}？
                  </h2>
                  <p className='mb-6 text-base leading-relaxed text-slate-600'>
                    专业顾问一对一服务，量身定制解决方案，让您的企业在数字化浪潮中抢占先机
                  </p>
                  <div className='flex flex-col gap-4 sm:flex-row'>
                    <Link href='/contact'>
                      <Button className='bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl'>
                        <MessageCircle className='mr-2 h-5 w-5' />
                        立即咨询
                      </Button>
                    </Link>
                    <Link href='/products'>
                      <Button
                        variant='outline'
                        className='border-slate-300 px-6 py-2.5 font-semibold text-slate-700 shadow-lg transition-all duration-300 hover:bg-slate-50 hover:shadow-xl'
                      >
                        <ArrowLeft className='mr-2 h-5 w-5' />
                        查看更多产品
                      </Button>
                    </Link>
                  </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                  className='flex justify-center lg:justify-end'
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className='w-48'>
                    <img
                      src='/vctrly-business-illustrations-20.png'
                      alt='客户服务'
                      className='h-auto w-full'
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  )
}
