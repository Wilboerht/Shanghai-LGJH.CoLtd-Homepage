/**
 * 删除互动记录API
 * 处理单个互动记录的删除操作
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE - 删除互动记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; interactionId: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('=== 删除API调用 ===')
    console.log('请求参数:', resolvedParams)

    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 检查人才是否存在
    const talent = await prisma.talentPool.findUnique({
      where: { id: resolvedParams.id },
      select: { id: true },
    })

    if (!talent) {
      return NextResponse.json({ error: '人才不存在' }, { status: 404 })
    }

    // 检查互动记录是否存在且属于该人才
    const interaction = await prisma.talentInteraction.findFirst({
      where: {
        id: resolvedParams.interactionId,
        talentId: resolvedParams.id,
      },
    })

    if (!interaction) {
      return NextResponse.json({ error: '互动记录不存在' }, { status: 404 })
    }

    // 删除互动记录
    await prisma.talentInteraction.delete({
      where: { id: resolvedParams.interactionId },
    })

    return NextResponse.json({
      success: true,
      message: '互动记录删除成功',
    })
  } catch (error) {
    console.error('删除互动记录失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
