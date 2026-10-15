'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminMobileMenu } from './admin-mobile-menu'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>加载中...</p>
        </div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>访问被拒绝</h1>
          <p className='text-gray-600 dark:text-gray-400'>您没有权限访问管理后台</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* 移动端菜单覆盖层 */}
      {sidebarOpen && (
        <div className='fixed inset-0 z-40 lg:hidden' onClick={() => setSidebarOpen(false)}>
          <div className='fixed inset-0 bg-gray-600 bg-opacity-75'></div>
        </div>
      )}

      {/* 顶部导航栏 - 置于侧边栏上方 */}
      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        user={session.user}
      />

      {/* 侧边栏 */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 移动端菜单 */}
      <AdminMobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 主要内容区域 */}
      <div className='pt-16 lg:pl-64'>
        {/* 页面内容 */}
        <main className='min-h-screen bg-gray-50 py-6 dark:bg-gray-900'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </div>
  )
}
