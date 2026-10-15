/**
 * 产品相关类型定义
 * 统一前端、API、数据库的数据结构
 */

import { LucideIcon } from 'lucide-react'

// 产品状态枚举
export type ProductStatus = 'AVAILABLE' | 'COMING_SOON' | 'DISCONTINUED'

// 产品图片接口
export interface ProductImage {
  id: string
  url: string
  alt?: string
}

// 产品规格接口
export interface ProductSpecification {
  name: string
  value: string
  unit?: string
}

// 基础产品接口（数据库/API使用）
export interface BaseProduct {
  id: string
  category: string
  title: string
  subtitle?: string
  description?: string
  features?: string[]
  specifications?: ProductSpecification[]
  applications?: string[]
  benefits?: string[]
  image?: string // 主图片，保持向后兼容
  images?: ProductImage[] // 多张图片
  status: ProductStatus
  slug: string
  tags?: string[]
  gradient?: string
  accentColor?: string
  createdAt: Date | string
  updatedAt: Date | string
  updatedBy?: string
  updater?: {
    id: string
    name: string
    email: string
  }
}

// 前端展示用产品接口（包含图标等前端特有属性）
export interface Product extends Omit<BaseProduct, 'createdAt' | 'updatedAt'> {
  icon?: LucideIcon
}

// 产品分类接口
export interface ProductCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
  gradient: string
  products: Product[]
}

// API响应接口
export interface ProductListResponse {
  products: BaseProduct[]
  categories: Array<{
    id: string
    name: string
    count: number
  }>
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ProductDetailResponse {
  product: BaseProduct
  relatedProducts: BaseProduct[]
}

// CMS管理用接口
export interface ProductFormData {
  category: string
  title: string
  subtitle?: string
  description?: string
  features?: string[]
  specifications?: ProductSpecification[]
  applications?: string[]
  benefits?: string[]
  image?: string // 主图片，保持向后兼容
  images?: ProductImage[] // 多张图片
  status: ProductStatus
  slug: string
  tags?: string[]
  gradient?: string
  accentColor?: string
}

// 产品筛选条件
export interface ProductFilters {
  category?: string
  status?: ProductStatus
  search?: string
  tags?: string[]
}

// 产品排序选项
export interface ProductSortOptions {
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'category'
  sortOrder: 'asc' | 'desc'
}

// 分页参数
export interface PaginationParams {
  page: number
  limit: number
}

// 产品查询参数
export interface ProductQueryParams extends ProductFilters, ProductSortOptions, PaginationParams {}

// 产品分类常量
export const PRODUCT_CATEGORIES = [
  { id: 'intelligent-digital', name: '智能数字化产品' },
  { id: 'ai-platform', name: 'AI智能平台' },
  { id: 'smart-medical', name: '智能医疗' },
  { id: 'smart-elderly-care', name: '智慧养老' },
  { id: 'new-energy', name: '新能源' },
  { id: 'other-products', name: '其他产品' },
] as const

// 产品状态常量
export const PRODUCT_STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: '可用' },
  { value: 'COMING_SOON', label: '即将推出' },
  { value: 'DISCONTINUED', label: '已停产' },
] as const

// 分类ID映射函数
export function getCategoryId(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    智能数字化产品: 'intelligent-digital',
    AI智能平台: 'ai-platform',
    智能医疗: 'smart-medical',
    智慧养老: 'smart-elderly-care',
    新能源: 'new-energy',
    其他产品: 'other-products',
    // 兼容旧分类
    AI智能设计: 'ai-platform',
    数据分析工具: 'ai-platform',
    云计算服务: 'intelligent-digital',
    智能安防产品: 'intelligent-digital',
    智能消防产品: 'intelligent-digital',
    智能能耗产品: 'new-energy',
    智能设备产品: 'other-products',
    智能设备: 'other-products',
  }

  return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
}

// 获取分类名称
export function getCategoryName(categoryId: string): string {
  const category = PRODUCT_CATEGORIES.find(cat => cat.id === categoryId)
  return category?.name || categoryId
}

// 状态转换函数
export function formatProductStatus(status: string): ProductStatus {
  const statusMap: Record<string, ProductStatus> = {
    available: 'AVAILABLE',
    'coming-soon': 'COMING_SOON',
    discontinued: 'DISCONTINUED',
    AVAILABLE: 'AVAILABLE',
    COMING_SOON: 'COMING_SOON',
    DISCONTINUED: 'DISCONTINUED',
  }

  return statusMap[status] || 'AVAILABLE'
}

// 获取状态显示文本
export function getStatusLabel(status: ProductStatus): string {
  const statusOption = PRODUCT_STATUS_OPTIONS.find(option => option.value === status)
  return statusOption?.label || status
}
