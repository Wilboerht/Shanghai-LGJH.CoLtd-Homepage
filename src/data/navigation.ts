/**
 * 导航栏数据结构
 * 根据开发计划文档定义的新导航结构
 */

import { LucideIcon } from 'lucide-react'
import {
  Home,
  Package,
  Lightbulb,
  Settings,
  Search,
  Heart,
  Phone,
  Building2,
  Cpu,
  Shield,
  Users,
  Factory,
  Truck,
  Activity,
  ShoppingBag,
  GraduationCap,
  Award,
  Handshake,
  Newspaper,
  Flame,
  Grid3X3,
  Wrench,
  Zap,
} from 'lucide-react'

export interface NavigationItem {
  name: string
  href: string
  icon?: LucideIcon
  description?: string
  children?: NavigationSubItem[]
}

export interface NavigationSubItem {
  name: string
  href: string
  icon?: LucideIcon
  description?: string
  badge?: string
}

// 主导航结构
export const mainNavigation: NavigationItem[] = [
  {
    name: '首页',
    href: '/',
    icon: Home,
    description: '返回首页',
  },
  {
    name: '产品',
    href: '/products',
    icon: Package,
    description: '智能化产品与解决方案',
    children: [
      {
        name: '智能数字化产品',
        href: '/products?category=intelligent-digital',
        icon: Cpu,
        description: '核心数字化产品',
      },
      {
        name: 'AI智能平台',
        href: '/products?category=ai-platform',
        icon: Lightbulb,
        description: 'AI驱动的设计产品',
      },
      {
        name: '智能医疗',
        href: '/products?category=smart-medical',
        icon: Activity,
        description: '医疗健康智能产品',
      },
      {
        name: '智慧养老',
        href: '/products?category=smart-elderly-care',
        icon: Heart,
        description: '养老服务智能产品',
      },
      {
        name: '新能源',
        href: '/products?category=new-energy',
        icon: Zap,
        description: '新能源相关产品',
      },
      {
        name: '其他产品',
        href: '/products?category=other-products',
        icon: Package,
        description: '其他创新产品',
      },
    ],
  },
  {
    name: '解决方案',
    href: '/solutions',
    icon: Lightbulb,
    description: '行业解决方案',
    children: [
      {
        name: '园区管理',
        href: '/solutions?category=park-management',
        icon: Building2,
        description: '智慧园区管理解决方案',
      },
      {
        name: '社区管理',
        href: '/solutions?category=community-management',
        icon: Users,
        description: '智慧社区管理系统',
      },
      {
        name: '公共交通',
        href: '/solutions?category=public-transport',
        icon: Truck,
        description: '公共交通智能化方案',
      },
      {
        name: '工业制造',
        href: '/solutions?category=industrial-manufacturing',
        icon: Factory,
        description: '工业4.0智能制造方案',
      },
      {
        name: '物流运输',
        href: '/solutions?category=logistics-transport',
        icon: Truck,
        description: '智能物流运输系统',
      },
      {
        name: '大健康',
        href: '/solutions?category=healthcare',
        icon: Activity,
        description: '健康医疗智能化方案',
      },
      {
        name: '商业综合体',
        href: '/solutions?category=commercial-complex',
        icon: ShoppingBag,
        description: '商业综合体智能管理',
      },
      {
        name: '其他方案',
        href: '/solutions?category=others',
        icon: Grid3X3,
        description: '创新解决方案和定制化服务',
      },
    ],
  },
  {
    name: '服务',
    href: '/services',
    icon: Settings,
    description: '专业服务介绍',
    children: [
      {
        name: '数字化转型',
        href: '/services/digital-transformation',
        icon: Cpu,
        description: '企业数字化转型服务',
      },
      {
        name: '智能运维服务',
        href: '/services/intelligent-operation',
        icon: Settings,
        description: '智能化运维管理服务',
      },
      {
        name: '智能化工程',
        href: '/services/intelligent-engineering',
        icon: Wrench,
        description: '智能化系统工程实施',
      },
      {
        name: '消防工程',
        href: '/services/fire-engineering',
        icon: Flame,
        description: '专业消防安全工程服务',
      },
      {
        name: '风险检测与评估',
        href: '/services/risk-assessment',
        icon: Shield,
        description: '安全风险评估服务',
      },
      {
        name: '其他服务',
        href: '/services/other-services',
        icon: Grid3X3,
        description: '定制化服务和专业支持',
      },
    ],
  },
  {
    name: '研究',
    href: '/research',
    icon: Search,
    description: '技术研究和创新',
    children: [
      {
        name: 'AI研究与应用',
        href: '/research/ai-research',
        icon: Lightbulb,
        description: '人工智能技术研发和应用',
      },
      {
        name: '技术创新',
        href: '/research/innovation',
        icon: Search,
        description: '前沿技术研究',
      },
      {
        name: '研发成果',
        href: '/research/achievements',
        icon: Package,
        description: '研发成果展示',
      },
      {
        name: '技术论文',
        href: '/research/papers',
        icon: Search,
        description: '技术论文发表',
      },
    ],
  },
  {
    name: '使命责任',
    href: '/mission',
    icon: Heart,
    description: '企业文化和社会责任',
    children: [
      {
        name: '产教融合',
        href: '/mission/education-integration',
        icon: GraduationCap,
        description: '产学研合作与人才培养',
      },
      {
        name: '荣誉活动',
        href: '/mission/honors-activities',
        icon: Award,
        description: '企业荣誉与活动展示',
      },
      {
        name: '公司动态',
        href: '/mission/company-news',
        icon: Newspaper,
        description: '公司最新动态和新闻',
      },
      {
        name: '加入我们',
        href: '/careers',
        icon: Users,
        description: '企业招聘信息',
      },
    ],
  },
  {
    name: '联系我们',
    href: '/contact',
    icon: Phone,
    description: '联系方式和咨询',
  },
]

// 移动端简化导航（用于小屏幕）
export const mobileNavigation: NavigationItem[] = [
  {
    name: '首页',
    href: '/',
    icon: Home,
  },
  {
    name: '产品',
    href: '/products',
    icon: Package,
  },
  {
    name: '解决方案',
    href: '/solutions',
    icon: Lightbulb,
  },
  {
    name: '服务',
    href: '/services',
    icon: Settings,
  },
  {
    name: '研究',
    href: '/research',
    icon: Search,
  },
  {
    name: '使命责任',
    href: '/mission',
    icon: Heart,
  },
  {
    name: '联系我们',
    href: '/contact',
    icon: Phone,
  },
]

// 中等屏幕导航（用于平板等中等屏幕）
export const mediumNavigation: NavigationItem[] = [
  {
    name: '首页',
    href: '/',
    icon: Home,
  },
  {
    name: '产品',
    href: '/products',
    icon: Package,
  },
  {
    name: '解决方案',
    href: '/solutions',
    icon: Lightbulb,
  },
  {
    name: '服务',
    href: '/services',
    icon: Settings,
  },
  {
    name: '联系我们',
    href: '/contact',
    icon: Phone,
  },
]

// 页脚导航
export const footerNavigation = {
  products: {
    title: '产品',
    items: [
      { name: '智能数字化产品', href: '/products?category=intelligent-digital' },
      { name: 'AI智能平台', href: '/products?category=ai-platform' },
      { name: '智能医疗', href: '/products?category=smart-medical' },
      { name: '智慧养老', href: '/products?category=smart-elderly-care' },
      { name: '新能源', href: '/products?category=new-energy' },
      { name: '其他产品', href: '/products?category=other-products' },
    ],
  },
  solutions: {
    title: '解决方案',
    items: [
      { name: '园区管理', href: '/solutions?category=park-management' },
      { name: '社区管理', href: '/solutions?category=community-management' },
      { name: '公共交通', href: '/solutions?category=public-transport' },
      { name: '工业制造', href: '/solutions?category=industrial-manufacturing' },
      { name: '物流运输', href: '/solutions?category=logistics-transport' },
      { name: '大健康', href: '/solutions?category=healthcare' },
      { name: '商业综合体', href: '/solutions?category=commercial-complex' },
      { name: '其他方案', href: '/solutions?category=others' },
    ],
  },
  services: {
    title: '服务',
    items: [
      { name: '数字化转型', href: '/services/digital-transformation' },
      { name: '智能运维服务', href: '/services/intelligent-operation' },
      { name: '智能化工程', href: '/services/intelligent-engineering' },
      { name: '消防工程', href: '/services/fire-engineering' },
      { name: '风险检测与评估', href: '/services/risk-assessment' },
      { name: '其他服务', href: '/services/other-services' },
    ],
  },
  company: {
    title: '公司',
    items: [
      { name: '使命责任', href: '/mission' },
      { name: '技术研究', href: '/research' },
      { name: '联系我们', href: '/contact' },
    ],
  },
}

// 面包屑导航辅助函数
export function getBreadcrumbs(pathname: string): Array<{ name: string; href: string }> {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ name: '首页', href: '/' }]

  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`

    // 查找对应的导航项
    const navItem = findNavigationItem(currentPath)
    if (navItem) {
      breadcrumbs.push({
        name: navItem.name,
        href: currentPath,
      })
    }
  }

  return breadcrumbs
}

// 查找导航项辅助函数
function findNavigationItem(href: string): NavigationItem | NavigationSubItem | null {
  for (const item of mainNavigation) {
    if (item.href === href) {
      return item
    }

    if (item.children) {
      for (const child of item.children) {
        if (child.href === href) {
          return child
        }
      }
    }
  }

  return null
}
