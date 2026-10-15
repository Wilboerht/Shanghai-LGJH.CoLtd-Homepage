import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// 用户更新验证schema
const updateUserSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100, '姓名过长').optional(),
  email: z.string().email('邮箱格式不正确').optional(),
  password: z.string().min(6, '密码至少6位').optional(),
  isAdmin: z.boolean().optional(),
})

// GET - 获取单个用户详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            contactSubmissions: true,
            products: true,
            solutions: true,
            services: true,
            articles: true,
            missionModules: true,
            missionItems: true,
            research: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return NextResponse.json({ error: '获取用户详情失败' }, { status: 500 })
  }
}

// PUT - 更新用户
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 如果更新邮箱，检查是否与其他用户冲突
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (emailExists) {
        return NextResponse.json({ error: '邮箱已被其他用户使用' }, { status: 400 })
      }
    }

    // 准备更新数据
    const updateData: any = {}

    if (validatedData.name) {
      updateData.name = validatedData.name
    }

    if (validatedData.email) {
      updateData.email = validatedData.email
    }

    if (validatedData.password) {
      updateData.passwordHash = await bcrypt.hash(validatedData.password, 12)
    }

    if (typeof validatedData.isAdmin === 'boolean') {
      // 防止用户移除自己的管理员权限
      if (id === session.user.id && !validatedData.isAdmin) {
        return NextResponse.json({ error: '不能移除自己的管理员权限' }, { status: 400 })
      }
      updateData.isAdmin = validatedData.isAdmin
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: '用户更新成功',
      user: updatedUser,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error('更新用户失败:', error)
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 })
  }
}

// DELETE - 删除用户
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

    // 防止删除自己
    if (id === session.user.id) {
      return NextResponse.json({ error: '不能删除当前登录的用户' }, { status: 400 })
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 删除用户
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({
      message: '用户删除成功',
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 })
  }
}

// PATCH - 重置用户密码
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, newPassword } = body

    if (action !== 'resetPassword') {
      return NextResponse.json({ error: '不支持的操作' }, { status: 400 })
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: '新密码至少6位' }, { status: 400 })
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 重置密码
    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    })

    return NextResponse.json({
      message: '密码重置成功',
    })
  } catch (error) {
    console.error('重置密码失败:', error)
    return NextResponse.json({ error: '重置密码失败' }, { status: 500 })
  }
}
