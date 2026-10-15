import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 客户案例更新验证模式
const clientCaseUpdateSchema = z.object({
  name: z.string().min(1, '客户名称不能为空').optional(),
  logo: z.string().optional(),
  industry: z.string().min(1, '行业分类不能为空').optional(),
  title: z.string().min(1, '案例标题不能为空').optional(),
  description: z.string().min(1, '案例描述不能为空').optional(),
  image: z.string().optional(),
  metrics: z.string().optional(),
  tags: z.string().optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

// GET - 获取单个客户案例
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const resolvedParams = await params
    const clientCase = await prisma.clientCase.findUnique({
      where: { id: resolvedParams.id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!clientCase) {
      return NextResponse.json({ error: '客户案例不存在' }, { status: 404 })
    }

    return NextResponse.json(clientCase)
  } catch (error) {
    console.error('获取客户案例失败:', error)
    return NextResponse.json({ error: '获取客户案例失败' }, { status: 500 })
  }
}

// PUT - 更新客户案例
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const resolvedParams = await params
    const body = await request.json()

    // 验证数据
    const validatedData = clientCaseUpdateSchema.parse(body)

    // 检查客户案例是否存在
    const existingCase = await prisma.clientCase.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingCase) {
      return NextResponse.json({ error: '客户案例不存在' }, { status: 404 })
    }

    // 更新客户案例
    const clientCase = await prisma.clientCase.update({
      where: { id: resolvedParams.id },
      data: {
        ...validatedData,
        updatedBy: session.user.id,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateClientCase()

    return NextResponse.json(clientCase)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新客户案例失败:', error)
    return NextResponse.json({ error: '更新客户案例失败' }, { status: 500 })
  }
}

// DELETE - 删除客户案例
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
    // 检查客户案例是否存在
    const existingCase = await prisma.clientCase.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingCase) {
      return NextResponse.json({ error: '客户案例不存在' }, { status: 404 })
    }

    // 删除客户案例
    await prisma.clientCase.delete({
      where: { id: resolvedParams.id },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateClientCase()

    return NextResponse.json({ message: '客户案例删除成功' })
  } catch (error) {
    console.error('删除客户案例失败:', error)
    return NextResponse.json({ error: '删除客户案例失败' }, { status: 500 })
  }
}
