'use client'

import React from 'react'

import { usePathname } from 'next/navigation'
import { MainLayout } from './main-layout'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()

  // 管理后台页面不使用官网布局
  const isAdminPage = pathname.startsWith('/admin')

  if (isAdminPage) {
    // 管理后台页面直接渲染子组件，不包含官网的导航栏和页脚
    return <>{children}</>
  }

  // 其他页面使用官网布局
  return <MainLayout>{children}</MainLayout>
}
