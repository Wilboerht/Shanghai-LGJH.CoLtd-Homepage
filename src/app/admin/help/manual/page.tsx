'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Book,
  Search,
  ArrowLeft,
  FileText,
  Users,
  Settings,
  BarChart3,
  Image,
  Globe,
  Menu,
  Shield,
  Mail,
  ChevronRight,
  Download,
  ExternalLink,
} from 'lucide-react'

interface ManualSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  subsections: {
    title: string
    content: string
  }[]
}

const manualSections: ManualSection[] = [
  {
    id: 'getting-started',
    title: '快速入门',
    description: '新用户必读指南',
    icon: <Book className='h-5 w-5' />,
    subsections: [
      {
        title: '首次登录',
        content:
          '使用管理员提供的账号和密码登录系统。首次登录后建议立即修改密码，确保账户安全。登录后会自动跳转到仪表板页面。',
      },
      {
        title: '界面介绍',
        content:
          '系统采用左侧导航栏设计，主要功能模块包括：仪表板、表单管理、内容管理、媒体库、用户管理、系统设置等。顶部显示当前用户信息和快速操作按钮。',
      },
      {
        title: '基本操作',
        content:
          '大部分操作都有明确的按钮提示。支持键盘快捷键操作，如Ctrl+S保存、Ctrl+Z撤销等。所有重要操作都会有确认提示，避免误操作。',
      },
    ],
  },
  {
    id: 'dashboard',
    title: '仪表板',
    description: '系统概览和数据统计',
    icon: <BarChart3 className='h-5 w-5' />,
    subsections: [
      {
        title: '概览信息',
        content:
          '仪表板显示系统的关键指标，包括待处理表单数量、用户统计、内容数量等。这些数据每小时自动更新一次，也可以点击刷新按钮手动更新。',
      },
      {
        title: '快速操作',
        content:
          '仪表板提供常用功能的快速入口，如查看最新表单提交、编辑首页内容、管理用户等。这些快捷方式可以大大提高工作效率。',
      },
      {
        title: '活动日志',
        content:
          '显示最近的系统活动，包括新的表单提交、内容更新、用户登录等重要事件。可以点击查看详细信息或进行相关操作。',
      },
      {
        title: '数据图表',
        content:
          '以图表形式展示访问量、用户增长、内容发布等趋势数据。支持切换不同时间范围，导出数据报表。',
      },
    ],
  },
  {
    id: 'forms',
    title: '表单管理',
    description: '处理用户提交的表单',
    icon: <Mail className='h-5 w-5' />,
    subsections: [
      {
        title: '查看表单',
        content:
          '在表单管理页面可以查看所有用户提交的表单。表单按提交时间排序，未处理的表单会有特殊标识。点击表单可以查看详细内容。',
      },
      {
        title: '处理表单',
        content:
          '对于每个表单，可以标记为"已处理"、"需要跟进"或"已完成"。可以添加内部备注，记录处理过程和结果。',
      },
      {
        title: '回复用户',
        content:
          '直接在系统中回复用户的咨询。系统会自动发送邮件通知用户。支持邮件模板，提高回复效率。',
      },
      {
        title: '数据导出',
        content:
          '可以将表单数据导出为Excel或CSV格式，方便进行数据分析或备份。支持按时间范围、状态等条件筛选导出。',
      },
    ],
  },
  {
    id: 'content',
    title: '内容管理',
    description: '管理网站的所有内容',
    icon: <FileText className='h-5 w-5' />,
    subsections: [
      {
        title: '产品管理',
        content: '添加、编辑、删除产品信息。支持多图片上传、富文本描述、分类管理、SEO设置等。',
      },
      {
        title: '新闻资讯',
        content: '发布公司新闻、行业动态等内容。支持定时发布、标签分类、相关文章推荐等功能。',
      },
      {
        title: '页面编辑',
        content: '编辑网站的静态页面，如关于我们、联系我们等。使用可视化编辑器，所见即所得。',
      },
    ],
  },
  {
    id: 'media',
    title: '媒体管理',
    description: '管理图片和文件资源',
    icon: <Image className='h-5 w-5' />,
    subsections: [
      {
        title: '文件上传',
        content: '支持批量上传图片、文档等文件。自动生成缩略图，支持文件夹分类管理。',
      },
      {
        title: '图片处理',
        content: '自动压缩和优化图片，生成不同尺寸的版本。支持水印添加、格式转换等功能。',
      },
      {
        title: '文件管理',
        content: '查看、移动、删除、重命名文件。支持搜索和筛选，可以查看文件使用情况。',
      },
    ],
  },
  {
    id: 'users',
    title: '用户管理',
    description: '管理系统用户和权限',
    icon: <Users className='h-5 w-5' />,
    subsections: [
      {
        title: '用户账户',
        content: '创建、编辑、删除用户账户。设置用户权限级别，管理登录状态和安全设置。',
      },
      {
        title: '权限控制',
        content: '配置用户的访问权限，设置哪些功能对特定用户可见。支持角色管理和细粒度权限控制。',
      },
      {
        title: '安全设置',
        content: '管理密码策略、登录限制、会话超时等安全相关设置。监控异常登录活动。',
      },
    ],
  },
  {
    id: 'settings',
    title: '系统设置',
    description: '配置系统参数',
    icon: <Settings className='h-5 w-5' />,
    subsections: [
      {
        title: '基本设置',
        content: '配置网站名称、描述、联系信息等基本信息。这些信息会显示在网站的各个位置。',
      },
      {
        title: '外观设置',
        content: '设置网站主题、颜色、字体等外观参数。上传和管理网站Logo、图标等视觉元素。',
      },
      {
        title: '高级配置',
        content: '配置邮件服务器、API接口、缓存设置等高级功能。需要技术背景才建议修改。',
      },
    ],
  },
]

export default function UserManualPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const filteredSections = manualSections.filter(
    section =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.subsections.some(
        sub =>
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

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
            下载PDF版本
          </Button>
        </div>

        <div>
          <h1 className='flex items-center space-x-3 text-3xl font-bold tracking-tight'>
            <Book className='h-8 w-8' />
            <span>用户手册</span>
          </h1>
          <p className='mt-2 text-muted-foreground'>详细的系统使用指南和操作说明</p>
        </div>

        {/* 搜索栏 */}
        <Card>
          <CardContent className='pt-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
              <Input
                placeholder='搜索手册内容...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
          </CardContent>
        </Card>

        {/* 手册内容 */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* 左侧目录 */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-6'>
              <CardHeader>
                <CardTitle className='text-lg'>目录</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                {filteredSections.map(section => (
                  <button
                    key={section.id}
                    type='button'
                    onClick={() => setSelectedSection(section.id)}
                    className={`flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors ${
                      selectedSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {section.icon}
                    <div>
                      <div className='font-medium'>{section.title}</div>
                      <div className='text-xs opacity-70'>{section.description}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 右侧内容 */}
          <div className='lg:col-span-3'>
            {selectedSection ? (
              <div className='space-y-6'>
                {filteredSections
                  .filter(section => section.id === selectedSection)
                  .map(section => (
                    <Card key={section.id}>
                      <CardHeader>
                        <CardTitle className='flex items-center space-x-3'>
                          {section.icon}
                          <span>{section.title}</span>
                        </CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-6'>
                        {section.subsections.map((subsection, index) => (
                          <div key={index} className='border-l-2 border-muted pl-4'>
                            <h3 className='mb-2 flex items-center font-semibold'>
                              <ChevronRight className='mr-1 h-4 w-4' />
                              {subsection.title}
                            </h3>
                            <p className='leading-relaxed text-muted-foreground'>
                              {subsection.content}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className='pb-12 pt-12 text-center'>
                  <Book className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
                  <h3 className='mb-2 text-xl font-semibold'>选择一个章节开始阅读</h3>
                  <p className='mb-6 text-muted-foreground'>从左侧目录中选择您想了解的功能模块</p>
                  <Button onClick={() => setSelectedSection('dashboard')} className='mx-auto'>
                    从仪表板开始
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 底部导航 */}
        {selectedSection && (
          <Card>
            <CardContent className='pt-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='font-semibold'>需要更多帮助？</h4>
                  <p className='text-sm text-muted-foreground'>查看常见问题或联系技术支持</p>
                </div>
                <div className='flex space-x-3'>
                  <Link href='/admin/help'>
                    <Button variant='outline'>返回帮助中心</Button>
                  </Link>
                  <Button>
                    <Mail className='mr-2 h-4 w-4' />
                    联系支持
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
