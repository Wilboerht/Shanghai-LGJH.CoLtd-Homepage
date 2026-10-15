import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 合作伙伴更新验证模式
const partnerUpdateSchema = z.object({
  name: z.string().min(1, '合作伙伴名称不能为空').optional(),
  logo: z.string().optional(),
  logoText: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
})

// GET - 获取单个合作伙伴
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const partner = await prisma.partner.findUnique({
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

    if (!partner) {
      return NextResponse.json({ error: '合作伙伴不存在' }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('获取合作伙伴失败:', error)
    return NextResponse.json({ error: '获取合作伙伴失败' }, { status: 500 })
  }
}

// PUT - 更新合作伙伴
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const body = await request.json()

    // 验证数据
    const validatedData = partnerUpdateSchema.parse(body)

    // 检查合作伙伴是否存在
    const existingPartner = await prisma.partner.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingPartner) {
      return NextResponse.json({ error: '合作伙伴不存在' }, { status: 404 })
    }

    // 更新合作伙伴
    const partner = await prisma.partner.update({
      where: { id: resolvedParams.id },
      data: {
        ...validatedData,
        // updatedBy 字段是可选的，暂时不设置
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
    await CacheManager.revalidatePartner()

    return NextResponse.json(partner)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新合作伙伴失败:', error)
    return NextResponse.json({ error: '更新合作伙伴失败' }, { status: 500 })
  }
}

// DELETE - 删除合作伙伴
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // 检查合作伙伴是否存在
    const existingPartner = await prisma.partner.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingPartner) {
      return NextResponse.json({ error: '合作伙伴不存在' }, { status: 404 })
    }

    // 删除合作伙伴
    await prisma.partner.delete({
      where: { id: resolvedParams.id },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidatePartner()

    return NextResponse.json({ message: '合作伙伴删除成功' })
  } catch (error) {
    console.error('删除合作伙伴失败:', error)
    return NextResponse.json({ error: '删除合作伙伴失败' }, { status: 500 })
  }
}
