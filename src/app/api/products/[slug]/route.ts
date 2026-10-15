import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProductDetailResponse, BaseProduct } from '@/types/product'

// 安全的JSON解析函数
function safeJsonParse(value: any, fallback: any = []) {
  if (!value) return fallback
  // 如果已经是对象或数组，直接返回
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value as string)
  } catch {
    return fallback
  }
}

interface RouteParams {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        // 只显示可用和即将推出的产品
        status: {
          in: ['AVAILABLE', 'COMING_SOON'],
        },
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

    if (!product) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    // 格式化产品数据
    const formattedProduct: BaseProduct = {
      ...product,
      subtitle: product.subtitle || undefined,
      description: product.description || undefined,
      image: product.image || undefined,
      gradient: product.gradient || undefined,
      accentColor: product.accentColor || undefined,
      features: safeJsonParse(product.features, []),
      specifications: safeJsonParse(product.specifications, []),
      applications: safeJsonParse(product.applications, []),
      benefits: safeJsonParse(product.benefits, []),
      tags: safeJsonParse(product.tags, []),
      // priceInfo字段已从Product模型中移除
      // priceInfo: safeJsonParse(product.priceInfo, null),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }

    // 获取相关产品（同分类的其他产品）
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        slug: { not: slug },
        status: { in: ['AVAILABLE', 'COMING_SOON'] },
      },
      take: 3,
      select: {
        id: true,
        title: true,
        subtitle: true,
        image: true,
        slug: true,
        status: true,
        category: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const formattedRelatedProducts: BaseProduct[] = relatedProducts.map(p => ({
      ...p,
      subtitle: p.subtitle || undefined,
      description: p.description || undefined,
      image: p.image || undefined,
      features: [],
      specifications: [],
      applications: [],
      benefits: [],
      tags: [],
      gradient: undefined, // 这些字段在select中没有包含
      accentColor: undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }))

    const response: ProductDetailResponse = {
      product: formattedProduct,
      relatedProducts: formattedRelatedProducts,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('获取产品详情失败:', error)
    return NextResponse.json({ error: '获取产品详情失败' }, { status: 500 })
  }
}
