'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/ui/container'
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all'

    if (query) {
      setSearchQuery(query)
      setSelectedType(type)
      handleSearch(query, type)
    }
  }, [searchParams])

  const handleSearch = async (query: string, type: string = 'all') => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}&limit=20`
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('q', searchQuery.trim())
      params.set('type', selectedType)
      router.push(`/search?${params.toString()}`)
    }
  }

  const typeFilters = [
    { value: 'all', label: '全部' },
    { value: 'products', label: '产品' },
    { value: 'solutions', label: '解决方案' },
    { value: 'services', label: '服务' },
    { value: 'research', label: '研究' },
    { value: 'news', label: '动态' },
  ]

  return (
    <div className='min-h-screen bg-gray-50 pt-20'>
      <Container>
        <div className='py-8'>
          {/* 返回按钮 */}
          <div className='mb-6'>
            <Button
              variant='ghost'
              onClick={() => router.back()}
              className='text-gray-600 hover:text-gray-900'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
          </div>

          {/* 页面标题 */}
          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold text-gray-900'>搜索结果</h1>
            {searchQuery && (
              <p className='text-gray-600'>
                搜索关键词: "{searchQuery}"
                {searchResults && <span className='ml-2'>找到 {searchResults.total} 个结果</span>}
              </p>
            )}
          </div>

          {/* 搜索框 */}
          <form onSubmit={handleSearchSubmit} className='mb-8'>
            <div className='flex gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <Input
                  type='text'
                  placeholder='搜索产品、解决方案、服务、研究...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='py-3 pl-10 text-base'
                />
              </div>
              <Button type='submit' disabled={loading}>
                {loading ? '搜索中...' : '搜索'}
              </Button>
            </div>
          </form>

          {/* 类型筛选 */}
          <div className='mb-8'>
            <div className='flex flex-wrap gap-2'>
              {typeFilters.map(filter => (
                <Button
                  key={filter.value}
                  variant={selectedType === filter.value ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => {
                    setSelectedType(filter.value)
                    if (searchQuery.trim()) {
                      const params = new URLSearchParams()
                      params.set('q', searchQuery.trim())
                      params.set('type', filter.value)
                      router.push(`/search?${params.toString()}`)
                    }
                  }}
                >
                  <Filter className='mr-2 h-4 w-4' />
                  {filter.label}
                  {searchResults?.categories.find(c => c.type === filter.value)?.count && (
                    <span className='ml-1 text-xs'>
                      ({searchResults.categories.find(c => c.type === filter.value)?.count})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* 搜索结果 */}
          {loading && (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                <p className='text-gray-600'>搜索中...</p>
              </div>
            </div>
          )}

          {!loading && searchQuery && !searchResults?.results.length && (
            <div className='py-12 text-center'>
              <div className='mb-2 text-lg text-gray-500'>未找到相关结果</div>
              <p className='text-gray-400'>尝试使用不同的关键词或查看下方的搜索建议</p>
            </div>
          )}

          {!loading && searchResults && searchResults.results.length > 0 && (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {searchResults.results.map(result => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  className='block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'
                >
                  {result.imageUrl && (
                    <div className='mb-4 h-32 w-full overflow-hidden rounded-lg'>
                      <Image
                        src={result.imageUrl}
                        alt={result.title}
                        width={300}
                        height={200}
                        className='h-full w-full object-cover'
                      />
                    </div>
                  )}
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700'>
                        {getTypeLabel(result.type)}
                      </span>
                      <span className='text-xs text-gray-500'>{result.category}</span>
                    </div>
                    <h3 className='line-clamp-2 font-semibold text-gray-900'>{result.title}</h3>
                    <p className='line-clamp-3 text-sm text-gray-600'>{result.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 搜索建议 */}
          {!loading && searchResults?.suggestions && searchResults.suggestions.length > 0 && (
            <div className='mt-12 rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>搜索建议</h3>
              <div className='flex flex-wrap gap-2'>
                {searchResults?.suggestions?.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion)
                      const params = new URLSearchParams()
                      params.set('q', suggestion)
                      params.set('type', selectedType)
                      router.push(`/search?${params.toString()}`)
                    }}
                    className='rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
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
