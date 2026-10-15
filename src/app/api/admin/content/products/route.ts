import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'
import { ProductCategoryManager, normalizeCategoryId } from '@/lib/product-categories'

// 查询参数验证
const querySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['title', 'category', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// 创建/更新产品验证
const productSchema = z.object({
  category: z.string().min(1, '分类不能为空'),
  title: z.string().min(1, '标题不能为空'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        unit: z.string().optional(),
      })
    )
    .optional(),
  applications: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  image: z.string().optional(),
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  status: z.enum(['AVAILABLE', 'COMING_SOON', 'DISCONTINUED']).default('AVAILABLE'),
  slug: z.string().min(1, 'URL别名不能为空'),
  tags: z.array(z.string()).optional(),
  gradient: z.string().optional(),
  accentColor: z.string().optional(),
})

// 确保产品分类存在的函数
async function ensureProductCategoryExists(categoryName: string) {
  try {
    // 规范化分类ID
    const normalizedId = normalizeCategoryId(categoryName)

    // 检查分类是否已存在
    const existingCategory = await prisma.productCategory.findUnique({
      where: { id: normalizedId },
    })

    if (existingCategory) {
      console.log(`分类 ${categoryName} (${normalizedId}) 已存在`)
      return existingCategory
    }

    // 从预定义分类中获取分类信息
    const categoryDefinition = ProductCategoryManager.getCategoryById(normalizedId)

    if (!categoryDefinition) {
      console.warn(`未找到分类定义: ${categoryName} -> ${normalizedId}`)
      return null
    }

    // 创建新的分类记录
    const newCategory = await prisma.productCategory.create({
      data: {
        id: categoryDefinition.id,
        name: categoryDefinition.name,
        description: categoryDefinition.description,
        iconName: categoryDefinition.icon.name || 'Package',
        gradient: categoryDefinition.gradient,
        order: categoryDefinition.order,
        isActive: categoryDefinition.isActive,
      },
    })

    console.log(`✅ 自动创建分类: ${newCategory.name} (${newCategory.id})`)
    return newCategory
  } catch (error) {
    console.error('确保分类存在时出错:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 解析查询参数
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    })

    // 构建查询条件
    const where: any = {}

    if (query.category) {
      where.category = query.category
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { subtitle: { contains: query.search } },
        { description: { contains: query.search } },
        { category: { contains: query.search } },
      ]
    }

    // 计算分页
    const skip = (query.page - 1) * query.limit

    // 查询产品
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        include: {
          updater: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    // JSON字段已经被Prisma自动解析，无需再次解析
    const formattedProducts = products.map(product => ({
      ...product,
      features: product.features || [],
      specifications: product.specifications || [],
      applications: product.applications || [],
      benefits: product.benefits || [],
      tags: product.tags || [],
      images: product.images || [],
    }))

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('获取产品列表失败:', error)
    return NextResponse.json({ error: '获取产品列表失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const data = productSchema.parse(body)

    // 检查slug是否已存在
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (existingProduct) {
      return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 })
    }

    // 确保产品分类存在
    await ensureProductCategoryExists(data.category)

    // 处理图片数据
    const processedData = {
      ...data,
      // 如果有多张图片但没有主图片，使用第一张图片作为主图片
      image: data.image || (data.images && data.images.length > 0 ? data.images[0].url : undefined),
      updatedBy: session.user.id,
    }

    // 创建产品
    const product = await prisma.product.create({
      data: processedData,
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateProduct(product.slug)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('创建产品失败:', error)
    return NextResponse.json({ error: '创建产品失败' }, { status: 500 })
  }
}
