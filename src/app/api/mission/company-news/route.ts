import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取公司动态数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 构建查询条件
    const where: any = {
      status: 'published',
    }

    if (category && category !== 'all') {
      const categoryMap: Record<string, string> = {
        product: '产品发布',
        development: '企业发展',
        cooperation: '合作签约',
        awards: '荣誉奖项',
        team: '员工发展',
        market: '市场拓展',
      }
      where.category = categoryMap[category]
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } },
        { tags: { hasSome: [search] } },
      ]
    }

    // 获取公司动态模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'company-news' },
    })

    // 获取新闻列表
    const [news, total] = await Promise.all([
      prisma.missionItem.findMany({
        where: {
          moduleId: module?.id,
          ...where,
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.missionItem.count({
        where: {
          moduleId: module?.id,
          ...where,
        },
      }),
    ])

    // 格式化新闻数据
    const formattedNews = news.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary || item.description || '',
      content: item.content || '',
      image: item.image || '/images/mission/company-news-default.jpg',
      date: item.date
        ? new Date(item.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      category: item.category || '企业发展',
      tags: (() => {
        try {
          if (Array.isArray(item.tags)) return item.tags
          if (typeof item.tags === 'string') return JSON.parse(item.tags)
          return []
        } catch (e) {
          return []
        }
      })(),
      author: (item.metadata as any)?.author || '临港景鸿',
      readTime: (item.metadata as any)?.readTime || '3分钟',
      featured: item.featured || false,
    }))

    // 获取分类统计
    const categoryStats = await prisma.missionItem.groupBy({
      by: ['category'],
      where: {
        moduleId: module?.id,
        status: 'published',
      },
      _count: {
        category: true,
      },
    })

    const categories = [
      { id: 'all', name: '全部', count: total },
      {
        id: 'product',
        name: '产品发布',
        count: categoryStats.find(c => c.category === '产品发布')?._count.category || 0,
      },
      {
        id: 'development',
        name: '企业发展',
        count: categoryStats.find(c => c.category === '企业发展')?._count.category || 0,
      },
      {
        id: 'cooperation',
        name: '合作签约',
        count: categoryStats.find(c => c.category === '合作签约')?._count.category || 0,
      },
      {
        id: 'awards',
        name: '荣誉奖项',
        count: categoryStats.find(c => c.category === '荣誉奖项')?._count.category || 0,
      },
      {
        id: 'team',
        name: '员工发展',
        count: categoryStats.find(c => c.category === '员工发展')?._count.category || 0,
      },
      {
        id: 'market',
        name: '市场拓展',
        count: categoryStats.find(c => c.category === '市场拓展')?._count.category || 0,
      },
    ]

    return NextResponse.json({
      module: module
        ? {
            id: module.id,
            title: module.title,
            subtitle: module.subtitle,
            description: module.description,
            icon: module.icon,
            image: module.image,
            highlights: module.highlights,
            features: module.features,
            achievements: module.achievements,
            gradient: module.gradient,
            accentColor: module.accentColor,
            href: module.href,
          }
        : null,
      news: formattedNews,
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取公司动态数据失败:', error)
    return NextResponse.json({ error: '获取公司动态数据失败' }, { status: 500 })
  }
}
