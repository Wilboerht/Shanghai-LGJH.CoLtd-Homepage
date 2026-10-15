import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取产教融合管理数据
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 获取产教融合模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'industry-education' },
      include: {
        items: {
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!module) {
      return NextResponse.json({ error: '产教融合模块不存在' }, { status: 404 })
    }

    return NextResponse.json({
      module: {
        id: module.id,
        title: module.title,
        description: module.description,
      },
      items: module.items,
      total: module.items.length,
    })
  } catch (error) {
    console.error('获取产教融合管理数据失败:', error)
    return NextResponse.json({ error: '获取产教融合管理数据失败' }, { status: 500 })
  }
}

// POST - 创建新的产教融合项目
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      content,
      category = 'cooperation-overview',
      status = 'draft',
      featured = false,
      image,
      metadata,
      sortOrder = 0,
    } = body

    // 验证必需字段
    if (!title) {
      return NextResponse.json({ error: '标题是必需的' }, { status: 400 })
    }

    // 获取产教融合模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'industry-education' },
    })

    if (!module) {
      return NextResponse.json({ error: '产教融合模块不存在' }, { status: 404 })
    }

    // 创建新项目
    const newItem = await prisma.missionItem.create({
      data: {
        moduleId: module.id,
        title,
        description: description || '',
        content: content || '',
        category,
        status,
        featured,
        image: image || '',
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        sortOrder: Number(sortOrder) || 0,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(newItem)
  } catch (error) {
    console.error('创建产教融合项目失败:', error)
    return NextResponse.json({ error: '创建产教融合项目失败' }, { status: 500 })
  }
}
