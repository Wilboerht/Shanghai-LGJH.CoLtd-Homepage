import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取单篇公司动态详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // 获取新闻详情
    const newsItem = await prisma.missionItem.findUnique({
      where: {
        id,
        status: 'published',
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!newsItem) {
      return NextResponse.json({ error: '新闻不存在或已下线' }, { status: 404 })
    }

    // 检查是否属于公司动态模块
    if (newsItem.module?.category !== 'company-news') {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    // 格式化新闻数据
    const formattedNews = {
      id: newsItem.id,
      title: newsItem.title,
      summary: newsItem.summary || newsItem.description || '',
      content: newsItem.content || '',
      image: newsItem.image || '/images/mission/company-news-default.jpg',
      date: newsItem.date
        ? new Date(newsItem.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      category: newsItem.category || '企业发展',
      tags: (() => {
        try {
          if (Array.isArray(newsItem.tags)) return newsItem.tags
          if (typeof newsItem.tags === 'string') return JSON.parse(newsItem.tags)
          return []
        } catch (e) {
          return []
        }
      })(),
      author: (newsItem.metadata as any)?.author || newsItem.author?.name || '临港景鸿',
      readTime: (newsItem.metadata as any)?.readTime || '3分钟',
      featured: newsItem.featured || false,
      createdAt: newsItem.createdAt,
      updatedAt: newsItem.updatedAt,
    }

    // 获取相关新闻（同分类的其他新闻）
    const relatedNews = await prisma.missionItem.findMany({
      where: {
        moduleId: newsItem.moduleId,
        status: 'published',
        id: { not: id },
        category: newsItem.category,
      },
      select: {
        id: true,
        title: true,
        summary: true,
        image: true,
        date: true,
        category: true,
      },
      orderBy: { date: 'desc' },
      take: 3,
    })

    const formattedRelatedNews = relatedNews.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary || '',
      image: item.image || '/images/mission/company-news-default.jpg',
      date: item.date
        ? new Date(item.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      category: item.category || '企业发展',
    }))

    return NextResponse.json({
      news: formattedNews,
      relatedNews: formattedRelatedNews,
    })
  } catch (error) {
    console.error('获取公司动态详情失败:', error)
    return NextResponse.json({ error: '获取公司动态详情失败' }, { status: 500 })
  }
}
