import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH - 标记通知为已读
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { isRead } = body

    // 更新通知状态
    const notification = await prisma.notification.update({
      where: {
        id,
        userId: session.user.id, // 确保只能更新自己的通知
      },
      data: {
        isRead,
        readAt: isRead ? new Date() : null,
      },
    })

    return NextResponse.json({
      success: true,
      data: notification,
      message: isRead ? '通知已标记为已读' : '通知已标记为未读',
    })
  } catch (error) {
    console.error('更新通知状态失败:', error)
    return NextResponse.json({ error: '更新通知状态失败' }, { status: 500 })
  }
}

// DELETE - 删除通知
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params

    // 删除通知
    await prisma.notification.delete({
      where: {
        id,
        userId: session.user.id, // 确保只能删除自己的通知
      },
    })

    return NextResponse.json({
      success: true,
      message: '通知删除成功',
    })
  } catch (error) {
    console.error('删除通知失败:', error)
    return NextResponse.json({ error: '删除通知失败' }, { status: 500 })
  }
}
