import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '安防解决方案 - 临港景鸿',
  description: '针对住宅、商业、工业和智慧城市应用的行业特定安防解决方案',
}

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return <div className='min-h-screen bg-white dark:bg-slate-900'>{children}</div>
}
