'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Users, ArrowRight } from 'lucide-react'

export default function ApplicationsRedirectPage() {
  const router = useRouter()

  // 自动重定向到新的招聘管理页面
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin/content/careers?tab=applications')
    }, 3000) // 3秒后自动跳转

    return () => clearTimeout(timer)
  }, [router])

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>页面已迁移</h1>
            <p className='mt-2 text-gray-600'>招聘申请管理功能已迁移到新的招聘管理页面</p>
          </div>
        </div>

        {/* 迁移通知卡片 */}
        <Card className='border-blue-200 bg-blue-50'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-blue-900'>
              <Briefcase className='h-5 w-5' />
              功能迁移通知
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='text-blue-700'>
              <p className='mb-4'>
                为了提供更好的用户体验，招聘申请管理功能已经迁移到招聘管理页面中。
                新的页面集成了职位管理、申请处理和数据分析功能，提供一站式的招聘管理体验。
              </p>
              <p className='mb-4 text-sm text-blue-600'>
                页面将在 3 秒后自动跳转，或者您可以点击下方按钮立即前往。
              </p>
            </div>

            <div className='flex gap-3'>
              <Button
                onClick={() => router.push('/admin/content/careers?tab=applications')}
                className='bg-blue-600 hover:bg-blue-700'
              >
                <Users className='mr-2 h-4 w-4' />
                立即前往申请管理
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push('/admin/content/careers')}
                className='border-blue-300 text-blue-700 hover:bg-blue-50'
              >
                <Briefcase className='mr-2 h-4 w-4' />
                查看完整招聘管理
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 功能说明 */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>新功能优势</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2 text-sm text-gray-600'>
                <li>• 职位管理和申请处理集中在一个页面</li>
                <li>• 更直观的数据统计和分析</li>
                <li>• 简化的操作流程</li>
                <li>• 更好的响应式设计</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>快速导航</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => router.push('/admin/content/careers')}
                >
                  <Briefcase className='mr-2 h-4 w-4' />
                  职位管理
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => router.push('/admin/content/careers?tab=applications')}
                >
                  <Users className='mr-2 h-4 w-4' />
                  申请管理
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => router.push('/admin/content/careers?tab=analytics')}
                >
                  <ArrowRight className='mr-2 h-4 w-4' />
                  数据分析
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
