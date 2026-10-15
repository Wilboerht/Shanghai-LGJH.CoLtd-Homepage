/**
 * 人才储备库统计API
 * 提供人才储备库的各种统计数据
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取人才储备库统计数据
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 基础统计
    const totalTalents = await prisma.talentPool.count()

    // 可用性统计
    const availabilityStats = await prisma.talentPool.groupBy({
      by: ['availability'],
      _count: {
        availability: true,
      },
    })

    // 评级统计
    const ratingStats = await prisma.talentPool.groupBy({
      by: ['rating'],
      _count: {
        rating: true,
      },
    })

    // 部门统计（基于原申请职位）
    const departmentStats = await prisma.talentPool.findMany({
      include: {
        application: {
          include: {
            job: {
              select: { department: true },
            },
          },
        },
      },
    })

    const departmentCounts = departmentStats.reduce(
      (acc, talent) => {
        const department = talent.application.job?.department || '未知部门'
        acc[department] = (acc[department] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // 月度新增统计（最近6个月）
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyStats = await prisma.talentPool.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
    })

    // 按月分组
    const monthlyGroups = monthlyStats.reduce(
      (acc, talent) => {
        const month = talent.createdAt.toISOString().slice(0, 7) // YYYY-MM
        acc[month] = (acc[month] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // 生成最近6个月的完整数据
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toISOString().slice(0, 7)
      monthlyTrend.push({
        month: monthKey,
        count: monthlyGroups[monthKey] || 0,
        label: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }),
      })
    }

    // 本月新增
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const thisMonthCount = await prisma.talentPool.count({
      where: {
        createdAt: {
          gte: thisMonth,
        },
      },
    })

    // 待跟进统计（有下次跟进时间且未过期的）
    const now = new Date()
    const pendingFollowUp = await prisma.talentPool.count({
      where: {
        nextFollowUp: {
          lte: now,
        },
        availability: {
          not: 'BLACKLIST',
        },
      },
    })

    // 平均评级
    const avgRatingResult = await prisma.talentPool.aggregate({
      _avg: {
        rating: true,
      },
    })

    // 最近互动统计
    const recentInteractions = await prisma.talentInteraction.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 最近7天
        },
      },
    })

    // 技能标签统计（从tags字段解析）
    const talentsWithTags = await prisma.talentPool.findMany({
      where: {
        tags: {
          not: null,
        },
      },
      select: {
        tags: true,
      },
    })

    const skillCounts = talentsWithTags.reduce(
      (acc, talent) => {
        try {
          const tags = JSON.parse(talent.tags || '[]')
          tags.forEach((tag: string) => {
            acc[tag] = (acc[tag] || 0) + 1
          })
        } catch (e) {
          // 忽略JSON解析错误
        }
        return acc
      },
      {} as Record<string, number>
    )

    // 获取前10个最热门技能
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }))

    // 格式化可用性统计
    const formattedAvailability = availabilityStats.reduce(
      (acc, stat) => {
        acc[stat.availability] = stat._count.availability
        return acc
      },
      {} as Record<string, number>
    )

    // 格式化评级统计
    const formattedRating = ratingStats.reduce(
      (acc, stat) => {
        if (stat.rating) {
          acc[stat.rating] = stat._count.rating
        }
        return acc
      },
      {} as Record<number, number>
    )

    return NextResponse.json({
      overview: {
        total: totalTalents,
        thisMonth: thisMonthCount,
        pendingFollowUp,
        averageRating: Math.round((avgRatingResult._avg.rating || 0) * 10) / 10,
        recentInteractions,
      },
      availability: formattedAvailability,
      rating: formattedRating,
      departments: departmentCounts,
      monthlyTrend,
      topSkills,
      summary: {
        availableCount: formattedAvailability.AVAILABLE || 0,
        contactedCount: formattedAvailability.CONTACTED || 0,
        busyCount: formattedAvailability.BUSY || 0,
        notLookingCount: formattedAvailability.NOT_LOOKING || 0,
        blacklistCount: formattedAvailability.BLACKLIST || 0,
        highRatingCount: (formattedRating[4] || 0) + (formattedRating[5] || 0), // 4-5星
        lowRatingCount: (formattedRating[1] || 0) + (formattedRating[2] || 0), // 1-2星
      },
    })
  } catch (error) {
    console.error('获取人才储备库统计失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
