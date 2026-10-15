import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CacheManager } from '@/lib/cache-utils'

// GET - 获取单个新闻详情（管理员）
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { id } = await params

    const newsItem = await prisma.missionItem.findUnique({
      where: { id },
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
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    // 检查是否属于公司动态模块
    if (newsItem.module?.category !== 'company-news') {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    // 格式化数据
    const formattedNews = {
      id: newsItem.id,
      title: newsItem.title,
      description: newsItem.description || '',
      content: newsItem.content || '',
      summary: newsItem.summary || newsItem.description || '',
      image: newsItem.image || '/images/mission/company-news-default.jpg',
      date: newsItem.date
        ? new Date(newsItem.date).toISOString().split('T')[0]
        : new Date(newsItem.createdAt).toISOString().split('T')[0],
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
      status: newsItem.status,
      featured: newsItem.featured || false,
      author: newsItem.author,
      metadata: (() => {
        try {
          return typeof newsItem.metadata === 'string'
            ? JSON.parse(newsItem.metadata)
            : newsItem.metadata
        } catch (e) {
          return {}
        }
      })(),
      createdAt: newsItem.createdAt.toISOString(),
      updatedAt: newsItem.updatedAt.toISOString(),
    }

    return NextResponse.json({ news: formattedNews })
  } catch (error) {
    console.error('获取新闻详情失败:', error)
    return NextResponse.json({ error: '获取新闻详情失败' }, { status: 500 })
  }
}

// PUT - 更新新闻
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { id } = await params
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
      status,
      featured,
      metadata = {},
    } = body

    // 检查新闻是否存在
    const existingNews = await prisma.missionItem.findUnique({
      where: { id },
      include: {
        module: {
          select: { category: true },
        },
      },
    })

    if (!existingNews) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    if (existingNews.module?.category !== 'company-news') {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    // 准备更新数据
    const updateData: any = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (content !== undefined) updateData.content = content
    if (summary !== undefined) updateData.summary = summary
    if (image !== undefined) updateData.image = image
    if (date !== undefined) updateData.date = date ? new Date(date) : null
    if (tags !== undefined) updateData.tags = JSON.stringify(tags)
    if (category !== undefined) updateData.category = category
    if (status !== undefined) updateData.status = status
    if (featured !== undefined) updateData.featured = featured

    // 处理元数据
    const existingMetadata = (() => {
      try {
        if (typeof existingNews.metadata === 'string') {
          return JSON.parse(existingNews.metadata)
        }
        return existingNews.metadata || {}
      } catch (e) {
        return {}
      }
    })()

    updateData.metadata = JSON.stringify({
      ...existingMetadata,
      ...metadata,
      updatedBy: session.user.name || session.user.email,
      updatedAt: new Date().toISOString(),
    })

    // 更新新闻
    const updatedNews = await prisma.missionItem.update({
      where: { id },
      data: updateData,
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateMission()

    return NextResponse.json({
      message: '新闻更新成功',
      news: updatedNews,
    })
  } catch (error) {
    console.error('更新新闻失败:', error)

    // 提供更详细的错误信息
    let errorMessage = '更新新闻失败'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    )
  }
}

// PATCH - 部分更新新闻（如切换特色状态）
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    // 检查新闻是否存在
    const existingNews = await prisma.missionItem.findUnique({
      where: { id },
      include: {
        module: {
          select: { category: true },
        },
      },
    })

    if (!existingNews) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    if (existingNews.module?.category !== 'company-news') {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    // 更新新闻
    const updatedNews = await prisma.missionItem.update({
      where: { id },
      data: {
        ...body,
        metadata: JSON.stringify({
          ...(typeof existingNews.metadata === 'object' ? existingNews.metadata : {}),
          updatedBy: session.user.name || session.user.email,
          updatedAt: new Date().toISOString(),
        }),
      },
    })

    return NextResponse.json({
      message: '新闻更新成功',
      news: updatedNews,
    })
  } catch (error) {
    console.error('更新新闻失败:', error)
    return NextResponse.json({ error: '更新新闻失败' }, { status: 500 })
  }
}

// DELETE - 删除新闻
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { id } = await params

    // 检查新闻是否存在
    const existingNews = await prisma.missionItem.findUnique({
      where: { id },
      include: {
        module: {
          select: { category: true },
        },
      },
    })

    if (!existingNews) {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    if (existingNews.module?.category !== 'company-news') {
      return NextResponse.json({ error: '新闻不存在' }, { status: 404 })
    }

    // 删除新闻
    await prisma.missionItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: '新闻删除成功' })
  } catch (error) {
    console.error('删除新闻失败:', error)
    return NextResponse.json({ error: '删除新闻失败' }, { status: 500 })
  }
}
