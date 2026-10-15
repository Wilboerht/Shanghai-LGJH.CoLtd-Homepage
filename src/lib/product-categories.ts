/**
 * 产品分类统一管理
 * 确保前端、API、CMS之间的分类映射一致性
 */

import { LucideIcon, Cpu, Lightbulb, Activity, Heart, Zap, Package } from 'lucide-react'

// 产品分类定义
export interface ProductCategoryDefinition {
  id: string
  name: string
  description: string
  icon: LucideIcon
  gradient: string
  order: number
  isActive: boolean
}

// 主要产品分类（按优先级排序）
export const MAIN_PRODUCT_CATEGORIES: ProductCategoryDefinition[] = [
  {
    id: 'intelligent-digital',
    name: '智能数字化产品',
    description: '先进的数字化管理平台和云计算服务，助力企业智能化转型',
    icon: Cpu,
    gradient: 'from-blue-600 to-cyan-600',
    order: 1,
    isActive: true,
  },
  {
    id: 'ai-platform',
    name: 'AI智能平台',
    description: '基于人工智能的智能平台和数据分析解决方案，提升业务效率',
    icon: Lightbulb,
    gradient: 'from-purple-600 to-pink-600',
    order: 2,
    isActive: true,
  },
  {
    id: 'smart-medical',
    name: '智能医疗',
    description: '专业的医疗AI诊断系统，守护健康生活',
    icon: Activity,
    gradient: 'from-green-600 to-teal-600',
    order: 3,
    isActive: true,
  },
  {
    id: 'smart-elderly-care',
    name: '智慧养老',
    description: '贴心的智慧养老服务平台，关爱老年生活',
    icon: Heart,
    gradient: 'from-orange-600 to-red-600',
    order: 4,
    isActive: true,
  },
  {
    id: 'new-energy',
    name: '新能源',
    description: '清洁高效的新能源解决方案，共建绿色未来',
    icon: Zap,
    gradient: 'from-yellow-600 to-orange-600',
    order: 5,
    isActive: true,
  },
  {
    id: 'other-products',
    name: '其他产品',
    description: '多样化的智能产品，满足不同场景需求',
    icon: Package,
    gradient: 'from-gray-600 to-slate-600',
    order: 6,
    isActive: true,
  },
]

// 兼容性映射（旧分类ID到新分类ID的映射）
export const LEGACY_CATEGORY_MAPPING: Record<string, string> = {
  // 旧的英文ID映射
  'digital-products': 'intelligent-digital',
  'ai-design': 'ai-platform',
  'data-analytics': 'ai-platform',
  'cloud-services': 'intelligent-digital',
  'security-products': 'intelligent-digital',
  'fire-protection': 'intelligent-digital',
  'energy-management': 'new-energy',
  'smart-devices': 'other-products',
  'smart-device-products': 'other-products',

  // 中文名称到ID的映射（重要：支持数据库中的中文分类名称）
  智能数字化产品: 'intelligent-digital',
  AI智能平台: 'ai-platform',
  智能医疗: 'smart-medical',
  智慧养老: 'smart-elderly-care',
  新能源: 'new-energy',
  其他产品: 'other-products',

  // 旧的中文名称映射
  AI智能设计: 'ai-platform',
  数据分析工具: 'ai-platform',
  云计算服务: 'intelligent-digital',
  智能安防产品: 'intelligent-digital',
  智能消防产品: 'intelligent-digital',
  智能能耗产品: 'new-energy',
  智能设备产品: 'other-products',
  智能设备: 'other-products',
}

// 分类工具函数
export class ProductCategoryManager {
  /**
   * 获取所有活跃的分类
   */
  static getActiveCategories(): ProductCategoryDefinition[] {
    return MAIN_PRODUCT_CATEGORIES.filter(cat => cat.isActive).sort((a, b) => a.order - b.order)
  }

  /**
   * 根据ID获取分类
   */
  static getCategoryById(id: string): ProductCategoryDefinition | null {
    return MAIN_PRODUCT_CATEGORIES.find(cat => cat.id === id) || null
  }

  /**
   * 根据名称获取分类
   */
  static getCategoryByName(name: string): ProductCategoryDefinition | null {
    return MAIN_PRODUCT_CATEGORIES.find(cat => cat.name === name) || null
  }

  /**
   * 标准化分类ID（处理兼容性映射）
   */
  static normalizeCategoryId(categoryId: string): string {
    // 如果是有效的主分类ID，直接返回
    if (MAIN_PRODUCT_CATEGORIES.some(cat => cat.id === categoryId)) {
      return categoryId
    }

    // 检查兼容性映射
    if (LEGACY_CATEGORY_MAPPING[categoryId]) {
      return LEGACY_CATEGORY_MAPPING[categoryId]
    }

    // 如果是中文名称，转换为ID
    const categoryByName = ProductCategoryManager.getCategoryByName(categoryId)
    if (categoryByName) {
      return categoryByName.id
    }

    // 默认返回其他产品分类
    return 'other-products'
  }

  /**
   * 获取分类名称
   */
  static getCategoryName(categoryId: string): string {
    const normalizedId = ProductCategoryManager.normalizeCategoryId(categoryId)
    const category = ProductCategoryManager.getCategoryById(normalizedId)
    return category?.name || categoryId
  }

  /**
   * 获取分类描述
   */
  static getCategoryDescription(categoryId: string): string {
    const normalizedId = ProductCategoryManager.normalizeCategoryId(categoryId)
    const category = ProductCategoryManager.getCategoryById(normalizedId)
    return category?.description || '专业的智能化解决方案，为您的业务赋能'
  }

  /**
   * 获取CMS选项列表
   */
  static getCMSOptions(): Array<{ value: string; label: string }> {
    return ProductCategoryManager.getActiveCategories().map(cat => ({
      value: cat.name, // CMS使用中文名称作为值
      label: cat.name,
    }))
  }

  /**
   * 获取API选项列表
   */
  static getAPIOptions(): Array<{ id: string; name: string; description: string }> {
    return ProductCategoryManager.getActiveCategories().map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
    }))
  }

  /**
   * 验证分类是否有效
   */
  static isValidCategory(categoryId: string): boolean {
    const normalizedId = ProductCategoryManager.normalizeCategoryId(categoryId)
    return MAIN_PRODUCT_CATEGORIES.some(cat => cat.id === normalizedId)
  }

  /**
   * 获取分类统计信息
   */
  static getCategoryStats(products: Array<{ category: string }>): Array<{
    id: string
    name: string
    count: number
  }> {
    const stats = ProductCategoryManager.getActiveCategories().map(cat => ({
      id: cat.id,
      name: cat.name,
      count: 0,
    }))

    // 统计每个分类的产品数量
    products.forEach(product => {
      const normalizedId = ProductCategoryManager.normalizeCategoryId(product.category)
      const stat = stats.find(s => s.id === normalizedId)
      if (stat) {
        stat.count++
      }
    })

    return stats
  }

  /**
   * 迁移旧分类到新分类
   */
  static migrateLegacyCategory(oldCategoryId: string): string {
    return ProductCategoryManager.normalizeCategoryId(oldCategoryId)
  }
}

// 导出常用的工具函数
export const {
  getActiveCategories,
  getCategoryById,
  getCategoryByName,
  normalizeCategoryId,
  getCategoryName,
  getCategoryDescription,
  getCMSOptions,
  getAPIOptions,
  isValidCategory,
  getCategoryStats,
  migrateLegacyCategory,
} = ProductCategoryManager

// 导出分类选项（用于表单组件）
export const PRODUCT_CATEGORY_OPTIONS = ProductCategoryManager.getCMSOptions()

// 导出API分类选项
export const API_CATEGORY_OPTIONS = ProductCategoryManager.getAPIOptions()
