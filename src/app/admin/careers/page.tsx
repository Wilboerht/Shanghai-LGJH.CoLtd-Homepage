import { redirect } from 'next/navigation'

export default function CareersPage() {
  // 重定向到职位管理页面
  redirect('/admin/careers/positions')
}
