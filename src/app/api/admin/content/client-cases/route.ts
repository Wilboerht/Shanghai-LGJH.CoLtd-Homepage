import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 客户案例数据验证模式
const clientCaseSchema = z.object({
  name: z.string().min(1, '客户名称不能为空'),
  logo: z.string().optional(),
  industry: z.string().min(1, '行业分类不能为空'),
  title: z.string().min(1, '案例标题不能为空'),
  description: z.string().min(1, '案例描述不能为空'),
  image: z.string().optional(),
  metrics: z.string().optional(),
  tags: z.string().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

// GET - 获取客户案例列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const industry = searchParams.get('industry')
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    if (industry) {
      where.industry = industry
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // 获取客户案例列表
    const [clientCases, total] = await Promise.all([
      prisma.clientCase.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          creator: {
            select: { id: true, name: true, email: true },
          },
          updater: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.clientCase.count({ where }),
    ])

    return NextResponse.json({
      clientCases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取客户案例失败:', error)
    return NextResponse.json({ error: '获取客户案例失败' }, { status: 500 })
  }
}

// POST - 创建新客户案例
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()

    // 验证数据
    const validatedData = clientCaseSchema.parse(body)

    // 创建客户案例
    const clientCase = await prisma.clientCase.create({
      data: {
        ...validatedData,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateClientCase()

    return NextResponse.json(clientCase, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('创建客户案例失败:', error)
    return NextResponse.json({ error: '创建客户案例失败' }, { status: 500 })
  }
}
