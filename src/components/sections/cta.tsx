'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import Image from 'next/image'

export function CTA() {
  return (
    <section className='md:py-18 relative overflow-hidden py-12'>
      {/* 背景图片 */}
      <div className='absolute inset-0'>
        <Image
          src='/images/tech-background.jpg'
          alt='科技背景'
          fill
          className='object-cover object-bottom'
          sizes='100vw'
          priority
        />
        {/* 渐变遮罩 */}
        <div className='absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/80'></div>
      </div>

      {/* 内容区域 */}
      <Container className='relative z-10'>
        <div className='mx-auto max-w-5xl text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='mb-6 font-noto-serif-sc text-2xl font-light text-gray-900 md:text-3xl lg:text-4xl'>
              专业安防，值得信赖
            </h2>
            <p className='mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl'>
              我们致力于通过专业的安防技术和创新解决方案，为客户提供全方位的安全保障，
              让您的业务更安全、更智能、更具竞争力。
            </p>

            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link href='/contact'>
                <Button
                  size='lg'
                  className='group bg-blue-600 px-6 py-2.5 text-base font-medium text-white transition-all duration-300 hover:bg-blue-700'
                >
                  免费咨询服务
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                </Button>
              </Link>
              <Link href='/solutions'>
                <Button
                  variant='outline'
                  size='lg'
                  className='group border-2 border-gray-300 px-6 py-2.5 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50'
                >
                  查看解决方案
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
