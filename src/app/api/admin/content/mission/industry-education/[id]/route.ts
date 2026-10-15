import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取单个产教融合项目
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params

    const item = await prisma.missionItem.findUnique({
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

    if (!item) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    // 确保是产教融合模块的项目
    if (item.module.category !== 'industry-education') {
      return NextResponse.json({ error: '项目不属于产教融合模块' }, { status: 400 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('获取产教融合项目失败:', error)
    return NextResponse.json({ error: '获取产教融合项目失败' }, { status: 500 })
  }
}

// PUT - 更新产教融合项目
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, content, category, status, featured, image, metadata, sortOrder } =
      body

    // 验证项目是否存在
    const existingItem = await prisma.missionItem.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            category: true,
          },
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    // 确保是产教融合模块的项目
    if (existingItem.module.category !== 'industry-education') {
      return NextResponse.json({ error: '项目不属于产教融合模块' }, { status: 400 })
    }

    // 更新项目
    const updatedItem = await prisma.missionItem.update({
      where: { id },
      data: {
        title,
        description,
        content,
        category,
        status,
        featured,
        image,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        sortOrder,
        authorId: session.user.id,
      },
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

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('更新产教融合项目失败:', error)
    return NextResponse.json({ error: '更新产教融合项目失败' }, { status: 500 })
  }
}

// DELETE - 删除产教融合项目
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params

    // 验证项目是否存在
    const existingItem = await prisma.missionItem.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            category: true,
          },
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    // 确保是产教融合模块的项目
    if (existingItem.module.category !== 'industry-education') {
      return NextResponse.json({ error: '项目不属于产教融合模块' }, { status: 400 })
    }

    // 删除项目
    await prisma.missionItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除产教融合项目失败:', error)
    return NextResponse.json({ error: '删除产教融合项目失败' }, { status: 500 })
  }
}
