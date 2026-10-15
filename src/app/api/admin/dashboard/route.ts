import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取日期范围（用于计算增长率）
function getDateRanges() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    today,
    yesterday,
    weekAgo,
    monthAgo,
  }
}

// 计算增长率
function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { today, yesterday, weekAgo, monthAgo } = getDateRanges()

    // 安全的数据库查询函数
    const safeCount = async (query: () => Promise<number>): Promise<number> => {
      try {
        return await query()
      } catch (error) {
        console.warn('Database query failed:', error)
        return 0
      }
    }

    const safeFindMany = async <T>(query: () => Promise<T[]>): Promise<T[]> => {
      try {
        return await query()
      } catch (error) {
        console.warn('Database query failed:', error)
        return []
      }
    }

    // 获取真实的统计数据
    const [
      // 基础统计
      totalUsers,
      totalSubmissions,
      newSubmissions,
      totalProducts,
      totalSolutions,
      totalServices,
      totalResearch,

      jobApplications,

      // 增长率计算用的历史数据
      yesterdayUsers,
      weekAgoUsers,
      yesterdaySubmissions,
      weekAgoSubmissions,
      weekAgoContent,

      // 最近活动数据
      recentSubmissions,
      recentContentUpdates,
    ] = await Promise.all([
      // 基础统计
      safeCount(() => prisma.user.count()),
      safeCount(() => prisma.contactSubmission.count()),
      safeCount(() => prisma.contactSubmission.count({ where: { status: 'NEW' } })),
      safeCount(() => prisma.product.count()),
      safeCount(() => prisma.solution.count()),
      safeCount(() => prisma.service.count()),
      safeCount(() => prisma.research.count()),
      safeCount(() => prisma.jobApplication.count()),

      // 历史数据用于计算增长率
      safeCount(() => prisma.user.count({ where: { createdAt: { lt: yesterday } } })),
      safeCount(() => prisma.user.count({ where: { createdAt: { lt: weekAgo } } })),
      safeCount(() =>
        prisma.contactSubmission.count({ where: { createdAt: { gte: yesterday, lt: today } } })
      ),
      safeCount(() =>
        prisma.contactSubmission.count({ where: { createdAt: { gte: weekAgo, lt: today } } })
      ),
      Promise.all([
        safeCount(() => prisma.product.count({ where: { createdAt: { lt: weekAgo } } })),
        safeCount(() => prisma.solution.count({ where: { createdAt: { lt: weekAgo } } })),
        safeCount(() => prisma.service.count({ where: { createdAt: { lt: weekAgo } } })),
        safeCount(() => prisma.research.count({ where: { createdAt: { lt: weekAgo } } })),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),

      // 最近活动 - 简化查询
      safeFindMany(() =>
        prisma.contactSubmission.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            subject: true,
            status: true,
            createdAt: true,
          },
        })
      ),
      // 最近内容更新 - 简化为只查询产品
      safeFindMany(() =>
        prisma.product.findMany({
          where: { updatedAt: { gte: weekAgo } },
          take: 5,
          orderBy: { updatedAt: 'desc' },
          select: {
            title: true,
            updatedAt: true,
          },
        })
      ).then(products =>
        products.map(p => ({
          type: 'product',
          title: p.title,
          updatedAt: p.updatedAt,
        }))
      ),
    ])

    const totalContent = totalProducts + totalSolutions + totalServices + totalResearch

    // 计算真实的增长率
    const todayUsers = totalUsers - yesterdayUsers
    const todaySubmissions = newSubmissions
    const weekUsers = totalUsers - weekAgoUsers
    const weekSubmissions = totalSubmissions - weekAgoSubmissions

    const response = {
      pendingSubmissions: newSubmissions,
      jobApplications,
      totalContent,
      totalUsers,
      submissionGrowth: calculateGrowth(todaySubmissions, yesterdaySubmissions),
      applicationGrowth: 0, // 暂时设为0，等招聘模块完善后更新
      contentGrowth: calculateGrowth(totalContent, weekAgoContent),
      userGrowth: calculateGrowth(weekUsers, totalUsers - weekAgoUsers - weekUsers),

      // 详细统计信息
      details: {
        submissions: {
          pending: newSubmissions,
          total: totalSubmissions,
          thisWeek: weekSubmissions,
        },
        content: {
          products: totalProducts,
          solutions: totalSolutions,
          services: totalServices,
          research: totalResearch,
          total: totalContent,
        },
        users: {
          total: totalUsers,
          admins: await prisma.user.count({ where: { isAdmin: true } }),
          thisWeek: weekUsers,
          active: await prisma.user.count({
            where: {
              lastLogin: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          }),
        },
      },

      // 最近活动
      recentActivities: {
        submissions: recentSubmissions,
        contentUpdates: recentContentUpdates,
      },

      lastUpdated: new Date(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('获取仪表板数据失败:', error)
    return NextResponse.json({ error: '获取仪表板数据失败' }, { status: 500 })
  }
}
