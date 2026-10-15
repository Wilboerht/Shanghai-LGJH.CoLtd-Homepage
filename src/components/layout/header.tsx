'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavigation } from '@/data/navigation'
import { getLogoConfig } from '@/data/logo-config'
import { GlobalSearch } from '@/components/ui/global-search'

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const logoConfig = getLogoConfig()
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveDropdown(itemName)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 300) // 300ms 延迟，给用户足够时间移动鼠标到下拉菜单
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <header className='pointer-events-none fixed left-0 right-0 top-0 z-50 w-full pb-2 pt-4'>
      <div className='liquid-glass pointer-events-auto relative mx-auto flex h-16 w-4/5 items-center rounded-xl px-6'>
        {/* Logo区域 - 绝对定位到左侧 */}
        <div className='absolute left-6 flex items-center space-x-2'>
          <Link href='/' className='flex items-center space-x-3'>
            {/* 主副Logo相邻摆放 */}
            <div className='flex items-center space-x-2'>
              {logoConfig.primaryLogoUrl && (
                <Image
                  src={logoConfig.primaryLogoUrl}
                  alt={logoConfig.primaryLogoAlt}
                  width={logoConfig.primaryLogoWidth}
                  height={logoConfig.primaryLogoHeight}
                  className='object-contain'
                  priority
                />
              )}
              {logoConfig.secondaryLogoUrl && (
                <Image
                  src={logoConfig.secondaryLogoUrl}
                  alt={logoConfig.secondaryLogoAlt}
                  width={logoConfig.secondaryLogoWidth}
                  height={logoConfig.secondaryLogoHeight}
                  className='object-contain'
                  priority
                />
              )}
            </div>
            {/* 公司名称 */}
            <span className='hidden text-lg font-bold sm:inline-block'>临港景鸿</span>
          </Link>
        </div>

        {/* 导航菜单 - 绝对居中 */}
        <nav className='absolute left-1/2 hidden -translate-x-1/2 transform items-center space-x-6 text-base font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)] md:flex'>
          {mainNavigation.map(item => (
            <div key={item.name} className='relative'>
              {item.children ? (
                <div
                  className='relative'
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href || '#'}
                    className='flex cursor-pointer items-center space-x-1 text-foreground/60 transition-colors hover:text-foreground/80'
                  >
                    <span>{item.name}</span>
                    <ChevronDown className='h-3 w-3' />
                  </Link>
                  {/* 透明的桥接区域，防止鼠标移动时下拉菜单消失 */}
                  <div
                    className={`absolute left-1/2 top-full z-40 h-2 w-64 -translate-x-1/2 transform ${activeDropdown === item.name ? 'block' : 'hidden'}`}
                  ></div>
                  <div
                    className={`dropdown-glass dark:dropdown-glass-dark absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 transform overflow-hidden rounded-xl p-2 transition-all duration-200 ${activeDropdown === item.name ? 'block translate-y-0 opacity-100' : 'hidden -translate-y-2 opacity-0'}`}
                  >
                    {item.children.map(child => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className='dropdown-item-glass dark:dropdown-item-glass-dark group/item flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300'
                      >
                        {child.icon && (
                          <child.icon className='h-5 w-5 text-gray-600 transition-colors group-hover/item:text-blue-600 dark:text-gray-300 dark:group-hover/item:text-blue-400' />
                        )}
                        <div className='flex-1'>
                          <div className='font-medium'>{child.name}</div>
                          {child.description && (
                            <div className='mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                              {child.description}
                            </div>
                          )}
                        </div>
                        <div className='opacity-0 transition-opacity group-hover/item:opacity-100'>
                          <svg
                            className='h-4 w-4 text-blue-500'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5l7 7-7 7'
                            />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href || '#'}
                  className='cursor-pointer text-foreground/60 transition-colors hover:text-foreground/80'
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* 搜索按钮 - 绝对定位到右侧 */}
        <div className='absolute right-6 flex items-center space-x-3'>
          <Button
            variant='ghost'
            size='sm'
            className='hidden h-9 w-9 p-0 text-foreground/60 transition-colors hover:bg-background/80 hover:text-foreground/80 md:flex'
            onClick={() => setSearchOpen(true)}
          >
            <Search className='h-4 w-4' />
            <span className='sr-only'>搜索</span>
          </Button>

          {/* 移动端菜单按钮 */}
          <Button
            variant='ghost'
            className='px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>切换菜单</span>
          </Button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {isOpen && (
        <div className='fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] w-full animate-slide-down grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md md:hidden'>
          <div className='mobile-glass-menu dark:mobile-glass-menu-dark relative z-20 grid gap-6 rounded-md p-4 text-popover-foreground'>
            {/* 移动端搜索 */}
            <div className='border-b border-border pb-4'>
              <Button
                variant='outline'
                className='w-full justify-start text-left font-normal'
                onClick={() => {
                  setIsOpen(false)
                  setSearchOpen(true)
                }}
              >
                <Search className='mr-2 h-4 w-4' />
                搜索...
              </Button>
            </div>

            <nav className='grid grid-flow-row auto-rows-max text-base'>
              {mainNavigation.map(item => (
                <div key={item.name} className='space-y-2'>
                  {item.children ? (
                    <div>
                      <Link
                        href={item.href || '#'}
                        className='flex w-full cursor-pointer items-center rounded-md p-2 text-base font-medium text-foreground/80 hover:text-foreground hover:underline'
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <item.icon className='mr-2 h-4 w-4' />}
                        {item.name}
                      </Link>
                      <div className='ml-2 mt-2 space-y-1 border-l-2 border-blue-100 pl-4'>
                        {item.children.map(child => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className='flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-foreground/70 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700'
                            onClick={() => setIsOpen(false)}
                          >
                            {child.icon && (
                              <child.icon className='h-5 w-5 text-gray-800 transition-colors hover:text-black' />
                            )}
                            <div className='flex-1'>
                              <div className='font-medium'>{child.name}</div>
                              {child.description && (
                                <div className='mt-0.5 line-clamp-1 text-xs text-gray-500'>
                                  {child.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className='flex w-full items-center rounded-md p-2 text-base font-medium hover:underline'
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon && <item.icon className='mr-2 h-4 w-4' />}
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* 全局搜索弹窗 */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
