'use client'

import React, { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Mail,
  Briefcase,
  FileText,
  Package,
  Lightbulb,
  Wrench,
  Users,
  Settings,
  Image,
  Menu,
  BarChart3,
  Globe,
  MapPin,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: '仪表板',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: '系统概览和统计',
  },
  {
    name: '表单管理',
    icon: Mail,
    children: [
      { name: '联系表单', href: '/admin/forms/contacts', description: '查看和管理联系表单' },
    ],
  },
  {
    name: '招聘管理',
    icon: Briefcase,
    children: [
      {
        name: '职位管理',
        href: '/admin/careers/positions',
        description: '发布、编辑和管理招聘职位',
      },
      { name: '申请管理', href: '/admin/careers/applications', description: '查看和处理求职申请' },
      {
        name: '人才储备库',
        href: '/admin/careers/talent-pool',
        description: '管理人才储备和候选人信息',
      },
      { name: '招聘数据', href: '/admin/careers/analytics', description: '招聘效果统计和数据分析' },
    ],
  },
  {
    name: '内容管理',
    icon: FileText,
    children: [
      { name: '首页管理', href: '/admin/content/homepage', description: '管理首页内容和展示' },
      { name: '产品管理', href: '/admin/content/products', description: '管理产品信息和分类' },
      { name: '解决方案', href: '/admin/content/solutions', description: '管理解决方案' },
      { name: '研究管理', href: '/admin/content/research', description: '管理技术研究内容' },
      {
        name: '服务管理',
        href: '/admin/content/services',
        description: '统一管理所有服务内容、客户案例和合作伙伴',
      },
      {
        name: '产教融合',
        href: '/admin/content/mission/education-integration',
        description: '管理产教融合内容',
      },
      {
        name: '荣誉活动',
        href: '/admin/content/mission/honors-activities',
        description: '管理荣誉奖项和社会活动',
      },
      { name: '公司动态', href: '/admin/content/company-news', description: '管理公司新闻动态' },
    ],
  },

  {
    name: '统计报表',
    href: '/admin/analytics',
    icon: BarChart3,
    description: '查看数据统计',
  },
  {
    name: '用户管理',
    href: '/admin/users',
    icon: Users,
    description: '管理管理员账户',
  },
  {
    name: '地址管理',
    href: '/admin/locations',
    icon: MapPin,
    description: '管理公司多个地址',
  },
  {
    name: '系统设置',
    href: '/admin/settings',
    icon: Settings,
    description: '网站配置和设置',
  },
]

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>(() => {
    // 默认展开包含当前路径的菜单
    const expanded: string[] = []
    navigation.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => pathname.startsWith(child.href))
        if (hasActiveChild) {
          expanded.push(item.name)
        }
      }
    })
    return expanded
  })

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName) ? prev.filter(name => name !== menuName) : [...prev, menuName]
    )
  }

  return (
    <>
      {/* 桌面端侧边栏 */}
      <div className='hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-16 lg:z-40 lg:flex lg:w-64 lg:flex-col'>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 pt-6 shadow-xl dark:bg-gray-800'>
          {/* 导航菜单 */}
          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
              <li>
                <ul role='list' className='-mx-2 space-y-1'>
                  {navigation.map(item => (
                    <li key={item.name}>
                      {!item.children ? (
                        <Link
                          href={item.href!}
                          className={cn(
                            pathname === item.href
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-300',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors'
                          )}
                        >
                          <item.icon
                            className={cn(
                              pathname === item.href
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-gray-400 group-hover:text-blue-700 dark:text-gray-500 dark:group-hover:text-blue-300',
                              'h-5 w-5 shrink-0'
                            )}
                          />
                          {item.name}
                        </Link>
                      ) : (
                        <div>
                          <button
                            type='button'
                            onClick={() => toggleMenu(item.name)}
                            className='flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-300'
                          >
                            <item.icon className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500' />
                            <span className='flex-1 text-left'>{item.name}</span>
                            {expandedMenus.includes(item.name) ? (
                              <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                            ) : (
                              <ChevronRight className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                            )}
                          </button>
                          {expandedMenus.includes(item.name) && (
                            <ul className='mt-1 px-2'>
                              {item.children.map(subItem => (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      pathname === subItem.href
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-300',
                                      'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 transition-colors'
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      <div
        className={cn(
          'fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 pt-4 shadow-xl dark:bg-gray-800'>
          {/* 移动端头部 - 只保留关闭按钮 */}
          <div className='flex h-12 shrink-0 items-center justify-end border-b border-gray-200 dark:border-gray-700'>
            <button
              type='button'
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              aria-label='关闭菜单'
            >
              <Menu className='h-6 w-6' />
            </button>
          </div>

          {/* 移动端导航菜单 */}
          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col gap-y-7'>
              <li>
                <ul role='list' className='-mx-2 space-y-1'>
                  {navigation.map(item => (
                    <li key={item.name}>
                      {!item.children ? (
                        <Link
                          href={item.href!}
                          onClick={onClose}
                          className={cn(
                            pathname === item.href
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-300',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors'
                          )}
                        >
                          <item.icon className='h-5 w-5 shrink-0' />
                          {item.name}
                        </Link>
                      ) : (
                        <div>
                          <button
                            type='button'
                            onClick={() => toggleMenu(item.name)}
                            className='flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-gray-700 transition-colors hover:bg-gray-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-300'
                          >
                            <item.icon className='h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500' />
                            <span className='flex-1 text-left'>{item.name}</span>
                            {expandedMenus.includes(item.name) ? (
                              <ChevronDown className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                            ) : (
                              <ChevronRight className='h-4 w-4 text-gray-400 dark:text-gray-500' />
                            )}
                          </button>
                          {expandedMenus.includes(item.name) && (
                            <ul className='mt-1 px-2'>
                              {item.children.map(subItem => (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    onClick={onClose}
                                    className={cn(
                                      pathname === subItem.href
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-300',
                                      'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 transition-colors'
                                    )}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
