'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { ImagePreviewModal, useImagePreview } from '@/components/ui/image-preview-modal'
import { ProtectedImage } from '@/components/ui/protected-image'

// 企业资质类型定义
interface Qualification {
  id: string
  title: string
  description?: string
  image?: string
  category: string
  issuer?: string
  issueDate?: string
  expiryDate?: string
  certificateNumber?: string
  displayOrder: number
  featured: boolean
}

// 原始数据作为fallback（如果API失败时使用）
const fallbackQualifications = [
  {
    id: 1,
    title: '安全生产许可证',
    description: '安全生产许可证',
    image: '/images/certificates/SECPROD.png',
    category: '安全生产',
  },
  {
    id: 2,
    title: '建筑业企业资质证书',
    description: '建筑业企业资质证书',
    image: '/images/certificates/CEQC.jpg',
    category: '建筑业企业资质',
  },
  {
    id: 3,
    title: '上海市公共安全防范工程设计施工单位',
    description: '上海市公共安全防范工程设计施工单位证书',
    image: '/images/certificates/SH-Pub-Sec-DEF-C.jpg',
    category: '施工单位资质',
  },
  {
    id: 4,
    title: '信息技术服务标准符合性证书',
    description: '信息技术服务标准符合性证书',
    image: '/images/certificates/ITSS.jpg',
    category: '经营许可',
  },
  {
    id: 5,
    title: 'ISO9001质量管理体系认证',
    description: 'ISO9001国际标准化组织质量管理体系认证',
    image: '/images/certificates/ISO9001-CN.jpg',
    category: '质量管理',
  },
  {
    id: 6,
    title: 'ISO20000信息技术服务管理体系认证',
    description: 'ISO20000信息技术服务管理体系认证',
    image: '/images/certificates/ISO20000-CN.jpg',
    category: '信息技术',
  },
  {
    id: 7,
    title: 'ISO27001信息安全管理体系认证',
    description: '信息安全管理体系认证',
    image: '/images/certificates/ISO27001-CN.jpg',
    category: '信息安全',
  },
  {
    id: 8,
    title: 'ISO14001环境管理体系认证',
    description: '环境管理体系标准认证',
    image: '/images/certificates/ISO14001-CN.jpg',
    category: '环境管理',
  },
  {
    id: 9,
    title: 'ISO45001职业健康安全管理体系认证',
    description: '职业健康安全管理体系认证',
    image: '/images/certificates/ISO45001-CN.jpg',
    category: '职业健康安全',
  },
  {
    id: 10,
    title: '企业信用等级证书',
    description: 'ceec',
    image: '/images/certificates/CEEC.jpg',
    category: '信用认证',
  },
]

export function Qualifications() {
  const [qualifications, setQualifications] = useState<Qualification[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6

  // 图片预览功能
  const { isOpen, imageData, openPreview, closePreview } = useImagePreview()

  // 获取企业资质数据
  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await fetch('/api/qualifications?limit=50')
        if (response.ok) {
          const data = await response.json()
          setQualifications(data.qualifications)
        } else {
          // 如果API失败，使用fallback数据
          console.warn('API获取失败，使用fallback数据')
          setQualifications(
            fallbackQualifications.map((item, index) => ({
              ...item,
              id: item.id.toString(),
              displayOrder: index,
              featured: true,
            }))
          )
        }
      } catch (error) {
        console.error('获取企业资质失败:', error)
        // 使用fallback数据
        setQualifications(
          fallbackQualifications.map((item, index) => ({
            ...item,
            id: item.id.toString(),
            displayOrder: index,
            featured: true,
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchQualifications()
  }, [])

  const totalPages = Math.ceil(qualifications.length / itemsPerPage)

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage
    return qualifications.slice(startIndex, startIndex + itemsPerPage)
  }

  const goToPrevious = () => {
    setCurrentPage(prev => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentPage(prev => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return (
      <section className='bg-white py-16 dark:bg-slate-900 md:py-24'>
        <Container>
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
              <p className='mt-4 text-gray-600 dark:text-gray-400'>加载企业资质中...</p>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className='bg-white py-16 dark:bg-slate-900 md:py-24'>
      <Container>
        {/* Section Header */}
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>企业资质</h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            我们拥有完善的资质认证体系，确保为客户提供专业、可靠的安防解决方案
          </p>
        </motion.div>

        {/* Certificates Grid with Navigation */}
        <div className='relative'>
          {/* Left Arrow */}
          {totalPages > 1 && (
            <button
              type='button'
              onClick={goToPrevious}
              className='group absolute -left-16 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-slate-700/90 dark:hover:bg-slate-600'
              aria-label='Previous page'
            >
              <ChevronLeft className='h-6 w-6 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white' />
            </button>
          )}

          {/* Right Arrow */}
          {totalPages > 1 && (
            <button
              type='button'
              onClick={goToNext}
              className='group absolute -right-16 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-slate-700/90 dark:hover:bg-slate-600'
              aria-label='Next page'
            >
              <ChevronRight className='h-6 w-6 text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white' />
            </button>
          )}

          <div className='mb-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
            {getCurrentPageItems().map((cert, index) => (
              <motion.div
                key={cert.id}
                className='group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-slate-700'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() =>
                  cert.image &&
                  openPreview(cert.image, cert.title, `${cert.title} - ${cert.category}`)
                }
              >
                {/* Certificate Image */}
                <div className='relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-slate-600'>
                  {cert.image ? (
                    <ProtectedImage
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className='object-contain p-2 transition-transform duration-300 group-hover:scale-105'
                      sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center text-gray-400'>
                      <div className='text-center'>
                        <div className='mb-2 text-4xl'>📜</div>
                        <div className='text-xs'>证书图片</div>
                      </div>
                    </div>
                  )}

                  {/* 悬停时显示放大提示 */}
                  {cert.image && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20'>
                      <div className='rounded-full bg-white/90 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                        <svg
                          className='h-5 w-5 text-gray-700'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7'
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Certificate Info */}
                <div className='p-3'>
                  <h3 className='mb-1 line-clamp-2 text-center text-sm font-medium text-gray-900 dark:text-white'>
                    {cert.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Page Indicator */}
        {totalPages > 1 && (
          <motion.div
            className='mt-8 flex items-center justify-center'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {currentPage + 1} / {totalPages}
            </span>
          </motion.div>
        )}
      </Container>

      {/* 图片预览模态框 */}
      <ImagePreviewModal
        isOpen={isOpen}
        onClose={closePreview}
        imageUrl={imageData.url}
        imageAlt={imageData.alt}
        title={imageData.title}
      />
    </section>
  )
}
