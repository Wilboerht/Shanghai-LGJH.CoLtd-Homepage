import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// 服务创建/更新验证
const serviceSchema = z.object({
  title: z.string().min(1, '服务标题不能为空'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, '服务分类不能为空'),
  serviceType: z.enum(['core', 'specialized']).optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),

  // 服务页面展示配置
  icon: z.string().optional(),
  backgroundImage: z.string().optional(),
  highlight: z.string().optional(),
  features: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),

  // 页面内容结构
  hero: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      instructor: z
        .object({
          name: z.string().optional(),
          title: z.string().optional(),
          company: z.string().optional(),
        })
        .optional(),
    })
    .optional(),

  learning: z
    .object({
      title: z.string().optional(),
      objectives: z.array(z.string()).optional(),
    })
    .optional(),

  courseInfo: z
    .object({
      level: z.string().optional(),
      duration: z.string().optional(),
      lessons: z.number().optional(),
      instructor: z.string().optional(),
      company: z.string().optional(),
    })
    .optional(),

  about: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      details: z.array(z.string()).optional(),
    })
    .optional(),

  cta: z
    .object({
      buttonText: z.string().optional(),
      isEnrollment: z.boolean().optional(),
    })
    .optional(),

  // 原有字段保持兼容
  process: z
    .array(
      z.object({
        step: z.number(),
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      })
    )
    .optional(),
  visualElements: z
    .object({
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      icon: z.string().optional(),
    })
    .optional(),
  ctaConfig: z
    .object({
      text: z.string().optional(),
      link: z.string().optional(),
      style: z.string().optional(),
    })
    .optional(),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        unit: z.string().optional(),
      })
    )
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),

  slug: z.string().min(1, '服务标识不能为空'),
})

// GET - 获取服务列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // 手动处理查询参数，避免Zod验证问题
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const serviceType = searchParams.get('serviceType')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'displayOrder'
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

    const offset = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (serviceType) {
      where.serviceType = serviceType
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    // 获取总数
    const total = await prisma.service.count({ where })

    // 获取服务列表
    const services = await prisma.service.findMany({
      where,
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: offset,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error('获取服务列表失败:', error)
    return NextResponse.json({ error: '获取服务列表失败' }, { status: 500 })
  }
}

// POST - 创建新服务
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = serviceSchema.parse(body)

    // 检查slug是否已存在
    const existingService = await prisma.service.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingService) {
      return NextResponse.json({ error: '服务标识已存在' }, { status: 400 })
    }

    // 验证用户是否存在
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    })

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        updatedBy: userExists ? session.user.id : null, // 如果用户不存在则设为null
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
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateService(service.slug)

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('服务创建数据验证失败:', error.issues)
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: error.issues,
          message: error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join(', '),
        },
        { status: 400 }
      )
    }

    console.error('创建服务失败:', error)
    return NextResponse.json({ error: '创建服务失败' }, { status: 500 })
  }
}
