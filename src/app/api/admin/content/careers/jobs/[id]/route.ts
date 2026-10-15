import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 职位更新验证schema
const updateJobSchema = z.object({
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
})

// GET - 获取单个职位详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const jobId = resolvedParams.id

    // 获取职位详情
    const job = await prisma.jobPosition.findUnique({
      where: { id: jobId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: '职位不存在' }, { status: 404 })
    }

    // 解析JSON字段（如果是字符串则解析，如果已经是数组则直接使用）
    const parseJsonField = (field: any) => {
      if (!field) return []
      if (Array.isArray(field)) return field
      if (typeof field === 'string') {
        try {
          return JSON.parse(field)
        } catch {
          return []
        }
      }
      return []
    }

    const jobWithParsedFields = {
      ...job,
      requirements: parseJsonField(job.requirements),
      benefits: parseJsonField(job.benefits),
      tags: parseJsonField(job.tags),
    }

    return NextResponse.json(jobWithParsedFields)
  } catch (error) {
    console.error('获取职位详情失败:', error)
    return NextResponse.json({ error: '获取职位详情失败' }, { status: 500 })
  }
}

// PUT - 更新职位
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const jobId = resolvedParams.id
    const body = await request.json()

    // 验证请求数据
    const validationResult = updateJobSchema.safeParse(body)
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

    // 检查职位是否存在
    const existingJob = await prisma.jobPosition.findUnique({
      where: { id: jobId },
    })

    if (!existingJob) {
      return NextResponse.json({ error: '职位不存在' }, { status: 404 })
    }

    // 注意：validUntil字段在当前数据库模型中不存在，暂时跳过

    // 更新职位
    const updatedJob = await prisma.jobPosition.update({
      where: { id: jobId },
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        experience: data.experience,
        salary: data.salary || '',
        description: data.description,
        requirements: JSON.stringify(data.requirements), // 转换为JSON字符串
        benefits: JSON.stringify(data.benefits), // 转换为JSON字符串
        status: data.status,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    // 记录操作日志 - AdminLog模型暂未实现
    console.log('职位更新成功:', {
      jobId,
      title: updatedJob.title,
      department: updatedJob.department,
      status: updatedJob.status,
      updatedBy: session.user.id,
    })

    // 解析JSON字段用于返回
    const jobWithParsedFields = {
      ...updatedJob,
      requirements: updatedJob.requirements ? JSON.parse(updatedJob.requirements) : [],
      benefits: updatedJob.benefits ? JSON.parse(updatedJob.benefits) : [],
    }

    return NextResponse.json({
      success: true,
      message: data.status === 'published' ? '职位更新并发布成功' : '职位更新成功',
      job: jobWithParsedFields,
    })
  } catch (error) {
    console.error('更新职位失败:', error)

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

    return NextResponse.json({ error: '更新职位失败' }, { status: 500 })
  }
}

// DELETE - 删除职位
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

    const jobId = resolvedParams.id

    // 检查职位是否存在
    const existingJob = await prisma.jobPosition.findUnique({
      where: { id: jobId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })

    if (!existingJob) {
      return NextResponse.json({ error: '职位不存在' }, { status: 404 })
    }

    // 检查是否有申请
    if (existingJob._count.applications > 0) {
      return NextResponse.json(
        {
          error: `该职位有 ${existingJob._count.applications} 个申请，无法删除。请先处理相关申请。`,
        },
        { status: 400 }
      )
    }

    // 删除职位
    await prisma.jobPosition.delete({
      where: { id: jobId },
    })

    // 记录操作日志 - AdminLog模型暂未实现
    console.log('职位删除成功:', {
      jobId,
      title: existingJob.title,
      department: existingJob.department,
      status: existingJob.status,
      deletedBy: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: '职位删除成功',
    })
  } catch (error) {
    console.error('删除职位失败:', error)
    return NextResponse.json({ error: '删除职位失败' }, { status: 500 })
  }
}
