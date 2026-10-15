'use client'

import React, { useState } from 'react'
import { Container } from '@/components/ui/container'
import { CompanyMap } from '@/components/ui/map'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Palette, Zap, Building2, Minimize2, Circle } from 'lucide-react'

type MarkerStyle = 'default' | 'modern' | 'corporate' | 'minimal' | 'animated'

const markerStyles: Array<{
  id: MarkerStyle
  name: string
  description: string
  icon: React.ReactNode
  color: string
}> = [
  {
    id: 'default',
    name: '默认样式',
    description: '高德地图原生蓝色标记点',
    icon: <Circle className='h-4 w-4' />,
    color: 'bg-blue-500',
  },
  {
    id: 'modern',
    name: '现代风格',
    description: '橙红渐变，带脉冲动画效果',
    icon: <Zap className='h-4 w-4' />,
    color: 'bg-orange-500',
  },
  {
    id: 'corporate',
    name: '企业风格',
    description: '蓝色商务风格，简洁专业',
    icon: <Building2 className='h-4 w-4' />,
    color: 'bg-blue-600',
  },
  {
    id: 'minimal',
    name: '极简风格',
    description: '绿色圆形，简约清爽',
    icon: <Minimize2 className='h-4 w-4' />,
    color: 'bg-green-500',
  },
  {
    id: 'animated',
    name: '动态风格',
    description: '金黄色，多重动画效果',
    icon: <Palette className='h-4 w-4' />,
    color: 'bg-yellow-500',
  },
]

export default function MapStylesDemo() {
  const [selectedStyle, setSelectedStyle] = useState<MarkerStyle>('modern')
  const [mapKey, setMapKey] = useState(0)

  const handleStyleChange = (style: MarkerStyle) => {
    setSelectedStyle(style)
    setMapKey(prev => prev + 1) // 强制重新渲染地图
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 dark:bg-slate-900'>
      <Container>
        <div className='mx-auto max-w-6xl'>
          {/* 页面标题 */}
          <div className='mb-8 text-center'>
            <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>
              地图标记样式演示
            </h1>
            <p className='mb-6 text-gray-600 dark:text-gray-300'>
              选择不同的标记样式来替换联系我们页面中的蓝色点位
            </p>
            <Badge variant='outline' className='mb-4'>
              当前选择: {markerStyles.find(s => s.id === selectedStyle)?.name}
            </Badge>
          </div>

          {/* 样式选择器 */}
          <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5'>
            {markerStyles.map(style => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedStyle === style.id ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => handleStyleChange(style.id)}
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-center space-x-2'>
                    <div className={`rounded-full p-2 ${style.color} text-white`}>{style.icon}</div>
                    <CardTitle className='text-sm'>{style.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <CardDescription className='text-xs'>{style.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 地图展示 */}
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <MapPin className='h-5 w-5 text-red-600' />
                <span>地图预览</span>
              </CardTitle>
              <CardDescription>实时预览选中的标记样式效果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-96 overflow-hidden rounded-lg'>
                <CompanyMap key={mapKey} markerStyle={selectedStyle} className='h-full w-full' />
              </div>
            </CardContent>
          </Card>

          {/* 使用说明 */}
          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <h4 className='mb-2 font-semibold'>样式特点</h4>
                  <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-300'>
                    <li>
                      • <strong>默认样式</strong>: 高德地图原生标记
                    </li>
                    <li>
                      • <strong>现代风格</strong>: 渐变色彩，脉冲动画
                    </li>
                    <li>
                      • <strong>企业风格</strong>: 商务蓝色，专业简洁
                    </li>
                    <li>
                      • <strong>极简风格</strong>: 小尺寸，清爽绿色
                    </li>
                    <li>
                      • <strong>动态风格</strong>: 多重动画，吸引注意
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className='mb-2 font-semibold'>推荐使用场景</h4>
                  <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-300'>
                    <li>
                      • <strong>企业官网</strong>: 企业风格或现代风格
                    </li>
                    <li>
                      • <strong>产品展示</strong>: 现代风格或动态风格
                    </li>
                    <li>
                      • <strong>简约设计</strong>: 极简风格
                    </li>
                    <li>
                      • <strong>传统布局</strong>: 默认样式
                    </li>
                    <li>
                      • <strong>营销页面</strong>: 动态风格
                    </li>
                  </ul>
                </div>
              </div>

              <div className='mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                <p className='text-sm text-blue-800 dark:text-blue-200'>
                  <strong>提示:</strong> 选择好样式后，我可以帮您将选中的样式应用到联系我们页面中。
                  目前联系我们页面使用的是 "现代风格" 标记。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}
