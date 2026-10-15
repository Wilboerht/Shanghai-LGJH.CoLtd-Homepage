import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 荣誉奖项验证模式
const awardSchema = z.object({
  title: z.string().min(1, '奖项名称不能为空'),
  description: z.string().optional(),
  image: z.string().optional(),
  category: z.string().min(1, '奖项类别不能为空'),
  issuer: z.string().optional(),
  awardDate: z.string().optional(),
  year: z.string().optional(),
  level: z.string().optional(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
})

// GET - 获取单个荣誉奖项
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const award = await prisma.award.findUnique({
      where: { id: resolvedParams.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!award) {
      return NextResponse.json({ error: '荣誉奖项不存在' }, { status: 404 })
    }

    return NextResponse.json(award)
  } catch (error) {
    console.error('获取荣誉奖项失败:', error)
    return NextResponse.json({ error: '获取荣誉奖项失败' }, { status: 500 })
  }
}

// PUT - 更新荣誉奖项
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = awardSchema.parse(body)

    // 检查奖项是否存在
    const existingAward = await prisma.award.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingAward) {
      return NextResponse.json({ error: '荣誉奖项不存在' }, { status: 404 })
    }

    // 处理日期
    const awardDate = validatedData.awardDate ? new Date(validatedData.awardDate) : null

    // 从validatedData中移除awardDate，因为我们要单独处理
    const { awardDate: _, ...updateData } = validatedData

    const award = await prisma.award.update({
      where: { id: resolvedParams.id },
      data: {
        ...updateData,
        awardDate,
        updatedBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(award)
  } catch (error) {
    console.error('更新荣誉奖项失败:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: '更新荣誉奖项失败' }, { status: 500 })
  }
}

// DELETE - 删除荣誉奖项
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const resolvedParams = await params

    // 检查奖项是否存在
    const existingAward = await prisma.award.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingAward) {
      return NextResponse.json({ error: '荣誉奖项不存在' }, { status: 404 })
    }

    await prisma.award.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: '荣誉奖项删除成功' })
  } catch (error) {
    console.error('删除荣誉奖项失败:', error)
    return NextResponse.json({ error: '删除荣誉奖项失败' }, { status: 500 })
  }
}
