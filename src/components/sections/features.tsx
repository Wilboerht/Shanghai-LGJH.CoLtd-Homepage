'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { Container } from '@/components/ui/container'
import { EnhancedAnimatedStat } from '@/components/ui/slot-machine-number'
import { FloatingSpheres } from '@/components/ui/floating-spheres'

export function Features() {
  return (
    <section className='relative z-20 bg-white py-12 dark:bg-slate-900 md:py-16'>
      <Container>
        <div className='mx-auto max-w-6xl'>
          {/* Header */}
          <motion.div
            className='mb-12 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className='mb-8 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl'>
              上海临港景鸿安全防范科技发展有限公司
            </h2>
          </motion.div>

          {/* Content Section - Text Only */}
          <motion.div
            className='mb-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Text Content */}
            <div className='space-y-6'>
              <div className='space-y-4 leading-relaxed text-gray-600 dark:text-gray-300'>
                <p className='text-base'>
                  上海临港景鸿安全防范科技发展有限公司成立于2016年8月，注册资本5000万元。
                  由上海景鸿保安服务股份有限公司、上海临港经济发展集团投资管理有限公司、上海加宝实业有限公司三方合资成立。拥有上海市公共安全防范工程设计施工单位一级资质、消防设施工程专业承包一级及电子与智能化工程专业承包一级资质。
                </p>
                <p className='text-base'>
                  上海临港景鸿安全防范科技发展有限公司将智慧安防技术发展与创新作为战略核心，以领先的安防异构融合技术逐浪安防行业赛道，以独具创新的项目管理系统结合ISO质量体系打造数字运营底座，拥抱AI、5G、IOT等前沿技术，深耕智慧园区行业，从临港走向上海、融入长三角、服务全中国；以多年的智能技术沉淀和丰富工程实施经验赋能智慧机场、智慧商业、智慧物业等新兴行业，面向政府、面向企业、面向家庭，加快推进&ldquo;四防合一&rdquo;（消防、技防、人防、智防），积极响应&ldquo;大数据&rdquo;国家战略，打造数字强国。
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      <Container>
        <div className='mx-auto max-w-6xl'>
          {/* 恢复原有内容 */}
          <motion.div
            className='mb-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className='space-y-6'>
              <div className='space-y-4 leading-relaxed text-gray-600 dark:text-gray-300'></div>
            </div>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            className='relative mb-6'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Background decoration */}
            <motion.div
              className='absolute inset-0 rounded-3xl bg-gradient-to-r from-red-50/50 to-blue-50/50 blur-3xl dark:from-red-900/10 dark:to-blue-900/10'
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5 }}
            />

            {/* Top Row Statistics */}
            <div className='relative z-10 grid grid-cols-2 items-start gap-6 md:grid-cols-5'>
              <EnhancedAnimatedStat value='100强' label='长三角<br />安防企业排名' delay={0.1} />

              <EnhancedAnimatedStat value='100+' label='员工数量' delay={0.2} />

              <EnhancedAnimatedStat value='60+' label='技术人员数量' delay={0.3} />

              <EnhancedAnimatedStat value='200+' label='服务生态伙伴' delay={0.4} />

              <EnhancedAnimatedStat value='50+' label='技术生态软件' delay={0.5} />
            </div>
          </motion.div>

          {/* Statistics Image */}
          <motion.div
            className='mt-8 flex justify-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className='relative'>
              <Image
                src='/images/company-stats-header.jpeg'
                alt='上海临港景鸿安全防范科技发展有限公司统计数据'
                width={800}
                height={300}
                className='rounded-2xl object-cover shadow-lg'
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
