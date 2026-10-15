'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, ArrowLeft, ExternalLink } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description: string
  type: string
  category: string
  status: string
  url: string
  updatedAt: string
}

interface SearchResponse {
  query: string
  type: string
  results: SearchResult[]
  categories: { name: string; count: number; type: string }[]
  suggestions: string[]
  total: number
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const pageSize = 20

  useEffect(() => {
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const page = parseInt(searchParams.get('page') || '1')

    setSearchQuery(query)
    setSelectedType(type)
    setCurrentPage(page)

    if (query) {
      handleSearch(query, type, page)
    }
  }, [searchParams])

  const handleSearch = async (query: string, type: string = 'all', page: number = 1) => {
    try {
      setLoading(true)
      const offset = (page - 1) * pageSize
      const response = await fetch(
        `/api/admin/search?q=${encodeURIComponent(query)}&type=${type}&limit=${pageSize}&offset=${offset}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

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

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    setCurrentPage(1)
    const params = new URLSearchParams(searchParams.toString())
    params.set('type', type)
    params.set('page', '1')
    router.push(`/admin/search?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/admin/search?${params.toString()}`)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product':
        return '📦'
      case 'research':
        return '🔬'
      case 'page':
        return '📄'
      case 'user':
        return '👤'
      case 'contact':
        return '📧'
      case 'application':
        return '💼'
      case 'feature':
        return '⚙️'
      default:
        return '📋'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'research':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'page':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'user':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'contact':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
      case 'application':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'feature':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const totalPages = searchResults
    ? Math.ceil((searchResults.total || searchResults.results.length) / pageSize)
    : 0

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* 页面头部 */}
        <div className='mb-8'>
          <div className='mb-4 flex items-center gap-4'>
            <Link
              href='/admin/dashboard'
              className='flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            >
              <ArrowLeft className='h-4 w-4' />
              返回仪表板
            </Link>
          </div>

          <div className='flex items-center gap-3'>
            <Search className='h-8 w-8 text-blue-600 dark:text-blue-400' />
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>搜索结果</h1>
              {searchQuery && (
                <p className='text-gray-600 dark:text-gray-400'>搜索关键词: "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>

        {/* 搜索框 */}
        <div className='mb-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <input
              type='search'
              placeholder='搜索内容、功能、用户...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    const params = new URLSearchParams()
                    params.set('q', searchQuery.trim())
                    params.set('type', 'all')
                    params.set('page', '1')
                    router.push(`/admin/search?${params.toString()}`)
                  }
                }
              }}
              className='w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400'
            />
          </div>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='flex items-center gap-3'>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
              <span className='text-gray-600 dark:text-gray-400'>搜索中...</span>
            </div>
          </div>
        ) : searchResults ? (
          <>
            {/* 搜索统计和筛选 */}
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-4'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  找到{' '}
                  <span className='font-medium text-gray-900 dark:text-white'>
                    {searchResults.results.length}
                  </span>{' '}
                  条结果
                </p>

                {/* 分类筛选 */}
                {searchResults.categories?.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => handleTypeFilter('all')}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedType === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      全部
                    </button>
                    {searchResults.categories.map(cat => (
                      <button
                        key={cat.type}
                        onClick={() => handleTypeFilter(cat.type)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          selectedType === cat.type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {cat.name} ({cat.count})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 搜索结果列表 */}
            {searchResults.results?.length > 0 ? (
              <div className='space-y-4'>
                {searchResults.results.map(result => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
                  >
                    <div className='flex items-start gap-4'>
                      <span className='text-2xl'>{getResultIcon(result.type)}</span>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex-1'>
                            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                              {result.title}
                            </h3>
                            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                              {result.description}
                            </p>
                          </div>
                          <Link
                            href={result.url}
                            className='flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                          >
                            查看
                            <ExternalLink className='h-3 w-3' />
                          </Link>
                        </div>

                        <div className='mt-3 flex items-center gap-3'>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(result.type)}`}
                          >
                            {result.category}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            更新时间: {new Date(result.updatedAt).toLocaleString('zh-CN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='py-12 text-center'>
                <Search className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
                <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>
                  没有找到相关结果
                </h3>
                <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                  尝试使用不同的关键词或查看下方建议
                </p>

                {searchResults.suggestions?.length > 0 && (
                  <div className='mt-6'>
                    <p className='mb-3 text-sm font-medium text-gray-900 dark:text-white'>
                      搜索建议:
                    </p>
                    <div className='flex flex-wrap justify-center gap-2'>
                      {searchResults.suggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            const params = new URLSearchParams()
                            params.set('q', suggestion)
                            params.set('type', 'all')
                            params.set('page', '1')
                            router.push(`/admin/search?${params.toString()}`)
                          }}
                          className='rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40'
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className='mt-8 flex items-center justify-center gap-2'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  上一页
                </button>

                <div className='flex gap-1'>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  下一页
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='py-12 text-center'>
            <Search className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
            <h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-white'>开始搜索</h3>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
              在上方输入关键词开始搜索内容、功能或用户
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
