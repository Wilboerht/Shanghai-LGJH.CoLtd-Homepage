'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Check } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { normalizeCategoryId, getCategoryName } from '@/lib/product-categories'

interface Product {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  specifications: Array<{
    name: string
    value: string
    unit?: string
  }>
  applications: string[]
  benefits: string[]
  image: string
  priceInfo: any
  status: string
  slug: string
  tags: string[]
  gradient: string
  accentColor: string
  category: string
}

interface ProductCategory {
  id: string
  name: string
  description?: string
  products: Product[]
}

interface CategoryProductsProps {
  categoryId: string
}

export default function CategoryProducts({ categoryId }: CategoryProductsProps) {
  const [category, setCategory] = useState<ProductCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('获取产品数据失败')
        }
        const data = await response.json()

        // 使用统一的分类管理器进行映射
        const normalizedCategoryId = normalizeCategoryId(categoryId)

        // 找到对应的分类 - 修复：从categories字段中查找
        const targetCategory = data.categories?.find(
          (cat: ProductCategory) => cat.id === normalizedCategoryId || cat.id === categoryId
        )

        setCategory(targetCategory || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取产品数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryId])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center pt-16 sm:pt-20'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-slate-600 dark:text-slate-400'>加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center pt-16 sm:pt-20'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>加载失败</h1>
          <p className='mb-6 text-slate-600 dark:text-slate-400'>{error}</p>
          <Link href='/products'>
            <Button>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回产品列表
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className='flex min-h-screen items-center justify-center pt-16 sm:pt-20'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>分类未找到</h1>
          <Link href='/products'>
            <Button>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回产品列表
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white dark:bg-slate-900'>
      {/* Simple Header */}
      <section className='pb-8 pt-20'>
        <Container>
          {/* Back Button */}
          <div className='mb-6'>
            <Link
              href='/products'
              className='inline-flex items-center text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回产品
            </Link>
          </div>

          <div className='mx-auto max-w-4xl'>
            {/* Simple Title */}
            <div className='mb-8'>
              <h1 className='mb-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl'>
                {category.name}
              </h1>
              <p className='text-slate-600 dark:text-slate-400'>{category.description}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Simple Products List */}
      <section className='pb-16'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <div className='space-y-4'>
              {category.products.map(product => (
                <div
                  key={product.id}
                  className='group rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='mb-1 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                        {product.title}
                      </h3>
                      <p className='mb-3 text-sm text-slate-600 dark:text-slate-400'>
                        {product.subtitle}
                      </p>

                      {product.features && product.features.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {product.features.slice(0, 3).map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className='inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                            >
                              <Check className='h-3 w-3 text-green-500' />
                              {feature}
                            </span>
                          ))}
                          {product.features.length > 3 && (
                            <span className='px-2 py-1 text-xs text-slate-500 dark:text-slate-400'>
                              +{product.features.length - 3} 更多
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className='ml-4 flex-shrink-0'>
                      <Link href={`/products/${product.slug}`}>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-slate-300 text-slate-600 hover:border-blue-300 hover:text-blue-600 dark:border-slate-600 dark:text-slate-400 dark:hover:border-blue-600 dark:hover:text-blue-400'
                        >
                          查看详情
                          <ExternalLink className='ml-1 h-3 w-3' />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Simple CTA */}
      <section className='border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-700 dark:bg-slate-800'>
        <Container>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='mb-3 text-xl font-semibold text-slate-900 dark:text-white'>
              需要定制化产品？
            </h2>
            <p className='mb-6 text-sm text-slate-600 dark:text-slate-400'>
              联系我们的专业团队，获取针对您业务需求的定制化产品方案
            </p>
            <div className='flex flex-col justify-center gap-3 sm:flex-row'>
              <Button size='sm' className='bg-blue-600 text-white hover:bg-blue-700'>
                立即咨询
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300'
              >
                了解更多
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
