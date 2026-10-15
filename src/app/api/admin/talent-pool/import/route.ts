/**
 * 人才储备库导入API
 * 从申请数据导入到人才储备库
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 导入验证schema
const importSchema = z.object({
  applicationId: z.string().min(1, '申请ID不能为空'),
  rating: z.number().min(1).max(5).optional().default(3),
  availability: z
    .enum(['AVAILABLE', 'BUSY', 'NOT_LOOKING', 'CONTACTED', 'BLACKLIST'])
    .optional()
    .default('AVAILABLE'),
  addedReason: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  currentPosition: z.string().optional(),
  currentCompany: z.string().optional(),
  expectedSalary: z.string().optional(),
})

// POST - 从申请导入到人才储备库
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = importSchema.parse(body)

    // 检查申请是否存在
    const application = await prisma.jobApplication.findUnique({
      where: { id: validatedData.applicationId },
      include: {
        job: {
          select: { title: true, department: true },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: '申请不存在' }, { status: 404 })
    }

    // 检查是否已经在人才储备库中
    const existingTalent = await prisma.talentPool.findUnique({
      where: { applicationId: validatedData.applicationId },
    })

    if (existingTalent) {
      return NextResponse.json({ error: '该申请已在人才储备库中' }, { status: 400 })
    }

    // 智能提取技能标签
    const extractedTags = extractSkillsFromApplication(application)
    const finalTags = validatedData.tags || extractedTags

    // 创建人才储备库记录
    const talent = await prisma.talentPool.create({
      data: {
        applicationId: validatedData.applicationId,
        rating: validatedData.rating,
        availability: validatedData.availability,
        addedReason: validatedData.addedReason || `从"${application.job?.title}"申请转入`,
        tags: finalTags,
        notes: validatedData.notes,
        currentPosition: validatedData.currentPosition,
        currentCompany: validatedData.currentCompany,
        expectedSalary: validatedData.expectedSalary,
        addedBy: session.user.id,
      },
      include: {
        application: {
          include: {
            job: {
              select: { title: true, department: true },
            },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      talent: {
        id: talent.id,
        applicantName: talent.application.applicantName,
        email: talent.application.email,
        jobTitle: talent.application.job?.title,
        rating: talent.rating,
        availability: talent.availability,
        createdAt: talent.createdAt,
      },
    })
  } catch (error) {
    console.error('导入人才储备库失败:', error)

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

// 智能提取技能标签
function extractSkillsFromApplication(application: any): string {
  const skills: string[] = []

  // 从职位标题提取
  const jobTitle = application.job?.title?.toLowerCase() || ''
  if (jobTitle.includes('前端')) skills.push('前端开发')
  if (jobTitle.includes('后端')) skills.push('后端开发')
  if (jobTitle.includes('全栈')) skills.push('全栈开发')
  if (jobTitle.includes('产品')) skills.push('产品管理')
  if (jobTitle.includes('设计')) skills.push('UI/UX设计')
  if (jobTitle.includes('测试')) skills.push('软件测试')
  if (jobTitle.includes('运维')) skills.push('运维开发')
  if (jobTitle.includes('数据')) skills.push('数据分析')
  if (jobTitle.includes('算法')) skills.push('算法工程')
  if (jobTitle.includes('AI') || jobTitle.includes('人工智能')) skills.push('人工智能')

  // 从部门提取
  const department = application.job?.department?.toLowerCase() || ''
  if (department.includes('技术')) skills.push('技术开发')
  if (department.includes('产品')) skills.push('产品运营')
  if (department.includes('市场')) skills.push('市场营销')
  if (department.includes('销售')) skills.push('销售管理')

  // 从自我介绍提取关键词
  const introduction = application.introduction?.toLowerCase() || ''
  const techKeywords = [
    'react',
    'vue',
    'angular',
    'javascript',
    'typescript',
    'python',
    'java',
    'golang',
    'php',
    'mysql',
    'redis',
    'docker',
    'kubernetes',
  ]
  techKeywords.forEach(keyword => {
    if (introduction.includes(keyword)) {
      skills.push(keyword.toUpperCase())
    }
  })

  // 去重并返回JSON字符串
  const uniqueSkills = [...new Set(skills)]
  return JSON.stringify(uniqueSkills)
}
