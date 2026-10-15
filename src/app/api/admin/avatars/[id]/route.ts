import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// 头像更新验证schema
const avatarUpdateSchema = z.object({
  name: z.string().min(1, '显示名称不能为空').optional(),
  filename: z.string().min(1, '文件名不能为空').optional(),
  url: z.string().url('请输入有效的URL').optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  isActive: z.boolean().optional(),
})

// 权限验证中间件
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isAdmin: true },
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
  }

  return user
}

// GET - 获取单个头像详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params

    const avatar = await prisma.avatar.findUnique({
      where: { id },
      include: {
        uploader: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!avatar) {
      return NextResponse.json({ error: '头像不存在' }, { status: 404 })
    }

    return NextResponse.json(avatar)
  } catch (error) {
    console.error('获取头像详情失败:', error)
    return NextResponse.json({ error: '获取头像详情失败' }, { status: 500 })
  }
}

// PUT - 更新头像
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params
    const body = await request.json()
    const validatedData = avatarUpdateSchema.parse(body)

    // 检查头像是否存在
    const existingAvatar = await prisma.avatar.findUnique({
      where: { id },
    })

    if (!existingAvatar) {
      return NextResponse.json({ error: '头像不存在' }, { status: 404 })
    }

    // 如果更新文件名，检查是否与其他头像冲突
    if (validatedData.filename && validatedData.filename !== existingAvatar.filename) {
      const conflictAvatar = await prisma.avatar.findUnique({
        where: { filename: validatedData.filename },
      })

      if (conflictAvatar) {
        return NextResponse.json({ error: '文件名已存在' }, { status: 400 })
      }
    }

    // 更新头像
    const updatedAvatar = await prisma.avatar.update({
      where: { id },
      data: validatedData,
      include: {
        uploader: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(updatedAvatar)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }
    console.error('更新头像失败:', error)
    return NextResponse.json({ error: '更新头像失败' }, { status: 500 })
  }
}

// DELETE - 删除头像
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params

    // 检查头像是否存在
    const existingAvatar = await prisma.avatar.findUnique({
      where: { id },
    })

    if (!existingAvatar) {
      return NextResponse.json({ error: '头像不存在' }, { status: 404 })
    }

    // 删除头像记录
    await prisma.avatar.delete({
      where: { id },
    })

    return NextResponse.json({ message: '头像删除成功' })
  } catch (error) {
    console.error('删除头像失败:', error)
    return NextResponse.json({ error: '删除头像失败' }, { status: 500 })
  }
}
