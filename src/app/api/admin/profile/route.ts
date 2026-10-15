import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// 个人资料更新验证schema
const updateProfileSchema = z
  .object({
    name: z.string().min(1, '姓名不能为空').max(100, '姓名过长').optional(),
    email: z.string().email('邮箱格式不正确').optional(),
    avatarUrl: z
      .union([
        z.string().url('头像URL格式不正确'), // 完整URL
        z.string().startsWith('/', '头像路径格式不正确'), // 相对路径
        z.null(),
        z.undefined(),
      ])
      .optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, '新密码至少6位').optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    data => {
      // 如果要修改密码，必须提供当前密码
      if (data.newPassword && !data.currentPassword) {
        return false
      }
      // 如果提供了新密码，确认密码必须匹配
      if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
        return false
      }
      return true
    },
    {
      message: '密码验证失败',
    }
  )

// GET - 获取当前用户个人资料
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isAdmin: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('获取个人资料失败:', error)
    return NextResponse.json({ error: '获取个人资料失败' }, { status: 500 })
  }
}

// PUT - 更新个人资料
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json()
    console.log('收到的请求数据:', body)

    try {
      const validatedData = updateProfileSchema.parse(body)
      console.log('验证通过的数据:', validatedData)
    } catch (validationError) {
      console.error('数据验证失败:', validationError)
      throw validationError
    }

    const validatedData = updateProfileSchema.parse(body)

    // 获取当前用户信息
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    // 如果更新邮箱，检查是否与其他用户冲突
    if (validatedData.email && validatedData.email !== currentUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (emailExists) {
        return NextResponse.json({ error: '邮箱已被其他用户使用' }, { status: 400 })
      }
    }

    // 如果要修改密码，验证当前密码
    if (validatedData.newPassword) {
      if (!validatedData.currentPassword) {
        return NextResponse.json({ error: '请输入当前密码' }, { status: 400 })
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        validatedData.currentPassword,
        currentUser.passwordHash
      )

      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: '当前密码不正确' }, { status: 400 })
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

    if (validatedData.avatarUrl !== undefined) {
      updateData.avatarUrl = validatedData.avatarUrl
    }

    if (validatedData.newPassword) {
      updateData.passwordHash = await bcrypt.hash(validatedData.newPassword, 12)
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isAdmin: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: '个人资料更新成功',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error('更新个人资料失败:', error)
    return NextResponse.json({ error: '更新个人资料失败' }, { status: 500 })
  }
}
