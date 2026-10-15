'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MetricsPreviewProps {
  metricsJson: string
  className?: string
}

export function MetricsPreview({ metricsJson, className }: MetricsPreviewProps) {
  let metrics: Record<string, string> = {}
  let hasError = false
  let errorMessage = ''

  try {
    if (metricsJson.trim()) {
      metrics = JSON.parse(metricsJson)
      if (typeof metrics !== 'object' || metrics === null || Array.isArray(metrics)) {
        throw new Error('指标数据必须是对象格式')
      }
    }
  } catch (error) {
    hasError = true
    errorMessage = error instanceof Error ? error.message : 'JSON格式错误'
  }

  const entries = Object.entries(metrics).slice(0, 4) // 最多显示4个

  return (
    <Card className={className}>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium'>
          📊 指标预览
          {entries.length > 0 && (
            <Badge variant='secondary' className='text-xs'>
              {entries.length}/4
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasError ? (
          <div className='py-4 text-center'>
            <div className='mb-2 text-sm text-red-500'>❌ {errorMessage}</div>
            <div className='text-xs text-gray-500'>请检查JSON格式是否正确</div>
          </div>
        ) : entries.length === 0 ? (
          <div className='py-4 text-center text-sm text-gray-500'>暂无指标数据</div>
        ) : (
          <div className='space-y-4'>
            {/* 前端显示效果预览 */}
            <div>
              <div className='mb-2 text-xs text-gray-500'>前端显示效果：</div>
              <div className='flex flex-wrap justify-center gap-8 rounded-lg bg-gray-50 py-4'>
                {entries.map(([key, value]) => (
                  <div key={key} className='flex flex-col items-center'>
                    <div className='mb-1 text-xl font-bold text-blue-600'>{value}</div>
                    <div className='whitespace-nowrap text-xs text-slate-600'>{key}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 管理界面显示效果预览 */}
            <div>
              <div className='mb-2 text-xs text-gray-500'>管理界面显示效果：</div>
              <div className='flex flex-wrap gap-2'>
                {entries.map(([key, value], index) => (
                  <span
                    key={index}
                    className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700'
                  >
                    {value} {key}
                  </span>
                ))}
              </div>
            </div>

            {/* 提示信息 */}
            {entries.length === 4 && Object.keys(metrics).length > 4 && (
              <div className='rounded bg-amber-50 p-2 text-xs text-amber-600'>
                ⚠️ 检测到超过4个指标，前端只会显示前4个
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 指标输入建议组件
export function MetricsSuggestions() {
  const suggestions = [
    { label: '效率类', examples: ['效率提升', '处理速度提升', '响应时间缩短'] },
    { label: '质量类', examples: ['故障率降低', '准确率提升', '可用性提升'] },
    { label: '成本类', examples: ['成本节省', '运维成本降低', '人力成本减少'] },
    { label: '业务类', examples: ['延误减少', '客户满意度', '业务增长'] },
  ]

  return (
    <Card className='mt-4'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-medium'>💡 指标命名建议</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {suggestions.map(category => (
          <div key={category.label}>
            <div className='mb-1 text-xs font-medium text-gray-700'>{category.label}</div>
            <div className='flex flex-wrap gap-1'>
              {category.examples.map(example => (
                <Badge
                  key={example}
                  variant='outline'
                  className='cursor-pointer text-xs hover:bg-blue-50'
                  onClick={() => {
                    // 可以添加点击复制功能
                    navigator.clipboard?.writeText(`"${example}": "XX%"`)
                  }}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        <div className='mt-2 text-xs text-gray-500'>💡 点击标签可复制到剪贴板</div>
      </CardContent>
    </Card>
  )
}
