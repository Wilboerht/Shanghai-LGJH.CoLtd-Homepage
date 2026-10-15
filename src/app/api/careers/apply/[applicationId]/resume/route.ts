/**
 * 简历下载API
 * 用于下载存储在数据库中的简历文件
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'

    // 获取申请记录
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      select: {
        resumeData: true,
        resumeName: true,
        resumeType: true,
        resumeSize: true,
        applicantName: true,
      },
    })

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: '申请记录不存在',
        },
        { status: 404 }
      )
    }

    if (!application.resumeData) {
      return NextResponse.json(
        {
          success: false,
          message: '该申请没有上传简历',
        },
        { status: 404 }
      )
    }

    // 设置响应头
    const headers = new Headers()
    headers.set('Content-Type', application.resumeType || 'application/octet-stream')

    // 根据preview参数决定是预览还是下载
    if (preview) {
      headers.set('Content-Disposition', 'inline')
    } else {
      headers.set(
        'Content-Disposition',
        `attachment; filename="${application.resumeName || `${application.applicantName}-简历`}"`
      )
    }

    headers.set('Content-Length', application.resumeSize?.toString() || '0')

    // 返回文件数据
    return new NextResponse(application.resumeData, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('简历访问错误:', error)
    return NextResponse.json(
      {
        success: false,
        message: '简历访问失败',
      },
      { status: 500 }
    )
  }
}
