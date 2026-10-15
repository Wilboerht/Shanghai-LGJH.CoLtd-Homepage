import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '加入我们 - 临港景鸿',
  description: '加入临港景鸿团队，与我们一起创造智能化的未来。查看最新招聘职位和企业文化。',
}

// 加入我们页面重定向到招聘页面
export default function JoinUsPage() {
  // 直接重定向到招聘页面
  redirect('/careers')
}
