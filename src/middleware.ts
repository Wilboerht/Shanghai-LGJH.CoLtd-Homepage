/**
 * Next.js中间件
 * 用于保护管理员路由和API端点
 */

import { withAuth } from 'next-auth/middleware'

export default withAuth(
  // 这个函数只在authorized返回true时执行
  function middleware(req) {
    // 如果到达这里，说明用户已经通过认证
    // 可以在这里添加额外的逻辑，比如日志记录
    console.log(`Admin access: ${req.nextUrl.pathname}`)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // 添加调试日志
        if (pathname.includes('honors-activities')) {
          console.log(`🔍 Middleware check for ${pathname}:`)
          console.log(`  - Method: ${req.method}`)
          console.log(`  - Token exists: ${!!token}`)
          console.log(`  - Token isAdmin: ${token?.isAdmin}`)
          console.log(`  - User email: ${token?.email}`)
        }

        // 对于登录页面，总是允许访问
        if (pathname === '/admin/login') {
          return true
        }

        // 对于其他管理员路由，需要验证token和管理员权限
        if (pathname.startsWith('/admin')) {
          return !!token?.isAdmin
        }

        // 对于管理员API，需要验证token和管理员权限
        if (pathname.startsWith('/api/admin')) {
          const isAuthorized = !!token?.isAdmin
          if (pathname.includes('honors-activities')) {
            console.log(`  - Authorization result: ${isAuthorized}`)
          }
          return isAuthorized
        }

        // 其他路由允许访问
        return true
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
