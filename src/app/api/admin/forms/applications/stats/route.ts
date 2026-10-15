import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取申请统计数据
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 获取申请统计数据
    const [total, pending, reviewed, rejected, recentApplications] = await Promise.all([
      // 总申请数
      prisma.jobApplication.count(),

      // 待处理申请数
      prisma.jobApplication.count({
        where: { status: 'NEW' },
      }),

      // 已审核申请数
      prisma.jobApplication.count({
        where: { status: 'REVIEWING' },
      }),

      // 已拒绝申请数
      prisma.jobApplication.count({
        where: { status: 'REJECTED' },
      }),

      // 最近7天的申请数
      prisma.jobApplication.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    // 获取按部门分组的申请统计（暂时跳过，因为需要复杂的关联查询）
    const departmentStats: Array<{ department: string; count: number }> = []

    return NextResponse.json({
      total,
      pending,
      reviewed,
      rejected,
      recent: recentApplications,
      departmentStats,
      summary: {
        totalApplications: total,
        pendingReview: pending,
        processed: reviewed + rejected,
        recentActivity: recentApplications,
      },
    })
  } catch (error) {
    console.error('获取申请统计数据失败:', error)
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}
