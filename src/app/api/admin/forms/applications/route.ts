/**
 * 管理员招聘申请API
 * 用于获取、更新和管理招聘申请
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
  status: z.enum(['NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'applicantName', 'email', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// 更新状态验证
const updateSchema = z.object({
  status: z.enum(['NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED', 'HIRED']),
  adminNotes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 解析查询参数
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    })

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const offset = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (query.status) {
      where.status = query.status
    }

    if (query.search) {
      where.OR = [
        { applicantName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { jobId: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // 构建排序条件
    const orderBy: any = {}
    orderBy[query.sortBy] = query.sortOrder

    // 获取数据、总数和统计信息
    const [applications, total, stats] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          processor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              department: true,
              location: true,
            },
          },
        },
      }),
      prisma.jobApplication.count({ where }),
      // 获取各状态的统计数据
      Promise.all([
        prisma.jobApplication.count(), // total
        prisma.jobApplication.count({ where: { status: 'NEW' } }), // pending
        prisma.jobApplication.count({ where: { status: 'REVIEWING' } }), // reviewed
        prisma.jobApplication.count({ where: { status: 'INTERVIEW' } }), // interview
        prisma.jobApplication.count({ where: { status: 'OFFER' } }), // offer
        prisma.jobApplication.count({ where: { status: 'HIRED' } }), // hired
        prisma.jobApplication.count({ where: { status: 'REJECTED' } }), // rejected
      ]),
    ])

    const [totalAll, pending, reviewed, interview, offer, hired, rejected] = stats

    // 计算分页信息
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    // 格式化申请数据
    const formattedApplications = applications.map(app => ({
      ...app,
      resumeUrl: app.resumeData ? `/api/careers/apply/${app.id}/resume` : null,
      hasResume: !!app.resumeData,
    }))

    return NextResponse.json({
      applications: formattedApplications,
      total: totalAll,
      pending,
      reviewed,
      interview,
      offer,
      hired,
      rejected,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      filters: {
        status: query.status,
        search: query.search,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
    })
  } catch (error) {
    console.error('获取招聘申请失败:', error)
    return NextResponse.json({ error: '获取招聘申请失败' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少申请ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status, adminNotes } = updateSchema.parse(body)

    // 更新申请状态
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: {
        status,
        adminNotes,
        processedBy: session.user.id,
        processedAt: new Date(),
      },
      include: {
        processor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: '申请状态更新成功',
      data: updatedApplication,
    })
  } catch (error) {
    console.error('更新申请状态失败:', error)
    return NextResponse.json({ error: '更新申请状态失败' }, { status: 500 })
  }
}

// 批量操作
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ids, status, adminNotes } = body

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: '无效的批量操作参数' }, { status: 400 })
    }

    let result
    switch (action) {
      case 'updateStatus':
        if (!status) {
          return NextResponse.json({ error: '缺少状态参数' }, { status: 400 })
        }
        result = await prisma.jobApplication.updateMany({
          where: { id: { in: ids } },
          data: {
            status,
            adminNotes,
            processedBy: session.user.id,
            processedAt: new Date(),
          },
        })
        break

      case 'delete':
        result = await prisma.jobApplication.deleteMany({
          where: { id: { in: ids } },
        })
        break

      default:
        return NextResponse.json({ error: '不支持的批量操作' }, { status: 400 })
    }

    return NextResponse.json({
      message: `批量操作成功，影响 ${result.count} 条记录`,
      count: result.count,
    })
  } catch (error) {
    console.error('批量操作失败:', error)
    return NextResponse.json({ error: '批量操作失败' }, { status: 500 })
  }
}
