/**
 * 管理员地址管理API
 * 用于管理公司多个地址信息
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

// 创建地址验证
const createLocationSchema = z.object({
  name: z.string().min(1, '地址名称不能为空').max(100, '地址名称过长'),
  type: LocationTypeEnum,
  address: z.string().min(1, '详细地址不能为空').max(500, '地址过长'),
  phone: z.string().optional(),
  email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  description: z.string().max(1000, '描述过长').optional(),
  isDefault: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
  businessHours: BusinessHoursSchema,
  contactPerson: z.string().max(100, '联系人姓名过长').optional(),
})

// 更新地址验证
const updateLocationSchema = createLocationSchema.partial()

// 查询参数验证
const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  type: LocationTypeEnum.optional(),
  isActive: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'type', 'sortOrder', 'createdAt']).optional().default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
})

// GET - 获取地址列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      type: searchParams.get('type') || undefined,
      isActive: searchParams.get('isActive') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'sortOrder',
      sortOrder: searchParams.get('sortOrder') || 'asc',
    })

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (query.type) {
      where.type = query.type
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true'
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { contactPerson: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    // 构建排序
    const orderBy: any = {}
    orderBy[query.sortBy] = query.sortOrder

    const [locations, total] = await Promise.all([
      prisma.companyLocation.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.companyLocation.count({ where }),
    ])

    return NextResponse.json({
      data: locations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('获取地址列表失败:', error)
    return NextResponse.json({ error: '获取地址列表失败' }, { status: 500 })
  }
}

// POST - 创建新地址
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createLocationSchema.parse(body)

    // 如果设置为默认地址，先取消其他默认地址
    if (validatedData.isDefault) {
      await prisma.companyLocation.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    // 处理营业时间
    const businessHoursJson = validatedData.businessHours
      ? JSON.stringify(validatedData.businessHours)
      : null

    const location = await prisma.companyLocation.create({
      data: {
        ...validatedData,
        businessHours: businessHoursJson,
      },
    })

    return NextResponse.json({
      message: '地址创建成功',
      data: location,
    })
  } catch (error) {
    console.error('创建地址失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: error.issues,
        },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: '创建地址失败' }, { status: 500 })
  }
}

// PUT - 批量更新地址
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { action, ids, data } = body

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: '无效的批量操作参数' }, { status: 400 })
    }

    let result
    switch (action) {
      case 'activate':
        result = await prisma.companyLocation.updateMany({
          where: { id: { in: ids } },
          data: { isActive: true },
        })
        break

      case 'deactivate':
        result = await prisma.companyLocation.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        })
        break

      case 'updateSortOrder':
        if (!data || !Array.isArray(data)) {
          return NextResponse.json({ error: '缺少排序数据' }, { status: 400 })
        }

        // 批量更新排序
        const updatePromises = data.map((item: { id: string; sortOrder: number }) =>
          prisma.companyLocation.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )

        result = await Promise.all(updatePromises)
        break

      default:
        return NextResponse.json({ error: '不支持的批量操作' }, { status: 400 })
    }

    return NextResponse.json({
      message: `批量操作成功`,
      count: Array.isArray(result) ? result.length : result.count,
    })
  } catch (error) {
    console.error('批量操作失败:', error)
    return NextResponse.json({ error: '批量操作失败' }, { status: 500 })
  }
}

// DELETE - 批量删除地址
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')

    if (!idsParam) {
      return NextResponse.json({ error: '缺少地址ID' }, { status: 400 })
    }

    const ids = idsParam.split(',')

    // 检查是否要删除默认地址
    const defaultLocation = await prisma.companyLocation.findFirst({
      where: {
        id: { in: ids },
        isDefault: true,
      },
    })

    if (defaultLocation) {
      return NextResponse.json(
        {
          error: '不能删除默认地址，请先设置其他地址为默认地址',
        },
        { status: 400 }
      )
    }

    const result = await prisma.companyLocation.deleteMany({
      where: { id: { in: ids } },
    })

    return NextResponse.json({
      message: `成功删除 ${result.count} 个地址`,
      count: result.count,
    })
  } catch (error) {
    console.error('删除地址失败:', error)
    return NextResponse.json({ error: '删除地址失败' }, { status: 500 })
  }
}
