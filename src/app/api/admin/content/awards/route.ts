import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 荣誉奖项验证模式
const awardSchema = z.object({
  title: z.string().min(1, '奖项名称不能为空'),
  description: z.string().optional(),
  image: z.string().optional(),
  category: z.string().min(1, '奖项类别不能为空'),
  issuer: z.string().optional(),
  awardDate: z.string().optional(),
  year: z.string().optional(),
  level: z.string().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
})

// GET - 获取荣誉奖项列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { issuer: { contains: search } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }

    // 获取总数
    const total = await prisma.award.count({ where })

    // 获取奖项列表
    const awards = await prisma.award.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    })

    return NextResponse.json({
      awards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取荣誉奖项失败:', error)
    return NextResponse.json({ error: '获取荣誉奖项失败' }, { status: 500 })
  }
}

// POST - 创建荣誉奖项
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/content/awards - 开始处理请求')

    const session = await getServerSession(authOptions)
    console.log('用户会话:', session?.user?.email, '是否管理员:', session?.user?.isAdmin)

    if (!session?.user?.isAdmin) {
      console.log('权限检查失败')
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    console.log('接收到的数据:', JSON.stringify(body, null, 2))

    const validatedData = awardSchema.parse(body)
    console.log('验证后的数据:', JSON.stringify(validatedData, null, 2))

    // 处理日期
    const awardDate = validatedData.awardDate ? new Date(validatedData.awardDate) : null
    console.log('处理后的日期:', awardDate)

    // 从validatedData中移除awardDate，因为我们要单独处理
    const { awardDate: _, ...createData } = validatedData
    console.log('最终创建数据:', JSON.stringify({ ...createData, awardDate }, null, 2))

    const award = await prisma.award.create({
      data: {
        ...createData,
        awardDate,
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateAward()

    console.log('创建成功:', award.id)
    return NextResponse.json(award, { status: 201 })
  } catch (error) {
    console.error('创建荣誉奖项失败:', error)
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息')

    if (error instanceof z.ZodError) {
      console.log('Zod验证错误:', error.issues)
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: '创建荣誉奖项失败' }, { status: 500 })
  }
}
