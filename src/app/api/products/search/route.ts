import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { BaseProduct } from '@/types/product'
import { normalizeCategoryId, getCategoryStats } from '@/lib/product-categories'

// 高级搜索参数验证
const searchSchema = z.object({
  q: z.string().optional(), // 关键词搜索
  category: z.string().optional(), // 分类筛选
  status: z.enum(['AVAILABLE', 'COMING_SOON', 'DISCONTINUED']).optional(), // 状态筛选
  tags: z.string().optional(), // 标签筛选（逗号分隔）
  priceRange: z.string().optional(), // 价格范围筛选
  features: z.string().optional(), // 功能特性筛选
  sortBy: z.enum(['relevance', 'title', 'category', 'createdAt', 'updatedAt']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.string().transform(Number).pipe(z.number().min(1)).default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default(20),
})

// 安全的JSON解析函数
function safeJsonParse(value: any, fallback: any = []) {
  if (!value) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value as string)
  } catch {
    return fallback
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = searchSchema.parse({
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      tags: searchParams.get('tags') || undefined,
      priceRange: searchParams.get('priceRange') || undefined,
      features: searchParams.get('features') || undefined,
      sortBy: searchParams.get('sortBy') || 'relevance',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    })

    // 构建查询条件
    const where: any = {
      // 只显示可用和即将推出的产品
      status: {
        in: ['AVAILABLE', 'COMING_SOON'],
      },
    }

    // 关键词搜索
    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { subtitle: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
        { category: { contains: params.q, mode: 'insensitive' } },
      ]
    }

    // 分类筛选
    if (params.category) {
      const normalizedCategory = normalizeCategoryId(params.category)
      where.category = normalizedCategory
    }

    // 状态筛选
    if (params.status) {
      where.status = params.status
    }

    // 计算分页
    const skip = (params.page - 1) * params.limit

    // 构建排序条件
    let orderBy: any = {}
    if (params.sortBy === 'relevance' && params.q) {
      // 相关性排序：标题匹配优先，然后是创建时间
      orderBy = [{ title: params.sortOrder }, { createdAt: 'desc' }]
    } else {
      orderBy = { [params.sortBy]: params.sortOrder }
    }

    // 查询产品
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: params.limit,
        orderBy,
        select: {
          id: true,
          category: true,
          title: true,
          subtitle: true,
          description: true,
          features: true,
          specifications: true,
          applications: true,
          benefits: true,
          image: true,
          images: true, // 添加多张图片字段
          // priceInfo字段已从Product模型中移除
          // priceInfo: true,
          status: true,
          slug: true,
          tags: true,
          gradient: true,
          accentColor: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.product.count({ where }),
    ])

    // 格式化产品数据
    const formattedProducts: BaseProduct[] = products.map(product => ({
      ...product,
      subtitle: product.subtitle || undefined,
      description: product.description || undefined,
      image: product.image || undefined,
      features: safeJsonParse(product.features, []),
      specifications: safeJsonParse(product.specifications, []),
      applications: safeJsonParse(product.applications, []),
      benefits: safeJsonParse(product.benefits, []),
      tags: safeJsonParse(product.tags, []),
      gradient: product.gradient || undefined,
      accentColor: product.accentColor || undefined,
      // priceInfo字段已从数据库模型中移除
      // priceInfo: safeJsonParse(product.priceInfo, null),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }))

    // 高级筛选（在内存中进行，适用于复杂条件）
    let filteredProducts = formattedProducts

    // 标签筛选
    if (params.tags) {
      const searchTags = params.tags.split(',').map(tag => tag.trim().toLowerCase())
      filteredProducts = filteredProducts.filter(product =>
        searchTags.some(searchTag =>
          (product.tags as string[])?.some(tag => tag.toLowerCase().includes(searchTag))
        )
      )
    }

    // 功能特性筛选
    if (params.features) {
      const searchFeatures = params.features.split(',').map(feature => feature.trim().toLowerCase())
      filteredProducts = filteredProducts.filter(product =>
        searchFeatures.some(searchFeature =>
          (product.features as string[])?.some(feature =>
            feature.toLowerCase().includes(searchFeature)
          )
        )
      )
    }

    // 价格范围筛选已移除，因为priceInfo字段已从数据库模型中移除
    // if (params.priceRange && params.priceRange !== 'all') {
    //   // 价格过滤逻辑已移除
    // }

    // 计算分页信息
    const totalPages = Math.ceil(totalCount / params.limit)
    const hasNextPage = params.page < totalPages
    const hasPrevPage = params.page > 1

    // 获取分类统计
    const categoryStats = getCategoryStats(filteredProducts)

    // 获取搜索建议（基于现有产品）
    const suggestions = params.q ? await getSearchSuggestions(params.q) : []

    return NextResponse.json({
      products: filteredProducts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: totalCount,
        pages: totalPages,
        hasNextPage,
        hasPrevPage,
      },
      categories: categoryStats,
      suggestions,
      searchParams: params,
    })
  } catch (error) {
    console.error('产品搜索失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '搜索参数验证失败', details: (error as any).errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: '产品搜索失败' }, { status: 500 })
  }
}

// 获取搜索建议
async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const suggestions = await prisma.product.findMany({
      where: {
        OR: [{ title: { contains: query } }, { category: { contains: query } }],
        status: { in: ['AVAILABLE', 'COMING_SOON'] },
      },
      select: {
        title: true,
        category: true,
      },
      take: 5,
    })

    const suggestionSet = new Set<string>()
    suggestions.forEach(product => {
      suggestionSet.add(product.title)
      suggestionSet.add(product.category)
    })

    return Array.from(suggestionSet).slice(0, 5)
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    return []
  }
}
