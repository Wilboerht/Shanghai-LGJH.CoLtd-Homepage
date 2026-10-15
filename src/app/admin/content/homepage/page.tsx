'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, FileText, Users, TrendingUp, Settings, Eye, RefreshCw } from 'lucide-react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// 统计数据类型定义
interface ModuleStats {
  total: number
  featured: number
  active: number
}

interface HomepageStats {
  hero: ModuleStats
  qualifications: ModuleStats
  awards: ModuleStats
  partners: ModuleStats
}

interface OverviewStats {
  totalContent: number
  activeContent: number
  featuredContent: number
}

// 首页管理模块配置（不包含统计数据）
const homepageModulesConfig = [
  {
    id: 'hero',
    title: 'Hero区域管理',
    description: '管理首页Hero区域的视频背景和内容',
    icon: FileText,
    href: '/admin/content/homepage/hero',
    color: 'bg-purple-500',
  },
  {
    id: 'qualifications',
    title: '企业资质管理',
    description: '管理首页展示的企业资质证书',
    icon: FileText,
    href: '/admin/content/homepage/qualifications',
    color: 'bg-blue-500',
  },
  {
    id: 'awards',
    title: '荣誉奖项管理',
    description: '管理首页展示的荣誉奖项',
    icon: Award,
    href: '/admin/content/homepage/awards',
    color: 'bg-yellow-500',
  },
  {
    id: 'partners',
    title: '合作伙伴管理',
    description: '管理首页展示的合作伙伴',
    icon: Users,
    href: '/admin/content/services#partners',
    color: 'bg-green-500',
  },
]

export default function HomepageManagement() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [stats, setStats] = useState<HomepageStats | null>(null)
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // 获取首页统计数据
  const fetchHomepageStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/content/homepage/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setOverview(data.overview)
      } else {
        console.error('获取首页统计数据失败:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('获取首页统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchHomepageStats()
    setRefreshing(false)
  }

  // 组件挂载时获取数据
  useEffect(() => {
    fetchHomepageStats()
  }, [])

  // 合并配置和统计数据
  const homepageModules = homepageModulesConfig.map(config => ({
    ...config,
    stats: stats?.[config.id as keyof HomepageStats] || { total: 0, featured: 0, active: 0 },
  }))

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>首页管理</h1>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              管理首页各个板块的内容展示
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <Button variant='outline' size='sm' onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              刷新数据
            </Button>
            <Button variant='outline' size='sm' asChild>
              <Link href='/' target='_blank'>
                <Eye className='mr-2 h-4 w-4' />
                预览首页
              </Link>
            </Button>
          </div>
        </div>

        {/* 统计概览 */}
        {loading ? (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
                  <div className='h-4 w-4 animate-pulse rounded bg-gray-200'></div>
                </CardHeader>
                <CardContent>
                  <div className='mb-2 h-8 w-16 animate-pulse rounded bg-gray-200'></div>
                  <div className='h-3 w-24 animate-pulse rounded bg-gray-200'></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          stats && (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>企业资质</CardTitle>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.qualifications.total}</div>
                  <p className='text-xs text-muted-foreground'>
                    {stats.qualifications.featured}个首页展示
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>荣誉奖项</CardTitle>
                  <Award className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.awards.total}</div>
                  <p className='text-xs text-muted-foreground'>{stats.awards.featured}个首页展示</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>合作伙伴</CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.partners.total}</div>
                  <p className='text-xs text-muted-foreground'>{stats.partners.active}个活跃展示</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>总内容数</CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{overview?.totalContent || 0}</div>
                  <p className='text-xs text-muted-foreground'>
                    {overview?.featuredContent || 0}个首页展示
                  </p>
                </CardContent>
              </Card>
            </div>
          )
        )}

        {/* 管理模块 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {homepageModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className='group cursor-pointer transition-all duration-200 hover:shadow-lg'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${module.color}`}
                    >
                      <module.icon className='h-6 w-6 text-white' />
                    </div>
                    <Badge variant='secondary'>{module.stats.active} 活跃</Badge>
                  </div>
                  <CardTitle className='text-lg'>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
                    <span>总计: {module.stats.total}</span>
                    <span>首页展示: {module.stats.featured}</span>
                  </div>
                  <div className='mt-4'>
                    <Button asChild className='w-full'>
                      <Link href={module.href}>
                        <Settings className='mr-2 h-4 w-4' />
                        管理内容
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
            <CardDescription>常用的首页管理操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Button variant='outline' asChild>
                <Link href='/admin/content/homepage/hero'>Hero区域管理</Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href='/admin/content/homepage/qualifications/new'>添加企业资质</Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href='/admin/content/homepage/awards'>管理荣誉奖项</Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href='/admin/content/services#partners'>管理合作伙伴</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
