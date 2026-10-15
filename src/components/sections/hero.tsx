'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'

interface HeroConfig {
  title: string
  subtitle: string
  titleStyle: {
    fontSize: number
    fontWeight: number
    fontFamily: string
    color: string
    letterSpacing: number
    lineHeight: number
    textShadow: boolean
    gradient: {
      enabled: boolean
      colors: string[]
      direction: string
    }
  }
  subtitleStyle: {
    fontSize: number
    fontWeight: number
    fontFamily: string
    color: string
    letterSpacing: number
    lineHeight: number
    textShadow: boolean
    opacity: number
  }
}

export function Hero() {
  const [config, setConfig] = React.useState<HeroConfig>({
    title: '专业安防解决方案 值得信赖的选择',
    subtitle:
      '临港景鸿是智能安防系统、视频监控、门禁控制和全面安防解决方案的领先提供商，为住宅、商业和工业客户提供专业服务。',
    titleStyle: {
      fontSize: 64,
      fontWeight: 700,
      fontFamily: 'font-dingtalk-jinbu',
      color: '#ffffff',
      letterSpacing: 0,
      lineHeight: 1.2,
      textShadow: true,
      gradient: {
        enabled: false,
        colors: ['#ffffff', '#e0e7ff'],
        direction: 'to right',
      },
    },
    subtitleStyle: {
      fontSize: 24,
      fontWeight: 400,
      fontFamily: 'font-sans',
      color: '#ffffff',
      letterSpacing: 0,
      lineHeight: 1.5,
      textShadow: true,
      opacity: 90,
    },
  })

  React.useEffect(() => {
    // 获取Hero配置
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/homepage/hero')
        if (response.ok) {
          const data = await response.json()
          setConfig(data.config)
        }
      } catch (error) {
        console.error('获取Hero配置失败:', error)
      }
    }

    fetchConfig()
  }, [])
  return (
    <section className='relative flex h-screen items-center justify-center overflow-hidden'>
      {/* Transparent Hero - video background comes from global layout */}

      {/* Content */}
      <Container className='relative z-10'>
        <div className='mx-auto max-w-6xl text-center'>
          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`mb-6 ${config.titleStyle.fontFamily} ${config.titleStyle.textShadow ? 'drop-shadow-lg' : ''} ${config.titleStyle.gradient.enabled ? 'bg-gradient-to-r bg-clip-text text-transparent' : ''}`}
            style={{
              fontSize: `${config.titleStyle.fontSize}px`,
              fontWeight: config.titleStyle.fontWeight,
              color: config.titleStyle.gradient.enabled ? 'transparent' : config.titleStyle.color,
              letterSpacing: `${config.titleStyle.letterSpacing}px`,
              lineHeight: config.titleStyle.lineHeight,
              backgroundImage: config.titleStyle.gradient.enabled
                ? `linear-gradient(${config.titleStyle.gradient.direction}, ${config.titleStyle.gradient.colors.join(', ')})`
                : undefined,
            }}
          >
            {config.title}
          </motion.h1>

          {/* Simple subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mx-auto mb-8 max-w-3xl ${config.subtitleStyle.fontFamily} ${config.subtitleStyle.textShadow ? 'drop-shadow-md' : ''}`}
            style={{
              fontSize: `${config.subtitleStyle.fontSize}px`,
              fontWeight: config.subtitleStyle.fontWeight,
              color: config.subtitleStyle.color,
              letterSpacing: `${config.subtitleStyle.letterSpacing}px`,
              lineHeight: config.subtitleStyle.lineHeight,
              opacity: config.subtitleStyle.opacity / 100,
            }}
          >
            {config.subtitle}
          </motion.p>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className='absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center px-4'
      >
        <div className='flex flex-col items-center space-y-2'>
          <span className='text-sm font-medium text-white/80'>滚动以查看更多</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className='flex h-10 w-6 justify-center rounded-full border-2 border-white/40'
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className='mt-2 h-3 w-1 rounded-full bg-white/60'
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
