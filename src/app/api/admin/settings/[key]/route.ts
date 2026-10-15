import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 设置更新验证
const settingUpdateSchema = z.object({
  value: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
})

// GET - 获取单个设置项
export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { key } = await params

    const setting = await prisma.siteConfig.findUnique({
      where: { key: decodeURIComponent(key) },
    })

    if (!setting) {
      return NextResponse.json({ error: '设置项不存在' }, { status: 404 })
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error('获取设置项失败:', error)
    return NextResponse.json({ error: '获取设置项失败' }, { status: 500 })
  }
}

// PUT - 更新单个设置项
export async function PUT(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { key } = await params
    const body = await request.json()
    const validatedData = settingUpdateSchema.parse(body)

    // 检查设置项是否存在
    const existingSetting = await prisma.siteConfig.findUnique({
      where: { key: decodeURIComponent(key) },
    })

    if (!existingSetting) {
      return NextResponse.json({ error: '设置项不存在' }, { status: 404 })
    }

    const setting = await prisma.siteConfig.update({
      where: { key: decodeURIComponent(key) },
      data: validatedData,
    })

    return NextResponse.json(setting)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新设置项失败:', error)
    return NextResponse.json({ error: '更新设置项失败' }, { status: 500 })
  }
}

// DELETE - 删除设置项
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { key } = await params

    // 检查设置项是否存在
    const existingSetting = await prisma.siteConfig.findUnique({
      where: { key: decodeURIComponent(key) },
    })

    if (!existingSetting) {
      return NextResponse.json({ error: '设置项不存在' }, { status: 404 })
    }

    await prisma.siteConfig.delete({
      where: { key: decodeURIComponent(key) },
    })

    return NextResponse.json({ message: '设置项删除成功' })
  } catch (error) {
    console.error('删除设置项失败:', error)
    return NextResponse.json({ error: '删除设置项失败' }, { status: 500 })
  }
}
