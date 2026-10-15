'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { solutionCategories, SolutionCategory } from '@/data/solutions'
import { cn } from '@/lib/utils'

interface SolutionCategoryNavProps {
  variant?: 'tabs' | 'pills' | 'sidebar' | 'breadcrumb'
  orientation?: 'horizontal' | 'vertical'
  showIcons?: boolean
  showCounts?: boolean
  className?: string
  activeCategory?: string
  onCategoryChange?: (categoryId: string) => void
}

export function SolutionCategoryNav({
  variant = 'tabs',
  orientation = 'horizontal',
  showIcons = true,
  showCounts = true,
  className,
  activeCategory,
  onCategoryChange,
}: SolutionCategoryNavProps) {
  const pathname = usePathname()

  // 如果没有提供activeCategory，从路径中推断
  const currentCategory =
    activeCategory ||
    React.useMemo(() => {
      if (pathname.startsWith('/solutions/')) {
        const segments = pathname.split('/')
        if (segments.length >= 3) {
          return segments[2]
        }
      }
      return 'all'
    }, [pathname, activeCategory])

  const categories = [
    {
      id: 'all',
      name: '全部方案',
      description: '查看所有解决方案',
      icon: null,
      gradient: 'from-gray-600 to-slate-600',
      solutions: solutionCategories.flatMap(cat => cat.solutions),
    },
    ...solutionCategories,
  ]

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange?.(categoryId)
  }

  const getNavClasses = () => {
    const baseClasses = 'flex'

    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          orientation === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2'
        )
      case 'sidebar':
        return 'flex flex-col space-y-1'
      case 'breadcrumb':
        return 'flex flex-row items-center space-x-2'
      case 'tabs':
      default:
        return cn(
          baseClasses,
          orientation === 'horizontal'
            ? 'flex-row border-b border-gray-200 dark:border-gray-700'
            : 'flex-col border-r border-gray-200 dark:border-gray-700'
        )
    }
  }

  const getItemClasses = (
    category: SolutionCategory | (typeof categories)[0],
    isActive: boolean
  ) => {
    const baseClasses = 'transition-all duration-200 font-medium'

    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          'px-4 py-2 rounded-full text-sm',
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        )
      case 'sidebar':
        return cn(
          baseClasses,
          'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm',
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        )
      case 'breadcrumb':
        return cn(
          baseClasses,
          'text-sm',
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        )
      case 'tabs':
      default:
        return cn(
          baseClasses,
          orientation === 'horizontal'
            ? 'px-4 py-3 border-b-2 text-sm'
            : 'px-4 py-3 border-r-2 text-sm',
          isActive
            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
        )
    }
  }

  const renderCategoryItem = (
    category: SolutionCategory | (typeof categories)[0],
    index: number
  ) => {
    const isActive = currentCategory === category.id
    const Icon = category.icon
    const itemClasses = getItemClasses(category, isActive)

    const content = (
      <>
        {showIcons && Icon && (
          <Icon
            className={cn(
              'flex-shrink-0',
              variant === 'sidebar' ? 'h-5 w-5' : 'h-4 w-4',
              variant === 'breadcrumb' && 'mr-1'
            )}
          />
        )}
        <span className={variant === 'sidebar' ? 'flex-1' : ''}>{category.name}</span>
        {showCounts && (
          <span
            className={cn(
              'text-xs',
              variant === 'pills' ? 'ml-2 opacity-75' : 'ml-1 opacity-60',
              variant === 'sidebar' && 'rounded-full bg-gray-200 px-2 py-0.5 dark:bg-gray-600'
            )}
          >
            {category.solutions.length}
          </span>
        )}
      </>
    )

    if (onCategoryChange) {
      return (
        <motion.button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={itemClasses}
          whileHover={{ scale: variant === 'pills' ? 1.05 : 1 }}
          whileTap={{ scale: variant === 'pills' ? 0.95 : 1 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {content}
        </motion.button>
      )
    }

    const href = category.id === 'all' ? '/solutions' : `/solutions?category=${category.id}`

    return (
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Link href={href} className={itemClasses}>
          {content}
        </Link>
        {variant === 'breadcrumb' && index < categories.length - 1 && (
          <span className='text-gray-400 dark:text-gray-500'>/</span>
        )}
      </motion.div>
    )
  }

  return (
    <nav className={cn(getNavClasses(), className)}>
      {categories.map((category, index) => renderCategoryItem(category, index))}
    </nav>
  )
}

// 预设的导航变体
export function TabsSolutionCategoryNav({
  className,
  ...props
}: Omit<SolutionCategoryNavProps, 'variant'>) {
  return <SolutionCategoryNav variant='tabs' className={className} {...props} />
}

export function PillsSolutionCategoryNav({
  className,
  ...props
}: Omit<SolutionCategoryNavProps, 'variant'>) {
  return <SolutionCategoryNav variant='pills' className={className} {...props} />
}

export function SidebarSolutionCategoryNav({
  className,
  ...props
}: Omit<SolutionCategoryNavProps, 'variant'>) {
  return (
    <SolutionCategoryNav
      variant='sidebar'
      orientation='vertical'
      className={className}
      {...props}
    />
  )
}

export function BreadcrumbSolutionCategoryNav({
  className,
  ...props
}: Omit<SolutionCategoryNavProps, 'variant'>) {
  return (
    <SolutionCategoryNav variant='breadcrumb' showCounts={false} className={className} {...props} />
  )
}
