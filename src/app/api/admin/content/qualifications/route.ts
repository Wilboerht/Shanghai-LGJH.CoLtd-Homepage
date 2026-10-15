import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 企业资质验证schema
const qualificationSchema = z.object({
  title: z.string().min(1, '资质名称不能为空'),
  image: z.string().optional(),
  displayOrder: z.number().default(0),
})

// GET - 获取企业资质管理列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { issuer: { contains: search } },
      ]
    }

    // 获取企业资质列表
    const [qualifications, total] = await Promise.all([
      prisma.qualification.findMany({
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
      prisma.qualification.count({ where }),
    ])

    return NextResponse.json({
      qualifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取企业资质失败:', error)
    return NextResponse.json({ error: '获取企业资质失败' }, { status: 500 })
  }
}

// POST - 创建企业资质
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = qualificationSchema.parse(body)

    // 准备数据
    const data: any = {
      ...validatedData,
      // 设置默认值
      category: '企业资质',
      isActive: true,
      featured: true, // 默认在首页显示
      createdBy: session.user.id,
    }

    const qualification = await prisma.qualification.create({
      data,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateQualification()

    return NextResponse.json(qualification, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('创建企业资质失败:', error)
    return NextResponse.json({ error: '创建企业资质失败' }, { status: 500 })
  }
}
