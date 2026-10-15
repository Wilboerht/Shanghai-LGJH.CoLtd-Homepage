/**
 * 人才储备库主API
 * 处理人才储备库的查询、创建等操作
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  availability: z.enum(['AVAILABLE', 'BUSY', 'NOT_LOOKING', 'CONTACTED', 'BLACKLIST']).optional(),
  rating: z.string().optional(),
  department: z.string().optional(),
  sortBy: z
    .enum(['createdAt', 'rating', 'lastContactAt', 'applicantName', 'availability'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// GET - 获取人才储备库列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (query.search) {
      where.OR = [
        { application: { applicantName: { contains: query.search } } },
        { application: { email: { contains: query.search } } },
        { tags: { contains: query.search } },
        { notes: { contains: query.search } },
      ]
    }

    if (query.availability) {
      where.availability = query.availability
    }

    if (query.rating) {
      where.rating = parseInt(query.rating)
    }

    if (query.department) {
      where.application = {
        job: {
          department: query.department,
        },
      }
    }

    // 构建排序条件
    let orderBy: any = {}
    if (query.sortBy === 'applicantName') {
      orderBy = { application: { applicantName: query.sortOrder } }
    } else {
      orderBy = { [query.sortBy]: query.sortOrder }
    }

    // 查询数据
    const [talents, total] = await Promise.all([
      prisma.talentPool.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          application: {
            select: {
              applicantName: true,
              email: true,
              phone: true,
              resumeUrl: true,
              job: {
                select: {
                  title: true,
                  department: true,
                  location: true,
                },
              },
            },
          },
          addedByUser: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              interactions: true,
            },
          },
        },
      }),
      prisma.talentPool.count({ where }),
    ])

    // 获取统计数据
    const stats = await prisma.talentPool.groupBy({
      by: ['availability'],
      _count: {
        availability: true,
      },
    })

    const availabilityStats = stats.reduce(
      (acc, stat) => {
        acc[stat.availability] = stat._count.availability
        return acc
      },
      {} as Record<string, number>
    )

    // 获取评级统计
    const ratingStats = await prisma.talentPool.groupBy({
      by: ['rating'],
      _count: {
        rating: true,
      },
    })

    const ratingDistribution = ratingStats.reduce(
      (acc, stat) => {
        if (stat.rating) {
          acc[stat.rating] = stat._count.rating
        }
        return acc
      },
      {} as Record<number, number>
    )

    // 格式化返回数据
    const formattedTalents = talents.map(talent => ({
      id: talent.id,
      applicantName: talent.application.applicantName,
      email: talent.application.email,
      phone: talent.application.phone,
      jobTitle: talent.application.job?.title,
      department: talent.application.job?.department,
      location: talent.application.job?.location,
      currentPosition: talent.currentPosition,
      currentCompany: talent.currentCompany,
      expectedSalary: talent.expectedSalary,
      availability: talent.availability,
      rating: talent.rating,
      tags: talent.tags ? JSON.parse(talent.tags) : [],
      notes: talent.notes,
      addedReason: talent.addedReason,
      lastContactAt: talent.lastContactAt,
      nextFollowUp: talent.nextFollowUp,
      interactionCount: talent._count.interactions,
      addedBy: talent.addedByUser.name,
      createdAt: talent.createdAt,
      updatedAt: talent.updatedAt,
      resumeUrl: talent.application.resumeUrl,
    }))

    return NextResponse.json({
      talents: formattedTalents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total,
        availability: availabilityStats,
        rating: ratingDistribution,
        averageRating:
          talents.length > 0
            ? talents.reduce((sum, t) => sum + (t.rating || 0), 0) / talents.length
            : 0,
      },
    })
  } catch (error) {
    console.error('获取人才储备库列表失败:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '参数验证失败',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// POST - 手动创建人才记录（暂时不实现，主要通过导入）
export async function POST(request: NextRequest) {
  return NextResponse.json({ error: '请使用导入功能添加人才' }, { status: 405 })
}
