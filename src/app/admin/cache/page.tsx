'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { RefreshCw, Trash2, Info, CheckCircle, XCircle } from 'lucide-react'

interface RevalidateResult {
  success: boolean
  message: string
  timestamp: string
}

export default function CacheManagePage() {
  const [loading, setLoading] = useState(false)
  const [revalidateType, setRevalidateType] = useState<'path' | 'tag'>('path')
  const [target, setTarget] = useState('')
  const [results, setResults] = useState<RevalidateResult[]>([])

  // 常用路径
  const commonPaths = ['/', '/products', '/services', '/research', '/about', '/contact', '/mission']

  // 常用标签
  const commonTags = ['products', 'services', 'research', 'partners', 'client-cases', 'mission']

  // 执行缓存刷新
  const handleRevalidate = async () => {
    if (!target.trim()) {
      toast.error('请输入要刷新的路径或标签')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: revalidateType,
          target: target.trim(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        setResults(prev => [result, ...prev.slice(0, 9)]) // 保留最近10条记录
        setTarget('') // 清空输入
      } else {
        toast.error(result.error || '刷新失败')
      }
    } catch (error) {
      console.error('刷新缓存失败:', error)
      toast.error('刷新缓存失败')
    } finally {
      setLoading(false)
    }
  }

  // 批量刷新常用路径
  const handleBatchRevalidate = async () => {
    setLoading(true)
    const paths = ['/', '/products', '/services', '/research']

    try {
      for (const path of paths) {
        const response = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'path',
            target: path,
          }),
        })

        const result = await response.json()
        setResults(prev => [result, ...prev])
      }

      toast.success('批量刷新完成')
    } catch (error) {
      console.error('批量刷新失败:', error)
      toast.error('批量刷新失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container mx-auto space-y-8 py-8'>
      <div>
        <h1 className='text-3xl font-bold'>缓存管理</h1>
        <p className='mt-2 text-muted-foreground'>管理网站页面缓存，确保内容更新后能及时显示</p>
      </div>

      {/* 缓存刷新工具 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <RefreshCw className='h-5 w-5' />
            缓存刷新
          </CardTitle>
          <CardDescription>手动刷新特定页面或标签的缓存</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='type'>刷新类型</Label>
              <Select
                value={revalidateType}
                onValueChange={(value: 'path' | 'tag') => setRevalidateType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='path'>路径 (Path)</SelectItem>
                  <SelectItem value='tag'>标签 (Tag)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='target'>{revalidateType === 'path' ? '页面路径' : '缓存标签'}</Label>
              <Input
                id='target'
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder={revalidateType === 'path' ? '例如: /products' : '例如: products'}
              />
            </div>
          </div>

          <div className='flex gap-2'>
            <Button onClick={handleRevalidate} disabled={loading}>
              {loading ? (
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <RefreshCw className='mr-2 h-4 w-4' />
              )}
              刷新缓存
            </Button>
            <Button variant='outline' onClick={handleBatchRevalidate} disabled={loading}>
              批量刷新主要页面
            </Button>
          </div>

          {/* 快捷按钮 */}
          <div className='space-y-2'>
            <Label>常用路径快捷刷新</Label>
            <div className='flex flex-wrap gap-2'>
              {commonPaths.map(path => (
                <Button
                  key={path}
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setRevalidateType('path')
                    setTarget(path)
                  }}
                >
                  {path === '/' ? '首页' : path}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 刷新历史 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Info className='h-5 w-5' />
              刷新历史
            </CardTitle>
            <CardDescription>最近的缓存刷新操作记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {results.map((result, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-lg border p-3'
                >
                  <div className='flex items-center gap-3'>
                    {result.success ? (
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    ) : (
                      <XCircle className='h-4 w-4 text-red-500' />
                    )}
                    <span className='font-medium'>{result.message}</span>
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h4 className='mb-2 font-semibold'>什么时候需要刷新缓存？</h4>
            <ul className='list-inside list-disc space-y-1 text-sm text-muted-foreground'>
              <li>在CMS中创建、更新或删除内容后</li>
              <li>发现前端页面显示的内容不是最新的</li>
              <li>网站部署后需要确保所有页面都是最新版本</li>
            </ul>
          </div>

          <div>
            <h4 className='mb-2 font-semibold'>路径 vs 标签</h4>
            <ul className='list-inside list-disc space-y-1 text-sm text-muted-foreground'>
              <li>
                <strong>路径刷新</strong>：刷新特定页面的缓存，如 /products 或 /services/consulting
              </li>
              <li>
                <strong>标签刷新</strong>：刷新所有带有特定标签的缓存，影响范围更广
              </li>
            </ul>
          </div>

          <div>
            <h4 className='mb-2 font-semibold'>常用操作</h4>
            <ul className='list-inside list-disc space-y-1 text-sm text-muted-foreground'>
              <li>更新产品后：刷新 /products 和 /products/[产品slug]</li>
              <li>更新服务后：刷新 /services 和 /services/[服务slug]</li>
              <li>更新研究后：刷新 /research 和 /research/[研究slug]</li>
              <li>全站更新后：使用"批量刷新主要页面"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
