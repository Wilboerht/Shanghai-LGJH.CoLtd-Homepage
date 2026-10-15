'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { CompanyMap } from '@/components/ui/map'
import { Button } from '@/components/ui/button'
import { RefreshCw, MapPin } from 'lucide-react'

export default function MapTestPage() {
  const [key, setKey] = React.useState(0)

  const refreshMap = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <Container>
        <div className='mx-auto max-w-4xl'>
          <div className='mb-8 text-center'>
            <h1 className='mb-4 text-3xl font-bold text-gray-900'>地图组件测试</h1>
            <p className='mb-6 text-gray-600'>测试新的高德地图组件功能</p>
            <Button onClick={refreshMap} className='mb-4'>
              <RefreshCw className='mr-2 h-4 w-4' />
              重新加载地图
            </Button>
          </div>

          <div className='space-y-8'>
            {/* 地图组件 */}
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-4 flex items-center text-xl font-semibold'>
                <MapPin className='mr-2 h-5 w-5 text-red-600' />
                公司位置地图
              </h2>
              <CompanyMap key={key} />
            </div>

            {/* 功能说明 */}
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-4 text-xl font-semibold'>功能说明</h2>
              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h3 className='mb-2 font-medium text-gray-900'>基本功能</h3>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• 显示公司位置标记</li>
                    <li>• 地图缩放和拖拽</li>
                    <li>• 点击标记显示信息窗体</li>
                    <li>• 导航功能</li>
                    <li>
                      • <strong>坐标切换</strong>：点击齿轮图标调整位置
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className='mb-2 font-medium text-gray-900'>位置切换</h3>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>• 默认显示公司总部位置</li>
                    <li>• 点击地图右上角齿轮图标切换到展厅</li>
                    <li>• 支持两个地址：总部和创晶展厅</li>
                    <li>• 每个位置显示对应的详细地址</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 技术信息 */}
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <h2 className='mb-4 text-xl font-semibold'>技术信息</h2>
              <div className='grid gap-6 md:grid-cols-3'>
                <div>
                  <h3 className='mb-2 font-medium text-gray-900'>地图服务</h3>
                  <p className='text-sm text-gray-600'>高德地图 API v2.0</p>
                </div>
                <div>
                  <h3 className='mb-2 font-medium text-gray-900'>API密钥</h3>
                  <p className='font-mono text-sm text-gray-600'>
                    ecc7df37a4199688fe9d3f5fcfdfb8c0
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 font-medium text-gray-900'>地址配置</h3>
                  <div className='space-y-2 text-sm text-gray-600'>
                    <div>
                      <p className='font-medium'>公司总部</p>
                      <p className='text-xs'>宜山路508号5楼</p>
                      <p className='text-xs text-gray-500'>121.4235, 31.1785</p>
                    </div>
                    <div>
                      <p className='font-medium'>创晶展厅</p>
                      <p className='text-xs'>海洋一路99号</p>
                      <p className='text-xs text-gray-500'>121.5890, 31.2040</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 调试信息 */}
            <div className='rounded-lg bg-gray-100 p-6'>
              <h2 className='mb-4 text-xl font-semibold'>调试信息</h2>
              <div className='space-y-2 font-mono text-sm'>
                <div>
                  <span className='text-gray-600'>地图 API 状态:</span>{' '}
                  <span
                    className={
                      typeof window !== 'undefined' && (window as any).AMap
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {typeof window !== 'undefined' && (window as any).AMap ? '已加载' : '未加载'}
                  </span>
                </div>
                <div>
                  <span className='text-gray-600'>浏览器支持:</span>{' '}
                  <span className='text-green-600'>
                    {typeof window !== 'undefined' ? '支持' : '服务端渲染'}
                  </span>
                </div>
                <div>
                  <span className='text-gray-600'>设备类型:</span>{' '}
                  <span className='text-blue-600'>
                    {typeof window !== 'undefined' &&
                    /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
                      ? '移动设备'
                      : '桌面设备'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
