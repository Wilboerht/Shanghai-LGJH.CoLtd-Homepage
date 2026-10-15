'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

import { Container } from '@/components/ui/container'

export function CultureInsight() {
  return (
    <section className='relative z-20 bg-white py-12 dark:bg-slate-900 md:py-16'>
      <Container>
        <div className='mx-auto max-w-6xl'>
          {/* 核心观点文字 */}
          <motion.div
            className='mb-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-300 md:text-xl'>
              在智慧城市建设的时代浪潮中，安全防护已不再是单纯的技术部署，而是城市数字化转型的核心驱动力。临港景鸿深信，"四防合一的智慧生态"不仅是我们对现代安防体系的创新诠释，更是引领行业未来发展的战略基石。
            </p>
          </motion.div>

          {/* 渐变分割线 */}
          <motion.div
            className='h-1 w-full rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-indigo-500'
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </div>
      </Container>
    </section>
  )
}
