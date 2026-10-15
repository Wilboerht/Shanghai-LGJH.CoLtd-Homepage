import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getActiveCategories } from '@/lib/product-categories'

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 获取基础统计数据
    const [
      totalProducts,
      availableProducts,
      comingSoonProducts,
      discontinuedProducts,
      recentProducts,
      categoryStats,
      monthlyStats,
    ] = await Promise.all([
      // 总产品数
      prisma.product.count(),

      // 可用产品数
      prisma.product.count({
        where: { status: 'AVAILABLE' },
      }),

      // 即将推出产品数
      prisma.product.count({
        where: { status: 'COMING_SOON' },
      }),

      // 已停产产品数
      prisma.product.count({
        where: { status: 'DISCONTINUED' },
      }),

      // 最近7天新增产品
      prisma.product.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // 分类统计
      prisma.product.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),

      // 月度统计（最近12个月）
      getMonthlyProductStats(),
    ])

    // 格式化分类统计
    const activeCategories = getActiveCategories()
    const formattedCategoryStats = activeCategories.map(category => {
      const stat = categoryStats.find(
        s => s.category === category.id || s.category === category.name
      )
      return {
        id: category.id,
        name: category.name,
        count: stat?._count.id || 0,
        percentage:
          totalProducts > 0 ? (((stat?._count.id || 0) / totalProducts) * 100).toFixed(1) : '0',
      }
    })

    // 添加其他分类的统计
    const otherCategories = categoryStats.filter(
      stat => !activeCategories.some(cat => cat.id === stat.category || cat.name === stat.category)
    )

    otherCategories.forEach(stat => {
      formattedCategoryStats.push({
        id: stat.category,
        name: stat.category,
        count: stat._count.id,
        percentage: totalProducts > 0 ? ((stat._count.id / totalProducts) * 100).toFixed(1) : '0',
      })
    })

    // 计算增长率
    const lastMonthProducts =
      monthlyStats.find(stat => {
        const date = new Date()
        date.setMonth(date.getMonth() - 1)
        return stat.month === date.getMonth() + 1 && stat.year === date.getFullYear()
      })?.count || 0

    const currentMonthProducts =
      monthlyStats.find(stat => {
        const date = new Date()
        return stat.month === date.getMonth() + 1 && stat.year === date.getFullYear()
      })?.count || 0

    const growthRate =
      lastMonthProducts > 0
        ? (((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100).toFixed(1)
        : '0'

    // 获取热门标签
    const popularTags = await getPopularTags()

    return NextResponse.json({
      overview: {
        total: totalProducts,
        available: availableProducts,
        comingSoon: comingSoonProducts,
        discontinued: discontinuedProducts,
        recent: recentProducts,
        growthRate: parseFloat(growthRate),
      },
      categories: formattedCategoryStats,
      monthlyTrend: monthlyStats,
      popularTags,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('获取产品统计失败:', error)
    return NextResponse.json({ error: '获取产品统计失败' }, { status: 500 })
  }
}

// 获取月度产品统计
async function getMonthlyProductStats() {
  const stats = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

    const count = await prisma.product.count({
      where: {
        createdAt: {
          gte: date,
          lt: nextDate,
        },
      },
    })

    stats.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      monthName: date.toLocaleDateString('zh-CN', { month: 'long' }),
      count,
    })
  }

  return stats
}

// 获取热门标签
async function getPopularTags() {
  try {
    const products = await prisma.product.findMany({
      select: {
        tags: true,
      },
      where: {
        status: { in: ['AVAILABLE', 'COMING_SOON'] },
      },
    })

    const tagCounts: Record<string, number> = {}

    products.forEach(product => {
      let tags = []
      try {
        tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags || []
      } catch {
        tags = []
      }

      tags.forEach((tag: string) => {
        if (tag && typeof tag === 'string') {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        }
      })
    })

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))
  } catch (error) {
    console.error('获取热门标签失败:', error)
    return []
  }
}
