'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  Activity,
  Clock,
  Shield,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  Star,
  LayoutDashboard,
} from 'lucide-react'

interface AdminHeaderProps {
  onMenuClick: () => void
  isDarkMode: boolean
  onThemeToggle: () => void
  user: {
    name?: string | null
    email?: string | null
    avatarUrl?: string | null
  }
}

export function AdminHeader({ onMenuClick, isDarkMode, onThemeToggle, user }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [showSystemStatus, setShowSystemStatus] = useState(false)
  const [showDateInfo, setShowDateInfo] = useState(false)
  const [showUpdateLog, setShowUpdateLog] = useState(false)
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [systemStatusLoading, setSystemStatusLoading] = useState(false)
  const [systemStatusTimer, setSystemStatusTimer] = useState<NodeJS.Timeout | null>(null)
  const [dateInfoTimer, setDateInfoTimer] = useState<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // 更新日志数据
  const updateLogs = [
    {
      version: 'v1.0.0',
      date: '2024-12-19',
      type: 'major',
      features: [
        '🎉 系统正式发布',
        '✨ 完整的内容管理功能',
        '🔐 用户权限管理系统',
        '📊 数据统计和分析',
        '🎨 响应式界面设计',
      ],
    },
    {
      version: 'v0.9.0',
      date: '2024-12-15',
      type: 'minor',
      features: ['🔧 系统性能优化', '🐛 修复已知问题', '📱 移动端适配改进', '🔍 搜索功能增强'],
    },
  ]

  // 处理系统状态悬浮
  const handleSystemStatusMouseEnter = () => {
    if (systemStatusTimer) {
      clearTimeout(systemStatusTimer)
      setSystemStatusTimer(null)
    }
    setShowSystemStatus(true)
    if (!systemStatus && !systemStatusLoading) {
      loadSystemStatus()
    }
  }

  const handleSystemStatusMouseLeave = () => {
    const timer = setTimeout(() => {
      setShowSystemStatus(false)
    }, 300) // 300ms延迟
    setSystemStatusTimer(timer)
  }

  // 处理时间信息悬浮
  const handleDateInfoMouseEnter = () => {
    if (dateInfoTimer) {
      clearTimeout(dateInfoTimer)
      setDateInfoTimer(null)
    }
    setShowDateInfo(true)
  }

  const handleDateInfoMouseLeave = () => {
    const timer = setTimeout(() => {
      setShowDateInfo(false)
    }, 200) // 200ms延迟
    setDateInfoTimer(timer)
  }

  // 加载系统状态
  const loadSystemStatus = async () => {
    try {
      setSystemStatusLoading(true)
      const response = await fetch('/api/admin/system/status')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data)
      } else {
        console.error('获取系统状态失败:', response.statusText)
      }
    } catch (error) {
      console.error('获取系统状态失败:', error)
    } finally {
      setSystemStatusLoading(false)
    }
  }

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 定期更新系统状态
  useEffect(() => {
    loadSystemStatus() // 初始加载
    const timer = setInterval(loadSystemStatus, 30000) // 每30秒更新一次
    return () => clearInterval(timer)
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (systemStatusTimer) {
        clearTimeout(systemStatusTimer)
      }
      if (dateInfoTimer) {
        clearTimeout(dateInfoTimer)
      }
    }
  }, [systemStatusTimer, dateInfoTimer])

  // 加载通知
  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const response = await fetch('/api/admin/notifications?limit=5&unreadOnly=false')
      const result = await response.json()

      console.log('通知API响应:', result) // 调试信息

      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.unreadCount)
      } else {
        console.error('通知API错误:', result.error)
      }
    } catch (error) {
      console.error('加载通知失败:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  // 标记通知为已读
  const markNotificationAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        loadNotifications()
      }
    } catch (error) {
      console.error('标记已读失败:', error)
    }
  }

  // 初始加载通知
  useEffect(() => {
    loadNotifications()
  }, [])

  // 获取页面标题
  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length <= 2) return '仪表板'

    const titleMap: Record<string, string> = {
      forms: '表单管理',
      content: '内容管理',
      navigation: '导航管理',
      analytics: '统计报表',
      users: '用户管理',
      locations: '地址管理',
      settings: '系统设置',
      notifications: '通知中心',
      search: '搜索结果',
      profile: '个人资料',
    }

    return titleMap[pathSegments[2]] || '管理后台'
  }

  // 搜索功能
  const handleSearch = async (query: string) => {
    // 如果查询为空，不执行搜索
    if (!query.trim()) {
      setSearchResults(null)
      setShowSearchResults(false)
      return
    }

    try {
      setSearchLoading(true)
      const searchUrl = `/api/admin/search?q=${encodeURIComponent(query)}&limit=8`

      const response = await fetch(searchUrl, {
        method: 'GET',
        credentials: 'include', // 包含cookies
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
        setShowSearchResults(true)
      } else {
        console.error('搜索请求失败:', response.status, response.statusText)
        // 只有在有查询内容时才设置默认建议
        if (query.trim()) {
          setSearchResults({
            query: query,
            results: [],
            categories: [],
            suggestions: ['智能监控', '安防系统', '门禁控制', '视频监控', '产品管理', '用户管理'],
          })
          setShowSearchResults(true)
        }
      }
    } catch (error) {
      console.error('搜索失败:', error)
      // 只有在有查询内容时才设置默认建议
      if (query.trim()) {
        setSearchResults({
          query: query,
          results: [],
          categories: [],
          suggestions: ['智能监控', '安防系统', '门禁控制', '视频监控', '产品管理', '用户管理'],
        })
        setShowSearchResults(true)
      }
    } finally {
      setSearchLoading(false)
    }
  }

  // 处理搜索建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    handleSearch(suggestion)
  }

  // 防抖搜索 - 只在有搜索内容时触发
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      setShowSearchResults(false)
      return
    }

    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // 键盘快捷键和点击外部关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('global-search') as HTMLInputElement
        searchInput?.focus()
      }
      if (e.key === 'Escape') {
        setShowSearchResults(false)
        setShowUserMenu(false)
        setShowNotifications(false)
        // setShowQuickActions(false) // 这个函数未定义，暂时注释
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-search-container]')) {
        setShowSearchResults(false)
      }
      if (!target.closest('[data-user-menu]')) {
        setShowUserMenu(false)
      }
      if (!target.closest('[data-notifications]')) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  // 获取搜索结果类型图标
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return '📦'
      case 'research':
        return '🔬'
      case 'page':
        return '📄'
      case 'user':
        return '👤'
      case 'contact':
        return '📧'
      case 'application':
        return '💼'
      case 'feature':
        return '⚙️'
      default:
        return '📋'
    }
  }

  return (
    <div className='fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/80'>
      <div className='flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* 左侧区域 */}
        <div className='flex items-center gap-x-4'>
          {/* 移动端菜单按钮 */}
          <button
            type='button'
            className='rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden'
            onClick={onMenuClick}
          >
            <span className='sr-only'>打开侧边栏</span>
            <Menu className='h-5 w-5' />
          </button>

          {/* Logo区域 */}
          <Link href='/admin' className='flex items-center gap-x-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600'>
              <LayoutDashboard className='h-5 w-5 text-white' />
            </div>
            <div className='hidden sm:block'>
              <h1 className='text-lg font-semibold text-gray-900 dark:text-white'>临港景鸿</h1>
              <p className='text-xs text-gray-500 dark:text-gray-400'>内容管理系统</p>
            </div>
          </Link>
        </div>

        {/* 中间区域 - 搜索栏 */}
        <div className='mx-8 hidden max-w-lg flex-1 md:block'>
          <div className='relative' data-search-container>
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                searchLoading ? 'animate-pulse text-blue-500' : 'text-gray-400 dark:text-gray-500'
              }`}
            />
            <input
              id='global-search'
              type='search'
              placeholder='搜索内容、用户、表单...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    handleSearch(searchQuery)
                  }
                }
              }}
              onFocus={() => {
                // 只有在有搜索内容或已有搜索结果时才显示
                if (searchQuery.trim() && searchResults) {
                  setShowSearchResults(true)
                } else if (searchQuery.trim()) {
                  handleSearch(searchQuery)
                }
                // 如果没有搜索内容，不显示任何建议
              }}
              className='w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-16 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:bg-gray-700 dark:focus:ring-blue-400'
            />
            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
              <kbd className='hidden h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 sm:inline-flex'>
                ⌘K
              </kbd>
            </div>

            {/* 搜索结果下拉菜单 */}
            {showSearchResults && searchResults && (
              <div className='absolute left-0 right-0 top-full z-50 mt-2 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-100/5'>
                {/* 搜索建议 */}
                {(!searchQuery || searchQuery.length < 2) &&
                  searchResults.suggestions?.length > 0 && (
                    <div className='border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
                      <h3 className='mb-2 text-sm font-semibold text-gray-900 dark:text-white'>
                        搜索建议
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {searchResults.suggestions.map((suggestion: string) => (
                          <button
                            key={suggestion}
                            type='button'
                            onClick={() => handleSuggestionClick(suggestion)}
                            className='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 搜索结果头部 */}
                {searchQuery && searchQuery.length >= 2 && (
                  <div className='border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
                        搜索结果
                      </h3>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        找到 {searchResults.results?.length || 0} 条结果
                      </span>
                    </div>
                    {/* 分类统计 */}
                    {searchResults.categories?.length > 0 && (
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {searchResults.categories.map((cat: any) => (
                          <span
                            key={cat.type}
                            className='inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          >
                            {cat.name} ({cat.count})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 搜索结果列表 */}
                {searchQuery && searchQuery.length >= 2 && (
                  <div className='max-h-80 overflow-y-auto py-2'>
                    {searchResults.results?.length > 0 ? (
                      searchResults.results.map((result: any) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.url}
                          className='flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700'
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery('')
                          }}
                        >
                          <span className='text-lg'>{getResultIcon(result.type)}</span>
                          <div className='min-w-0 flex-1'>
                            <p className='truncate text-sm font-medium text-gray-900 dark:text-white'>
                              {result.title}
                            </p>
                            <p className='truncate text-xs text-gray-500 dark:text-gray-400'>
                              {result.description}
                            </p>
                            <div className='mt-1 flex items-center gap-2'>
                              <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300'>
                                {result.category}
                              </span>
                              <span className='text-xs text-gray-400 dark:text-gray-500'>
                                {new Date(result.updatedAt).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className='px-4 py-8 text-center'>
                        <Search className='mx-auto h-8 w-8 text-gray-400 dark:text-gray-500' />
                        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                          没有找到 "{searchQuery}" 相关的内容
                        </p>
                        {searchResults.suggestions?.length > 0 && (
                          <div className='mt-3'>
                            <p className='mb-2 text-xs text-gray-400 dark:text-gray-500'>
                              试试这些搜索：
                            </p>
                            <div className='flex flex-wrap justify-center gap-1'>
                              {searchResults.suggestions.slice(0, 4).map((suggestion: string) => (
                                <button
                                  key={suggestion}
                                  type='button'
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className='text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 查看更多结果 */}
                {searchQuery && searchQuery.length >= 2 && searchResults.results?.length >= 8 && (
                  <div className='border-t border-gray-100 p-4 dark:border-gray-700'>
                    <Link
                      href={`/admin/search?q=${encodeURIComponent(searchQuery)}&type=all&page=1`}
                      className='flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      onClick={() => setShowSearchResults(false)}
                    >
                      <Search className='h-4 w-4' />
                      查看所有搜索结果
                    </Link>
                  </div>
                )}

                {/* 搜索结果底部提示 */}
                {searchQuery &&
                  searchQuery.length >= 2 &&
                  searchResults.results?.length > 0 &&
                  searchResults.results?.length < 8 && (
                    <div className='border-t border-gray-100 px-4 py-2 dark:border-gray-700'>
                      <p className='text-center text-xs text-gray-500 dark:text-gray-400'>
                        共找到 {searchResults.results.length} 条结果
                      </p>
                    </div>
                  )}

                {/* 搜索提示 */}
                {!searchQuery && (
                  <div className='px-4 py-3 text-center'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      输入关键词开始搜索，或选择下方建议
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右侧区域 */}
        <div className='flex items-center gap-x-2'>
          {/* 系统状态指示器 */}
          <div className='relative hidden lg:block'>
            <div
              className={`flex cursor-pointer items-center gap-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                !systemStatus || systemStatusLoading
                  ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                  : systemStatus.status === 'healthy'
                    ? 'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30'
              }`}
              onMouseEnter={handleSystemStatusMouseEnter}
              onMouseLeave={handleSystemStatusMouseLeave}
            >
              {systemStatusLoading ? (
                <RefreshCw className='h-3 w-3 animate-spin' />
              ) : (
                <Activity className='h-3 w-3' />
              )}
              <span>
                {systemStatusLoading
                  ? '加载中...'
                  : !systemStatus
                    ? '系统状态'
                    : systemStatus.status === 'healthy'
                      ? '系统正常'
                      : '系统警告'}
              </span>
            </div>

            {/* 系统状态详情悬浮框 */}
            {showSystemStatus && (
              <div
                className='absolute right-0 top-full z-50 mt-2 w-80 rounded-lg bg-white p-4 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-100/5'
                onMouseEnter={handleSystemStatusMouseEnter}
                onMouseLeave={handleSystemStatusMouseLeave}
              >
                {systemStatusLoading ? (
                  <div className='flex items-center justify-center py-4'>
                    <RefreshCw className='h-4 w-4 animate-spin text-gray-400' />
                    <span className='ml-2 text-sm text-gray-500'>加载系统状态...</span>
                  </div>
                ) : !systemStatus ? (
                  <div className='py-4 text-center'>
                    <span className='text-sm text-gray-500'>无法获取系统状态</span>
                  </div>
                ) : (
                  <>
                    <div className='mb-3 flex items-center justify-between'>
                      <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>
                        系统状态详情
                      </h3>
                      <div className='flex items-center gap-1'>
                        <div
                          className={`h-2 w-2 rounded-full ${systemStatus.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}
                        ></div>
                        <span
                          className={`text-xs ${systemStatus.status === 'healthy' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
                        >
                          {systemStatus.status === 'healthy' ? '运行正常' : '需要关注'}
                        </span>
                      </div>
                    </div>

                    <div className='space-y-3'>
                      {/* 系统信息 */}
                      <div className='grid grid-cols-2 gap-3 text-xs'>
                        <div className='flex justify-between'>
                          <span className='text-gray-500 dark:text-gray-400'>系统版本:</span>
                          <span className='font-medium text-gray-900 dark:text-white'>
                            {systemStatus.application?.version || 'v1.0.0'}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-500 dark:text-gray-400'>运行环境:</span>
                          <span className='font-medium text-gray-900 dark:text-white'>
                            {systemStatus.application?.environment || 'production'}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-500 dark:text-gray-400'>运行时间:</span>
                          <span className='font-medium text-green-600 dark:text-green-400'>
                            {systemStatus.uptime?.formatted || '未知'}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-500 dark:text-gray-400'>最后更新:</span>
                          <span className='font-medium text-gray-900 dark:text-white'>
                            {systemStatus.lastUpdate
                              ? new Date(systemStatus.lastUpdate).toLocaleTimeString('zh-CN')
                              : '未知'}
                          </span>
                        </div>
                      </div>

                      {/* 资源使用情况 */}
                      <div className='space-y-2'>
                        <h4 className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                          资源使用情况
                        </h4>

                        {/* CPU使用率 */}
                        <div className='flex items-center justify-between text-xs'>
                          <span className='text-gray-500 dark:text-gray-400'>CPU使用率</span>
                          <span className='font-medium text-gray-900 dark:text-white'>
                            {systemStatus.resources?.cpu?.load || 0}%
                          </span>
                        </div>
                        <div className='h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
                          <div
                            className='h-1.5 rounded-full bg-blue-500'
                            style={{
                              width: `${Math.min(systemStatus.resources?.cpu?.load || 0, 100)}%`,
                            }}
                          ></div>
                        </div>

                        {/* 内存使用率 */}
                        <div className='flex items-center justify-between text-xs'>
                          <span className='text-gray-500 dark:text-gray-400'>内存使用率</span>
                          <span className='font-medium text-gray-900 dark:text-white'>
                            {systemStatus.resources?.memory?.usage || 0}%
                          </span>
                        </div>
                        <div className='h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
                          <div
                            className='h-1.5 rounded-full bg-yellow-500'
                            style={{
                              width: `${Math.min(systemStatus.resources?.memory?.usage || 0, 100)}%`,
                            }}
                          ></div>
                        </div>

                        {/* 磁盘使用率 */}
                        <div className='flex items-center justify-between text-xs'>
                          <span className='text-gray-500 dark:text-gray-400'>磁盘使用率</span>
                          <span className='font-medium text-gray-900 dark:text-white'>
                            {systemStatus.resources?.disk?.usage || 0}%
                          </span>
                        </div>
                        <div className='h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700'>
                          <div
                            className='h-1.5 rounded-full bg-orange-500'
                            style={{
                              width: `${Math.min(systemStatus.resources?.disk?.usage || 0, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* 服务状态 */}
                      <div className='space-y-2'>
                        <h4 className='text-xs font-medium text-gray-700 dark:text-gray-300'>
                          服务状态
                        </h4>
                        <div className='grid grid-cols-2 gap-2 text-xs'>
                          <div className='flex items-center justify-between'>
                            <span className='text-gray-500 dark:text-gray-400'>网络连接</span>
                            <div className='flex items-center gap-1'>
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${systemStatus.services?.network?.status === 'normal' ? 'bg-green-500' : 'bg-red-500'}`}
                              ></div>
                              <span
                                className={`${systemStatus.services?.network?.status === 'normal' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                              >
                                {systemStatus.services?.network?.status === 'normal'
                                  ? '正常'
                                  : '异常'}
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center justify-between'>
                            <span className='text-gray-500 dark:text-gray-400'>数据库</span>
                            <div className='flex items-center gap-1'>
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${systemStatus.services?.database?.status === 'normal' ? 'bg-green-500' : 'bg-red-500'}`}
                              ></div>
                              <span
                                className={`${systemStatus.services?.database?.status === 'normal' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                              >
                                {systemStatus.services?.database?.status === 'normal'
                                  ? '正常'
                                  : '异常'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 更新日志按钮 */}
                    <div className='mt-4 border-t border-gray-200 pt-4 dark:border-gray-700'>
                      <Dialog open={showUpdateLog} onOpenChange={setShowUpdateLog}>
                        <DialogTrigger asChild>
                          <Button variant='outline' size='sm' className='h-7 px-3 text-xs'>
                            <ExternalLink className='mr-1 h-3 w-3' />
                            更新日志
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
                          <DialogHeader>
                            <DialogTitle className='flex items-center space-x-2'>
                              <Star className='h-5 w-5' />
                              <span>系统更新日志</span>
                            </DialogTitle>
                            <DialogDescription>查看系统的版本更新历史和新功能</DialogDescription>
                          </DialogHeader>
                          <div className='space-y-6'>
                            {updateLogs.map((log, index) => (
                              <div key={index} className='border-l-2 border-blue-500 pl-4'>
                                <div className='mb-2 flex items-center space-x-2'>
                                  <Badge variant='secondary'>{log.version}</Badge>
                                  <span className='text-sm text-gray-500'>{log.date}</span>
                                  <Badge variant={log.type === 'major' ? 'default' : 'outline'}>
                                    {log.type === 'major' ? '重大更新' : '功能更新'}
                                  </Badge>
                                </div>
                                <ul className='space-y-1'>
                                  {log.features.map((feature, featureIndex) => (
                                    <li
                                      key={featureIndex}
                                      className='text-sm text-gray-700 dark:text-gray-300'
                                    >
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 时间显示 */}
          <div className='relative hidden xl:block'>
            <div
              className='flex cursor-pointer items-center gap-x-2 rounded-lg px-2 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300'
              onMouseEnter={handleDateInfoMouseEnter}
              onMouseLeave={handleDateInfoMouseLeave}
            >
              <Clock className='h-4 w-4' />
              <span className='w-16 text-center font-mono'>
                {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
              </span>
            </div>

            {/* 时间信息悬浮框 */}
            {showDateInfo && (
              <div
                className='absolute right-0 top-full z-50 mt-2 w-56 rounded-lg bg-white p-3 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-100/5'
                onMouseEnter={handleDateInfoMouseEnter}
                onMouseLeave={handleDateInfoMouseLeave}
              >
                <div className='space-y-2 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>时区:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>UTC时间:</span>
                    <span className='font-mono text-gray-900 dark:text-white'>
                      {currentTime.toISOString().slice(0, 19).replace('T', ' ')}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>时间戳:</span>
                    <span className='font-mono text-gray-900 dark:text-white'>
                      {Math.floor(currentTime.getTime() / 1000)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 前台网站链接 */}
          <Link
            href='/'
            target='_blank'
            className='rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400'
            title='查看前台网站'
          >
            <Home className='h-5 w-5' />
          </Link>

          {/* 主题切换按钮 */}
          <button
            type='button'
            className='rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            onClick={onThemeToggle}
            title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
          >
            <span className='sr-only'>切换主题</span>
            {isDarkMode ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
          </button>

          {/* 通知按钮 */}
          <div className='relative' data-notifications>
            <button
              type='button'
              className='relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (!showNotifications) {
                  loadNotifications()
                }
              }}
              title='通知中心'
            >
              <span className='sr-only'>查看通知</span>
              <Bell className='h-5 w-5' />
              {/* 通知徽章 */}
              {unreadCount > 0 && (
                <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white'>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* 通知下拉菜单 */}
            {showNotifications && (
              <div className='absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-100/5'>
                <div className='flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>通知中心</h3>
                  {unreadCount > 0 && (
                    <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
                      {unreadCount} 条新消息
                    </span>
                  )}
                </div>
                <div className='max-h-80 overflow-y-auto'>
                  {loadingNotifications ? (
                    <div className='flex items-center justify-center py-8'>
                      <RefreshCw className='h-5 w-5 animate-spin text-gray-400' />
                      <span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
                        加载中...
                      </span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className='py-8 text-center'>
                      <Bell className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                      <p className='text-sm text-gray-600 dark:text-gray-400'>暂无通知</p>
                    </div>
                  ) : (
                    notifications.map(notification => {
                      const getTypeColor = (type: string) => {
                        switch (type) {
                          case 'SUCCESS':
                            return 'border-green-500 bg-green-50/50 dark:bg-green-900/10'
                          case 'WARNING':
                            return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10'
                          case 'ERROR':
                            return 'border-red-500 bg-red-50/50 dark:bg-red-900/10'
                          case 'FORM_SUBMISSION':
                            return 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/10'
                          case 'SYSTEM':
                            return 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                          default:
                            return 'border-gray-500 bg-gray-50/50 dark:bg-gray-900/10'
                        }
                      }

                      const formatTime = (dateString: string) => {
                        const date = new Date(dateString)
                        const now = new Date()
                        const diff = now.getTime() - date.getTime()
                        const minutes = Math.floor(diff / 60000)
                        const hours = Math.floor(diff / 3600000)
                        const days = Math.floor(diff / 86400000)

                        if (minutes < 1) return '刚刚'
                        if (minutes < 60) return `${minutes}分钟前`
                        if (hours < 24) return `${hours}小时前`
                        if (days < 7) return `${days}天前`
                        return date.toLocaleDateString('zh-CN')
                      }

                      return (
                        <div
                          key={notification.id}
                          className={`cursor-pointer border-l-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${getTypeColor(notification.type)} ${
                            !notification.isRead ? 'font-medium' : ''
                          }`}
                          onClick={() => {
                            if (!notification.isRead) {
                              markNotificationAsRead(notification.id)
                            }
                            if (notification.actionUrl) {
                              window.open(notification.actionUrl, '_blank')
                            }
                          }}
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <p
                                className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                              >
                                {notification.title}
                              </p>
                              <p className='mt-1 text-xs text-gray-600 dark:text-gray-400'>
                                {notification.message}
                              </p>
                            </div>
                            <div className='ml-2 flex items-center gap-2'>
                              <span className='text-xs text-gray-500 dark:text-gray-400'>
                                {formatTime(notification.createdAt)}
                              </span>
                              {!notification.isRead && (
                                <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className='border-t border-gray-100 p-2 dark:border-gray-700'>
                  <Link
                    href='/admin/notifications'
                    className='block w-full rounded-md px-3 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
                    onClick={() => setShowNotifications(false)}
                  >
                    查看所有通知
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 帮助按钮 */}
          <Link
            href='/admin/help'
            className='rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            title='帮助文档'
          >
            <HelpCircle className='h-5 w-5' />
          </Link>

          {/* 分隔线 */}
          <div className='h-6 w-px bg-gray-200 dark:bg-gray-700' />

          {/* 用户菜单 */}
          <div className='relative' data-user-menu>
            <button
              type='button'
              className='flex items-center gap-x-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm'>
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || '用户头像'}
                    width={32}
                    height={32}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <User className='h-4 w-4 text-white' />
                )}
              </div>
              <div className='hidden text-left lg:block'>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  {user.name || '管理员'}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {user.email || 'admin@example.com'}
                </p>
              </div>
              <ChevronDown className='hidden h-4 w-4 text-gray-400 dark:text-gray-500 lg:block' />
            </button>

            {/* 用户下拉菜单 */}
            {showUserMenu && (
              <div className='absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-100/5'>
                {/* 用户信息头部 */}
                <div className='border-b border-gray-100 px-4 py-3 dark:border-gray-700'>
                  <div className='flex items-center gap-x-3'>
                    <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-blue-600'>
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt={user.name || '用户头像'}
                          width={40}
                          height={40}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <User className='h-5 w-5 text-white' />
                      )}
                    </div>
                    <div>
                      <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {user.name || '管理员'}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{user.email}</p>
                      <div className='mt-1 flex items-center gap-x-1'>
                        <Shield className='h-3 w-3 text-green-500' />
                        <span className='text-xs text-green-600 dark:text-green-400'>
                          超级管理员
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 菜单项 */}
                <div className='py-2'>
                  <Link
                    href='/admin/profile'
                    className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className='mr-3 h-4 w-4' />
                    个人资料
                  </Link>
                </div>

                {/* 退出登录 */}
                <div className='border-t border-gray-100 pt-2 dark:border-gray-700'>
                  <button
                    type='button'
                    onClick={handleSignOut}
                    className='flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                  >
                    <LogOut className='mr-3 h-4 w-4' />
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
