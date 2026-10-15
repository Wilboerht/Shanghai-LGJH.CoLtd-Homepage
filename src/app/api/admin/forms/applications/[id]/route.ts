import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取单个申请详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: resolvedParams.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: '申请不存在' }, { status: 404 })
    }

    // 格式化数据
    const formattedApplication = {
      id: application.id,
      jobId: application.jobId,
      jobTitle: application.job?.title || '职位已删除',
      jobDepartment: application.job?.department || '',
      jobLocation: application.job?.location || '',
      applicantName: application.applicantName,
      email: application.email,
      phone: application.phone,
      introduction: application.introduction,
      status: application.status,
      resumeUrl: application.resumeData ? `/api/careers/apply/${application.id}/resume` : null,
      resumeName: application.resumeName,
      resumeType: application.resumeType,
      resumeSize: application.resumeSize,
      hasResume: !!application.resumeData,
      adminNotes: application.adminNotes,
      processedBy: application.processedBy,
      processedAt: application.processedAt?.toISOString(),
      createdAt: application.createdAt.toISOString(),
    }

    return NextResponse.json({ application: formattedApplication })
  } catch (error) {
    console.error('获取申请详情失败:', error)
    return NextResponse.json({ error: '获取申请详情失败' }, { status: 500 })
  }
}

// PATCH - 更新申请状态
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const { status, adminNotes } = body

    // 验证状态值
    const validStatuses = ['NEW', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: '无效的状态值' }, { status: 400 })
    }

    // 检查申请是否存在
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingApplication) {
      return NextResponse.json({ error: '申请不存在' }, { status: 404 })
    }

    // 更新申请
    const updateData: any = {}

    if (status) {
      updateData.status = status
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
          },
        },
      },
    })

    // 操作日志功能暂时移除，因为ApplicationLog模型不存在
    // TODO: 如果需要操作日志，需要先在Prisma schema中定义ApplicationLog模型

    // 格式化返回数据
    const formattedApplication = {
      id: updatedApplication.id,
      jobId: updatedApplication.jobId,
      jobTitle: updatedApplication.job?.title || '职位已删除',
      jobDepartment: updatedApplication.job?.department || '',
      jobLocation: updatedApplication.job?.location || '',
      applicantName: updatedApplication.applicantName,
      email: updatedApplication.email,
      phone: updatedApplication.phone,
      introduction: updatedApplication.introduction,
      status: updatedApplication.status,
      resumeUrl: updatedApplication.resumeData
        ? `/api/careers/apply/${updatedApplication.id}/resume`
        : null,
      resumeName: updatedApplication.resumeName,
      resumeType: updatedApplication.resumeType,
      resumeSize: updatedApplication.resumeSize,
      hasResume: !!updatedApplication.resumeData,
      adminNotes: updatedApplication.adminNotes,
      processedBy: updatedApplication.processedBy,
      processedAt: updatedApplication.processedAt?.toISOString(),
      createdAt: updatedApplication.createdAt.toISOString(),
    }

    return NextResponse.json({
      message: '申请更新成功',
      application: formattedApplication,
    })
  } catch (error) {
    console.error('更新申请失败:', error)
    return NextResponse.json({ error: '更新申请失败' }, { status: 500 })
  }
}

// DELETE - 删除申请
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

    // 检查申请是否存在
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingApplication) {
      return NextResponse.json({ error: '申请不存在' }, { status: 404 })
    }

    // 删除相关日志功能暂时移除，因为ApplicationLog模型不存在
    // TODO: 如果需要操作日志，需要先在Prisma schema中定义ApplicationLog模型

    // 删除申请
    await prisma.jobApplication.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: '申请删除成功' })
  } catch (error) {
    console.error('删除申请失败:', error)
    return NextResponse.json({ error: '删除申请失败' }, { status: 500 })
  }
}
