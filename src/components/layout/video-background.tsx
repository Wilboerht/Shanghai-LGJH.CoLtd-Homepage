'use client'

import * as React from 'react'

interface HeroConfig {
  videoUrl: string
  videoFallbackUrl?: string
  autoplay: boolean
  muted: boolean
  loop: boolean
  overlayOpacity: number
}

export function VideoBackground() {
  const [mounted, setMounted] = React.useState(false)
  const [videoLoaded, setVideoLoaded] = React.useState(false)
  const [videoError, setVideoError] = React.useState(false)
  const [config, setConfig] = React.useState<HeroConfig>({
    videoUrl: '/videos/Home.mp4',
    videoFallbackUrl: '',
    autoplay: true,
    muted: true,
    loop: true,
    overlayOpacity: 30,
  })

  React.useEffect(() => {
    setMounted(true)

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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className='fixed inset-0 z-0 h-full w-full'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' />
      </div>
    )
  }

  return (
    <>
      {/* Fixed Video Background */}
      <div className='fixed inset-0 z-0 h-full w-full'>
        {!videoError && (
          <video
            autoPlay={config.autoplay}
            muted={config.muted}
            loop={config.loop}
            playsInline
            className={`h-full w-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
          >
            <source src={config.videoUrl} type='video/mp4' />
            {config.videoFallbackUrl && <source src={config.videoFallbackUrl} type='video/mp4' />}
          </video>
        )}

        {/* Fallback Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-1000 ${
            videoError || !videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Video Overlay */}
        <div
          className='absolute inset-0 bg-black'
          style={{ opacity: config.overlayOpacity / 100 }}
        />
      </div>
    </>
  )
}
