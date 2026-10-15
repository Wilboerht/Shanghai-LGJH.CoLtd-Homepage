import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '产品服务 - 临港景鸿',
  description:
    '涵盖6大核心领域的智能化产品，包括智能数字化产品、AI智能设计、智能医疗、智慧养老、新能源和其他创新产品',
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <div className='min-h-screen bg-white dark:bg-slate-900'>{children}</div>
}
