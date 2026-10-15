import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取招聘统计数据
export async function GET(request: NextRequest) {
  try {
    // 获取职位统计
    const totalJobs = await prisma.jobPosition.count()
    const activeJobs = await prisma.jobPosition.count({
      where: { status: 'published' },
    })

    // 获取申请统计
    const totalApplications = await prisma.jobApplication.count()
    const pendingApplications = await prisma.jobApplication.count({
      where: { status: 'NEW' },
    })

    // 获取最近7天的申请数
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentApplications = await prisma.jobApplication.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    })

    // 获取部门统计
    const departmentStats = await prisma.jobPosition.groupBy({
      by: ['department'],
      where: { status: 'published' },
      _count: {
        department: true,
      },
    })

    const departments = departmentStats.map(stat => ({
      name: stat.department,
      count: stat._count.department,
    }))

    // 获取申请状态分布
    const applicationStatusStats = await prisma.jobApplication.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    const applicationStatusDistribution = applicationStatusStats.map(stat => ({
      status: stat.status,
      count: stat._count.status,
    }))

    // 获取热门职位（按申请数排序）
    const hotJobs = await prisma.jobPosition.findMany({
      where: { status: 'published' },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        applications: {
          _count: 'desc',
        },
      },
      take: 10,
    })

    const responseData = {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      recentApplications,
      departments,
      applicationStatusDistribution,
      hotJobs: hotJobs.map(job => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        applicationCount: job._count.applications,
      })),
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('获取招聘统计数据失败:', error)
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}
