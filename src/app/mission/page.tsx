'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Heart, Handshake, Award } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function MissionPage() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='relative flex min-h-[60vh] items-center overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32'>
        {/* Background Image */}
        <div className='bg-lingang-skyline absolute inset-0 scale-105 transition-transform duration-[20s] ease-out'>
          {/* Overlay for better text readability */}
          <div className='absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70'></div>
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
          {/* Subtle pattern overlay */}
          <div className='bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] absolute inset-0 opacity-50'></div>
        </div>

        <Container>
          <div className='relative z-10 flex justify-start'>
            <div className='max-w-2xl text-left'>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  className='mb-6 font-noto-serif-sc text-4xl font-medium leading-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl'
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  使命与责任
                </motion.h1>
                <motion.p
                  className='mb-8 text-lg leading-relaxed text-white/95 drop-shadow-lg md:text-xl lg:text-2xl'
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  科技向善，共创未来
                </motion.p>
                <motion.div
                  className='text-base leading-relaxed text-white/85 drop-shadow-md md:text-lg'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  我们致力于通过技术创新推动社会进步，
                  <br />
                  承担企业责任，为构建更美好的未来贡献力量
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tagline Section */}
      <section className='border-b border-gray-100 bg-white py-8'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center'
          >
            <p className='font-noto-serif-sc text-xl font-medium text-gray-700 md:text-2xl'>
              立足长三角，服务全中国
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Quote Section */}
      <section className='bg-white py-16 md:py-20'>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='mx-auto max-w-4xl'
          >
            <div className='flex items-start space-x-8'>
              {/* 左侧灰色线条 */}
              <div className='h-36 w-1 flex-shrink-0 bg-gray-300'></div>

              <div className='flex-1'>
                <blockquote>
                  <p className='mb-6 font-dingtalk-jinbu text-lg leading-relaxed text-blue-600 md:text-xl lg:text-2xl'>
                    随着新一轮信息技术和产业转型兴起，数字化进程正在空前加速，犹如一幢摩天大楼拔地而起。科技企业的重要使命和责任，就是为这座数字大厦打好地基。
                  </p>

                  <footer className='mt-8'>
                    <cite className='block text-base font-bold not-italic text-gray-900 md:text-lg'>
                      颜敏骏
                    </cite>
                    <p className='text-sm text-gray-600 md:text-base'>总经理兼首席执行官</p>
                  </footer>
                </blockquote>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Industry-Education Integration Section */}
      <section className='py-20 md:py-32'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
              {/* 左侧文字内容 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className='space-y-6'
              >
                <h2 className='font-noto-serif-sc text-3xl font-light text-gray-900 md:text-4xl lg:text-5xl'>
                  产教融合
                </h2>
                <div className='space-y-4'>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    深化产教融合，推动教育链、人才链与产业链、创新链有机衔接，是我们始终坚持的发展理念。我们致力于构建校企深度合作的育人机制，通过与知名企业建立战略合作关系，共建实训基地，开展订单式人才培养。
                  </p>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    在实践教学方面，我们构建了完善的实践教学体系，通过项目驱动、案例教学、企业实习等多种方式，全面提升学生的实际操作能力和解决问题的能力。
                  </p>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    通过产教融合的深入实施，我们真正实现了教育与产业的良性互动，为区域经济社会发展贡献重要力量。
                  </p>
                </div>
                <div className='pt-4'>
                  <Button
                    asChild
                    size='lg'
                    className='group bg-blue-600 px-8 py-3 text-lg text-white hover:bg-blue-700'
                  >
                    <Link href='/mission/education-integration'>
                      查看详情
                      <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* 右侧图片 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='relative'
              >
                <div className='relative overflow-hidden rounded-2xl shadow-lg'>
                  <div className='relative aspect-[4/3]'>
                    <Image
                      src='/images/education-integration.webp'
                      alt='产教融合'
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>
                </div>

                {/* 装饰元素 */}
                <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-200 opacity-20'></div>
                <div className='absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-purple-200 opacity-15'></div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Awards & Activities Section */}
      <section className='bg-gray-50 py-20 md:py-32'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
              {/* 左侧图片 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className='relative'
              >
                <div className='relative overflow-hidden rounded-2xl shadow-lg'>
                  <div className='relative aspect-[4/3]'>
                    <Image
                      src='/images/awards-activities.webp'
                      alt='荣誉活动'
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>
                </div>
              </motion.div>

              {/* 右侧文字内容 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='space-y-6'
              >
                <h2 className='font-noto-serif-sc text-3xl font-light text-gray-900 md:text-4xl lg:text-5xl'>
                  荣誉活动
                </h2>
                <div className='space-y-4'>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    多年来，我们在行业中获得了众多权威认可和荣誉奖项，这些成就见证了我们在技术创新、服务质量和企业管理方面的卓越表现。从行业协会的表彰到客户的信任，每一份荣誉都是对我们专业能力的肯定。
                  </p>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    我们定期举办和参与各类学术研讨会、技术论坛和行业交流活动，积极促进产学研合作，推动行业技术发展。通过这些平台，我们不仅分享最新的技术成果和行业洞察，也与同行建立了深度的合作关系。
                  </p>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    作为负责任的企业公民，我们积极参与公益活动，承担社会责任，为社区发展和人才培养贡献力量，用实际行动回馈社会。
                  </p>
                </div>
                <div className='flex justify-end pt-4'>
                  <Button
                    asChild
                    size='lg'
                    className='group bg-orange-600 px-8 py-3 text-lg text-white hover:bg-orange-700'
                  >
                    <Link href='/mission/honors-activities'>
                      查看详情
                      <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Company News Section */}
      <section className='py-20 md:py-32'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
              {/* 左侧文字内容 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className='space-y-6'
              >
                <h2 className='font-noto-serif-sc text-3xl font-light text-gray-900 md:text-4xl lg:text-5xl'>
                  公司动态
                </h2>
                <div className='space-y-4'>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    我们始终保持开放透明的沟通态度，第一时间与各界分享公司的最新发展动态。从重要的产品发布到战略合作伙伴关系的建立，从技术创新突破到市场拓展成果，每一个重要时刻都值得记录和分享。
                  </p>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    回顾企业发展历程，我们经历了从初创到成长，从本土到区域，从传统到数字化的重要转型。每一个发展节点都见证了我们的坚持与努力，也展现了我们对未来的信心与规划。
                  </p>
                  <p className='text-lg leading-relaxed text-gray-700'>
                    通过定期发布企业动态，我们希望与客户、合作伙伴和社会各界保持密切联系，共同见证企业成长的每一个重要时刻，携手创造更加美好的未来。
                  </p>
                </div>
                <div className='pt-4'>
                  <Button
                    asChild
                    size='lg'
                    className='group bg-purple-600 px-8 py-3 text-lg text-white hover:bg-purple-700'
                  >
                    <Link href='/mission/company-news'>
                      查看详情
                      <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* 右侧图片 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='relative'
              >
                <div className='relative overflow-hidden rounded-2xl shadow-lg'>
                  <div className='relative aspect-[4/3]'>
                    <Image
                      src='/images/company-news.webp'
                      alt='公司动态'
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Join Us Section */}
      <section className='bg-gray-50 pb-20 pt-12 md:pb-32 md:pt-16'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='mb-16 text-center'
            >
              <h2 className='mb-6 font-noto-serif-sc text-3xl font-light text-gray-900 md:text-5xl'>
                加入我们
              </h2>
              <p className='mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl'>
                寻找志同道合的伙伴，共同创造美好未来。我们提供广阔的发展平台和优质的工作环境。
              </p>
            </motion.div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              {/* 工作机会 */}
              <Link href='/careers' className='block'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className='group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
                >
                  {/* 背景图片 */}
                  <div className='relative h-80 w-full'>
                    <Image
                      src='/images/工作机会.webp'
                      alt='工作机会'
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 50vw'
                    />
                    {/* 渐变遮罩 */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
                  </div>

                  {/* 内容区域 */}
                  <div className='absolute inset-0 flex flex-col justify-between p-8'>
                    {/* 占位元素，用于推送文字到底部 */}
                    <div></div>

                    {/* 文字内容区域 */}
                    <div className='pb-4 pr-16 text-white'>
                      <h3 className='mb-4 font-noto-serif-sc text-2xl font-medium'>工作机会</h3>
                      <p className='text-lg leading-relaxed text-white/90'>
                        我们为各类人才提供广阔的发展平台，包括全职职位和实习机会。
                      </p>
                    </div>

                    {/* 右下角编辑图标 */}
                    <div className='absolute bottom-6 right-6'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30'>
                        <ExternalLink className='h-5 w-5 text-white' />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* 合作伙伴 */}
              <Link href='/contact' className='block'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className='group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
                >
                  {/* 背景图片 */}
                  <div className='relative h-80 w-full'>
                    <Image
                      src='/images/合作伙伴.webp'
                      alt='合作伙伴'
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 50vw'
                    />
                    {/* 渐变遮罩 */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
                  </div>

                  {/* 内容区域 */}
                  <div className='absolute inset-0 flex flex-col justify-between p-8'>
                    {/* 占位元素，用于推送文字到底部 */}
                    <div></div>

                    {/* 文字内容区域 */}
                    <div className='pb-4 pr-16 text-white'>
                      <h3 className='mb-4 font-noto-serif-sc text-2xl font-medium'>合作伙伴</h3>
                      <p className='text-lg leading-relaxed text-white/90'>
                        我们诚邀各界优秀企业和机构与我们建立战略合作关系，共同开拓市场机遇。
                      </p>
                    </div>

                    {/* 右下角编辑图标 */}
                    <div className='absolute bottom-6 right-6'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30'>
                        <ExternalLink className='h-5 w-5 text-white' />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* User Protection Section */}
      <section className='py-20 md:py-32'>
        <Container>
          <div className='mx-auto max-w-6xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='mb-16 text-center'
            >
              <h2 className='mb-6 font-noto-serif-sc text-3xl font-bold text-gray-900 md:text-5xl'>
                以负责任的方式服务每一位客户
              </h2>
              <p className='mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl'>
                我们始终将客户的利益放在首位，以诚信、专业、负责的态度为每一位客户提供优质服务，建立长期信任关系。
              </p>
            </motion.div>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {/* 诚信服务 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className='rounded-2xl bg-white p-8 shadow-sm'
              >
                <div>
                  <div className='mb-6 flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200'>
                    <Heart className='h-16 w-16 text-blue-600' />
                  </div>
                  <h3 className='mb-4 font-noto-serif-sc text-xl font-medium text-gray-900'>
                    诚信服务
                  </h3>
                  <p className='leading-relaxed text-gray-600'>
                    我们坚持诚信为本，以透明、公正的方式为客户提供服务，确保每一个承诺都能兑现，建立可信赖的合作关系。
                  </p>
                </div>
              </motion.div>

              {/* 专业负责 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='rounded-2xl bg-white p-8 shadow-sm'
              >
                <div>
                  <div className='mb-6 flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-200'>
                    <Award className='h-16 w-16 text-green-600' />
                  </div>
                  <h3 className='mb-4 font-noto-serif-sc text-xl font-medium text-gray-900'>
                    专业负责
                  </h3>
                  <p className='leading-relaxed text-gray-600'>
                    我们拥有专业的团队和丰富的经验，对每一个项目都精益求精，承担起应有的责任，为客户创造最大价值。
                  </p>
                </div>
              </motion.div>

              {/* 长期合作 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='rounded-2xl bg-white p-8 shadow-sm'
              >
                <div>
                  <div className='mb-6 flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200'>
                    <Handshake className='h-16 w-16 text-purple-600' />
                  </div>
                  <h3 className='mb-4 font-noto-serif-sc text-xl font-medium text-gray-900'>
                    长期合作
                  </h3>
                  <p className='leading-relaxed text-gray-600'>
                    我们注重与客户建立长期稳定的合作关系，持续关注客户需求变化，提供持续优化的服务支持。
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission Statement */}
      <section className='relative overflow-hidden py-16 md:py-24'>
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
              <h2 className='mb-8 font-noto-serif-sc text-3xl font-light text-gray-900 md:text-5xl lg:text-6xl'>
                科技向善，共创未来
              </h2>
              <p className='mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl'>
                我们相信技术的力量能够改变世界，让生活更美好。通过持续创新和负责任的发展，
                我们致力于为社会创造长期价值，推动人类文明进步。
              </p>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}
