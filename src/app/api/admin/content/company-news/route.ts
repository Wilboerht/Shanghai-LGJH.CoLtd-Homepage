import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CacheManager } from '@/lib/cache-utils'

// GET - 获取公司动态列表（管理员）
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const includeAll = searchParams.get('includeAll') === 'true'

    // 获取公司动态模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'company-news' },
    })

    if (!module) {
      return NextResponse.json({ error: '公司动态模块不存在' }, { status: 404 })
    }

    // 构建查询条件
    const where: any = {
      moduleId: module.id,
    }

    // 如果不是包含所有状态，默认只显示已发布的
    if (!includeAll) {
      where.status = 'published'
    } else if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } },
      ]
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
      where.category = categoryMap[category] || category
    }

    // 获取新闻列表和总数
    const [news, total] = await Promise.all([
      prisma.missionItem.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [{ featured: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.missionItem.count({ where }),
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
        : new Date(item.createdAt).toISOString().split('T')[0],
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
      status: item.status,
      featured: item.featured || false,
      author: item.author,
      metadata: (() => {
        try {
          return typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata
        } catch (e) {
          return {}
        }
      })(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }))

    // 获取分类统计
    const categoryStats = await prisma.missionItem.groupBy({
      by: ['category'],
      where: {
        moduleId: module.id,
        status: includeAll ? undefined : 'published',
      },
      _count: {
        category: true,
      },
    })

    const categories = [
      { id: 'all', name: '全部', count: total },
      ...categoryStats.map(stat => ({
        id: stat.category || 'uncategorized',
        name: stat.category || '未分类',
        count: stat._count.category,
      })),
    ]

    return NextResponse.json({
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
    console.error('获取公司动态列表失败:', error)
    return NextResponse.json({ error: '获取公司动态列表失败' }, { status: 500 })
  }
}

// POST - 创建新闻
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      content,
      summary,
      image,
      date,
      tags,
      category,
      status = 'draft',
      featured = false,
      metadata = {},
    } = body

    // 获取公司动态模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'company-news' },
    })

    if (!module) {
      return NextResponse.json({ error: '公司动态模块不存在' }, { status: 404 })
    }

    // 生成唯一ID
    const newsId = `news-${Date.now()}`

    // 创建新闻
    const newsItem = await prisma.missionItem.create({
      data: {
        id: newsId,
        moduleId: module.id,
        title,
        description,
        content,
        summary,
        image,
        date: date ? new Date(date) : new Date(),
        tags: JSON.stringify(tags || []),
        category: category || '企业发展',
        status,
        featured,
        metadata: JSON.stringify({
          author: session.user.name || '管理员',
          readTime: '3分钟',
          views: 0,
          ...metadata,
        }),
        authorId: session.user.id,
        sortOrder: 0,
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateMission()

    return NextResponse.json({
      message: '新闻创建成功',
      news: newsItem,
    })
  } catch (error) {
    console.error('创建新闻失败:', error)
    return NextResponse.json({ error: '创建新闻失败' }, { status: 500 })
  }
}
