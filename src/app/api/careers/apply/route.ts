/**
 * 招聘申请API
 * 处理招聘申请提交、简历上传和数据存储
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 招聘申请验证schema
const jobApplicationSchema = z.object({
  jobId: z.string().min(1, '职位ID不能为空'),
  applicantName: z.string().min(1, '姓名不能为空').max(100, '姓名过长'),
  email: z.string().email('邮箱格式不正确'),
  phone: z.string().optional(),
  introduction: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')

    let jobId: string
    let applicantName: string
    let email: string
    let phone: string
    let introduction: string
    let resumeFile: File | null = null

    if (contentType?.includes('application/json')) {
      // 处理JSON格式的请求
      const body = await request.json()
      jobId = body.jobId
      applicantName = body.applicantName
      email = body.email
      phone = body.phone || ''
      introduction = body.introduction || ''
    } else {
      // 处理FormData格式的请求
      const formData = await request.formData()
      jobId = formData.get('jobId') as string
      applicantName = formData.get('applicantName') as string
      email = formData.get('email') as string
      phone = formData.get('phone') as string
      introduction = formData.get('introduction') as string
      resumeFile = formData.get('resume') as File
    }

    // 验证基本数据
    const validatedData = jobApplicationSchema.parse({
      jobId,
      applicantName,
      email,
      phone: phone || undefined,
      introduction: introduction || undefined,
    })

    let resumeData: Buffer | undefined
    let resumeName: string | undefined
    let resumeType: string | undefined
    let resumeSize: number | undefined

    // 处理简历文件上传
    if (resumeFile && resumeFile.size > 0) {
      // 验证文件类型和大小
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json(
          {
            success: false,
            message: '简历文件格式不支持，请上传PDF或Word文档',
          },
          { status: 400 }
        )
      }

      if (resumeFile.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: '简历文件过大，请上传小于10MB的文件',
          },
          { status: 400 }
        )
      }

      try {
        // 读取文件数据
        const arrayBuffer = await resumeFile.arrayBuffer()
        resumeData = Buffer.from(arrayBuffer)
        resumeName = resumeFile.name
        resumeType = resumeFile.type
        resumeSize = resumeFile.size
      } catch (uploadError) {
        console.error('文件处理错误:', uploadError)
        return NextResponse.json(
          {
            success: false,
            message: '简历处理失败，请稍后重试',
          },
          { status: 500 }
        )
      }
    }

    // 保存到数据库
    const application = await prisma.jobApplication.create({
      data: {
        jobId: validatedData.jobId,
        applicantName: validatedData.applicantName,
        email: validatedData.email,
        phone: validatedData.phone,
        introduction: validatedData.introduction,
        resumeData,
        resumeName,
        resumeType,
        resumeSize,
        status: 'NEW',
      },
    })

    // TODO: 发送邮件通知
    // await sendApplicationNotification(application)

    return NextResponse.json({
      success: true,
      message: '申请提交成功！我们会尽快联系您。',
      applicationId: application.id,
    })
  } catch (error) {
    console.error('招聘申请提交错误:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: '申请数据验证失败',
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
  // 这个端点用于管理员获取招聘申请列表
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const jobId = searchParams.get('jobId')

    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (jobId) where.jobId = jobId

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
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
      prisma.jobApplication.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取招聘申请列表错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '获取数据失败',
      },
      { status: 500 }
    )
  }
}
