import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log('通知API - Session:', session?.user?.email, session?.user?.isAdmin) // 调试信息

    if (!session?.user) {
      console.log('通知API - 未登录')
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }
    if (!session.user.isAdmin) {
      console.log('通知API - 非管理员用户')
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const type = searchParams.get('type')

    const offset = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      userId: session.user.id,
    }

    if (unreadOnly) {
      where.isRead = false
    }

    if (type) {
      where.type = type
    }

    // 获取通知列表
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    })
  } catch (error) {
    console.error('获取通知失败:', error)
    return NextResponse.json({ error: '获取通知失败' }, { status: 500 })
  }
}

// POST - 创建新通知
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const { title, message, type, priority, actionUrl, actionText, metadata } = body

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || 'INFO',
        priority: priority || 'NORMAL',
        userId: session.user.id,
        actionUrl,
        actionText,
        metadata,
      },
    })

    return NextResponse.json({
      success: true,
      data: notification,
      message: '通知创建成功',
    })
  } catch (error) {
    console.error('创建通知失败:', error)
    return NextResponse.json({ error: '创建通知失败' }, { status: 500 })
  }
}
