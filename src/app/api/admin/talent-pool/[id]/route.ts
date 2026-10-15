/**
 * 人才储备库详情API
 * 处理单个人才的查询、更新、删除操作
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 更新验证schema
const updateSchema = z.object({
  applicantName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  introduction: z.string().optional(),
  currentPosition: z.string().optional(),
  currentCompany: z.string().optional(),
  expectedSalary: z.string().optional(),
  availability: z.enum(['AVAILABLE', 'BUSY', 'NOT_LOOKING', 'CONTACTED', 'BLACKLIST']).optional(),
  rating: z.number().min(1).max(5).optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  notes: z.string().optional(),
  addedReason: z.string().optional(),
  nextFollowUp: z
    .string()
    .optional()
    .transform(val => (val ? new Date(val) : undefined)),
})

// GET - 获取人才详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const talent = await prisma.talentPool.findUnique({
      where: { id: resolvedParams.id },
      include: {
        application: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                department: true,
                location: true,
                type: true,
                experience: true,
                salary: true,
              },
            },
          },
        },
        addedByUser: {
          select: {
            name: true,
            email: true,
          },
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          include: {
            createdByUser: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!talent) {
      return NextResponse.json({ error: '人才不存在' }, { status: 404 })
    }

    // 格式化返回数据
    const formattedTalent = {
      id: talent.id,
      // 基本信息（来自申请）
      applicantName: talent.application.applicantName,
      email: talent.application.email,
      phone: talent.application.phone,
      introduction: talent.application.introduction,
      resumeUrl: talent.application.resumeUrl,
      resumeName: talent.application.resumeName,
      resumeType: talent.application.resumeType,
      resumeSize: talent.application.resumeSize,

      // 原申请信息
      originalApplication: {
        id: talent.application.id,
        jobTitle: talent.application.job?.title,
        department: talent.application.job?.department,
        location: talent.application.job?.location,
        jobType: talent.application.job?.type,
        experience: talent.application.job?.experience,
        salary: talent.application.job?.salary,
        status: talent.application.status,
        appliedAt: talent.application.createdAt,
      },

      // 人才库补充信息
      currentPosition: talent.currentPosition,
      currentCompany: talent.currentCompany,
      expectedSalary: talent.expectedSalary,
      availability: talent.availability,
      rating: talent.rating,
      tags: talent.tags ? JSON.parse(talent.tags) : [],
      notes: talent.notes,
      addedReason: talent.addedReason,
      lastContactAt: talent.lastContactAt,
      nextFollowUp: talent.nextFollowUp,

      // 管理信息
      addedBy: talent.addedByUser.name,
      addedByEmail: talent.addedByUser.email,
      createdAt: talent.createdAt,
      updatedAt: talent.updatedAt,

      // 互动记录
      interactions: talent.interactions.map(interaction => ({
        id: interaction.id,
        type: interaction.type,
        content: interaction.content,
        nextAction: interaction.nextAction,
        scheduledAt: interaction.scheduledAt,
        createdBy: interaction.createdByUser.name,
        createdAt: interaction.createdAt,
      })),
    }

    return NextResponse.json({ talent: formattedTalent })
  } catch (error) {
    console.error('获取人才详情失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// PUT - 更新人才信息
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateSchema.parse(body)

    // 检查人才是否存在
    const existingTalent = await prisma.talentPool.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingTalent) {
      return NextResponse.json({ error: '人才不存在' }, { status: 404 })
    }

    // 处理 tags 字段转换
    const processedData = {
      ...validatedData,
      tags: Array.isArray(validatedData.tags)
        ? JSON.stringify(validatedData.tags)
        : validatedData.tags,
      lastContactAt:
        validatedData.availability === 'CONTACTED' ? new Date() : existingTalent.lastContactAt,
    }

    // 更新人才信息
    const updatedTalent = await prisma.talentPool.update({
      where: { id: resolvedParams.id },
      data: processedData,
      // TalentPool 模型中没有 application 关联，移除 include
    })

    return NextResponse.json({
      success: true,
      talent: {
        id: updatedTalent.id,
        applicantName: processedData.applicantName || '',
        email: processedData.email || '',
        availability: updatedTalent.availability,
        rating: updatedTalent.rating,
        updatedAt: updatedTalent.updatedAt,
      },
    })
  } catch (error) {
    console.error('更新人才信息失败:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// DELETE - 删除人才记录
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

    // 检查人才是否存在
    const existingTalent = await prisma.talentPool.findUnique({
      where: { id: resolvedParams.id },
      include: {
        application: {
          select: { applicantName: true },
        },
      },
    })

    if (!existingTalent) {
      return NextResponse.json({ error: '人才不存在' }, { status: 404 })
    }

    // 删除人才记录（会级联删除互动记录）
    await prisma.talentPool.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({
      success: true,
      message: `已删除人才 ${existingTalent.application.applicantName} 的记录`,
    })
  } catch (error) {
    console.error('删除人才记录失败:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}

// PATCH - 更新人才信息
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()

    // 验证输入数据
    const validatedData = updateSchema.parse(body)

    // 检查人才是否存在
    const existingTalent = await prisma.talentPool.findUnique({
      where: { id: resolvedParams.id },
      include: {
        application: true,
      },
    })

    if (!existingTalent) {
      return NextResponse.json({ error: '人才记录不存在' }, { status: 404 })
    }

    // 准备更新数据
    const updateData: any = {}

    if (validatedData.currentPosition !== undefined) {
      updateData.currentPosition = validatedData.currentPosition || null
    }
    if (validatedData.currentCompany !== undefined) {
      updateData.currentCompany = validatedData.currentCompany || null
    }
    if (validatedData.expectedSalary !== undefined) {
      updateData.expectedSalary = validatedData.expectedSalary || null
    }
    if (validatedData.availability !== undefined) {
      updateData.availability = validatedData.availability
    }
    if (validatedData.rating !== undefined) {
      updateData.rating = validatedData.rating
    }
    if (validatedData.tags !== undefined) {
      // 处理tags字段 - 可能是数组或字符串
      let tagsArray: string[] = []
      if (Array.isArray(validatedData.tags)) {
        tagsArray = validatedData.tags
      } else if (typeof validatedData.tags === 'string') {
        tagsArray = validatedData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag)
      }
      updateData.tags = JSON.stringify(tagsArray)
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }
    if (validatedData.nextFollowUp !== undefined) {
      updateData.nextFollowUp = validatedData.nextFollowUp
    }

    // 如果有基本信息更新，也更新申请表中的信息
    const applicationUpdateData: any = {}
    if (body.applicantName !== undefined) {
      applicationUpdateData.applicantName = body.applicantName
    }
    if (body.email !== undefined) {
      applicationUpdateData.email = body.email
    }
    if (body.phone !== undefined) {
      applicationUpdateData.phone = body.phone
    }
    if (body.introduction !== undefined) {
      applicationUpdateData.introduction = body.introduction
    }
    if (body.addedReason !== undefined) {
      updateData.addedReason = body.addedReason
    }

    // 执行更新
    const updatedTalent = await prisma.talentPool.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        application: {
          include: {
            job: {
              select: {
                id: true,
                title: true,
                department: true,
                location: true,
                type: true,
                experience: true,
                salary: true,
              },
            },
          },
        },
        addedByUser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            createdByUser: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    })

    // 如果有申请信息需要更新
    if (Object.keys(applicationUpdateData).length > 0) {
      await prisma.jobApplication.update({
        where: { id: existingTalent.applicationId },
        data: applicationUpdateData,
      })
    }

    return NextResponse.json({
      success: true,
      message: '人才信息更新成功',
      talent: updatedTalent,
    })
  } catch (error) {
    console.error('更新人才信息失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '输入数据格式错误',
          details: error.issues,
        },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
