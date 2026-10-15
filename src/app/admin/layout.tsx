/**
 * 管理后台根布局
 * 为所有管理后台页面提供统一的布局和认证检查
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '管理后台 - 临港景鸿CMS',
  description: '临港景鸿内容管理系统',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
