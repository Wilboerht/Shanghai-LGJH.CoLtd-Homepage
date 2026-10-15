'use client'

import React from 'react'
import { ArrowLeft, ExternalLink, Check } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Solution {
  id: string
  title: string
  subtitle: string
  description: string
  category: string
  features: string[]
  applications: string[]
  metrics: Array<{
    value: string
    label: string
  }>
  technologies: string[]
  benefits: string[]
  image: string
  slug: string
  gradient: string
  accentColor: string
}

interface SolutionCategory {
  id: string
  name: string
  description: string
  solutions: Solution[]
}

interface CategorySolutionsProps {
  categoryId: string
}

export default function CategorySolutions({ categoryId }: CategorySolutionsProps) {
  const [category, setCategory] = React.useState<SolutionCategory | null>(null)
  const [loading, setLoading] = React.useState(true)

  // 获取分类解决方案数据
  React.useEffect(() => {
    const fetchCategorySolutions = async () => {
      try {
        setLoading(true)

        // 分类ID映射表 - 将URL中的ID转换为实际的分类名称
        const categoryIdMap: Record<string, string> = {
          // 支持中文分类名称（直接映射）
          园区管理: '园区管理',
          社区管理: '社区管理',
          公共交通: '公共交通',
          工业制造: '工业制造',
          物流运输: '物流运输',
          大健康: '大健康',
          商业综合体: '商业综合体',
          其他方案: '其他方案',
          // 支持英文ID映射
          'park-management': '园区管理',
          'community-management': '社区管理',
          'public-transport': '公共交通',
          'industrial-manufacturing': '工业制造',
          'logistics-transport': '物流运输',
          'big-health': '大健康',
          healthcare: '大健康',
          'commercial-complex': '商业综合体',
          'other-solutions': '其他方案',
          others: '其他方案',
        }

        // 获取实际的分类名称
        const actualCategoryName = categoryIdMap[categoryId] || categoryId

        const response = await fetch(
          `/api/solutions?category=${encodeURIComponent(actualCategoryName)}`
        )
        if (!response.ok) throw new Error('获取解决方案数据失败')

        const solutions: Solution[] = await response.json()

        if (solutions.length > 0) {
          setCategory({
            id: categoryId,
            name: solutions[0].category,
            description: `${solutions[0].category}相关的智能化解决方案`,
            solutions: solutions,
          })
        } else {
          setCategory(null)
        }
      } catch (error) {
        console.error('获取分类解决方案失败:', error)
        setCategory(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCategorySolutions()
  }, [categoryId])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center pt-16 sm:pt-20'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600 dark:text-gray-400'>加载中...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className='flex min-h-screen items-center justify-center pt-16 sm:pt-20'>
        <div className='text-center'>
          <h1 className='mb-4 font-alimama-shuhei text-2xl font-bold text-gray-900 dark:text-white'>
            分类未找到
          </h1>
          <Link href='/solutions'>
            <Button>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回解决方案列表
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
              href='/solutions'
              className='inline-flex items-center text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回解决方案
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

      {/* Simple Solutions List */}
      <section className='pb-16'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <div className='space-y-4'>
              {category.solutions.map((solution, index) => (
                <div
                  key={solution.id}
                  className='group rounded-lg bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='mb-1 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
                        {solution.title}
                      </h3>
                      <p className='mb-3 text-sm text-slate-600 dark:text-slate-400'>
                        {solution.subtitle}
                      </p>

                      {solution.features && solution.features.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {solution.features.slice(0, 3).map((feature, featureIndex) => (
                            <span
                              key={featureIndex}
                              className='inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                            >
                              <Check className='h-3 w-3 text-green-500' />
                              {feature}
                            </span>
                          ))}
                          {solution.features.length > 3 && (
                            <span className='px-2 py-1 text-xs text-slate-500 dark:text-slate-400'>
                              +{solution.features.length - 3} 更多
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className='ml-4 flex-shrink-0'>
                      <Link href={`/solutions/${solution.slug}`}>
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
              需要定制化解决方案？
            </h2>
            <p className='mb-6 text-sm text-slate-600 dark:text-slate-400'>
              联系我们的专业团队，获取针对您业务需求的定制化方案
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
