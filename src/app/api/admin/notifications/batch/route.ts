import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH - 批量操作通知
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const { action, notificationIds } = body

    if (!action || !Array.isArray(notificationIds)) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    let result
    const where = {
      id: { in: notificationIds },
      userId: session.user.id, // 确保只能操作自己的通知
    }

    switch (action) {
      case 'markAsRead':
        result = await prisma.notification.updateMany({
          where,
          data: {
            isRead: true,
            readAt: new Date(),
          },
        })
        break

      case 'markAsUnread':
        result = await prisma.notification.updateMany({
          where,
          data: {
            isRead: false,
            readAt: null,
          },
        })
        break

      case 'delete':
        result = await prisma.notification.deleteMany({
          where,
        })
        break

      default:
        return NextResponse.json({ error: '不支持的操作' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `批量操作完成，影响 ${result.count} 条通知`,
    })
  } catch (error) {
    console.error('批量操作通知失败:', error)
    return NextResponse.json({ error: '批量操作失败' }, { status: 500 })
  }
}

// POST - 全部标记为已读
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 标记所有未读通知为已读
    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `已标记 ${result.count} 条通知为已读`,
    })
  } catch (error) {
    console.error('标记全部已读失败:', error)
    return NextResponse.json({ error: '标记全部已读失败' }, { status: 500 })
  }
}
