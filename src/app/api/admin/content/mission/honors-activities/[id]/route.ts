import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取单个荣誉活动项目
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const resolvedParams = await params
    const item = await prisma.missionItem.findUnique({
      where: { id: resolvedParams.id },
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

    // 确保是荣誉活动模块的项目
    if (item.module.category !== 'honors-activities') {
      return NextResponse.json({ error: '项目不属于荣誉活动模块' }, { status: 400 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('获取荣誉活动项目失败:', error)
    return NextResponse.json({ error: '获取荣誉活动项目失败' }, { status: 500 })
  }
}

// PUT - 更新荣誉活动项目
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const resolvedParams = await params
    const body = await request.json()
    const { title, description, date, category, status, featured, sortOrder } = body

    // 验证项目是否存在
    const existingItem = await prisma.missionItem.findUnique({
      where: { id: resolvedParams.id },
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

    // 确保是荣誉活动模块的项目
    if (existingItem.module.category !== 'honors-activities') {
      return NextResponse.json({ error: '项目不属于荣誉活动模块' }, { status: 400 })
    }

    // 更新项目
    const updatedItem = await prisma.missionItem.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        category,
        status,
        featured,
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
    console.error('更新荣誉活动项目失败:', error)
    return NextResponse.json({ error: '更新荣誉活动项目失败' }, { status: 500 })
  }
}

// PATCH - 部分更新荣誉活动项目（如状态切换）
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const resolvedParams = await params
    const body = await request.json()

    // 验证项目是否存在
    const existingItem = await prisma.missionItem.findUnique({
      where: { id: resolvedParams.id },
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

    // 确保是荣誉活动模块的项目
    if (existingItem.module.category !== 'honors-activities') {
      return NextResponse.json({ error: '项目不属于荣誉活动模块' }, { status: 400 })
    }

    // 部分更新项目
    const updatedItem = await prisma.missionItem.update({
      where: { id: resolvedParams.id },
      data: {
        ...body,
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
    console.error('更新荣誉活动项目失败:', error)
    return NextResponse.json({ error: '更新荣誉活动项目失败' }, { status: 500 })
  }
}

// DELETE - 删除荣誉活动项目
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

    // 验证项目是否存在
    const existingItem = await prisma.missionItem.findUnique({
      where: { id: resolvedParams.id },
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

    // 确保是荣誉活动模块的项目
    if (existingItem.module.category !== 'honors-activities') {
      return NextResponse.json({ error: '项目不属于荣誉活动模块' }, { status: 400 })
    }

    // 删除项目
    await prisma.missionItem.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: '项目删除成功' })
  } catch (error) {
    console.error('删除荣誉活动项目失败:', error)
    return NextResponse.json({ error: '删除荣誉活动项目失败' }, { status: 500 })
  }
}
