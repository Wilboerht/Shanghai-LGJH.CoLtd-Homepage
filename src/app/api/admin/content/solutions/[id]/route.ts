import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - 获取单个解决方案
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params

    const solution = await prisma.solution.findUnique({
      where: { id },
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!solution) {
      return NextResponse.json({ error: '解决方案不存在' }, { status: 404 })
    }

    return NextResponse.json(solution)
  } catch (error) {
    console.error('获取解决方案失败:', error)
    return NextResponse.json({ error: '获取解决方案失败' }, { status: 500 })
  }
}

// PUT - 更新解决方案
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // 检查解决方案是否存在
    const existingSolution = await prisma.solution.findUnique({
      where: { id },
    })

    if (!existingSolution) {
      return NextResponse.json({ error: '解决方案不存在' }, { status: 404 })
    }

    // 如果更新了slug，检查是否与其他解决方案冲突
    if (data.slug && data.slug !== existingSolution.slug) {
      const slugExists = await prisma.solution.findUnique({
        where: { slug: data.slug },
      })

      if (slugExists) {
        return NextResponse.json({ error: 'URL标识已存在' }, { status: 400 })
      }
    }

    // 过滤掉不应该更新的字段
    const { id: _, createdAt, updatedAt, updater, ...updateData } = data

    // 更新解决方案
    const solution = await prisma.solution.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: session.user.id,
      },
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(solution)
  } catch (error) {
    console.error('更新解决方案失败:', error)
    return NextResponse.json({ error: '更新解决方案失败' }, { status: 500 })
  }
}

// DELETE - 删除解决方案
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await params

    // 检查解决方案是否存在
    const existingSolution = await prisma.solution.findUnique({
      where: { id },
    })

    if (!existingSolution) {
      return NextResponse.json({ error: '解决方案不存在' }, { status: 404 })
    }

    // 删除解决方案
    await prisma.solution.delete({
      where: { id },
    })

    return NextResponse.json({ message: '解决方案删除成功' })
  } catch (error) {
    console.error('删除解决方案失败:', error)
    return NextResponse.json({ error: '删除解决方案失败' }, { status: 500 })
  }
}
