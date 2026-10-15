'use client'

import * as React from 'react'

export function ServicesVideoBackground() {
  const [mounted, setMounted] = React.useState(false)
  const [videoLoaded, setVideoLoaded] = React.useState(false)
  const [videoError, setVideoError] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 视频文件路径
  const videoPath = '/videos/Northwaitan.mov'

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className='absolute inset-0 h-full w-full'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900' />
      </div>
    )
  }

  return (
    <>
      {/* Video Background for Services Page */}
      <div className='absolute inset-0 h-full w-full'>
        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload='metadata'
            className={`h-full w-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            onCanPlay={() => setVideoLoaded(true)}
          >
            {/* 主要视频源 - 北外滩日出视频 */}
            <source src={videoPath} type='video/quicktime' />
            {/* 备用格式 - 使用Home.mp4作为备用 */}
            <source src='/videos/Home.mp4' type='video/mp4' />
          </video>
        )}

        {/* 加载指示器 */}
        {!videoLoaded && !videoError && (
          <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900'>
            <div className='text-center'>
              <div className='mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-white'></div>
              <div className='text-sm font-medium text-white/80'>加载视频背景...</div>
            </div>
          </div>
        )}

        {/* Fallback Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 transition-opacity duration-1000 ${
            videoError || !videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Video Overlay for better text readability */}
        <div className='absolute inset-0 bg-black/40 dark:bg-black/60' />

        {/* Additional gradient overlay for services theme */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30' />
      </div>
    </>
  )
}
