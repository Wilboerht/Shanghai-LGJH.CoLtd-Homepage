'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChatIcon } from '../icons/chat-icon'
import { AssistantIcon } from '../icons/assistant-icon'

export function ChatBot() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isIframeLoading, setIsIframeLoading] = useState(true)
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    // 延迟显示悬浮按钮，增加入场动画效果
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen)
    // 每次打开模态框时重置加载状态
    if (!isModalOpen) {
      setIsIframeLoading(true)
      setIframeError(false)
      // 设置超时，防止无限加载
      setTimeout(() => {
        setIsIframeLoading(false)
      }, 10000) // 10秒后自动隐藏加载指示器
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleIframeLoad = () => {
    setIsIframeLoading(false)
    setIframeError(false)
  }

  const handleIframeError = () => {
    setIsIframeLoading(false)
    setIframeError(true)
  }

  if (!isVisible) return null

  return (
    <>
      {/* 悬浮按钮 */}
      <div className='fixed bottom-6 right-6 z-50'>
        <div className='group relative'>
          <button
            onClick={handleToggleModal}
            className='relative flex h-16 w-16 items-center justify-center rounded-full border border-gray-200/40 bg-gray-50/90 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/20'
            style={{
              boxShadow:
                '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
            aria-label='打开鸿宝智能助手'
          >
            {/* 外层脉冲光圈 */}
            <div
              className='absolute inset-0 animate-ping rounded-full bg-gray-100/30 opacity-40'
              style={{ animationDuration: '3s' }}
            ></div>

            {/* 柔和的外层光晕 */}
            <div
              className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-t from-gray-50/30 to-white/20 opacity-50'
              style={{ animationDuration: '4s' }}
            ></div>

            {/* 内层高光 */}
            <div className='absolute inset-1 rounded-full bg-gradient-to-b from-white/50 to-transparent'></div>

            {/* 图标 */}
            <Image
              src='/jswing-logo.png'
              alt='鸿宝智能助手'
              width={48}
              height={48}
              className='relative z-20 rounded-sm drop-shadow-sm transition-transform duration-300 group-hover:scale-110'
            />
          </button>

          {/* 提示气泡 */}
          <div className='animate-fadeIn absolute bottom-full right-0 mb-3 hidden group-hover:block'>
            <div className='relative whitespace-nowrap rounded-lg border border-white/20 bg-white/90 px-4 py-2 text-sm text-foreground shadow-lg backdrop-blur-md'>
              鸿宝智能助手
              <div className='absolute right-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/90'></div>
            </div>
          </div>
        </div>
      </div>

      {/* 模态框 */}
      {isModalOpen && (
        <div
          className='animate-fadeIn fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-300'
          onClick={handleCloseModal}
        >
          {/* 模态框内容 - 页面居中，更大尺寸 */}
          <div
            className='animate-slideInUp flex h-[80vh] max-h-[600px] w-full max-w-4xl transform flex-col overflow-hidden rounded-xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-md transition-all duration-300'
            onClick={e => e.stopPropagation()}
          >
            {/* 模态框头部 */}
            <div className='flex items-center justify-between rounded-t-xl border-b border-border bg-card p-6 text-foreground backdrop-blur-sm'>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center justify-center'>
                  <Image
                    src='/jswing-logo.png'
                    alt='鸿宝智能助手'
                    width={48}
                    height={48}
                    className='rounded-sm'
                  />
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-foreground'>鸿宝智能助手</h3>
                  <p className='text-sm text-muted-foreground'>24小时在线服务 • AI驱动</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className='rounded-full p-2 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground'
                aria-label='关闭聊天窗口'
              >
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* iframe 容器 */}
            <div className='relative flex-1 overflow-hidden bg-gray-50'>
              <iframe
                src='https://chatbot.lgjh.com'
                className='h-full w-full rounded-b-xl border-0 bg-gray-50'
                title='AI聊天机器人'
                allow='microphone; camera; clipboard-write'
                sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-modals'
                loading='lazy'
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />

              {/* 加载指示器 - 只在加载时显示 */}
              {isIframeLoading && !iframeError && (
                <div className='absolute inset-0 flex items-center justify-center rounded-b-xl bg-gray-50'>
                  <div className='flex flex-col items-center space-y-6'>
                    <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
                    <div className='text-center'>
                      <p className='mb-2 text-lg text-muted-foreground'>正在加载智能助手...</p>
                      <p className='text-sm text-muted-foreground/60'>首次加载可能需要几秒钟</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 错误提示 - 加载失败时显示 */}
              {iframeError && (
                <div className='absolute inset-0 flex items-center justify-center rounded-b-xl bg-gray-50'>
                  <div className='flex flex-col items-center space-y-6 px-8 text-center'>
                    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-muted'>
                      <svg
                        className='h-10 w-10 text-muted-foreground'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                    <div>
                      <p className='mb-2 text-lg text-muted-foreground'>无法加载智能助手</p>
                      <p className='mb-1 text-sm text-muted-foreground/60'>
                        请检查网络连接或稍后重试
                      </p>
                      <p className='text-xs text-muted-foreground/60'>如有问题，请联系技术支持</p>
                    </div>
                    <button
                      onClick={() => {
                        setIframeError(false)
                        setIsIframeLoading(true)
                        // 重新加载iframe
                        const iframe = document.querySelector(
                          'iframe[title="AI聊天机器人"]'
                        ) as HTMLIFrameElement
                        if (iframe) {
                          iframe.src = iframe.src
                        }
                      }}
                      className='rounded-lg bg-primary px-6 py-3 text-sm text-primary-foreground shadow-md transition-colors hover:bg-primary/90'
                    >
                      重新加载
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 响应式样式 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .fixed.inset-0.flex.items-center.justify-center > div {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }

          .fixed.bottom-6.right-6 {
            bottom: 20px !important;
            right: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .fixed.inset-0.flex.items-center.justify-center > div {
            width: 95vw;
            height: 85vh;
            max-height: 500px;
          }
        }
      `}</style>
    </>
  )
}
