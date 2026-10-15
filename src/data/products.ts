/**
 * Products页面6大分类数据结构
 * 根据开发计划文档定义的产品分类
 */

import { LucideIcon } from 'lucide-react'
import {
  Cpu,
  Lightbulb,
  Activity,
  Heart,
  Zap,
  Package,
  Shield,
  Camera,
  Wifi,
  Settings,
  Monitor,
  Database,
  Brain,
  Smartphone,
} from 'lucide-react'

export interface Product {
  id: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  image: string
  category: string
  features: string[]
  specifications: Array<{
    name: string
    value: string
  }>
  applications: string[]
  benefits: string[]
  gradient: string
  accentColor: string
  slug: string
  status: 'available' | 'coming-soon' | 'discontinued'
  tags: string[]
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
  gradient: string
  products: Product[]
}

// 6大产品分类
export const productCategories: ProductCategory[] = [
  {
    id: 'intelligent-digital',
    name: '智能数字化产品',
    description: '核心数字化产品',
    icon: Cpu,
    gradient: 'from-blue-600 to-cyan-600',
    products: [
      {
        id: 'integrated-management-platform',
        title: '综合管理集成平台',
        subtitle: 'Integrated Management Platform',
        description:
          '统一的智能化管理平台，集成安防、消防、能耗、设备等多个子系统，实现统一监控和管理。',
        icon: Monitor,
        image: '/images/products/integrated-platform.jpg',
        category: 'intelligent-digital',
        features: [
          '多系统集成',
          '统一监控界面',
          '实时数据展示',
          '智能报警管理',
          '移动端支持',
          '数据分析报告',
        ],
        specifications: [
          { name: '支持子系统', value: '20+' },
          { name: '并发用户', value: '1000+' },
          { name: '数据处理', value: '实时' },
          { name: '部署方式', value: '云端/本地' },
        ],
        applications: ['智慧园区', '商业综合体', '工业园区', '政府机构'],
        benefits: ['提升管理效率', '降低运营成本', '统一操作界面', '数据集中分析'],
        gradient: 'from-blue-600 to-cyan-600',
        accentColor: 'blue',
        slug: 'integrated-management-platform',
        status: 'available',
        tags: ['平台', '集成', '管理', '智能化'],
      },
      {
        id: 'operation-maintenance-platform',
        title: '综合运维管理平台',
        subtitle: 'O&M Management Platform',
        description:
          '专业的运维管理平台，提供设备监控、故障预警、维护计划、工单管理等全方位运维服务。',
        icon: Settings,
        image: '/images/products/om-platform.jpg',
        category: 'intelligent-digital',
        features: [
          '设备状态监控',
          '故障预警系统',
          '维护计划管理',
          '工单流程管理',
          '备件库存管理',
          '运维数据分析',
        ],
        specifications: [
          { name: '监控设备', value: '10000+' },
          { name: '响应时间', value: '< 1秒' },
          { name: '预警准确率', value: '95%' },
          { name: '系统可用性', value: '99.9%' },
        ],
        applications: ['数据中心', '制造工厂', '医院', '学校'],
        benefits: ['预防性维护', '降低故障率', '提升设备寿命', '优化运维成本'],
        gradient: 'from-green-600 to-emerald-600',
        accentColor: 'green',
        slug: 'operation-maintenance-platform',
        status: 'available',
        tags: ['运维', '监控', '预警', '管理'],
      },
    ],
  },
  {
    id: 'ai-design',
    name: 'AI智能设计',
    description: 'AI驱动的设计产品',
    icon: Brain,
    gradient: 'from-purple-600 to-indigo-600',
    products: [
      {
        id: 'ai-security-analysis',
        title: 'AI智能安防分析系统',
        subtitle: 'AI Security Analysis System',
        description: '基于深度学习的智能视频分析系统，实现人脸识别、行为分析、异常检测等AI功能。',
        icon: Brain,
        image: '/images/products/ai-security.jpg',
        category: 'ai-design',
        features: [
          '人脸识别技术',
          '行为分析算法',
          '异常检测预警',
          '智能追踪功能',
          '多场景适应',
          '实时处理能力',
        ],
        specifications: [
          { name: '识别准确率', value: '99.5%' },
          { name: '处理速度', value: '30fps' },
          { name: '支持摄像头', value: '1000+' },
          { name: '响应时间', value: '< 100ms' },
        ],
        applications: ['安防监控', '智慧城市', '交通管理', '商业场所'],
        benefits: ['提升安防效率', '减少人工成本', '24×7智能监控', '精准识别预警'],
        gradient: 'from-purple-600 to-indigo-600',
        accentColor: 'purple',
        slug: 'ai-security-analysis',
        status: 'available',
        tags: ['AI', '人脸识别', '行为分析', '智能监控'],
      },
    ],
  },
  {
    id: 'smart-medical',
    name: '智能医疗',
    description: '医疗健康智能产品',
    icon: Activity,
    gradient: 'from-pink-600 to-rose-600',
    products: [
      {
        id: 'smart-hospital-system',
        title: '智慧医院管理系统',
        subtitle: 'Smart Hospital Management System',
        description: '面向医疗机构的智能化管理系统，提供患者管理、医疗设备监控、药品管理等功能。',
        icon: Activity,
        image: '/images/products/smart-hospital.jpg',
        category: 'smart-medical',
        features: [
          '患者信息管理',
          '医疗设备监控',
          '药品库存管理',
          '预约挂号系统',
          '电子病历系统',
          '医疗数据分析',
        ],
        specifications: [
          { name: '患者容量', value: '100000+' },
          { name: '设备监控', value: '1000+' },
          { name: '数据安全', value: '等保三级' },
          { name: '系统稳定性', value: '99.99%' },
        ],
        applications: ['综合医院', '专科医院', '社区卫生中心', '诊所'],
        benefits: ['提升医疗效率', '改善患者体验', '降低医疗风险', '优化资源配置'],
        gradient: 'from-pink-600 to-rose-600',
        accentColor: 'pink',
        slug: 'smart-hospital-system',
        status: 'available',
        tags: ['医疗', '医院', '管理系统', '智能化'],
      },
    ],
  },
  {
    id: 'smart-elderly',
    name: '智慧养老',
    description: '养老服务智能产品',
    icon: Heart,
    gradient: 'from-orange-600 to-amber-600',
    products: [
      {
        id: 'elderly-care-platform',
        title: '智慧养老服务平台',
        subtitle: 'Smart Elderly Care Platform',
        description: '专为养老机构设计的智能化服务平台，提供健康监测、安全看护、生活服务等功能。',
        icon: Heart,
        image: '/images/products/elderly-care.jpg',
        category: 'smart-elderly',
        features: [
          '健康数据监测',
          '紧急呼叫系统',
          '生活服务管理',
          '家属沟通平台',
          '药物提醒功能',
          '活动安排管理',
        ],
        specifications: [
          { name: '监测指标', value: '20+' },
          { name: '响应时间', value: '< 30秒' },
          { name: '设备兼容', value: '全品牌' },
          { name: '数据存储', value: '云端安全' },
        ],
        applications: ['养老院', '社区养老', '居家养老', '康复中心'],
        benefits: ['保障老人安全', '提升护理质量', '减轻家属负担', '优化服务流程'],
        gradient: 'from-orange-600 to-amber-600',
        accentColor: 'orange',
        slug: 'elderly-care-platform',
        status: 'available',
        tags: ['养老', '健康监测', '安全看护', '服务平台'],
      },
    ],
  },
  {
    id: 'new-energy',
    name: '新能源',
    description: '新能源相关产品',
    icon: Zap,
    gradient: 'from-green-600 to-lime-600',
    products: [
      {
        id: 'energy-management-system',
        title: '智能能源管理系统',
        subtitle: 'Smart Energy Management System',
        description: '新能源智能管理系统，实现太阳能、风能等新能源的监控、调度和优化管理。',
        icon: Zap,
        image: '/images/products/energy-management.jpg',
        category: 'new-energy',
        features: [
          '能源实时监控',
          '发电量预测',
          '负荷调度优化',
          '储能系统管理',
          '能效分析报告',
          '远程控制功能',
        ],
        specifications: [
          { name: '监控容量', value: '100MW+' },
          { name: '数据精度', value: '99.9%' },
          { name: '响应速度', value: '< 1秒' },
          { name: '节能效果', value: '20%+' },
        ],
        applications: ['太阳能电站', '风力发电', '工业园区', '商业建筑'],
        benefits: ['提升能源效率', '降低运营成本', '减少碳排放', '优化能源配置'],
        gradient: 'from-green-600 to-lime-600',
        accentColor: 'green',
        slug: 'energy-management-system',
        status: 'available',
        tags: ['新能源', '能源管理', '节能', '环保'],
      },
    ],
  },
  {
    id: 'others',
    name: '其他产品',
    description: '其他创新产品',
    icon: Package,
    gradient: 'from-gray-600 to-slate-600',
    products: [
      {
        id: 'iot-gateway-device',
        title: '物联网网关设备',
        subtitle: 'IoT Gateway Device',
        description: '工业级物联网网关设备，支持多种通信协议，实现设备互联和数据采集。',
        icon: Wifi,
        image: '/images/products/iot-gateway.jpg',
        category: 'others',
        features: [
          '多协议支持',
          '边缘计算能力',
          '数据预处理',
          '安全加密传输',
          '远程配置管理',
          '故障自诊断',
        ],
        specifications: [
          { name: '连接设备', value: '500+' },
          { name: '通信协议', value: '10+' },
          { name: '处理能力', value: 'ARM Cortex-A9' },
          { name: '工作温度', value: '-40°C~85°C' },
        ],
        applications: ['工业自动化', '智慧农业', '环境监测', '智能建筑'],
        benefits: ['设备互联互通', '数据实时采集', '降低部署成本', '提升系统稳定性'],
        gradient: 'from-gray-600 to-slate-600',
        accentColor: 'gray',
        slug: 'iot-gateway-device',
        status: 'available',
        tags: ['物联网', '网关', '设备连接', '数据采集'],
      },
    ],
  },
]

// 获取所有产品
export const allProducts: Product[] = productCategories.flatMap(category => category.products)

// 根据分类获取产品
export function getProductsByCategory(categoryId: string): Product[] {
  const category = productCategories.find(cat => cat.id === categoryId)
  return category ? category.products : []
}

// 根据ID获取产品
export function getProductById(id: string): Product | undefined {
  return allProducts.find(product => product.id === id)
}

// 根据slug获取产品
export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find(product => product.slug === slug)
}

// 获取分类信息
export function getProductCategoryById(id: string): ProductCategory | undefined {
  return productCategories.find(category => category.id === id)
}

// 根据标签搜索产品
export function searchProductsByTag(tag: string): Product[] {
  return allProducts.filter(product =>
    product.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  )
}

// 获取推荐产品
export function getRecommendedProducts(currentProductId: string, limit: number = 3): Product[] {
  const currentProduct = getProductById(currentProductId)
  if (!currentProduct) return []

  // 优先推荐同类别的产品
  const sameCategory = getProductsByCategory(currentProduct.category).filter(
    p => p.id !== currentProductId
  )

  // 如果同类别产品不足，从其他类别补充
  const otherProducts = allProducts.filter(
    p => p.category !== currentProduct.category && p.id !== currentProductId
  )

  return [...sameCategory, ...otherProducts].slice(0, limit)
}
