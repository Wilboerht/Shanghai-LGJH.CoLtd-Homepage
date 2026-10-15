import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // 检查用户是否已登录且是管理员
  if (!session?.user?.isAdmin) {
    redirect('/admin/login')
  }

  // 重定向到管理后台仪表板
  redirect('/admin/dashboard')
}
