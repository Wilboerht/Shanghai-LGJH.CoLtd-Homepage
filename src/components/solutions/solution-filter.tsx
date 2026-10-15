'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Filter, Search, X, Grid3X3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// 解决方案接口定义
interface Solution {
  id: string
  title: string
  subtitle: string
  description: string
  content?: string // 新增富文本内容字段
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
import { cn } from '@/lib/utils'

interface SolutionFilterProps {
  solutions: Solution[]
  onFilterChange: (filteredSolutions: Solution[]) => void
  onViewModeChange?: (viewMode: 'grid' | 'list') => void
  showViewToggle?: boolean
  className?: string
}

export function SolutionFilter({
  solutions,
  onFilterChange,
  onViewModeChange,
  showViewToggle = false,
  className,
}: SolutionFilterProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  // 从解决方案数据中动态获取分类
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, number>()

    solutions.forEach(solution => {
      const count = categoryMap.get(solution.category) || 0
      categoryMap.set(solution.category, count + 1)
    })

    return [
      { id: 'all', name: '全部', count: solutions.length },
      ...Array.from(categoryMap.entries()).map(([category, count]) => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        count,
      })),
    ]
  }, [solutions])

  // 过滤解决方案
  const filterSolutions = React.useCallback(() => {
    let filtered = solutions

    // 按分类过滤
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.name
      filtered = categoryName
        ? solutions.filter(solution => solution.category === categoryName)
        : []
    }

    // 按搜索关键词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        solution =>
          solution.title.toLowerCase().includes(query) ||
          solution.description.toLowerCase().includes(query) ||
          solution.features.some(feature => feature.toLowerCase().includes(query)) ||
          solution.applications.some(app => app.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [solutions, selectedCategory, searchQuery, categories])

  // 当过滤条件改变时更新结果
  React.useEffect(() => {
    const filtered = filterSolutions()
    onFilterChange(filtered)
  }, [filterSolutions, onFilterChange])

  // 处理分类选择
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  // 处理搜索
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('')
  }

  // 处理视图模式切换
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    onViewModeChange?.(mode)
  }

  return (
    <motion.div
      className={cn('space-y-6', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 搜索框 */}
      <div className='relative max-w-md'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <Input
          type='text'
          placeholder='搜索解决方案...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='pl-10 pr-10'
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className='absolute inset-y-0 right-0 flex items-center pr-3'
          >
            <X className='h-5 w-5 text-gray-400 transition-colors hover:text-gray-600' />
          </button>
        )}
      </div>

      {/* 过滤器和视图切换 */}
      <div className='flex flex-col items-start justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0'>
        {/* 分类过滤器 */}
        <div className='flex w-full flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0 lg:w-auto'>
          <div className='flex items-center space-x-2'>
            <Filter className='h-5 w-5 text-gray-500' />
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>分类筛选：</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size='sm'
                onClick={() => handleCategoryChange(category.id)}
                className='text-xs md:text-sm'
              >
                {category.name}
                <span className='ml-1 text-xs opacity-70'>({category.count})</span>
              </Button>
            ))}
          </div>
        </div>

        {/* 视图切换 */}
        {showViewToggle && (
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>视图：</span>
            <div className='flex items-center space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => handleViewModeChange('grid')}
                className='h-8 w-8 p-0'
              >
                <Grid3X3 className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size='sm'
                onClick={() => handleViewModeChange('list')}
                className='h-8 w-8 p-0'
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 活动过滤器显示 */}
      {(selectedCategory !== 'all' || searchQuery) && (
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-gray-600 dark:text-gray-400'>活动过滤器：</span>

          {selectedCategory !== 'all' && (
            <div className='flex items-center space-x-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-300'>
              <span>分类: {categories.find(cat => cat.id === selectedCategory)?.name}</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className='ml-1 hover:text-blue-900 dark:hover:text-blue-100'
              >
                <X className='h-3 w-3' />
              </button>
            </div>
          )}

          {searchQuery && (
            <div className='flex items-center space-x-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900 dark:text-green-300'>
              <span>搜索: "{searchQuery}"</span>
              <button
                onClick={clearSearch}
                className='ml-1 hover:text-green-900 dark:hover:text-green-100'
              >
                <X className='h-3 w-3' />
              </button>
            </div>
          )}

          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}
            className='text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          >
            清除所有
          </Button>
        </div>
      )}
    </motion.div>
  )
}

// 简化版过滤器
export function SimpleSolutionFilter({
  solutions,
  onFilterChange,
  className,
}: Omit<SolutionFilterProps, 'onViewModeChange' | 'showViewToggle'>) {
  return (
    <SolutionFilter
      solutions={solutions}
      onFilterChange={onFilterChange}
      showViewToggle={false}
      className={className}
    />
  )
}
