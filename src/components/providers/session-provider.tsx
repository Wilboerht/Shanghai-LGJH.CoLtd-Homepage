'use client'

import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AuthSessionProvider({ children }: Props) {
  return (
    <SessionProvider
      // 减少不必要的 session 检查频率
      refetchInterval={5 * 60} // 5分钟检查一次
      refetchOnWindowFocus={false} // 窗口聚焦时不自动检查
    >
      {children}
    </SessionProvider>
  )
}
