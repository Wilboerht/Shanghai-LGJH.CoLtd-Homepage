'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Flame,
  Shield,
  Grid3X3,
  CheckCircle,
  Star,
  Settings,
  Cpu,
  Wrench,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { PartnersCarousel } from '@/components/ui/partners-carousel'

// 清理HTML标签的函数
function stripHtml(html: string): string {
  if (!html) return ''
  // 移除HTML标签，保留文本内容
  return html.replace(/<[^>]*>/g, '').trim()
}

// 获取默认亮点的函数
function getDefaultHighlight(serviceId: string): string {
  const highlights: Record<string, string> = {
    'digital-transformation': '平均提升40%运营效率',
    'intelligent-operation': '减少60%运维成本',
    'intelligent-engineering': '98%准时交付率',
    'fire-engineering': '100%验收通过率',
    'risk-assessment': '预防千万级损失',
    'other-services': '定制化专业解决方案',
  }
  return highlights[serviceId] || '专业服务'
}

// 行业案例类型定义
interface IndustryCase {
  company: string
  logo: string
  logoColor: string
  title: string
  description: string
  image: string
}

type IndustryCases = {
  [key in '金融' | '制造' | '政府' | '游戏' | '电商' | '汽车']: IndustryCase
}

interface ClientTestimonial {
  company: string
  logo: string
  quote: string
  color: string
}

// 数据库客户案例接口
interface ClientCase {
  id: string
  name: string
  logo?: string
  logoText?: string
  logoColor?: string
  industry: string
  title: string
  description: string
  image?: string
  metrics?: Record<string, string>
  tags?: string[]
  displayOrder: number
}

// 客户案例列表
const clientTestimonials: ClientTestimonial[] = [
  {
    company: 'TOYOTA',
    logo: '/images/logos/toyota.png',
    quote: '工作流程管理，将帮助百间明确至原来的3分之一。',
    color: 'red',
  },
  {
    company: 'ramp',
    logo: '/images/logos/ramp.png',
    quote: '有了智能化系统，Ramp 的每个人都有一个AI助手。',
    color: 'purple',
  },
  {
    company: 'Vercel',
    logo: '/images/logos/vercel.png',
    quote: '系统明显，一个工具就能解决大部分多项问题。',
    color: 'black',
  },
  {
    company: 'MatchGroup',
    logo: '/images/logos/matchgroup.png',
    quote: '智能化系统是最具备化工作流程最大，最具备动力的方式。',
    color: 'blue',
  },
  {
    company: 'deel',
    logo: '/images/logos/deel.png',
    quote: '每人可以加入Deel并加入自己，而无需与任何人交流。',
    color: 'green',
  },
  {
    company: 'planful',
    logo: '/images/logos/planful.png',
    quote: '我们大幅度应用的功能：智能化 AI 驱动的快速增长。',
    color: 'purple',
  },
]

// Notion风格的服务数据结构 - 简洁而有力
interface ServiceItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  features: string[]
  highlight: string // 核心亮点
  category: 'core' | 'specialized' // 服务分类
  backgroundImage?: string // 背景图片URL
}

// 图标映射 - 扩展以支持数据库中的所有图标
const iconMap = {
  Cpu: Cpu,
  Settings: Settings,
  Wrench: Wrench,
  Flame: Flame,
  Shield: Shield,
  CheckCircle: CheckCircle,
  Star: Star,
  Grid3X3: Grid3X3,
  Search: CheckCircle, // 数据库中的Search图标映射到CheckCircle
}

// 静态服务数据作为fallback
const staticServices: ServiceItem[] = [
  {
    id: 'digital-transformation',
    title: '数字化转型',
    description: '帮助企业构建数字化能力，从流程优化到技术架构，全面提升竞争力。',
    icon: Cpu,
    href: '/services/digital-transformation',
    features: ['数字化咨询', '系统集成', '流程优化', '数据分析'],
    highlight: '平均提升40%运营效率',
    category: 'core',
    backgroundImage: '/images/services/digital-transformation-bg.jpg',
  },
  {
    id: 'intelligent-operation',
    title: '智能运维服务',
    description: '基于AI的智能运维解决方案，实现故障预测、自动化运维和性能优化。',
    icon: Settings,
    href: '/services/intelligent-operation',
    features: ['故障预测', '自动化运维', '性能监控', '智能告警'],
    highlight: '减少60%运维成本',
    category: 'core',
    backgroundImage: '/images/services/intelligent-operation-bg.png',
  },
  {
    id: 'intelligent-engineering',
    title: '智能化工程',
    description: '结合IoT、大数据和AI技术，为工程项目提供智能化的管理和实施。',
    icon: Wrench,
    href: '/services/intelligent-engineering',
    features: ['智能设计', '数字化施工', '项目管理', '质量控制'],
    highlight: '98%准时交付率',
    category: 'specialized',
    backgroundImage: '/images/services/intelligent-engineering-bg.jpg',
  },
  {
    id: 'fire-engineering',
    title: '消防工程',
    description: '专业的消防系统设计、施工和维护服务，确保建筑物的消防安全。',
    icon: Flame,
    href: '/services/fire-engineering',
    features: ['系统设计', '施工安装', '维护检测', '安全评估'],
    highlight: '99.8%项目成功率',
    category: 'specialized',
    backgroundImage: '/images/services/fire-engineering-bg.png',
  },
  {
    id: 'risk-assessment',
    title: '风险检测与评估',
    description: '全面的风险识别、评估和管理服务，帮助企业建立完善的风险管控体系。',
    icon: Shield,
    href: '/services/risk-assessment',
    features: ['风险识别', '评估分析', '管控方案', '持续监控'],
    highlight: '预防千万级损失',
    category: 'specialized',
    backgroundImage: '/images/services/risk-assessment-bg.png',
  },
]

export default function ServicesPage() {
  const [services, setServices] = React.useState<ServiceItem[]>([])
  const [loading, setLoading] = React.useState(true)

  // 获取服务数据
  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔄 前端: 开始获取服务数据')

        const response = await fetch('/api/services', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })

        console.log('📡 前端: API响应状态', response.status)

        if (!response.ok) {
          throw new Error(`API响应错误: ${response.status}`)
        }

        const data = await response.json()
        console.log('📊 前端: 接收到数据', {
          success: data.success,
          count: data.count,
          timestamp: data.timestamp,
        })

        if (!data.success || !Array.isArray(data.services)) {
          throw new Error('API返回数据格式错误')
        }

        // 转换API数据为组件格式
        const formattedServices = data.services.map((service: any, index: number) => {
          console.log(`🔧 前端: 转换服务 ${index + 1}: ${service.title}`)
          console.log(`   - 服务类型: ${service.serviceType}`)
          console.log(`   - 特性: ${service.features?.length || 0} 个`)

          const formatted = {
            id: service.id,
            title: service.title,
            description: stripHtml(service.description || ''),
            icon: iconMap[service.icon as keyof typeof iconMap] || Settings,
            href: service.href || `/services/${service.slug}`,
            features: Array.isArray(service.features) ? service.features : [],
            highlight: service.highlight || getDefaultHighlight(service.id),
            category: service.serviceType || 'core',
            backgroundImage: service.backgroundImage,
          }

          return formatted
        })

        console.log(`✅ 前端: 成功转换 ${formattedServices.length} 个服务`)
        console.log(
          '📋 前端: 所有服务',
          formattedServices.map((s: any) => s.title)
        )

        setServices(formattedServices)
      } catch (error) {
        console.error('❌ 前端: 获取服务数据失败', error)
        console.log('🔄 前端: 使用静态数据作为fallback')

        // 使用静态数据作为fallback
        const cleanedStaticServices = staticServices.map(service => ({
          ...service,
          description: stripHtml(service.description),
          highlight: stripHtml(service.highlight),
        }))

        setServices(cleanedStaticServices)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // 不区分服务类型，统一显示所有服务

  // 客户案例状态
  const [clientCases, setClientCases] = React.useState<ClientCase[]>([])
  const [activeIndustry, setActiveIndustry] = React.useState<string>('')
  const [casesLoading, setCasesLoading] = React.useState(true)

  // 获取客户案例数据
  React.useEffect(() => {
    const fetchClientCases = async () => {
      try {
        console.log('🔄 前端: 开始获取客户案例数据')

        const response = await fetch('/api/client-cases?limit=20')
        if (response.ok) {
          const data = await response.json()
          console.log('📊 前端: 接收到客户案例数据', data.clientCases.length, '个案例')

          setClientCases(data.clientCases)

          // 设置默认选中的行业
          if (data.clientCases.length > 0) {
            setActiveIndustry(data.clientCases[0].industry)
          }
        } else {
          console.error('获取客户案例失败:', response.status)
        }
      } catch (error) {
        console.error('获取客户案例失败:', error)
      } finally {
        setCasesLoading(false)
      }
    }

    fetchClientCases()
  }, [])

  // 获取所有行业列表
  const industries = React.useMemo(() => {
    const uniqueIndustries = [...new Set(clientCases.map(c => c.industry))]
    return uniqueIndustries.map(industry => ({
      id: industry.toLowerCase().replace(/\s+/g, '-'),
      name: industry,
    }))
  }, [clientCases])

  // 获取当前选中行业的案例
  const currentCase = React.useMemo(() => {
    return clientCases.find(c => c.industry === activeIndustry)
  }, [clientCases, activeIndustry])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white dark:bg-slate-950'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>加载服务数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950'>
      {/* Hero Section - 参考 Mission 页面设计 */}
      <section className='relative flex min-h-[50vh] items-center overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32'>
        {/* Background Image */}
        <div className='absolute inset-0 scale-105 bg-[url(/images/services-hero-bg.jpg)] bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-out'>
          {/* Overlay for better text readability */}
          <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70'></div>
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
          {/* Subtle pattern overlay */}
          <div className='bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] absolute inset-0 opacity-50'></div>
        </div>

        <Container>
          <div className='relative z-10 flex justify-start'>
            <div className='max-w-2xl text-left'>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  className='mb-6 font-noto-serif-sc text-4xl font-medium leading-tight text-white md:text-6xl lg:text-7xl'
                  style={{
                    textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)',
                  }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  专业服务
                </motion.h1>
                <motion.p
                  className='mb-8 text-lg leading-relaxed text-white/95 md:text-xl lg:text-2xl'
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  让专业成就您的未来
                </motion.p>
                <motion.div
                  className='text-base leading-relaxed text-white/85 md:text-lg'
                  style={{
                    textShadow: '0 1px 5px rgba(0,0,0,0.3)',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  从数字化转型到智能运维，我们提供一站式专业服务解决方案，
                  <br />
                  让您的业务更高效、更智能、更具竞争力
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* 服务内容区域 - 白色背景 */}
      <section className='bg-white py-16 dark:bg-slate-950'>
        <Container>
          <div className='mx-auto max-w-6xl space-y-12'>
            {/* 核心服务 - 简化设计 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='mb-8 text-center'
              >
                <h2 className='mb-2 text-2xl font-bold text-slate-900 dark:text-white'>
                  我们的服务
                </h2>
                <p className='text-slate-600 dark:text-slate-400'>
                  为您的业务提供全方位的专业服务支持
                </p>
              </motion.div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {services.map((service, index) => {
                  const IconComponent = service.icon

                  // 使用数据库中的背景图片
                  const backgroundImage = service.backgroundImage
                  const hasBackground = !!backgroundImage

                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={service.href}>
                        <div
                          className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-md ${
                            hasBackground
                              ? 'dynamic-bg-image border-transparent bg-transparent text-white'
                              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700'
                          }`}
                          {...(backgroundImage && {
                            style: {
                              '--bg-image': `url(${backgroundImage})`,
                            } as React.CSSProperties,
                          })}
                        >
                          {/* 背景图片遮罩层 */}
                          {hasBackground && (
                            <div className='absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/40'></div>
                          )}

                          <div className='relative p-6'>
                            <div className='flex items-start gap-4'>
                              {/* 图标 */}
                              <div
                                className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                                  hasBackground
                                    ? 'border border-white/30 bg-white/20 text-white backdrop-blur-sm'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                <IconComponent className='h-5 w-5' />
                              </div>

                              <div className='flex-1'>
                                {/* 标题和描述 */}
                                <h3
                                  className={`mb-2 text-lg font-semibold ${
                                    hasBackground
                                      ? 'text-white drop-shadow-md'
                                      : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {service.title}
                                </h3>
                                <p
                                  className={`mb-3 text-sm leading-relaxed ${
                                    hasBackground
                                      ? 'text-white/95 drop-shadow-md'
                                      : 'text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {service.description}
                                </p>

                                {/* CTA */}
                                <div
                                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                    hasBackground
                                      ? 'text-white drop-shadow-md group-hover:text-blue-200'
                                      : 'text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'
                                  }`}
                                >
                                  了解更多
                                  <ArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-1' />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* 客户案例 - 使用数据库数据 */}
            {!casesLoading && clientCases.length > 0 && (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className='mb-8 text-center'
                >
                  <h2 className='mb-3 text-2xl font-bold text-slate-900 dark:text-white'>
                    行业实践应用，助力客户业务增长
                  </h2>
                  <p className='text-slate-600 dark:text-slate-400'>
                    深耕各行各业，为不同领域客户提供专业定制化解决方案
                  </p>
                </motion.div>

                {/* 行业标签 */}
                {industries.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className='mb-8 flex justify-center'
                  >
                    <div className='flex items-center gap-8 text-sm'>
                      {industries.map(industry => (
                        <button
                          key={industry.id}
                          type='button'
                          onClick={() => setActiveIndustry(industry.name)}
                          className={`pb-2 transition-colors ${
                            activeIndustry === industry.name
                              ? 'border-b-2 border-slate-900 font-medium text-slate-900 dark:border-white dark:text-white'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          {industry.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 主要案例展示 */}
                {currentCase ? (
                  <motion.div
                    key={activeIndustry} // 添加 key 以触发重新渲染动画
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='rounded-2xl p-8'
                  >
                    <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2'>
                      {/* 左侧内容 */}
                      <div className='space-y-6'>
                        {/* 客户logo */}
                        <div className='flex items-center gap-3'>
                          {currentCase?.logo ? (
                            <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white'>
                              <Image
                                src={currentCase.logo}
                                alt={`${currentCase.name} logo`}
                                width={48}
                                height={48}
                                className='h-full w-full object-contain'
                                onError={e => {
                                  // 如果图片加载失败，隐藏图片并显示文字logo
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              className='flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white'
                              style={{ backgroundColor: currentCase?.logoColor || '#3b82f6' }}
                            >
                              {currentCase?.logoText || currentCase?.name?.charAt(0) || '?'}
                            </div>
                          )}
                          <div>
                            <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                              {currentCase?.name || '客户名称'}
                            </h3>
                            <p className='text-sm text-slate-600 dark:text-slate-400'>
                              {currentCase?.industry || '行业'}
                            </p>
                          </div>
                        </div>

                        {/* 案例标题 */}
                        <h4 className='text-xl font-bold leading-tight text-slate-900 dark:text-white'>
                          {currentCase?.title || '案例标题'}
                        </h4>

                        {/* 案例描述 */}
                        <p className='leading-relaxed text-slate-600 dark:text-slate-400'>
                          {currentCase?.description || '案例描述'}
                        </p>

                        {/* 关键指标 */}
                        {currentCase?.metrics && Object.keys(currentCase.metrics).length > 0 && (
                          <div className='flex flex-wrap justify-center gap-12 py-4'>
                            {Object.entries(currentCase.metrics)
                              .slice(0, 4)
                              .map(([key, value]) => (
                                <div key={key} className='flex flex-col items-center'>
                                  <div className='mb-1 text-xl font-bold text-blue-600 dark:text-blue-400'>
                                    {value}
                                  </div>
                                  <div className='whitespace-nowrap text-xs text-slate-600 dark:text-slate-400'>
                                    {key}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* 右侧图片 */}
                      <div className='relative'>
                        <div className='aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-800'>
                          {currentCase?.image ? (
                            <Image
                              src={currentCase.image}
                              alt={`${currentCase.name}案例`}
                              fill
                              className='object-cover'
                              sizes='(max-width: 768px) 100vw, 50vw'
                              onError={e => {
                                // 如果图片加载失败，显示占位符
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : null}
                          {/* 占位符内容 */}
                          <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='text-center text-slate-600 dark:text-slate-400'>
                              <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-white dark:bg-slate-600'>
                                <div className='text-2xl'>
                                  {currentCase?.industry === '交通运输'
                                    ? '🛫'
                                    : currentCase?.industry === '金融'
                                      ? '🏦'
                                      : currentCase?.industry === '制造'
                                        ? '🏭'
                                        : currentCase?.industry === '政府'
                                          ? '🏛️'
                                          : '📊'}
                                </div>
                              </div>
                              <p className='text-sm'>{currentCase?.industry || '行业'}案例</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : !casesLoading && clientCases.length === 0 ? (
                  <div className='rounded-2xl bg-slate-50 p-8 text-center dark:bg-slate-900'>
                    <div className='text-slate-600 dark:text-slate-400'>
                      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700'>
                        <div className='text-2xl'>📋</div>
                      </div>
                      <h3 className='mb-2 text-lg font-medium'>暂无客户案例</h3>
                      <p className='text-sm'>客户案例正在准备中，敬请期待</p>
                    </div>
                  </div>
                ) : casesLoading ? (
                  <div className='rounded-2xl bg-slate-50 p-8 text-center dark:bg-slate-900'>
                    <div className='text-slate-600 dark:text-slate-400'>
                      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700'>
                        <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-slate-600'></div>
                      </div>
                      <p className='text-sm'>正在加载客户案例...</p>
                    </div>
                  </div>
                ) : null}

                {/* 企业Logo传送带 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className='mt-12'
                >
                  <PartnersCarousel title='已为 500+ 企业提供专业服务' speed={35} limit={30} />
                </motion.div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* CTA Section - 参考 Mission 页面设计 */}
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
                专业服务，成就未来
              </h2>
              <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl'>
                我们致力于通过专业的技术服务和创新解决方案，帮助企业实现数字化转型，
                提升运营效率，创造更大的商业价值。
              </p>

              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/contact'>
                  <Button
                    size='lg'
                    className='group bg-blue-600 px-6 py-2.5 text-base font-medium text-white transition-all duration-300 hover:bg-blue-700'
                  >
                    免费咨询服务
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                  </Button>
                </Link>
                <Link href='/solutions'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='group border-2 border-gray-300 px-6 py-2.5 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50'
                  >
                    查看解决方案
                    <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
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
