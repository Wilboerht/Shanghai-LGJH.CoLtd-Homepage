import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  normalizeCategoryId,
  getCategoryName,
  ProductCategoryManager,
} from '@/lib/product-categories'

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
    console.log('API /api/products 被调用')

    // 简化版本：直接查询所有产品
    const products = await prisma.product.findMany({
      where: {
        status: {
          in: ['AVAILABLE', 'COMING_SOON'],
        },
      },
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
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
        status: true,
        slug: true,
        tags: true,
        gradient: true,
        accentColor: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    console.log('查询到产品数量:', products.length)

    // 格式化产品数据
    const formattedProducts = products.map(product => ({
      ...product,
      features: safeJsonParse(product.features, []),
      specifications: safeJsonParse(product.specifications, []),
      applications: safeJsonParse(product.applications, []),
      benefits: safeJsonParse(product.benefits, []),
      tags: safeJsonParse(product.tags, []),
      // priceInfo字段已从Product模型中移除
      // priceInfo: safeJsonParse(product.priceInfo, null),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }))

    // 按规范化的分类ID分组产品
    const productsByNormalizedCategory = formattedProducts.reduce(
      (acc, product) => {
        const normalizedId = normalizeCategoryId(product.category)
        const categoryName = getCategoryName(normalizedId)

        if (!acc[normalizedId]) {
          acc[normalizedId] = {
            name: categoryName,
            products: [],
          }
        }
        acc[normalizedId].products.push(product)
        return acc
      },
      {} as Record<string, { name: string; products: typeof formattedProducts }>
    )

    // 从数据库获取分类信息并创建分类列表
    const dbCategories = await prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    const categories = dbCategories
      .filter(dbCat => productsByNormalizedCategory[dbCat.id]) // 只包含有产品的分类
      .map(dbCat => ({
        id: dbCat.id,
        name: dbCat.name,
        description: dbCat.description,
        products: productsByNormalizedCategory[dbCat.id].products,
        order: dbCat.order,
      }))

    console.log('返回分类数量:', categories.length)

    return NextResponse.json({
      categories,
      products: formattedProducts,
      totalProducts: products.length,
    })
  } catch (error) {
    console.error('获取产品列表失败:', error)
    return NextResponse.json(
      {
        error: '获取产品列表失败',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
