import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

const prisma = new PrismaClient()

// 研究创建/更新验证schema
const researchSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  subtitle: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val)),
  description: z.string().min(1, '描述不能为空'),
  category: z.enum(['AI_RESEARCH', 'INNOVATION', 'ACHIEVEMENTS', 'PAPERS']),
  content: z.string().min(1, '内容不能为空'),
  image: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val))
    .refine(
      val => {
        if (!val) return true
        // 允许相对路径（如 /uploads/image.jpg）
        if (val.startsWith('/')) return true
        // 允许完整的URL
        try {
          new URL(val)
          return true
        } catch {
          return false
        }
      },
      { message: '请输入有效的图片URL地址' }
    ),
  slug: z.string().min(1, 'URL标识符不能为空'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authors: z
    .array(
      z.object({
        name: z.string(),
        title: z.string().optional(),
        email: z
          .string()
          .optional()
          .refine(
            val => {
              if (!val || val === '') return true
              return z.string().email().safeParse(val).success
            },
            { message: '请输入有效的邮箱地址' }
          ),
        avatar: z
          .string()
          .optional()
          .transform(val => (val === '' ? undefined : val))
          .refine(
            val => {
              if (!val) return true
              // 允许相对路径（如 /uploads/avatar.jpg）
              if (val.startsWith('/')) return true
              // 允许完整的URL
              try {
                new URL(val)
                return true
              } catch {
                return false
              }
            },
            { message: '请输入有效的头像URL地址' }
          ),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string().optional(),
      })
    )
    .optional(),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
})

// 查询参数验证schema
const querySchema = z.object({
  page: z.string().default('1').transform(Number),
  limit: z.string().default('10').transform(Number),
  search: z.string().optional(),
  category: z.enum(['AI_RESEARCH', 'INNOVATION', 'ACHIEVEMENTS', 'PAPERS']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  sortBy: z
    .enum(['title', 'createdAt', 'updatedAt', 'publishedAt', 'sortOrder'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// 权限验证中间件
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isAdmin: true },
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  return user
}

// GET - 获取研究列表
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    // 构建查询条件
    const where: any = {}

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    if (query.category) {
      where.category = query.category
    }

    if (query.status) {
      where.status = query.status
    }

    // 计算分页
    const skip = (query.page - 1) * query.limit

    // 构建排序
    const orderBy: any = {}
    orderBy[query.sortBy] = query.sortOrder

    // 查询数据
    const [research, total] = await Promise.all([
      prisma.research.findMany({
        where,
        skip,
        take: query.limit,
        orderBy,
        include: {
          updater: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.research.count({ where }),
    ])

    return NextResponse.json({
      data: research,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    console.error('获取研究列表失败:', error)
    return NextResponse.json({ error: '获取研究列表失败' }, { status: 500 })
  }
}

// POST - 创建新研究
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    console.log('创建研究 - 用户ID:', authResult.id)

    const body = await request.json()
    console.log('创建研究 - 接收到的数据:', JSON.stringify(body, null, 2))

    const data = researchSchema.parse(body)
    console.log('创建研究 - 验证后的数据:', JSON.stringify(data, null, 2))

    // 检查slug是否已存在
    const existingResearch = await prisma.research.findUnique({
      where: { slug: data.slug },
    })

    if (existingResearch) {
      return NextResponse.json({ error: 'URL标识符已存在' }, { status: 400 })
    }

    // 处理发布日期
    let publishedAt = null
    if (data.status === 'PUBLISHED') {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date()
    }

    // 创建研究
    const createData = {
      ...data,
      publishedAt,
      updatedBy: authResult.id,
    }
    console.log('创建研究 - 数据库创建数据:', JSON.stringify(createData, null, 2))

    const research = await prisma.research.create({
      data: createData,
      include: {
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    console.log('创建研究 - 创建成功:', research.id)

    // 刷新相关页面缓存
    await CacheManager.revalidateResearch(research.slug)

    return NextResponse.json(research, { status: 201 })
  } catch (error) {
    console.error('创建研究失败:', error)

    if (error instanceof z.ZodError) {
      console.error('Zod验证错误详情:', JSON.stringify(error.issues, null, 2))
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: error.issues,
          message: error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join('; '),
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      console.error('错误详情:', error.message, error.stack)
      return NextResponse.json(
        {
          error: '创建研究失败',
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: '创建研究失败' }, { status: 500 })
  }
}
