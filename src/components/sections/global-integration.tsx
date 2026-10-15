'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { Container } from '@/components/ui/container'

export function GlobalIntegration() {
  return (
    <section className='relative z-20 overflow-hidden bg-white py-12 dark:bg-slate-900 md:py-16'>
      {/* SVG背景图片 */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/integration-background.svg'
          alt='集成资源背景'
          fill
          className='object-cover opacity-15 dark:opacity-20'
          sizes='100vw'
        />
      </div>

      <Container>
        <div className='relative z-10 mx-auto max-w-7xl'>
          {/* 四防合一安全防护体系板块 */}
          <motion.div
            className='mb-20'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className='relative'>
              {/* 右侧图片 */}
              <div className='float-right mb-6 ml-8 w-96 lg:w-[450px]'>
                <Image
                  src='/images/security-system.jpg'
                  alt='四防合一安全防护体系'
                  width={500}
                  height={375}
                  className='w-full rounded-xl object-cover shadow-2xl drop-shadow-xl'
                />
              </div>

              {/* 标题 */}
              <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                四防合一安全防护体系
              </h3>

              {/* 副标题 */}
              <h4 className='mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300'>
                消防、技防、人防、智防一体化：构建新时代全方位安全防护体系
              </h4>

              {/* 概述段落 */}
              <p className='mb-6 text-base leading-normal text-gray-600 dark:text-gray-300'>
                在现代社会，单一的安全防护手段已难以应对日益复杂化、多样化的安全挑战。融合消防、技防、人防、智防于一体的全方位安全防护解决方案，通过构建多层次、立体化、智能化的防护体系，从事前预警、事中处置到事后追溯进行全链条管理，旨在实现更高效、更精准、更全面的安全保障。
              </p>

              {/* 四防核心概念 */}
              <div className='space-y-5'>
                <h5 className='text-lg font-bold text-gray-800 dark:text-gray-200'>
                  核心概念解析：
                </h5>

                <div className='space-y-4'>
                  <div>
                    <h6 className='mb-2 flex items-center font-bold text-gray-900 dark:text-gray-100'>
                      <span className='mr-2'>🔥</span>
                      消防 - 安全的底线保障
                    </h6>
                    <p className='pl-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                      消防不仅仅是火灾的预防和扑救，它涵盖了对火灾、爆炸等各类灾害事故的预防、监测、报警、处置和救援的全过程管理，是保障生命财产安全的基本盘。
                    </p>
                  </div>

                  <div>
                    <h6 className='mb-2 flex items-center font-bold text-gray-900 dark:text-gray-100'>
                      <span className='mr-2'>📹</span>
                      技防 - 安全的可靠支撑
                    </h6>
                    <p className='pl-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                      技防是指利用现代科学技术手段进行的安全防范，例如视频监控、入侵报警、门禁系统、电子巡更等。通过技术设备实现对防护区域的持续监控和早期预警。
                    </p>
                  </div>

                  <div>
                    <h6 className='mb-2 flex items-center font-bold text-gray-900 dark:text-gray-100'>
                      <span className='mr-2'>👥</span>
                      人防 - 安全的关键执行
                    </h6>
                    <p className='pl-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                      通过安保人员、管理制度和应急预案等实现的安全保障，是连接技术设备与实际处置的关键环节。人的专业判断和灵活处置能力是技术手段无法完全替代的。
                    </p>
                  </div>

                  <div>
                    <h6 className='mb-2 flex items-center font-bold text-gray-900 dark:text-gray-100'>
                      <span className='mr-2'>🧠</span>
                      智防 - 安全的智慧大脑
                    </h6>
                    <p className='pl-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                      以人工智能、大数据、物联网、云计算等技术为核心，实现安全防范的自动化、预测化和主动化。将海量的安防数据转化为有效的决策支持，实现从被动响应向主动防御的转变。
                    </p>
                  </div>
                </div>
              </div>

              {/* 清除浮动 */}
              <div className='clear-both'></div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className='mb-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl'>
              集成资源为企业赋能
            </h2>
            <p className='mx-auto max-w-4xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
              整合行业顶尖技术资源，构建一站式安防解决方案生态，为多业态客户提供定制化的智慧安防服务体系。
            </p>
          </motion.div>

          {/* 核心集成能力展示 */}
          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {[
              {
                icon: '🏢',
                title: '工程集成',
                description:
                  '消防工程、智能化工程、安防工程三大工程资质，提供从设计到施工的全流程服务',
                features: ['一级资质认证', '全流程管控', '标准化施工', '质量保障体系'],
              },
              {
                icon: '⚙️',
                title: '技术集成',
                description: 'AI、5G、IoT等前沿技术深度融合，构建智慧安防技术生态',
                features: ['AI算法优化', '5G高速传输', 'IoT设备联动', '云边协同'],
              },
              {
                icon: '🔗',
                title: '平台集成',
                description: '统一管理平台整合各类安防系统，实现数据互通、功能协同',
                features: ['统一管控', '数据融合', '智能分析', '协同响应'],
              },
            ].map((capability, index) => (
              <motion.div
                key={capability.title}
                className='rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className='mb-4 text-4xl'>{capability.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-gray-900 dark:text-white'>
                  {capability.title}
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-300'>{capability.description}</p>
                <div className='space-y-2'>
                  {capability.features.map((feature, idx) => (
                    <div key={idx} className='flex items-center space-x-2'>
                      <div className='h-1.5 w-1.5 rounded-full bg-blue-500' />
                      <span className='text-sm text-gray-600 dark:text-gray-400'>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 企业赋能价值展示 */}
          <motion.div
            className='rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 dark:from-blue-900/20 dark:to-indigo-900/20 md:p-12'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className='flex gap-8'>
              <div className='flex-[7]'>
                <h3 className='mb-6 text-2xl font-bold text-gray-900 dark:text-white'>
                  为企业带来的核心价值
                </h3>
                <div className='grid gap-4 sm:grid-cols-2'>
                  {[
                    {
                      icon: '💰',
                      title: '降本增效',
                      desc: '通过智能化管理和自动化运维，平均降低运营成本30%，减少人力投入，提升管理效率',
                    },
                    {
                      icon: '🛡️',
                      title: '风险防控',
                      desc: '构建多层次安全防护体系，实现事前预警、事中处置、事后追溯的全链条风险管控',
                    },
                    {
                      icon: '📊',
                      title: '数据驱动',
                      desc: '基于大数据分析和AI算法，提供精准的安全态势感知和智能决策支持服务',
                    },
                    {
                      icon: '🚀',
                      title: '业务创新',
                      desc: '将安防技术与业务场景深度融合，催生新的商业模式和服务价值创新点',
                    },
                  ].map((value, idx) => (
                    <div key={value.title} className='flex items-start space-x-3'>
                      <div className='text-2xl'>{value.icon}</div>
                      <div>
                        <div className='font-semibold text-gray-900 dark:text-white'>
                          {value.title}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400'>{value.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex flex-[2] items-center justify-end pr-4'>
                <div className='relative -mb-8 -mt-24 w-full max-w-44'>
                  <Image
                    src='/images/core-value-illustration-v2.svg'
                    alt='为企业带来的核心价值'
                    width={180}
                    height={135}
                    className='h-auto w-full object-contain'
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
