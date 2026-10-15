import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { ConditionalLayout } from '@/components/layout/conditional-layout'
import AuthSessionProvider from '@/components/providers/session-provider'
import { getSEOSettings, getGeneralSettings } from '@/lib/settings'
import { GoogleAnalytics } from '@/components/seo/dynamic-metadata'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

// DingTalk 进步体字体
const dingTalkJinbu = localFont({
  src: '../../public/fonts/DingTalk Jinbu/DingTalk JinBuTi.ttf',
  variable: '--font-dingtalk-jinbu',
  display: 'swap',
})

// DingTalk Sans字体
const dingTalkSans = localFont({
  src: '../../public/fonts/DingTalk Jinbu/DingTalk Sans.ttf',
  variable: '--font-dingtalk-sans',
  display: 'swap',
})

// 阿里妈妈东方大楷
const aliDongfang = localFont({
  src: [
    {
      path: '../../public/fonts/Ali Dongfang/AlimamaDongFangDaKai-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ali Dongfang/AlimamaDongFangDaKai-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ali Dongfang/AlimamaDongFangDaKai-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-ali-dongfang',
  display: 'swap',
})

// 阿里妈妈灵动体 (可变字体)
const alimamaAgile = localFont({
  src: [
    {
      path: '../../public/fonts/Alimama Agile/AlimamaAgileVF-Thin.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Agile/AlimamaAgileVF-Thin.woff',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Agile/AlimamaAgileVF-Thin.ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-alimama-agile',
  display: 'swap',
})

// 阿里妈妈刀隶体
const alimamaDaoli = localFont({
  src: [
    {
      path: '../../public/fonts/Alimama Daoli/AlimamaDaoLiTi.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Daoli/AlimamaDaoLiTi.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Daoli/AlimamaDaoLiTi.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-alimama-daoli',
  display: 'swap',
})

// 阿里妈妈方圆体 (可变字体)
const alimamaFangyuan = localFont({
  src: [
    {
      path: '../../public/fonts/Alimama Fangyuan/AlimamaFangYuanTiVF-Thin.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Fangyuan/AlimamaFangYuanTiVF-Thin.woff',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Fangyuan/AlimamaFangYuanTiVF-Thin.ttf',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-alimama-fangyuan',
  display: 'swap',
})

// 阿里妈妈数黑体 (粗体)
const alimamaShuhei = localFont({
  src: [
    {
      path: '../../public/fonts/Alimama Shuhei/AlimamaShuHeiTi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Shuhei/AlimamaShuHeiTi-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Alimama Shuhei/AlimamaShuHeiTi-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-alimama-shuhei',
  display: 'swap',
})

// Noto Serif SC (思源宋体简体中文)
const notoSerifSC = localFont({
  src: [
    {
      path: '../../public/fonts/Noto_Serif_SC/NotoSerifSC-VariableFont_wght.ttf',
      weight: '200 900',
      style: 'normal',
    },
  ],
  variable: '--font-noto-serif-sc',
  display: 'swap',
})

// 动态生成metadata
export async function generateMetadata(): Promise<Metadata> {
  const seoSettings = await getSEOSettings()
  const generalSettings = await getGeneralSettings()

  const title = seoSettings.meta_title || generalSettings.site_name || '临港景鸿 - 专业安防解决方案'
  const description =
    seoSettings.meta_description ||
    generalSettings.site_description ||
    '智能安防系统、视频监控、门禁控制和全面安防解决方案的领先提供商，为住宅、商业和工业客户提供专业服务。'
  const keywords = generalSettings.site_keywords || [
    '安防系统',
    '视频监控',
    '门禁控制',
    '安防解决方案',
    '智能监控',
    '专业安防',
    '临港景鸿',
  ]
  const siteName = generalSettings.site_name || '临港景鸿'

  return {
    title,
    description,
    keywords,
    authors: [{ name: siteName }],
    icons: {
      icon: [
        {
          url: '/logo.png',
          type: 'image/png',
        },
      ],
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// 使用动态metadata，移除静态metadata导出

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${poppins.variable} ${dingTalkJinbu.variable} ${dingTalkSans.variable} ${aliDongfang.variable} ${alimamaAgile.variable} ${alimamaDaoli.variable} ${alimamaFangyuan.variable} ${alimamaShuhei.variable} ${notoSerifSC.variable}`}
    >
      <body className='font-sans antialiased' suppressHydrationWarning={true}>
        <GoogleAnalytics />
        <AuthSessionProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
