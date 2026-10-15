'use client'

import React, { useMemo } from 'react'

interface ChartData {
  [key: string]: any
}

interface AnalyticsChartProps {
  data: ChartData[]
  type: 'line' | 'bar' | 'area' | 'doughnut'
  xKey: string
  yKey: string
  color: string
  height?: number
}

export function AnalyticsChart({
  data,
  type,
  xKey,
  yKey,
  color,
  height = 300,
}: AnalyticsChartProps) {
  // 计算图表的基本统计信息
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null

    const values = data.map(item => item[yKey])
    const max = Math.max(...values)
    const min = Math.min(...values)
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const total = values.reduce((sum, val) => sum + val, 0)

    return { max, min, avg, total }
  }, [data, yKey])

  // 如果没有数据，显示空状态
  if (!data || data.length === 0) {
    return (
      <div
        className='flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800'
        style={{ height }}
      >
        <div className='text-center'>
          <div className='mb-2 text-gray-400'>📊</div>
          <p className='text-sm text-gray-500'>暂无数据</p>
        </div>
      </div>
    )
  }

  // 简单的条形图实现
  if (type === 'bar') {
    const maxValue = Math.max(...data.map(item => item[yKey]))

    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-gray-500'>最大值: </span>
            <span className='font-medium'>{stats?.max}</span>
          </div>
          <div>
            <span className='text-gray-500'>平均值: </span>
            <span className='font-medium'>{stats?.avg.toFixed(1)}</span>
          </div>
        </div>
        <div className='space-y-2'>
          {data.map((item, index) => (
            <div key={index} className='flex items-center gap-3'>
              <div className='w-20 truncate text-sm text-gray-600'>{item[xKey]}</div>
              <div className='relative h-6 flex-1 rounded-full bg-gray-200 dark:bg-gray-700'>
                <div
                  className='flex h-full items-center justify-end rounded-full pr-2'
                  style={{
                    width: `${(item[yKey] / maxValue) * 100}%`,
                    backgroundColor: color,
                  }}
                >
                  <span className='text-xs font-medium text-white'>{item[yKey]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 简单的线图实现
  if (type === 'line' || type === 'area') {
    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-3 gap-4 text-sm'>
          <div>
            <span className='text-gray-500'>总计: </span>
            <span className='font-medium'>{stats?.total}</span>
          </div>
          <div>
            <span className='text-gray-500'>最大值: </span>
            <span className='font-medium'>{stats?.max}</span>
          </div>
          <div>
            <span className='text-gray-500'>平均值: </span>
            <span className='font-medium'>{stats?.avg.toFixed(1)}</span>
          </div>
        </div>
        <div
          className='relative rounded-lg bg-gray-50 p-4 dark:bg-gray-800'
          style={{ height: height - 80 }}
        >
          <div className='absolute inset-4'>
            {/* 简单的数据点展示 */}
            <div className='grid h-full grid-cols-7 gap-1'>
              {data.slice(-7).map((item, index) => {
                const percentage = stats ? (item[yKey] / stats.max) * 100 : 0
                return (
                  <div key={index} className='flex flex-col items-center justify-end'>
                    <div
                      className='w-full rounded-t'
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: color,
                        opacity: type === 'area' ? 0.7 : 1,
                      }}
                    />
                    <div className='mt-1 w-full truncate text-center text-xs text-gray-500'>
                      {new Date(item[xKey]).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 简单的饼图实现
  if (type === 'doughnut') {
    const total = data.reduce((sum, item) => sum + item[yKey], 0)

    return (
      <div className='space-y-4'>
        <div className='text-center'>
          <div className='text-2xl font-bold text-gray-900 dark:text-white'>{total}</div>
          <div className='text-sm text-gray-500'>总计</div>
        </div>
        <div className='space-y-2'>
          {data.map((item, index) => {
            const percentage = total > 0 ? (item[yKey] / total) * 100 : 0
            const colors = [
              '#3b82f6',
              '#10b981',
              '#8b5cf6',
              '#f59e0b',
              '#ef4444',
              '#6b7280',
              '#ec4899',
              '#14b8a6',
            ]
            const itemColor = colors[index % colors.length]

            return (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='h-3 w-3 rounded-full' style={{ backgroundColor: itemColor }} />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>{item[xKey]}</span>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium'>{item[yKey]}</div>
                  <div className='text-xs text-gray-500'>{percentage.toFixed(1)}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-64 items-center justify-center text-gray-500'>
      不支持的图表类型: {type}
    </div>
  )
}
