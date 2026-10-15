'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Video,
  Search,
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Settings,
  BarChart3,
  FileText,
  Image,
  Shield,
  Zap,
  Download,
  ExternalLink,
} from 'lucide-react'

interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  thumbnail: string
  videoUrl: string
  views: number
  rating: number
}

const videoTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: '系统快速入门',
    description: '了解管理后台的基本功能和操作流程',
    duration: '8:30',
    difficulty: 'beginner',
    category: 'getting-started',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video1',
    views: 1250,
    rating: 4.8,
  },
  {
    id: '2',
    title: '仪表板使用指南',
    description: '深入了解仪表板的各项功能和数据解读',
    duration: '12:15',
    difficulty: 'beginner',
    category: 'dashboard',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video2',
    views: 980,
    rating: 4.7,
  },
  {
    id: '3',
    title: '表单管理详解',
    description: '学习如何高效处理和管理用户提交的表单',
    duration: '15:45',
    difficulty: 'intermediate',
    category: 'forms',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video3',
    views: 756,
    rating: 4.9,
  },
  {
    id: '4',
    title: '内容发布流程',
    description: '掌握产品、新闻等内容的创建和发布技巧',
    duration: '18:20',
    difficulty: 'intermediate',
    category: 'content',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video4',
    views: 642,
    rating: 4.6,
  },
  {
    id: '5',
    title: '媒体文件管理',
    description: '学习图片上传、处理和文件组织的最佳实践',
    duration: '10:30',
    difficulty: 'beginner',
    category: 'media',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video5',
    views: 523,
    rating: 4.5,
  },
  {
    id: '6',
    title: '用户权限设置',
    description: '配置用户角色和权限，确保系统安全',
    duration: '14:10',
    difficulty: 'advanced',
    category: 'users',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video6',
    views: 389,
    rating: 4.8,
  },
  {
    id: '7',
    title: '系统配置优化',
    description: '高级设置和性能优化技巧',
    duration: '22:45',
    difficulty: 'advanced',
    category: 'settings',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video7',
    views: 267,
    rating: 4.9,
  },
  {
    id: '8',
    title: '数据分析实战',
    description: '利用统计数据进行业务分析和决策',
    duration: '16:55',
    difficulty: 'intermediate',
    category: 'analytics',
    thumbnail: '/api/placeholder/320/180',
    videoUrl: 'https://example.com/video8',
    views: 445,
    rating: 4.7,
  },
]

const categories = [
  { id: 'all', name: '全部', icon: <Video className='h-4 w-4' /> },
  { id: 'getting-started', name: '快速入门', icon: <BookOpen className='h-4 w-4' /> },
  { id: 'dashboard', name: '仪表板', icon: <BarChart3 className='h-4 w-4' /> },
  { id: 'forms', name: '表单管理', icon: <FileText className='h-4 w-4' /> },
  { id: 'content', name: '内容管理', icon: <FileText className='h-4 w-4' /> },
  { id: 'media', name: '媒体管理', icon: <Image className='h-4 w-4' /> },
  { id: 'users', name: '用户管理', icon: <Users className='h-4 w-4' /> },
  { id: 'settings', name: '系统设置', icon: <Settings className='h-4 w-4' /> },
  { id: 'analytics', name: '数据分析', icon: <BarChart3 className='h-4 w-4' /> },
]

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

const difficultyLabels = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
}

export default function VideoTutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null)

  const filteredVideos = videoTutorials.filter(video => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Link
              href='/admin/help'
              className='flex items-center text-muted-foreground transition-colors hover:text-foreground'
            >
              <ArrowLeft className='mr-1 h-4 w-4' />
              返回帮助中心
            </Link>
          </div>
          <Button variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            下载全部视频
          </Button>
        </div>

        <div>
          <h1 className='flex items-center space-x-3 text-3xl font-bold tracking-tight'>
            <Video className='h-8 w-8' />
            <span>视频教程</span>
          </h1>
          <p className='mt-2 text-muted-foreground'>通过视频学习系统的各项功能和操作技巧</p>
        </div>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
                <Input
                  placeholder='搜索视频教程...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <div className='flex flex-wrap gap-2'>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setSelectedCategory(category.id)}
                    className='flex items-center space-x-1'
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 视频列表 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredVideos.map(video => (
            <Card key={video.id} className='overflow-hidden transition-shadow hover:shadow-lg'>
              <div className='relative'>
                <img src={video.thumbnail} alt={video.title} className='h-48 w-full object-cover' />
                <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100'>
                  <Button
                    size='lg'
                    className='rounded-full'
                    onClick={() => setSelectedVideo(video)}
                  >
                    <Play className='h-6 w-6' />
                  </Button>
                </div>
                <div className='absolute right-2 top-2'>
                  <Badge className={difficultyColors[video.difficulty]}>
                    {difficultyLabels[video.difficulty]}
                  </Badge>
                </div>
                <div className='absolute bottom-2 right-2'>
                  <Badge variant='secondary' className='bg-black/70 text-white'>
                    <Clock className='mr-1 h-3 w-3' />
                    {video.duration}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className='text-lg'>{video.title}</CardTitle>
                <CardDescription>{video.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between text-sm text-muted-foreground'>
                  <div className='flex items-center space-x-4'>
                    <span className='flex items-center'>
                      <Users className='mr-1 h-4 w-4' />
                      {video.views.toLocaleString()} 观看
                    </span>
                    <span className='flex items-center'>
                      <Star className='mr-1 h-4 w-4 fill-yellow-400 text-yellow-400' />
                      {video.rating}
                    </span>
                  </div>
                  <Button variant='ghost' size='sm' onClick={() => setSelectedVideo(video)}>
                    观看视频
                    <ExternalLink className='ml-1 h-3 w-3' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {filteredVideos.length === 0 && (
          <Card>
            <CardContent className='pb-12 pt-12 text-center'>
              <Video className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
              <h3 className='mb-2 text-xl font-semibold'>没有找到相关视频</h3>
              <p className='mb-6 text-muted-foreground'>尝试调整搜索关键词或选择不同的分类</p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                重置筛选
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 学习路径推荐 */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Zap className='h-5 w-5' />
              <span>推荐学习路径</span>
            </CardTitle>
            <CardDescription>按照建议顺序学习，快速掌握系统使用</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='rounded-lg border p-4 text-center'>
                <div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white'>
                  1
                </div>
                <h4 className='mb-1 font-semibold'>新手入门</h4>
                <p className='text-sm text-muted-foreground'>系统快速入门 → 仪表板使用指南</p>
              </div>
              <div className='rounded-lg border p-4 text-center'>
                <div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white'>
                  2
                </div>
                <h4 className='mb-1 font-semibold'>核心功能</h4>
                <p className='text-sm text-muted-foreground'>表单管理 → 内容发布 → 媒体管理</p>
              </div>
              <div className='rounded-lg border p-4 text-center'>
                <div className='mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white'>
                  3
                </div>
                <h4 className='mb-1 font-semibold'>高级应用</h4>
                <p className='text-sm text-muted-foreground'>用户权限 → 系统配置 → 数据分析</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 底部帮助 */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-semibold'>需要更多帮助？</h4>
                <p className='text-sm text-muted-foreground'>查看用户手册或联系技术支持</p>
              </div>
              <div className='flex space-x-3'>
                <Link href='/admin/help/manual'>
                  <Button variant='outline'>
                    <BookOpen className='mr-2 h-4 w-4' />
                    用户手册
                  </Button>
                </Link>
                <Link href='/admin/help'>
                  <Button>返回帮助中心</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 视频播放模态框 */}
      {selectedVideo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
          <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-background'>
            <div className='p-6'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>{selectedVideo.title}</h2>
                <Button variant='ghost' size='sm' onClick={() => setSelectedVideo(null)}>
                  ✕
                </Button>
              </div>
              <div className='mb-4 flex aspect-video items-center justify-center rounded-lg bg-muted'>
                <div className='text-center'>
                  <Video className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
                  <p className='text-muted-foreground'>视频播放器</p>
                  <p className='text-sm text-muted-foreground'>实际项目中这里会嵌入视频播放器</p>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center space-x-4'>
                  <Badge className={difficultyColors[selectedVideo.difficulty]}>
                    {difficultyLabels[selectedVideo.difficulty]}
                  </Badge>
                  <span className='flex items-center text-sm text-muted-foreground'>
                    <Clock className='mr-1 h-4 w-4' />
                    {selectedVideo.duration}
                  </span>
                  <span className='flex items-center text-sm text-muted-foreground'>
                    <Users className='mr-1 h-4 w-4' />
                    {selectedVideo.views.toLocaleString()} 观看
                  </span>
                  <span className='flex items-center text-sm text-muted-foreground'>
                    <Star className='mr-1 h-4 w-4 fill-yellow-400 text-yellow-400' />
                    {selectedVideo.rating}
                  </span>
                </div>
                <p className='text-muted-foreground'>{selectedVideo.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
