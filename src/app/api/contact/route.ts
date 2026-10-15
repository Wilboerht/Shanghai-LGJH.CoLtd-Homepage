/**
 * 联系表单API
 * 处理联系表单提交、验证和存储
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 联系表单验证schema
const contactSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100, '姓名过长'),
  email: z.string().email('邮箱格式不正确'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, '主题不能为空').max(200, '主题过长'),
  message: z.string().min(1, '消息不能为空').max(2000, '消息过长'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    const validatedData = contactSchema.parse(body)

    // 获取客户端信息
    const ipAddress =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // 保存到数据库
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        subject: validatedData.subject,
        message: validatedData.message,
        ipAddress,
        userAgent,
        status: 'NEW',
      },
    })

    // TODO: 发送邮件通知
    // await sendEmailNotification(submission)

    return NextResponse.json({
      success: true,
      message: '感谢您的联系，我们会尽快回复您！',
      submissionId: submission.id,
    })
  } catch (error) {
    console.error('联系表单提交错误:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: '表单数据验证失败',
          errors: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: '提交失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // 这个端点用于管理员获取联系表单列表
  // 需要认证

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where = status ? { status: status as any } : {}

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          processor: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.contactSubmission.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取联系表单列表错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取数据失败',
      },
      { status: 500 }
    )
  }
}
