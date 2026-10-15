import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取单个职位详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const resolvedParams = await params
    const { jobId } = resolvedParams

    // 获取职位详情
    const job = await prisma.jobPosition.findUnique({
      where: {
        id: jobId,
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        type: true,
        experience: true,
        salary: true,
        description: true,
        requirements: true,
        benefits: true,
        tags: true,
        isHot: true,
        isUrgent: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: '职位不存在' }, { status: 404 })
    }

    // 解析JSON字符串
    let requirements = []
    let benefits = []
    let tags = []

    try {
      requirements = job.requirements ? JSON.parse(job.requirements) : []
    } catch (e) {
      requirements = job.requirements ? [job.requirements] : []
    }

    try {
      benefits = job.benefits ? JSON.parse(job.benefits) : []
    } catch (e) {
      benefits = job.benefits ? [job.benefits] : []
    }

    try {
      tags = job.tags ? JSON.parse(job.tags) : []
    } catch (e) {
      tags = job.tags ? [job.tags] : []
    }

    // 格式化职位数据
    const formattedJob = {
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      requirements,
      benefits,
      tags,
      isHot: job.isHot,
      isUrgent: job.isUrgent,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    }

    return NextResponse.json(formattedJob)
  } catch (error) {
    console.error('获取职位详情失败:', error)
    return NextResponse.json({ error: '获取职位详情失败' }, { status: 500 })
  }
}
