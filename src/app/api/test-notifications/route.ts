import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 测试通知数据
export async function GET(request: NextRequest) {
  try {
    // 获取所有通知
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // 获取用户数量
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      notificationCount: notifications.length,
      userCount,
      notifications: notifications.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        userId: n.userId,
        createdAt: n.createdAt,
      })),
    })
  } catch (error) {
    console.error('测试通知失败:', error)
    return NextResponse.json(
      {
        error: '测试失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
