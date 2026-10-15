import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取公开的合作伙伴列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 构建查询条件
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = category
    }

    // 获取合作伙伴列表
    const partners = await prisma.partner.findMany({
      where,
      take: limit,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        logo: true,
        logoText: true,
        website: true,
        description: true,
        category: true,
        displayOrder: true,
      },
    })

    return NextResponse.json({
      partners,
    })
  } catch (error) {
    console.error('获取合作伙伴失败:', error)
    return NextResponse.json({ error: '获取合作伙伴失败' }, { status: 500 })
  }
}
