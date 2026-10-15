import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 合作伙伴数据验证模式
const partnerSchema = z.object({
  name: z.string().min(1, '合作伙伴名称不能为空'),
  logo: z.string().optional(),
  logoText: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

// GET - 获取合作伙伴列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    if (category) {
      where.category = category
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // 获取合作伙伴列表
    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
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
      prisma.partner.count({ where }),
    ])

    return NextResponse.json({
      partners,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取合作伙伴失败:', error)
    return NextResponse.json({ error: '获取合作伙伴失败' }, { status: 500 })
  }
}

// POST - 创建新合作伙伴
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证数据
    const validatedData = partnerSchema.parse(body)

    // 创建合作伙伴
    const partner = await prisma.partner.create({
      data: {
        ...validatedData,
        // createdBy 和 updatedBy 字段是可选的，暂时不设置
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
    await CacheManager.revalidatePartner()

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('创建合作伙伴失败:', error)
    return NextResponse.json({ error: '创建合作伙伴失败' }, { status: 500 })
  }
}
