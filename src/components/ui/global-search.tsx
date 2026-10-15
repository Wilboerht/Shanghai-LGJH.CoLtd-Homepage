'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, ArrowRight, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface SearchResult {
  id: string
  title: string
  description: string
  type: string
  category: string
  url: string
  imageUrl?: string
}

interface SearchResponse {
  query: string
  results: SearchResult[]
  categories: Array<{ name: string; count: number; type: string }>
  suggestions: string[]
  total: number
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 客户端挂载检查
  useEffect(() => {
    setMounted(true)
  }, [])

  // 加载最近搜索
  useEffect(() => {
    if (mounted) {
      const recent = localStorage.getItem('recentSearches')
      if (recent) {
        setRecentSearches(JSON.parse(recent))
      }
    }
  }, [mounted])

  // 防抖搜索
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // 打开时聚焦输入框和阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      const cleanup = () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleKeyDown)
      }
      return cleanup
    } else {
      return undefined
    }
  }, [isOpen, onClose])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      } else {
        console.error('搜索失败:', response.status)
      }
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (query?: string) => {
    if (query) {
      // 保存到最近搜索
      const newRecent = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))
    }
    onClose()
    setSearchQuery('')
    setSearchResults(null)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  if (!isOpen || !mounted) return null

  const searchModal = (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm'
      style={{ zIndex: 999999 }}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className='flex min-h-screen items-start justify-center p-4 pt-16'>
        <div
          className='w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl'
          onClick={e => e.stopPropagation()}
        >
          {/* 搜索头部 */}
          <div className='relative'>
            <div className='flex items-center gap-4 border-b border-gray-100 p-6'>
              <div className='flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3'>
                <Search className='h-5 w-5 flex-shrink-0 text-gray-400' />
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='搜索产品、解决方案、服务、研究...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='flex-1 bg-transparent text-base text-gray-900 placeholder-gray-500 outline-none'
                  autoFocus
                  autoComplete='off'
                  spellCheck='false'
                />
                {searchQuery && (
                  <button
                    type='button'
                    onClick={() => setSearchQuery('')}
                    className='rounded-full p-1 transition-colors hover:bg-gray-200'
                    title='清除搜索'
                  >
                    <X className='h-4 w-4 text-gray-400' />
                  </button>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='h-10 w-10 p-0 hover:bg-gray-100'
              >
                <X className='h-5 w-5 text-gray-500' />
              </Button>
            </div>
          </div>

          {/* 搜索内容 */}
          <div className='max-h-[70vh] overflow-y-auto'>
            {/* 加载状态 */}
            {loading && (
              <div className='flex items-center justify-center py-12'>
                <div className='flex items-center gap-3 text-gray-600'>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  <span>搜索中...</span>
                </div>
              </div>
            )}

            {/* 搜索结果 */}
            {!loading && searchResults && searchResults.results.length > 0 && (
              <div className='p-4'>
                {/* 结果统计 */}
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-sm text-gray-600'>找到 {searchResults.total} 个结果</div>
                  {searchResults.categories.length > 0 && (
                    <div className='flex gap-2'>
                      {searchResults.categories.map(category => (
                        <span
                          key={category.type}
                          className='inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700'
                        >
                          {category.name} {category.count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 搜索结果列表 */}
                <div className='space-y-3'>
                  {searchResults.results.map(result => (
                    <Link
                      key={`${result.type}-${result.id}`}
                      href={result.url}
                      onClick={() => handleResultClick(searchQuery)}
                      className='group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50'
                    >
                      {result.imageUrl && (
                        <div className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                          <Image
                            src={result.imageUrl}
                            alt={result.title}
                            width={48}
                            height={48}
                            className='h-full w-full object-cover'
                          />
                        </div>
                      )}
                      <div className='min-w-0 flex-1'>
                        <h3 className='line-clamp-1 font-medium text-gray-900 transition-colors group-hover:text-blue-600'>
                          {result.title}
                        </h3>
                        <p className='mt-1 line-clamp-2 text-sm text-gray-600'>
                          {result.description}
                        </p>
                        <div className='mt-2 flex items-center gap-2'>
                          <span className='inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700'>
                            {getTypeLabel(result.type)}
                          </span>
                          <span className='text-xs text-gray-500'>{result.category}</span>
                        </div>
                      </div>
                      <ArrowRight className='mt-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover:text-blue-600' />
                    </Link>
                  ))}
                </div>

                {/* 查看更多 */}
                {searchResults.total > searchResults.results.length && (
                  <div className='mt-6 border-t border-gray-100 pt-4'>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => handleResultClick(searchQuery)}
                      className='flex w-full items-center justify-center gap-2 py-3 font-medium text-blue-600 transition-colors hover:text-blue-700'
                    >
                      查看全部 {searchResults.total} 个结果
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 无结果 */}
            {!loading && searchQuery && !searchResults?.results.length && (
              <div className='p-8 text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                  <Search className='h-6 w-6 text-gray-400' />
                </div>
                <h3 className='mb-2 text-lg font-medium text-gray-900'>未找到相关结果</h3>
                <p className='mb-4 text-gray-600'>尝试使用不同的关键词</p>
                {searchResults?.suggestions && searchResults.suggestions.length > 0 && (
                  <div className='flex flex-wrap justify-center gap-2'>
                    {searchResults?.suggestions?.map(suggestion => (
                      <button
                        key={suggestion}
                        type='button'
                        onClick={() => setSearchQuery(suggestion)}
                        className='rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200'
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 默认状态 */}
            {!searchQuery && (
              <div className='p-6'>
                {/* 最近搜索 */}
                {recentSearches.length > 0 && (
                  <div className='mb-6'>
                    <div className='mb-3 flex items-center justify-between'>
                      <h3 className='text-sm font-medium text-gray-900'>最近搜索</h3>
                      <button
                        type='button'
                        onClick={clearRecentSearches}
                        className='text-xs text-gray-500 hover:text-gray-700'
                      >
                        清除
                      </button>
                    </div>
                    <div className='space-y-2'>
                      {recentSearches.map(search => (
                        <button
                          key={search}
                          type='button'
                          onClick={() => setSearchQuery(search)}
                          className='flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-gray-50'
                        >
                          <Clock className='h-4 w-4 text-gray-400' />
                          <span className='text-gray-700'>{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 热门搜索 */}
                <div>
                  <h3 className='mb-3 text-sm font-medium text-gray-900'>热门搜索</h3>
                  <div className='flex flex-wrap gap-2'>
                    {['智能监控', '安防系统', '数字化转型', '视频监控', '门禁控制', 'AI平台'].map(
                      suggestion => (
                        <button
                          key={suggestion}
                          type='button'
                          onClick={() => setSearchQuery(suggestion)}
                          className='rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200'
                        >
                          {suggestion}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(searchModal, document.body)
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    product: '产品',
    solution: '解决方案',
    service: '服务',
    research: '研究',
    news: '动态',
  }
  return labels[type] || type
}
