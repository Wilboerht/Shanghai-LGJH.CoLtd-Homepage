import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// 头像创建/更新验证schema
const avatarSchema = z.object({
  name: z.string().min(1, '显示名称不能为空'),
  filename: z.string().min(1, '文件名不能为空'),
  url: z.string().url('请输入有效的URL'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  isActive: z.boolean().default(true),
})

// 查询参数验证schema
const querySchema = z.object({
  page: z.string().default('1').transform(Number),
  limit: z.string().default('20').transform(Number),
  search: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform(val => (val === 'true' ? true : val === 'false' ? false : undefined)),
  tags: z.string().optional(),
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
    return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
  }

  return user
}

// GET - 获取头像列表
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
        { name: { contains: query.search, mode: 'insensitive' } },
        { filename: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive
    }

    if (query.tags) {
      where.tags = {
        array_contains: query.tags,
      }
    }

    // 计算分页
    const skip = (query.page - 1) * query.limit

    // 查询头像列表
    const [avatars, total] = await Promise.all([
      prisma.avatar.findMany({
        where,
        include: {
          uploader: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      prisma.avatar.count({ where }),
    ])

    // 计算分页信息
    const pages = Math.ceil(total / query.limit)

    return NextResponse.json({
      data: avatars,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error('获取头像列表失败:', error)
    return NextResponse.json({ error: '获取头像列表失败' }, { status: 500 })
  }
}

// POST - 创建新头像
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult
    const user = authResult

    const body = await request.json()
    const validatedData = avatarSchema.parse(body)

    // 检查文件名是否已存在
    const existingAvatar = await prisma.avatar.findUnique({
      where: { filename: validatedData.filename },
    })

    if (existingAvatar) {
      return NextResponse.json({ error: '文件名已存在' }, { status: 400 })
    }

    // 创建头像记录
    const avatar = await prisma.avatar.create({
      data: {
        ...validatedData,
        tags: validatedData.tags || [],
        uploadedBy: user.id,
      },
      include: {
        uploader: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(avatar, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }
    console.error('创建头像失败:', error)
    return NextResponse.json({ error: '创建头像失败' }, { status: 500 })
  }
}
