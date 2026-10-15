import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ProductCategoryManager, normalizeCategoryId } from '@/lib/product-categories'

// 产品验证schema
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
  priceInfo: z
    .object({
      type: z.enum(['fixed', 'range', 'quote']),
      value: z.string().optional(),
      currency: z.string().default('CNY'),
      note: z.string().optional(),
    })
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

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
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

    if (!product) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('获取产品详情失败:', error)
    return NextResponse.json({ error: '获取产品详情失败' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const data = productSchema.parse(body)
    console.log('data', data)

    // 检查产品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    // 检查slug是否与其他产品冲突
    if (data.slug !== existingProduct.slug) {
      const slugConflict = await prisma.product.findUnique({
        where: { slug: data.slug },
      })

      if (slugConflict) {
        return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 })
      }
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

    // 更新产品
    const product = await prisma.product.update({
      where: { id: resolvedParams.id },
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
    await CacheManager.revalidateProduct(product.slug, existingProduct.slug)

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新产品失败:', error)
    return NextResponse.json({ error: '更新产品失败' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 检查产品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 })
    }

    // 删除产品
    await prisma.product.delete({
      where: { id: resolvedParams.id },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateProduct(existingProduct.slug)

    return NextResponse.json({ message: '产品删除成功' })
  } catch (error) {
    console.error('删除产品失败:', error)
    return NextResponse.json({ error: '删除产品失败' }, { status: 500 })
  }
}
