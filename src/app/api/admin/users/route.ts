import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// 用户创建验证schema
const createUserSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100, '姓名过长'),
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少6位'),
  isAdmin: z.boolean().default(false),
})

// 用户更新验证schema
const updateUserSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100, '姓名过长').optional(),
  email: z.string().email('邮箱格式不正确').optional(),
  password: z.string().min(6, '密码至少6位').optional(),
  isAdmin: z.boolean().optional(),
})

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [{ name: { contains: search } }, { email: { contains: search } }]
    }

    if (role === 'admin') {
      where.isAdmin = true
    } else if (role === 'user') {
      where.isAdmin = false
    }

    // 获取总数
    const total = await prisma.user.count({ where })

    // 获取用户列表
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
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
            articles: true,
            products: true,
          },
        },
      },
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 })
  }
}

// POST - 创建新用户
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: '邮箱已存在' }, { status: 400 })
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(validatedData.password, 12)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        isAdmin: validatedData.isAdmin,
      },
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
      message: '用户创建成功',
      user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage =
        error.issues && error.issues.length > 0 ? error.issues[0].message : '数据验证失败'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    console.error('创建用户失败:', error)
    return NextResponse.json({ error: '创建用户失败' }, { status: 500 })
  }
}

// PUT - 批量更新用户
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const { action, userIds, data } = body

    if (!action || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    let result
    switch (action) {
      case 'updateRole':
        if (typeof data.isAdmin !== 'boolean') {
          return NextResponse.json({ error: '角色参数错误' }, { status: 400 })
        }
        result = await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { isAdmin: data.isAdmin },
        })
        break

      case 'delete':
        // 防止删除当前登录的管理员
        if (userIds.includes(session.user.id)) {
          return NextResponse.json({ error: '不能删除当前登录的用户' }, { status: 400 })
        }
        result = await prisma.user.deleteMany({
          where: { id: { in: userIds } },
        })
        break

      default:
        return NextResponse.json({ error: '不支持的批量操作' }, { status: 400 })
    }

    return NextResponse.json({
      message: `批量操作成功，影响 ${result.count} 个用户`,
      count: result.count,
    })
  } catch (error) {
    console.error('批量操作失败:', error)
    return NextResponse.json({ error: '批量操作失败' }, { status: 500 })
  }
}

// DELETE - 批量删除用户
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userIds = searchParams.get('ids')?.split(',') || []

    if (userIds.length === 0) {
      return NextResponse.json({ error: '请选择要删除的用户' }, { status: 400 })
    }

    // 防止删除当前登录的管理员
    if (userIds.includes(session.user.id)) {
      return NextResponse.json({ error: '不能删除当前登录的用户' }, { status: 400 })
    }

    const result = await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    })

    return NextResponse.json({
      message: `成功删除 ${result.count} 个用户`,
      count: result.count,
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 })
  }
}
