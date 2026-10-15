/**
 * NextAuth.js类型扩展
 * 为Session和JWT添加自定义字段
 */

import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      avatarUrl?: string | null
      isAdmin: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    avatarUrl?: string | null
    isAdmin: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    avatarUrl?: string | null
    isAdmin: boolean
  }
}
