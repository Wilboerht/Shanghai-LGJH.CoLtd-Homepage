/**
 * 人才互动记录API
 * 处理人才的互动记录创建和查询
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 创建互动记录验证schema
const createInteractionSchema = z.object({
  type: z.enum(['EMAIL', 'PHONE', 'INTERVIEW', 'NOTE', 'FOLLOW_UP']),
  content: z.string().min(1, '内容不能为空'),
  scheduledAt: z.string().optional(), // 可选的下次行动时间
})

// GET - 获取人才的互动记录
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
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

    // 获取互动记录
    const interactions = await prisma.talentInteraction.findMany({
      where: { talentId: resolvedParams.id },
      orderBy: { createdAt: 'desc' },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // 格式化返回数据
    const formattedInteractions = interactions.map(interaction => ({
      id: interaction.id,
      type: interaction.type,
      content: interaction.content,
      nextAction: interaction.nextAction,
      scheduledAt: interaction.scheduledAt,
      createdBy: interaction.createdByUser.name,
      createdByEmail: interaction.createdByUser.email,
      createdAt: interaction.createdAt,
    }))

    return NextResponse.json({
      interactions: formattedInteractions,
      total: interactions.length,
    })
  } catch (error) {
    console.error('获取互动记录失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// POST - 创建新的互动记录
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createInteractionSchema.parse(body)

    // 检查人才是否存在
    const talent = await prisma.talentPool.findUnique({
      where: { id: resolvedParams.id },
      include: {
        application: {
          select: { applicantName: true },
        },
      },
    })

    if (!talent) {
      return NextResponse.json({ error: '人才不存在' }, { status: 404 })
    }

    // 创建互动记录
    const interaction = await prisma.talentInteraction.create({
      data: {
        talentId: resolvedParams.id,
        type: validatedData.type,
        content: validatedData.content,
        createdBy: session.user.id,
      },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // 更新人才的最后联系时间
    if (validatedData.type === 'EMAIL' || validatedData.type === 'PHONE') {
      await prisma.talentPool.update({
        where: { id: resolvedParams.id },
        data: {
          lastContactAt: new Date(),
          availability: 'CONTACTED',
        },
      })
    }

    // 如果设置了下次行动时间，更新人才的跟进时间
    if (validatedData.scheduledAt) {
      await prisma.talentPool.update({
        where: { id: resolvedParams.id },
        data: {
          nextFollowUp: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined,
        },
      })
    }

    return NextResponse.json({
      success: true,
      interaction: {
        id: interaction.id,
        type: interaction.type,
        content: interaction.content,
        nextAction: interaction.nextAction,
        scheduledAt: interaction.scheduledAt,
        createdBy: interaction.createdByUser.name,
        createdAt: interaction.createdAt,
      },
      message: `已为 ${talent.application.applicantName} 添加${getInteractionTypeName(validatedData.type)}记录`,
    })
  } catch (error) {
    console.error('创建互动记录失败:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// 获取互动类型中文名称
function getInteractionTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    EMAIL: '邮件沟通',
    PHONE: '电话沟通',
    INTERVIEW: '面试',
    NOTE: '备注',
    FOLLOW_UP: '跟进',
  }
  return typeMap[type] || type
}
