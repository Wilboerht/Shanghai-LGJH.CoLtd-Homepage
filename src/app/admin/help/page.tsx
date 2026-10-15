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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  HelpCircle,
  Search,
  Book,
  Video,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Settings,
  Users,
  Shield,
  Zap,
  Star,
  CheckCircle,
  ChevronDown,
} from 'lucide-react'

interface HelpSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  items: {
    question: string
    answer: string
  }[]
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: '快速入门',
    description: '了解如何开始使用管理后台',
    icon: <Zap className='h-5 w-5' />,
    items: [
      {
        question: '如何登录管理后台？',
        answer: '使用您的管理员账号和密码在登录页面进行登录。如果忘记密码，请联系系统管理员重置。',
      },
      {
        question: '首次登录需要做什么？',
        answer:
          '建议首先完善个人资料，设置头像，然后熟悉各个功能模块的位置和用途。可以从仪表板开始了解系统概况。',
      },
      {
        question: '如何修改个人信息？',
        answer:
          '点击右上角头像，选择"个人资料"，在个人资料页面可以修改姓名、邮箱、头像和密码。头像上传后会自动保存并同步到整个系统。',
      },
      {
        question: '如何导航到不同功能？',
        answer:
          '使用左侧边栏导航菜单，或者使用顶部搜索栏快速查找功能。移动端可以点击左上角菜单按钮打开导航。',
      },
      {
        question: '如何退出登录？',
        answer: '点击右上角头像，在下拉菜单中选择"退出登录"即可安全退出系统。',
      },
    ],
  },
  {
    id: 'content-management',
    title: '内容管理',
    description: '学习如何管理网站内容',
    icon: <FileText className='h-5 w-5' />,
    items: [
      {
        question: '如何添加新的产品？',
        answer:
          '进入"内容管理" > "产品管理"，点击"添加产品"按钮，填写产品信息、上传图片，然后保存。支持富文本编辑和多图片上传。',
      },
      {
        question: '如何编辑现有内容？',
        answer:
          '在相应的内容列表中找到要编辑的项目，点击"编辑"按钮进行修改，完成后点击"保存"。编辑时可以预览效果。',
      },
      {
        question: '如何管理图片和媒体文件？',
        answer:
          '使用"媒体管理"功能上传和管理图片、文档等文件。支持JPG、PNG、GIF格式，单个文件最大5MB，支持批量上传。',
      },
      {
        question: '如何发布和撤销内容？',
        answer:
          '在内容编辑页面可以设置发布状态。已发布的内容会在前台网站显示，草稿状态的内容只在后台可见。',
      },
      {
        question: '如何设置SEO信息？',
        answer: '在编辑内容时，可以设置页面标题、描述、关键词等SEO信息，帮助提高搜索引擎排名。',
      },
    ],
  },
  {
    id: 'user-management',
    title: '用户管理',
    description: '管理系统用户和权限',
    icon: <Users className='h-5 w-5' />,
    items: [
      {
        question: '如何添加新用户？',
        answer: '进入"用户管理"页面，点击"添加用户"，填写用户信息并设置权限级别。',
      },
      {
        question: '如何重置用户密码？',
        answer: '在用户列表中找到目标用户，点击"重置密码"，系统会生成新密码并发送给用户。',
      },
      {
        question: '如何管理用户权限？',
        answer:
          '编辑用户信息时可以设置是否为管理员。管理员拥有所有权限，普通用户只能查看部分内容。',
      },
    ],
  },
  {
    id: 'settings',
    title: '系统设置',
    description: '配置网站基本设置',
    icon: <Settings className='h-5 w-5' />,
    items: [
      {
        question: '如何修改网站基本信息？',
        answer:
          '进入"系统设置"页面，在"基本设置"标签页中可以修改网站名称、描述、联系方式等信息。修改后会立即生效。',
      },
      {
        question: '如何修改网站Logo？',
        answer:
          '网站Logo通过静态配置文件管理，如需修改请联系开发人员更新 /src/data/logo-config.ts 文件中的配置。',
      },
      {
        question: '如何配置导航菜单？',
        answer:
          '使用"导航管理"功能可以添加、编辑、删除导航菜单项，支持多级菜单和外部链接。可以拖拽调整菜单顺序。',
      },
      {
        question: '如何备份系统数据？',
        answer: '在"系统设置" > "数据管理"中可以导出系统数据。建议定期备份重要数据。',
      },
      {
        question: '如何查看系统日志？',
        answer: '系统会自动记录重要操作日志，管理员可以在"系统设置" > "日志管理"中查看详细记录。',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: '故障排除',
    description: '解决常见技术问题',
    icon: <Shield className='h-5 w-5' />,
    items: [
      {
        question: '页面加载缓慢怎么办？',
        answer: '检查网络连接，清除浏览器缓存，或者尝试刷新页面。如果问题持续，请联系技术支持。',
      },
      {
        question: '上传文件失败怎么办？',
        answer:
          '确认文件格式和大小符合要求（图片最大5MB），检查网络连接是否稳定。如果仍然失败，请尝试压缩文件后重新上传。',
      },
      {
        question: '忘记密码怎么办？',
        answer:
          '在登录页面点击"忘记密码"，输入邮箱地址获取重置链接。或者联系系统管理员直接重置密码。',
      },
      {
        question: '数据保存失败怎么办？',
        answer:
          '检查必填字段是否完整，确认网络连接正常。如果问题持续，请复制您的内容到安全位置，然后联系技术支持。',
      },
      {
        question: '权限不足怎么办？',
        answer:
          '如果提示权限不足，请联系系统管理员检查您的账户权限设置。某些功能只有管理员才能访问。',
      },
    ],
  },
]

// 更新日志数据
const updateLogs = [
  {
    version: 'v1.0.0',
    date: '2024-12-19',
    changes: [
      '✨ 新增完整的管理后台系统',
      '🎨 实现响应式设计和暗色主题',
      '📝 添加内容管理功能',
      '👥 实现用户权限管理',
      '📊 添加数据统计功能',
      '🔒 完善安全认证机制',
    ],
  },
  {
    version: 'v0.9.0',
    date: '2024-12-15',
    changes: ['🚀 初始版本发布', '⚡ 基础功能实现', '🎯 核心架构搭建'],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSections, setFilteredSections] = useState(helpSections)
  const [activeTab, setActiveTab] = useState('getting-started')
  const [showUserManual, setShowUserManual] = useState(false)
  const [showVideoTutorials, setShowVideoTutorials] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started'])

  // 切换分类展开/收起
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    )
  }

  // 搜索功能
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredSections(helpSections)
      return
    }

    const filtered = helpSections
      .map(section => ({
        ...section,
        items: section.items.filter(
          item =>
            item.question.toLowerCase().includes(query.toLowerCase()) ||
            item.answer.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter(section => section.items.length > 0)

    setFilteredSections(filtered)
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>帮助中心</h1>
            <p className='mt-2 text-muted-foreground'>查找常见问题解答和使用指南</p>
          </div>
        </div>

        {/* 搜索栏 */}
        <Card>
          <CardContent className='pt-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
              <Input
                placeholder='搜索帮助内容...'
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className='pl-10'
              />
            </div>
          </CardContent>
        </Card>

        {/* 快速链接 */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card
            className='cursor-pointer transition-shadow hover:shadow-md'
            onClick={() => setShowUserManual(true)}
          >
            <CardContent className='pt-6'>
              <div className='flex items-center space-x-3'>
                <div className='rounded-lg bg-blue-100 p-2'>
                  <Book className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold'>用户手册</h3>
                  <p className='text-sm text-muted-foreground'>详细使用指南</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer transition-shadow hover:shadow-md'
            onClick={() => setShowVideoTutorials(true)}
          >
            <CardContent className='pt-6'>
              <div className='flex items-center space-x-3'>
                <div className='rounded-lg bg-green-100 p-2'>
                  <Video className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <h3 className='font-semibold'>视频教程</h3>
                  <p className='text-sm text-muted-foreground'>观看操作演示</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <a href='mailto:support@wilboerht.cn' className='block'>
            <Card className='cursor-pointer transition-shadow hover:shadow-md'>
              <CardContent className='pt-6'>
                <div className='flex items-center space-x-3'>
                  <div className='rounded-lg bg-orange-100 p-2'>
                    <Mail className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold'>邮件支持</h3>
                    <p className='text-sm text-muted-foreground'>发送问题反馈</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        {/* 常见问题 */}
        <div className='space-y-8'>
          <div>
            <h2 className='mb-2 text-2xl font-semibold text-gray-900'>常见问题</h2>
            <p className='text-gray-600'>快速解答您的疑问</p>
          </div>

          <div className='space-y-6'>
            {/* 快速入门 */}
            <div>
              <button
                onClick={() => toggleSection('getting-started')}
                className='mb-4 flex w-full items-center justify-between gap-2 text-lg font-medium text-gray-900 transition-colors hover:text-blue-600'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                  快速入门
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedSections.includes('getting-started') ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSections.includes('getting-started') && (
                <div className='mb-6 space-y-3'>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何登录管理后台？</h4>
                    <p className='text-sm text-gray-600'>
                      使用您的管理员账号和密码在登录页面进行登录。首次登录建议修改默认密码。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>忘记密码怎么办？</h4>
                    <p className='text-sm text-gray-600'>
                      请联系系统管理员重置密码，或通过邮件联系技术支持。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何修改个人信息？</h4>
                    <p className='text-sm text-gray-600'>
                      点击右上角头像，选择"个人设置"即可修改姓名、邮箱等个人信息。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 内容管理 */}
            <div>
              <button
                onClick={() => toggleSection('content-management')}
                className='mb-4 flex w-full items-center justify-between gap-2 text-lg font-medium text-gray-900 transition-colors hover:text-green-600'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                  内容管理
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedSections.includes('content-management') ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSections.includes('content-management') && (
                <div className='mb-6 space-y-3'>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何添加新产品？</h4>
                    <p className='text-sm text-gray-600'>
                      进入"内容管理" &gt; "产品管理"，点击"新增产品"按钮，填写产品信息并保存。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何上传图片？</h4>
                    <p className='text-sm text-gray-600'>
                      在编辑页面点击图片上传区域，选择本地图片文件上传。支持JPG、PNG格式。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>内容发布后如何修改？</h4>
                    <p className='text-sm text-gray-600'>
                      在对应的管理页面找到已发布的内容，点击"编辑"按钮即可修改。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 用户管理 */}
            <div>
              <button
                onClick={() => toggleSection('user-management')}
                className='mb-4 flex w-full items-center justify-between gap-2 text-lg font-medium text-gray-900 transition-colors hover:text-purple-600'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                  用户管理
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedSections.includes('user-management') ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSections.includes('user-management') && (
                <div className='mb-6 space-y-3'>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何添加新用户？</h4>
                    <p className='text-sm text-gray-600'>
                      进入"用户管理"页面，点击"新增用户"，填写用户信息并分配相应权限。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何重置用户密码？</h4>
                    <p className='text-sm text-gray-600'>
                      在用户列表中找到对应用户，点击"重置密码"按钮，系统将生成新的临时密码。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何设置用户权限？</h4>
                    <p className='text-sm text-gray-600'>
                      编辑用户信息时，可以设置用户为管理员或普通用户，管理员拥有所有权限。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 系统设置 */}
            <div>
              <button
                onClick={() => toggleSection('system-settings')}
                className='mb-4 flex w-full items-center justify-between gap-2 text-lg font-medium text-gray-900 transition-colors hover:text-orange-600'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-orange-500'></div>
                  系统设置
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedSections.includes('system-settings') ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSections.includes('system-settings') && (
                <div className='mb-6 space-y-3'>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何修改网站Logo？</h4>
                    <p className='text-sm text-gray-600'>
                      网站Logo通过静态配置文件管理，如需修改请联系开发人员更新配置。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何配置SEO信息？</h4>
                    <p className='text-sm text-gray-600'>
                      进入"系统设置" &gt; "SEO配置"，可以设置网站标题、描述、关键词等SEO信息。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>如何备份数据？</h4>
                    <p className='text-sm text-gray-600'>
                      系统会自动进行数据备份，如需手动备份请联系技术支持人员。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 故障排除 */}
            <div>
              <button
                onClick={() => toggleSection('troubleshooting')}
                className='mb-4 flex w-full items-center justify-between gap-2 text-lg font-medium text-gray-900 transition-colors hover:text-red-600'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-2 w-2 rounded-full bg-red-500'></div>
                  故障排除
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${expandedSections.includes('troubleshooting') ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSections.includes('troubleshooting') && (
                <div className='mb-6 space-y-3'>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>页面加载缓慢怎么办？</h4>
                    <p className='text-sm text-gray-600'>
                      请检查网络连接，清除浏览器缓存，或尝试刷新页面。如问题持续请联系技术支持。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>上传文件失败怎么办？</h4>
                    <p className='text-sm text-gray-600'>
                      检查文件格式和大小是否符合要求，确保网络连接稳定。大文件建议分批上传。
                    </p>
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'>
                    <h4 className='mb-2 font-medium text-gray-900'>数据保存失败怎么办？</h4>
                    <p className='text-sm text-gray-600'>
                      检查必填字段是否完整，确认网络连接正常。如问题持续请联系技术支持。
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 联系支持 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <MessageCircle className='h-5 w-5' />
                <span>技术支持</span>
              </CardTitle>
              <CardDescription>遇到问题？我们随时为您提供帮助</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>support@wilboerht.cn</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>+86 18721400154</span>
              </div>
              <div className='flex space-x-2'>
                <a href='mailto:support@wilboerht.cn' className='flex-1'>
                  <Button className='w-full'>
                    <Mail className='mr-2 h-4 w-4' />
                    发送邮件
                  </Button>
                </a>
                <a href='tel:+8618721400154' className='flex-1'>
                  <Button variant='outline' className='w-full'>
                    <Phone className='mr-2 h-4 w-4' />
                    拨打电话
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 用户手册对话框 */}
        <Dialog open={showUserManual} onOpenChange={setShowUserManual}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-center'>用户手册</DialogTitle>
              <DialogDescription className='text-center'>系统使用指南和操作说明</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-3 pt-4'>
              <Button
                variant='outline'
                className='flex w-full items-center justify-center gap-2'
                onClick={() => {
                  // 检查文件是否存在并预览
                  fetch('/docs/user-manual.pdf', { method: 'HEAD' })
                    .then(response => {
                      if (response.ok) {
                        window.open('/docs/user-manual.pdf', '_blank')
                      } else {
                        alert('用户手册PDF文件暂未准备就绪，请稍后再试或联系管理员。')
                      }
                    })
                    .catch(() => {
                      alert('用户手册PDF文件暂未准备就绪，请稍后再试或联系管理员。')
                    })
                }}
              >
                <ExternalLink className='h-4 w-4' />
                预览手册
              </Button>
              <Button
                className='flex w-full items-center justify-center gap-2'
                onClick={() => {
                  // 检查文件是否存在并下载
                  fetch('/docs/user-manual.pdf', { method: 'HEAD' })
                    .then(response => {
                      if (response.ok) {
                        const link = document.createElement('a')
                        link.href = '/docs/user-manual.pdf'
                        link.download = '临港景鸿CMS用户手册.pdf'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      } else {
                        alert('用户手册PDF文件暂未准备就绪，请稍后再试或联系管理员。')
                      }
                    })
                    .catch(() => {
                      alert('用户手册PDF文件暂未准备就绪，请稍后再试或联系管理员。')
                    })
                }}
              >
                <FileText className='h-4 w-4' />
                下载手册
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 视频教程对话框 */}
        <Dialog open={showVideoTutorials} onOpenChange={setShowVideoTutorials}>
          <DialogContent className='max-h-[80vh] max-w-4xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Video className='h-5 w-5 text-green-600' />
                视频教程
              </DialogTitle>
              <DialogDescription>观看操作演示视频，快速掌握系统使用方法</DialogDescription>
            </DialogHeader>
            <div className='space-y-6'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-red-100'>
                        <Video className='h-4 w-4 text-red-600' />
                      </div>
                      系统概览
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-3 flex aspect-video items-center justify-center rounded-lg bg-gray-100'>
                      <div className='text-center'>
                        <Video className='mx-auto mb-2 h-12 w-12 text-gray-400' />
                        <p className='text-sm text-gray-500'>系统介绍视频</p>
                        <p className='text-xs text-gray-400'>时长: 5分钟</p>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      了解管理后台的整体布局和主要功能模块
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                        <FileText className='h-4 w-4 text-blue-600' />
                      </div>
                      内容管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-3 flex aspect-video items-center justify-center rounded-lg bg-gray-100'>
                      <div className='text-center'>
                        <Video className='mx-auto mb-2 h-12 w-12 text-gray-400' />
                        <p className='text-sm text-gray-500'>内容管理教程</p>
                        <p className='text-xs text-gray-400'>时长: 8分钟</p>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      学习如何创建、编辑和发布各类内容
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-100'>
                        <Users className='h-4 w-4 text-green-600' />
                      </div>
                      用户管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-3 flex aspect-video items-center justify-center rounded-lg bg-gray-100'>
                      <div className='text-center'>
                        <Video className='mx-auto mb-2 h-12 w-12 text-gray-400' />
                        <p className='text-sm text-gray-500'>用户管理教程</p>
                        <p className='text-xs text-gray-400'>时长: 6分钟</p>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>掌握用户账号管理和权限分配</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-lg'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100'>
                        <Settings className='h-4 w-4 text-purple-600' />
                      </div>
                      系统设置
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-3 flex aspect-video items-center justify-center rounded-lg bg-gray-100'>
                      <div className='text-center'>
                        <Video className='mx-auto mb-2 h-12 w-12 text-gray-400' />
                        <p className='text-sm text-gray-500'>系统设置教程</p>
                        <p className='text-xs text-gray-400'>时长: 7分钟</p>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>配置网站基本信息和高级设置</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
