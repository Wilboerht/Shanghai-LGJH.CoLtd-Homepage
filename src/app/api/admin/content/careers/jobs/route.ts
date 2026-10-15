import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 职位创建验证schema
const createJobSchema = z.object({
  title: z.string().min(1, '职位标题不能为空').max(100, '职位标题不能超过100个字符'),
  department: z.string().min(1, '部门不能为空').max(50, '部门名称不能超过50个字符'),
  location: z.string().min(1, '工作地点不能为空').max(50, '工作地点不能超过50个字符'),
  type: z.string().min(1, '工作类型不能为空').max(20, '工作类型不能超过20个字符'),
  experience: z.string().min(1, '经验要求不能为空').max(50, '经验要求不能超过50个字符'),
  salary: z.string().max(50, '薪资范围不能超过50个字符').optional(),
  description: z
    .string()
    .min(10, '职位描述至少需要10个字符')
    .max(5000, '职位描述不能超过5000个字符'),
  requirements: z.array(z.string().min(1, '职位要求不能为空')).min(1, '至少需要添加一个职位要求'),
  benefits: z.array(z.string().min(1, '福利待遇不能为空')).optional().default([]),
  tags: z.string().optional().default(''),
  isHot: z.boolean().optional().default(false),
  isUrgent: z.boolean().optional().default(false),
  status: z.enum(['draft', 'published', 'archived']).optional().default('published'),
  validUntil: z.string().optional(),
})

// GET - 获取职位列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const department = searchParams.get('department')
    const search = searchParams.get('search')

    // 构建查询条件
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (department) {
      where.department = department
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
      ]
    }

    // 获取职位列表
    const [rawJobs, total] = await Promise.all([
      prisma.jobPosition.findMany({
        where,
        include: {
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: [{ isHot: 'desc' }, { isUrgent: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.jobPosition.count({ where }),
    ])

    // 解析JSON字段
    const jobs = rawJobs.map(job => ({
      ...job,
      requirements: job.requirements ? JSON.parse(job.requirements) : [],
      benefits: job.benefits ? JSON.parse(job.benefits) : [],
    }))

    // 获取统计信息
    const stats = {
      total,
      published: await prisma.jobPosition.count({ where: { status: 'published' } }),
      draft: await prisma.jobPosition.count({ where: { status: 'draft' } }),
      archived: await prisma.jobPosition.count({ where: { status: 'archived' } }),
      departments: await prisma.jobPosition.groupBy({
        by: ['department'],
        _count: { department: true },
      }),
    }

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    })
  } catch (error) {
    console.error('获取职位列表失败:', error)
    return NextResponse.json({ error: '获取职位列表失败' }, { status: 500 })
  }
}

// POST - 创建新职位
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    console.log('收到的创建职位数据:', body)

    // 验证请求数据
    const validationResult = createJobSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // 处理有效期
    let validUntil = null
    if (data.validUntil) {
      validUntil = new Date(data.validUntil)
      if (validUntil <= new Date()) {
        return NextResponse.json(
          {
            error: '有效期必须是未来的日期',
          },
          { status: 400 }
        )
      }
    }

    // 调试：打印session信息
    console.log('Session user:', session.user)
    console.log('User ID:', session.user.id)

    // 暂时跳过用户验证，直接创建职位
    console.log('跳过用户验证，直接创建职位')

    // 准备创建数据 - 确保数据类型正确
    const createData = {
      title: data.title,
      department: data.department,
      location: data.location,
      type: data.type,
      experience: data.experience,
      salary: data.salary || '',
      description: data.description,
      requirements: JSON.stringify(data.requirements || []), // 确保数组不为空
      benefits: JSON.stringify(data.benefits || []), // 确保数组不为空
      tags: data.tags || '',
      isHot: data.isHot || false,
      isUrgent: data.isUrgent || false,
      status: data.status || 'published',
      createdBy: session.user.id,
    }

    console.log('准备创建职位，数据:', createData)

    // 创建职位
    const job = await prisma.jobPosition.create({
      data: createData,
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateCareer()

    // 记录操作日志
    console.log('职位创建成功:', {
      id: job.id,
      title: job.title,
      department: job.department,
      status: job.status,
    })

    return NextResponse.json({
      success: true,
      message: data.status === 'published' ? '职位发布成功' : '草稿保存成功',
      job,
    })
  } catch (error) {
    console.error('创建职位失败:', error)

    // 处理数据库约束错误
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            error: '职位标题已存在，请使用不同的标题',
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ error: '创建职位失败' }, { status: 500 })
  }
}
