'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Star,
  Flame,
  Briefcase,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
// 数据类型定义
interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  isHot?: boolean
  isUrgent?: boolean
  createdAt: string
  updatedAt: string
}

interface Department {
  id: string
  name: string
  count: number
}

interface Benefit {
  icon: string
  title: string
  description: string
  color: string
  details: string[]
}

interface CareersData {
  jobs: JobPosition[]
  departments: Department[]
  benefits: Benefit[]
  stats: {
    totalJobs: number
    totalDepartments: number
    hotJobs: number
    urgentJobs: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedDepartment, setSelectedDepartment] = React.useState('all')
  const [data, setData] = React.useState<CareersData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 获取数据
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedDepartment !== 'all') {
        params.append('department', selectedDepartment)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/careers?${params.toString()}`)
      if (!response.ok) {
        throw new Error('获取数据失败')
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }, [selectedDepartment, searchTerm])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <p className='mb-4 text-red-600'>{error || '数据加载失败'}</p>
          <Button onClick={() => fetchData()}>重新加载</Button>
        </div>
      </div>
    )
  }

  const departmentOptions = data.departments.map(dept => dept.id)

  return (
    <div className='min-h-screen bg-white'>
      {/* Job Positions */}
      <section className='pb-20 pt-32 md:pb-32 md:pt-40'>
        <Container>
          <div className='mx-auto max-w-7xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='mb-16 text-center'
            >
              <h2 className='mb-6 font-noto-serif-sc text-3xl font-light text-gray-900 md:text-5xl'>
                开放职位
              </h2>
              <p className='mx-auto max-w-3xl text-lg text-gray-600 md:text-xl'>
                找到适合你的职位，开启职业新篇章
              </p>
            </motion.div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
              {/* Left Sidebar - Search and Filter */}
              <div className='lg:col-span-1'>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className='sticky top-24 rounded-lg bg-gray-50 p-6'
                >
                  <h3 className='mb-6 font-noto-serif-sc text-lg font-medium text-gray-900'>
                    筛选职位
                  </h3>

                  {/* Search */}
                  <div className='mb-6'>
                    <label className='mb-2 block text-sm font-medium text-gray-700'>搜索职位</label>
                    <div className='relative'>
                      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                      <Input
                        placeholder='输入职位名称或技能...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className='pl-10'
                      />
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div className='mb-6'>
                    <label className='mb-3 block text-sm font-medium text-gray-700'>部门分类</label>
                    <div className='space-y-2'>
                      {departmentOptions.map(dept => (
                        <button
                          key={dept}
                          onClick={() => setSelectedDepartment(dept)}
                          className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                            selectedDepartment === dept
                              ? 'bg-slate-600 text-white'
                              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {data.departments.find(d => d.id === dept)?.name || dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className='border-t border-gray-200 pt-4'>
                    <p className='text-sm text-gray-600'>
                      找到 <span className='font-medium text-slate-700'>{data.jobs.length}</span>{' '}
                      个职位
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right Content - Job List */}
              <div className='lg:col-span-3'>
                <div className='space-y-6'>
                  {data.jobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className='rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg'
                    >
                      <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
                        <div className='flex-1'>
                          <div className='mb-3 flex items-center gap-3'>
                            <h3 className='font-noto-serif-sc text-xl font-medium text-gray-900'>
                              {job.title}
                            </h3>
                            <Badge variant='secondary'>{job.department}</Badge>
                            {job.isHot && (
                              <Badge variant='destructive' className='bg-red-500'>
                                <Flame className='mr-1 h-3 w-3' />
                                热门
                              </Badge>
                            )}
                            {job.isUrgent && (
                              <Badge variant='destructive' className='bg-orange-500'>
                                <Star className='mr-1 h-3 w-3' />
                                急招
                              </Badge>
                            )}
                          </div>

                          <div className='mb-3 flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                            <div className='flex items-center'>
                              <MapPin className='mr-1 h-4 w-4' />
                              {job.location}
                            </div>
                            <div className='flex items-center'>
                              <Clock className='mr-1 h-4 w-4' />
                              {job.type}
                            </div>
                            <div className='flex items-center'>
                              <Briefcase className='mr-1 h-4 w-4' />
                              {job.experience}
                            </div>
                            <div className='flex items-center'>
                              <DollarSign className='mr-1 h-4 w-4' />
                              {job.salary}
                            </div>
                          </div>

                          <p className='mb-3 leading-relaxed text-gray-600'>{job.description}</p>

                          <div className='flex flex-wrap gap-2'>
                            {job.tags.map(tag => (
                              <Badge key={tag} variant='outline' className='text-xs'>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className='xl:ml-6'>
                          <Link href={`/careers/${job.id}`}>
                            <Button className='w-full bg-slate-600 hover:bg-slate-700 xl:w-auto'>
                              申请职位
                              <ArrowRight className='ml-2 h-4 w-4' />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {data.jobs.length === 0 && (
                  <div className='py-12 text-center'>
                    <div className='mx-auto max-w-md'>
                      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                        <Search className='h-8 w-8 text-gray-400' />
                      </div>
                      <h3 className='mb-2 text-lg font-medium text-gray-900'>暂无符合条件的职位</h3>
                      <p className='text-gray-500'>请尝试调整搜索条件或筛选选项</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='bg-gray-50 py-20 md:py-32'>
        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-6 font-noto-serif-sc text-3xl font-light text-gray-900 md:text-5xl'>
                没有找到合适的职位？
              </h2>
              <p className='mb-8 text-lg leading-relaxed text-gray-600 md:text-xl'>
                我们随时欢迎优秀的人才加入。请将您的简历发送给我们，我们会在有合适机会时联系您。
              </p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/contact'>
                  <Button size='lg' className='bg-slate-600 hover:bg-slate-700'>
                    投递简历
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
                <Button size='lg' variant='outline'>
                  了解更多
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}
