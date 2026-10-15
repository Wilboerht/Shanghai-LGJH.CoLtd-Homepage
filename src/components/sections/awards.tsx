'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { ImagePreviewModal, useImagePreview } from '@/components/ui/image-preview-modal'
import { ProtectedImage } from '@/components/ui/protected-image'

// 荣誉奖项类型定义
interface Award {
  id: string
  title: string
  category: string
  year: string
  date: string
  description?: string
  image?: string
  issuer?: string
}

// 原始数据作为fallback（如果API失败时使用）
const fallbackAwards = [
  {
    id: 1,
    title: '上海市智能安防解决方案优秀集成商奖',
    description: '上海市智能安防解决方案优秀集成商奖',
    image: '/images/awards/2018-PSE.jpg',
    category: '上海市安博会',
  },
  {
    id: 2,
    title: '上海市安防行业优秀企业',
    description: '上海市安防行业优秀企业',
    image: '/images/awards/2024-PSE-EX-BU.jpg',
    category: '上海市安博会',
  },
  {
    id: 3,
    title: '长三角地区安防创新产品奖',
    description: '长三角地区安防创新产品奖',
    image: '/images/awards/2024-PSE-EX-PROT.jpg',
    category: '上海市安博会',
  },
  {
    id: 4,
    title: '长三角地区智慧城市建设优秀解决方案奖',
    description: '长三角地区智慧城市建设优秀解决方案',
    image: '/images/awards/2024-PSE-SLOV.jpg',
    category: '上海市安博会',
  },
  {
    id: 5,
    title: '上海虹桥国际机场最佳伙伴奖',
    description: '上海虹桥国际机场最佳伙伴奖',
    image: '/images/awards/BEST-PARTNER.jpg',
    category: '最佳伙伴',
  },
  {
    id: 6,
    title: '安全防范报警协会副理事长单位',
    description: '安全防范报警协会副理事长单位',
    image: '/images/awards/安全防范报警协会副理事长单位.jpg',
    category: '行业协会',
  },
  {
    id: 7,
    title: '海康威视战略合作伙伴',
    description: '海康威视战略合作伙伴',
    image: '/images/awards/海康威视战略合作伙伴.jpg',
    category: '战略合作伙伴',
  },
  {
    id: 8,
    title: '虹桥机场最佳伙伴奖',
    description: '虹桥机场最佳伙伴奖',
    image: '/images/awards/虹桥机场最佳伙伴奖.jpg',
    category: '战略合作商',
  },
  {
    id: 9,
    title: '华为合作伙伴',
    description: '华为合作伙伴',
    image: '/images/awards/华为合作伙伴.jpg',
    category: '行业协会',
  },
  {
    id: 10,
    title: '交通电子行业理事单位',
    description: '交通电子行业理事单位',
    image: '/images/awards/交通电子行业理事单位.jpg',
    category: '行业协会',
  },
  {
    id: 11,
    title: '申安杯优秀安装工程奖',
    description: '申安杯优秀安装工程奖',
    image: '/images/awards/申安杯优秀安装工程奖.png',
    category: '行业协会',
  },
  {
    id: 12,
    title: '优秀安防工程商',
    description: '优秀安防工程商',
    image: '/images/awards/优秀安防工程商.jpg',
    category: '行业协会',
  },
  {
    id: 13,
    title: '优秀安防集成商',
    description: '优秀安防集成商',
    image: '/images/awards/优秀安防集成商.jpg',
    category: '行业协会',
  },
  {
    id: 14,
    title: '云筑蜜蜂会员',
    description: '云筑蜜蜂会员',
    image: '/images/awards/云筑蜂会员.jpg',
    category: '行业协会',
  },
  {
    id: 15,
    title: '长三角地区百强企业',
    description: '长三角地区百强企业',
    image: '/images/awards/长三角地区百强企业.jpg',
    category: '行业协会',
  },
  {
    id: 16,
    title: '智能安防解决方案优秀集成商',
    description: '智能安防解决方案优秀集成商',
    image: '/images/awards/智能安防解决方案优秀集成商.png',
    category: '行业协会',
  },
]

export function Awards() {
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 6

  // 图片预览功能
  const { isOpen, imageData, openPreview, closePreview } = useImagePreview()

  // 获取荣誉奖项数据
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch('/api/awards?featured=true&limit=50')
        if (response.ok) {
          const data = await response.json()
          setAwards(data.awards || [])
        } else {
          // 如果API失败，使用fallback数据
          console.warn('API获取失败，使用fallback数据')
          setAwards(
            fallbackAwards.map((item, index) => ({
              ...item,
              id: item.id.toString(),
              year: '2024',
              date: '2024-01-01',
              issuer: '相关机构',
            }))
          )
        }
      } catch (error) {
        console.error('获取荣誉奖项失败:', error)
        // 使用fallback数据
        setAwards(
          fallbackAwards.map((item, index) => ({
            ...item,
            id: item.id.toString(),
            year: '2024',
            date: '2024-01-01',
            issuer: '相关机构',
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAwards()
  }, [])

  const totalPages = Math.ceil(awards.length / itemsPerPage)

  const getCurrentPageItems = () => {
    const startIndex = currentPage * itemsPerPage
    return awards.slice(startIndex, startIndex + itemsPerPage)
  }

  const goToPrevious = () => {
    setCurrentPage(prev => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentPage(prev => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  if (loading) {
    return (
      <section className='bg-white pb-16 pt-8 dark:bg-slate-900 md:pb-24 md:pt-12'>
        <Container>
          <div className='flex items-center justify-center py-20'>
            <div className='text-center'>
              <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
              <p className='mt-4 text-gray-600 dark:text-gray-400'>加载荣誉奖项中...</p>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className='bg-white pb-16 pt-8 dark:bg-slate-900 md:pb-24 md:pt-12'>
      <Container>
        {/* Section Header */}
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>荣誉奖项</h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            多年来获得的行业认可和荣誉奖项，见证我们在安防领域的专业实力和创新成果
          </p>
        </motion.div>

        {/* Awards Grid with Navigation */}
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
            {getCurrentPageItems().map((award, index) => (
              <motion.div
                key={award.id}
                className='group cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-slate-700'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() =>
                  award.image &&
                  openPreview(award.image, award.title, `${award.title} - ${award.category}`)
                }
              >
                {/* Award Image */}
                <div className='relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-slate-600'>
                  {award.image ? (
                    <ProtectedImage
                      src={award.image}
                      alt={award.title}
                      fill
                      className='object-contain p-2 transition-transform duration-300 group-hover:scale-105'
                      sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center text-gray-400'>
                      <div className='text-center'>
                        <div className='mb-2 text-4xl'>🏆</div>
                        <div className='text-xs'>奖项图片</div>
                      </div>
                    </div>
                  )}

                  {/* 悬停时显示放大提示 */}
                  {award.image && (
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

                {/* Award Info */}
                <div className='p-3'>
                  <h3 className='mb-1 line-clamp-2 text-center text-sm font-medium text-gray-900 dark:text-white'>
                    {award.title}
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
