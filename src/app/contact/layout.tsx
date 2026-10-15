import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '联系我们 - 临港景鸿安防科技',
  description:
    '联系上海临港景鸿安防科技有限公司，获取专业安防解决方案咨询。提供视频监控、门禁控制、防盗报警等安防系统服务。24小时技术支持热线：400-888-9999',
  keywords: ['联系临港景鸿', '安防咨询', '技术支持', '商务合作', '安防方案', '上海安防公司'],
  openGraph: {
    title: '联系我们 - 临港景鸿安防科技',
    description: '专业安防解决方案提供商，15年行业经验。联系我们获取定制化安防方案。',
    type: 'website',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <div className='min-h-screen bg-white dark:bg-slate-900'>{children}</div>
}
