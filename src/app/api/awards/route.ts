import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取前端荣誉奖项列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')

    // 构建查询条件
    const where: any = {
      isActive: true,
    }

    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }

    if (category) {
      where.category = category
    }

    // 获取奖项列表
    const awards = await prisma.award.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        category: true,
        issuer: true,
        awardDate: true,
        year: true,
        level: true,
        displayOrder: true,
        featured: true,
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit,
    })

    // 转换数据格式以匹配前端期望的格式
    const formattedAwards = awards.map(award => ({
      id: award.id,
      title: award.title,
      description: award.description || '',
      image: award.image || '/images/awards/default.jpg',
      category: award.category,
      issuer: award.issuer || '相关机构',
      year: award.year || new Date().getFullYear().toString(),
      date: award.awardDate || new Date().toISOString().split('T')[0],
      level: award.level,
      featured: award.featured,
    }))

    return NextResponse.json({
      success: true,
      awards: formattedAwards,
      total: formattedAwards.length,
    })
  } catch (error) {
    console.error('获取荣誉奖项失败:', error)
    return NextResponse.json({ error: '获取荣誉奖项失败' }, { status: 500 })
  }
}
