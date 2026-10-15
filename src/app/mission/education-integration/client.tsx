'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  ArrowRight,
  Target,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Star,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Tag,
  ExternalLink,
  Eye,
  Share2,
  ChevronRight,
  Hash,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'

// 数据类型定义
interface UniversityItem {
  id: string
  name: string
  field: string
  description: string
  content: string
  image: string
  featured: boolean
}

interface SuccessCase {
  id: string
  title: string
  description: string
  content: string
  partner: string
  year: string
  image: string
  category: string
  tags: string[]
}

interface EducationCategory {
  id: string
  name: string
  count: number
}

interface EducationData {
  module: {
    title: string
    description: string
  }
  overview: {
    content: string
    updatedAt: string
  } | null
  universities: UniversityItem[]
  successCases: SuccessCase[]
}

export default function EducationIntegrationClient({ data }: { data: EducationData | null }) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'universities' | 'cases' | 'overview'>(
    'overview'
  )
  const [mounted, setMounted] = React.useState(false)

  // Modal状态管理
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalContent, setModalContent] = React.useState<{
    type: 'university' | 'case'
    data: UniversityItem | SuccessCase
  } | null>(null)

  // Modal处理函数
  const openModal = (type: 'university' | 'case', data: UniversityItem | SuccessCase) => {
    setModalContent({ type, data })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
  }

  // 客户端挂载后初始化
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 筛选数据
  const filteredUniversities = React.useMemo(() => {
    if (!data?.universities) return []

    return data.universities.filter(university => {
      const matchesSearch =
        searchTerm === '' ||
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.field?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.description?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [data?.universities, searchTerm])

  const filteredCases = React.useMemo(() => {
    if (!data?.successCases) return []

    return data.successCases.filter(case_ => {
      const matchesSearch =
        searchTerm === '' ||
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.partner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [data?.successCases, searchTerm])

  // 如果没有数据，显示错误状态
  if (!data) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <p className='text-gray-600 dark:text-gray-300'>暂无数据</p>
        </div>
      </div>
    )
  }

  // 在客户端挂载前显示加载状态，避免水合错误
  if (!mounted) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600 dark:text-gray-300'>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Campaign-style Header */}
      <section className='bg-white pb-6 pt-28'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            {/* Navigation and Search */}
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Link href='/' className='text-sm text-gray-600 hover:text-gray-900'>
                  首页
                </Link>
                <span className='text-gray-400'>/</span>
                <Link href='/mission' className='text-sm text-gray-600 hover:text-gray-900'>
                  企业使命
                </Link>
                <span className='text-gray-400'>/</span>
                <span className='text-sm text-gray-900'>产教融合</span>
              </div>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <Input
                    placeholder='搜索院校或案例...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-64 pl-10'
                  />
                </div>
              </div>
            </div>

            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='mb-12 text-center'
            >
              <h1 className='mb-4 text-4xl font-bold text-gray-900 md:text-5xl'>产教融合</h1>
              <p className='mx-auto max-w-3xl text-xl text-gray-600'>
                深化校企合作，培养高素质技术技能人才，推动产学研一体化发展
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className='mb-8 flex items-center justify-center'>
              <div className='flex items-center rounded-lg bg-gray-100 p-1'>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  合作概况
                </button>
                <button
                  onClick={() => setActiveTab('universities')}
                  className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                    activeTab === 'universities'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  合作院校
                </button>
                <button
                  onClick={() => setActiveTab('cases')}
                  className={`rounded-md px-6 py-2 text-sm font-medium transition-all ${
                    activeTab === 'cases'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  成功案例
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className='pb-20'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
              {/* Left Column - Main Content */}
              <div className='lg:col-span-2'>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='space-y-12'
                  >
                    {/* 合作概况 */}
                    <div className='prose prose-base max-w-none'>
                      {data?.overview?.content ? (
                        <div dangerouslySetInnerHTML={{ __html: data.overview.content }} />
                      ) : (
                        <div>
                          <h2 className='mb-6 text-2xl font-bold text-gray-900'>合作概况</h2>
                          <p className='mb-6 leading-relaxed text-gray-600'>
                            我们致力于深化产教融合，通过与知名院校建立战略合作关系，共同培养适应行业发展需要的高素质技术技能人才，推动产学研一体化发展。
                          </p>
                          <p className='mb-6 leading-relaxed text-gray-600'>
                            我们秉承"产教融合、校企合作、协同育人"的理念，坚持以市场需求为导向，以技术创新为驱动，以人才培养为核心，构建产学研深度融合的合作生态。
                          </p>
                          <p className='leading-relaxed text-gray-600'>
                            通过多元化的合作模式，包括联合培养、科研合作、师资交流、实习实训、技术转化等多种形式，我们与合作院校共同建立校企合作基地、产学研协同创新中心等平台，为学生提供真实的工作环境和项目实践机会。
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Universities Tab */}
                {activeTab === 'universities' && (
                  <div className='space-y-8'>
                    {filteredUniversities.length === 0 ? (
                      <div className='py-20 text-center'>
                        <GraduationCap className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                        <p className='text-gray-500'>没有找到相关院校</p>
                      </div>
                    ) : (
                      <div className='space-y-6'>
                        {filteredUniversities.map((university, index) => (
                          <motion.article
                            key={university.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className='group'
                          >
                            <div className='relative min-h-[160px] overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg'>
                              {/* 右侧背景图片 */}
                              {university.image && (
                                <div className='absolute right-0 top-0 h-full w-1/5'>
                                  <Image
                                    src={university.image}
                                    alt={university.name}
                                    fill
                                    className='object-contain'
                                    sizes='(max-width: 768px) 20vw, (max-width: 1200px) 10vw, 8vw'
                                  />
                                  {/* 轻微渐变遮罩，创建从左边到右边的自然过渡 */}
                                  <div className='absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent'></div>
                                </div>
                              )}

                              {/* 内容区域 */}
                              <div className='relative z-10 flex h-full min-h-[160px] flex-col justify-between p-6'>
                                <div>
                                  <h3 className='mb-3 text-lg font-semibold text-gray-900'>
                                    {university.name}
                                  </h3>
                                  <p className='mb-4 line-clamp-2 max-w-md leading-relaxed text-gray-600'>
                                    {university.description}
                                  </p>
                                </div>

                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-3'>
                                    {university.field && (
                                      <span className='rounded bg-blue-50 px-2 py-1 text-sm text-blue-600'>
                                        {university.field}
                                      </span>
                                    )}
                                  </div>

                                  {/* 查看详情按钮 - 往左移动更多 */}
                                  <div className='ml-auto mr-36'>
                                    <Button
                                      variant='outline'
                                      size='sm'
                                      className='bg-white/90 backdrop-blur-sm hover:border-blue-300 hover:bg-white'
                                      onClick={() => openModal('university', university)}
                                    >
                                      <Eye className='mr-2 h-4 w-4' />
                                      查看详情
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cases Tab */}
                {activeTab === 'cases' && (
                  <div className='space-y-8'>
                    {filteredCases.length === 0 ? (
                      <div className='py-20 text-center'>
                        <Award className='mx-auto mb-4 h-12 w-12 text-gray-400' />
                        <p className='text-gray-500'>没有找到相关案例</p>
                      </div>
                    ) : (
                      <div className='space-y-6'>
                        {filteredCases.map((case_, index) => (
                          <motion.article
                            key={case_.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className='group'
                          >
                            <div className='rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg'>
                              <div className='flex items-start justify-between'>
                                <div className='flex-1'>
                                  <h3 className='mb-3 text-lg font-semibold text-gray-900'>
                                    {case_.title}
                                  </h3>
                                  <p className='mb-4 line-clamp-2 leading-relaxed text-gray-600'>
                                    {case_.description}
                                  </p>
                                </div>
                                <div className='ml-6 flex-shrink-0'>
                                  <Button
                                    variant='outline'
                                    size='sm'
                                    className='hover:border-blue-300 hover:bg-blue-50'
                                    onClick={() => openModal('case', case_)}
                                  >
                                    <Eye className='mr-2 h-4 w-4' />
                                    查看详情
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Right Column - Sidebar */}
              <div className='lg:col-span-1'>
                <div className='sticky top-24 space-y-6'>
                  {/* Quick Stats */}
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h3 className='mb-4 text-sm font-medium text-gray-900'>合作数据</h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>合作院校</span>
                        <span className='text-sm font-medium text-gray-900'>
                          {data?.universities?.length || 0}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>成功案例</span>
                        <span className='text-sm font-medium text-gray-900'>
                          {data?.successCases?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Featured Universities */}
                  {activeTab === 'universities' &&
                    data?.universities &&
                    data.universities.filter(u => u.featured).length > 0 && (
                      <div className='rounded-lg bg-gray-50 p-4'>
                        <h3 className='mb-4 text-sm font-medium text-gray-900'>重点合作院校</h3>
                        <div className='space-y-2'>
                          {data.universities
                            .filter(u => u.featured)
                            .slice(0, 5)
                            .map(university => (
                              <div key={university.id} className='text-sm'>
                                <div className='mb-1 font-medium text-gray-900'>
                                  {university.name}
                                </div>
                                <div className='text-xs text-gray-500'>{university.field}</div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Recent Cases */}
                  {activeTab === 'cases' && data?.successCases && data.successCases.length > 0 && (
                    <div className='rounded-lg bg-gray-50 p-4'>
                      <h3 className='mb-4 text-sm font-medium text-gray-900'>最新案例</h3>
                      <div className='space-y-2'>
                        {data.successCases.slice(0, 5).map(case_ => (
                          <div key={case_.id} className='text-sm'>
                            <div className='mb-1 line-clamp-2 font-medium text-gray-900'>
                              {case_.title}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {case_.partner} · {case_.year}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent?.type === 'university' ? '合作院校详情' : '成功案例详情'}
        size='xl'
      >
        {modalContent && (
          <div className='p-6'>
            {modalContent.type === 'university' ? (
              <div className='prose prose-sm max-w-none'>
                <h3 className='mb-4 text-xl font-bold'>
                  {(modalContent.data as UniversityItem).name}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: (modalContent.data as UniversityItem).content || '暂无详细内容',
                  }}
                />
              </div>
            ) : (
              <div className='prose prose-sm max-w-none'>
                <h3 className='mb-4 text-xl font-bold'>
                  {(modalContent.data as SuccessCase).title}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: (modalContent.data as SuccessCase).content || '暂无详细内容',
                  }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
