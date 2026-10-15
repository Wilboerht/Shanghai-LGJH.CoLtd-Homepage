import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取使命责任模块列表（公开接口）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'

    // 构建查询条件
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    // 获取模块列表
    const modules = await prisma.missionModule.findMany({
      where,
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        icon: true,
        image: true,
        highlights: true,
        features: true,
        achievements: true,
        gradient: true,
        accentColor: true,
        href: true,
        category: true,
        status: true,
        sortOrder: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })

    return NextResponse.json({
      modules,
      total: modules.length,
    })
  } catch (error) {
    console.error('获取使命责任模块列表失败:', error)
    return NextResponse.json({ error: '获取使命责任模块列表失败' }, { status: 500 })
  }
}
