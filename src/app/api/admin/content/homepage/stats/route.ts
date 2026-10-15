import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取首页内容统计数据
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 获取各模块的统计数据
    const [
      // Hero区域统计 (固定为1)
      heroStats,

      // 企业资质统计
      totalQualifications,
      activeQualifications,
      featuredQualifications,

      // 荣誉奖项统计
      totalAwards,
      activeAwards,
      featuredAwards,

      // 合作伙伴统计
      totalPartners,
      activePartners,
    ] = await Promise.all([
      // Hero区域 (固定统计)
      Promise.resolve({ total: 1, featured: 1, active: 1 }),

      // 企业资质统计
      prisma.qualification.count(),
      prisma.qualification.count({ where: { isActive: true } }),
      prisma.qualification.count({ where: { isActive: true, featured: true } }),

      // 荣誉奖项统计
      prisma.award.count(),
      prisma.award.count({ where: { isActive: true } }),
      prisma.award.count({ where: { isActive: true, featured: true } }),

      // 合作伙伴统计
      prisma.partner.count(),
      prisma.partner.count({ where: { isActive: true } }),
    ])

    // 计算合作伙伴首页展示数量 (假设活跃的合作伙伴都在首页展示)
    const featuredPartners = activePartners

    // 构建响应数据
    const stats = {
      hero: {
        total: heroStats.total,
        featured: heroStats.featured,
        active: heroStats.active,
      },
      qualifications: {
        total: totalQualifications,
        featured: featuredQualifications,
        active: activeQualifications,
      },
      awards: {
        total: totalAwards,
        featured: featuredAwards,
        active: activeAwards,
      },
      partners: {
        total: totalPartners,
        featured: featuredPartners,
        active: activePartners,
      },
    }

    // 计算总体统计
    const overview = {
      totalContent: totalQualifications + totalAwards + totalPartners + 1, // +1 for hero
      activeContent: activeQualifications + activeAwards + activePartners + 1,
      featuredContent: featuredQualifications + featuredAwards + featuredPartners + 1,
    }

    return NextResponse.json({
      stats,
      overview,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('获取首页统计数据失败:', error)
    return NextResponse.json({ error: '获取首页统计数据失败' }, { status: 500 })
  }
}
