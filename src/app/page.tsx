import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { CultureInsight } from '@/components/sections/culture-insight'
import { GlobalIntegration } from '@/components/sections/global-integration'
import { Qualifications } from '@/components/sections/qualifications'
import { Awards } from '@/components/sections/awards'
import { Partners } from '@/components/sections/partners'
import { CTA } from '@/components/sections/cta'
import { VideoBackground } from '@/components/layout/video-background'
import { SectionDivider } from '@/components/ui/section-divider'

export default function Home() {
  return (
    <div className='relative'>
      {/* Video Background - Only for Home Page */}
      <VideoBackground />

      {/* Page Content - 重新调整排版顺序，优化视觉流程 */}
      <div className='relative z-10'>
        {/* 1. 英雄区块 - 首屏展示 */}
        <Hero />

        {/* 2. 公司介绍 - 紧接着介绍公司背景 */}
        <Features />

        {/* 3. 文化输出 - 展示企业理念和战略思考 */}
        <CultureInsight />

        {/* 4. 全球集成 - 展示服务范围和能力 */}
        <GlobalIntegration />

        {/* 5. 企业资质 - 建立信任和专业度 */}
        <Qualifications />

        {/* 6. 荣誉奖项 - 展示成就和认可 */}
        <Awards />

        {/* 7. 合作伙伴 - 展示合作生态 */}
        <Partners />

        {/* 8. 行动号召 - 引导用户进一步了解 */}
        <CTA />
      </div>
    </div>
  )
}
