import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 企业资质验证schema
const qualificationSchema = z.object({
  title: z.string().min(1, '资质名称不能为空'),
  image: z.string().optional(),
  displayOrder: z.number().default(0),
})

// GET - 获取单个企业资质详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params

    const qualification = await prisma.qualification.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!qualification) {
      return NextResponse.json({ error: '企业资质不存在' }, { status: 404 })
    }

    return NextResponse.json(qualification)
  } catch (error) {
    console.error('获取企业资质详情失败:', error)
    return NextResponse.json({ error: '获取企业资质详情失败' }, { status: 500 })
  }
}

// PUT - 更新企业资质
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = qualificationSchema.parse(body)

    // 检查企业资质是否存在
    const existingQualification = await prisma.qualification.findUnique({
      where: { id },
    })

    if (!existingQualification) {
      return NextResponse.json({ error: '企业资质不存在' }, { status: 404 })
    }

    // 准备更新数据
    const data: any = {
      ...validatedData,
      updatedBy: session.user.id,
    }

    const qualification = await prisma.qualification.update({
      where: { id },
      data,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(qualification)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新企业资质失败:', error)
    return NextResponse.json({ error: '更新企业资质失败' }, { status: 500 })
  }
}

// DELETE - 删除企业资质
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

    // 检查企业资质是否存在
    const existingQualification = await prisma.qualification.findUnique({
      where: { id },
    })

    if (!existingQualification) {
      return NextResponse.json({ error: '企业资质不存在' }, { status: 404 })
    }

    await prisma.qualification.delete({
      where: { id },
    })

    return NextResponse.json({ message: '企业资质删除成功' })
  } catch (error) {
    console.error('删除企业资质失败:', error)
    return NextResponse.json({ error: '删除企业资质失败' }, { status: 500 })
  }
}
