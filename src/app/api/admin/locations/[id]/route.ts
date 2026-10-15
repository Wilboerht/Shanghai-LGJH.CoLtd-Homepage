/**
 * 单个地址管理API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 地址类型枚举
const LocationTypeEnum = z.enum([
  'HEADQUARTERS',
  'BRANCH',
  'OFFICE',
  'SHOWROOM',
  'WAREHOUSE',
  'FACTORY',
  'SERVICE_CENTER',
  'OTHER',
])

// 营业时间验证
const BusinessHoursSchema = z
  .object({
    monday: z
      .object({ open: z.string(), close: z.string() })
      .or(z.object({ closed: z.boolean() }))
      .optional(),
    tuesday: z
      .object({ open: z.string(), close: z.string() })
      .or(z.object({ closed: z.boolean() }))
      .optional(),
    wednesday: z
      .object({ open: z.string(), close: z.string() })
      .or(z.object({ closed: z.boolean() }))
      .optional(),
    thursday: z
      .object({ open: z.string(), close: z.string() })
      .or(z.object({ closed: z.boolean() }))
      .optional(),
    friday: z
      .object({ open: z.string(), close: z.string() })
      .or(z.object({ closed: z.boolean() }))
      .optional(),
    saturday: z
      .object({ open: z.string(), close: z.string() })
      .or(z.object({ closed: z.boolean() }))
      .optional(),
    sunday: z
      .object({ open: z.string(), close: z.string() })
      .or(z.object({ closed: z.boolean() }))
      .optional(),
  })
  .optional()

// 更新地址验证
const updateLocationSchema = z.object({
  name: z.string().min(1, '地址名称不能为空').max(100, '地址名称过长').optional(),
  type: LocationTypeEnum.optional(),
  address: z.string().min(1, '详细地址不能为空').max(500, '地址过长').optional(),
  phone: z.string().optional(),
  email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  description: z.string().max(1000, '描述过长').optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  businessHours: BusinessHoursSchema,
  contactPerson: z.string().max(100, '联系人姓名过长').optional(),
})

// GET - 获取单个地址
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id } = await params

    const location = await prisma.companyLocation.findUnique({
      where: { id },
    })

    if (!location) {
      return NextResponse.json({ error: '地址不存在' }, { status: 404 })
    }

    // 解析营业时间
    let businessHours = null
    if (location.businessHours) {
      try {
        businessHours = JSON.parse(location.businessHours)
      } catch (e) {
        console.warn('解析营业时间失败:', e)
      }
    }

    return NextResponse.json({
      ...location,
      businessHours,
    })
  } catch (error) {
    console.error('获取地址失败:', error)
    return NextResponse.json({ error: '获取地址失败' }, { status: 500 })
  }
}

// PUT - 更新单个地址
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    console.log('Received body:', JSON.stringify(body, null, 2)) // 调试信息
    const validatedData = updateLocationSchema.parse(body)

    // 检查地址是否存在
    const existingLocation = await prisma.companyLocation.findUnique({
      where: { id },
    })

    if (!existingLocation) {
      return NextResponse.json({ error: '地址不存在' }, { status: 404 })
    }

    // 如果设置为默认地址，先取消其他默认地址
    if (validatedData.isDefault && !existingLocation.isDefault) {
      await prisma.companyLocation.updateMany({
        where: {
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      })
    }

    // 处理营业时间
    const businessHoursJson = validatedData.businessHours
      ? JSON.stringify(validatedData.businessHours)
      : undefined

    const location = await prisma.companyLocation.update({
      where: { id },
      data: {
        ...validatedData,
        businessHours: businessHoursJson,
      },
    })

    return NextResponse.json({
      message: '地址更新成功',
      data: location,
    })
  } catch (error) {
    console.error('更新地址失败:', error)
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.issues) // 详细日志
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: error.issues,
        },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: '更新地址失败' }, { status: 500 })
  }
}

// DELETE - 删除单个地址
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { id } = await params

    // 检查地址是否存在
    const existingLocation = await prisma.companyLocation.findUnique({
      where: { id },
    })

    if (!existingLocation) {
      return NextResponse.json({ error: '地址不存在' }, { status: 404 })
    }

    // 不能删除默认地址
    if (existingLocation.isDefault) {
      return NextResponse.json(
        {
          error: '不能删除默认地址，请先设置其他地址为默认地址',
        },
        { status: 400 }
      )
    }

    await prisma.companyLocation.delete({
      where: { id },
    })

    return NextResponse.json({
      message: '地址删除成功',
    })
  } catch (error) {
    console.error('删除地址失败:', error)
    return NextResponse.json({ error: '删除地址失败' }, { status: 500 })
  }
}
