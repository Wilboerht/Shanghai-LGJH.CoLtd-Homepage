import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'

// GET - 获取解决方案列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { subtitle: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (category) {
      where.category = category
    }

    // 获取总数
    const total = await prisma.solution.count({ where })

    // 获取解决方案列表
    const solutions = await prisma.solution.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
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

    return NextResponse.json({
      solutions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取解决方案列表失败:', error)
    return NextResponse.json({ error: '获取解决方案列表失败' }, { status: 500 })
  }
}

// POST - 创建新解决方案
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const data = await request.json()

    // 验证必填字段
    if (!data.title || !data.category || !data.slug) {
      return NextResponse.json({ error: '标题、分类和URL标识为必填字段' }, { status: 400 })
    }

    // 检查slug是否已存在
    const existingSolution = await prisma.solution.findUnique({
      where: { slug: data.slug },
    })

    if (existingSolution) {
      return NextResponse.json({ error: 'URL标识已存在' }, { status: 400 })
    }

    // 创建解决方案
    const solution = await prisma.solution.create({
      data: {
        ...data,
        updatedBy: session.user.id,
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
    await CacheManager.revalidateSolution()

    return NextResponse.json(solution, { status: 201 })
  } catch (error) {
    console.error('创建解决方案失败:', error)
    return NextResponse.json({ error: '创建解决方案失败' }, { status: 500 })
  }
}
