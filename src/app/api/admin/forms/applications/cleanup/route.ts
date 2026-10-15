import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - 批量清理过期申请
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const { daysOld = 180, excludeTalentPool = true } = body

    // 计算截止日期
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    // 构建查询条件
    const whereCondition: any = {
      createdAt: {
        lt: cutoffDate,
      },
    }

    // 如果要排除已在人才库中的申请
    if (excludeTalentPool) {
      // 获取所有在人才库中的申请ID
      const talentPoolApplications = await prisma.talentPool.findMany({
        select: {
          application: {
            select: {
              id: true,
            },
          },
        },
        where: {
          applicationId: {
            not: undefined,
          },
        },
      })

      const talentPoolApplicationIds = talentPoolApplications
        .map(tp => tp.application.id)
        .filter(Boolean)

      // 排除这些申请
      whereCondition.id = {
        notIn: talentPoolApplicationIds,
      }
    }

    // 获取要删除的申请列表（用于统计和日志）
    const applicationsToDelete = await prisma.jobApplication.findMany({
      where: whereCondition,
      select: {
        id: true,
        applicantName: true,
        email: true,
        createdAt: true,
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    })

    if (applicationsToDelete.length === 0) {
      return NextResponse.json({
        message: '没有找到需要清理的过期申请',
        deletedCount: 0,
        cutoffDate: cutoffDate.toISOString(),
      })
    }

    // 删除相关的日志记录功能暂时移除，因为ApplicationLog模型不存在
    // TODO: 如果需要操作日志，需要先在Prisma schema中定义ApplicationLog模型

    // 批量删除申请
    const deleteResult = await prisma.jobApplication.deleteMany({
      where: whereCondition,
    })

    // 系统日志功能暂时移除，因为SystemLog模型不存在
    // TODO: 如果需要系统日志，需要先在Prisma schema中定义SystemLog模型

    return NextResponse.json({
      message: `成功清理了 ${deleteResult.count} 条过期申请记录`,
      deletedCount: deleteResult.count,
      cutoffDate: cutoffDate.toISOString(),
      excludedTalentPool: excludeTalentPool,
      deletedApplications: applicationsToDelete.map(app => ({
        name: app.applicantName,
        email: app.email,
        jobTitle: app.job?.title,
        createdAt: app.createdAt,
      })),
    })
  } catch (error) {
    console.error('清理申请失败:', error)
    return NextResponse.json({ error: '清理申请失败，请重试' }, { status: 500 })
  }
}

// GET - 获取可清理的申请统计
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const daysOld = parseInt(searchParams.get('daysOld') || '180')
    const excludeTalentPool = searchParams.get('excludeTalentPool') !== 'false'

    // 计算截止日期
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    // 构建查询条件
    const whereCondition: any = {
      createdAt: {
        lt: cutoffDate,
      },
    }

    // 如果要排除已在人才库中的申请
    if (excludeTalentPool) {
      const talentPoolApplications = await prisma.talentPool.findMany({
        select: {
          application: {
            select: {
              id: true,
            },
          },
        },
        where: {
          applicationId: {
            not: undefined,
          },
        },
      })

      const talentPoolApplicationIds = talentPoolApplications
        .map(tp => tp.application.id)
        .filter(Boolean)

      whereCondition.id = {
        notIn: talentPoolApplicationIds,
      }
    }

    // 统计可清理的申请数量
    const cleanupCount = await prisma.jobApplication.count({
      where: whereCondition,
    })

    // 获取一些示例申请
    const sampleApplications = await prisma.jobApplication.findMany({
      where: whereCondition,
      select: {
        id: true,
        applicantName: true,
        email: true,
        createdAt: true,
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 10,
    })

    return NextResponse.json({
      cleanupCount,
      cutoffDate: cutoffDate.toISOString(),
      daysOld,
      excludeTalentPool,
      sampleApplications: sampleApplications.map(app => ({
        name: app.applicantName,
        email: app.email,
        jobTitle: app.job?.title,
        createdAt: app.createdAt,
        daysAgo: Math.ceil(
          (new Date().getTime() - app.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        ),
      })),
    })
  } catch (error) {
    console.error('获取清理统计失败:', error)
    return NextResponse.json({ error: '获取清理统计失败' }, { status: 500 })
  }
}
