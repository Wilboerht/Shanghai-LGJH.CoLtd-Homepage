import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取招聘信息数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 构建查询条件
    const where: any = {
      status: 'published',
    }

    if (department && department !== 'all') {
      where.department = department
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { requirements: { contains: search } },
      ]
    }

    // 获取职位列表
    const [rawJobs, total] = await Promise.all([
      prisma.jobPosition.findMany({
        where,
        orderBy: [{ isUrgent: 'desc' }, { isHot: 'desc' }, { createdAt: 'desc' }],
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

    // 获取部门统计
    const departmentStats = await prisma.jobPosition.groupBy({
      by: ['department'],
      where: { status: 'published' },
      _count: {
        department: true,
      },
    })

    const departments = [
      { id: 'all', name: '全部部门', count: total },
      ...departmentStats.map(stat => ({
        id: stat.department,
        name: stat.department,
        count: stat._count.department,
      })),
    ]

    // 获取公司统计数据
    const stats = {
      totalJobs: total,
      totalDepartments: departmentStats.length,
      hotJobs: await prisma.jobPosition.count({ where: { isHot: true, status: 'published' } }),
      urgentJobs: await prisma.jobPosition.count({
        where: { isUrgent: true, status: 'published' },
      }),
    }

    // 格式化职位数据
    const formattedJobs = jobs.map(job => {
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

      return {
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
    })

    // 获取公司福利信息（从配置或静态数据）
    const benefits = [
      {
        icon: 'DollarSign',
        title: '竞争薪酬',
        description: '提供具有市场竞争力的薪酬待遇',
        color: 'text-green-600',
        details: ['基本工资', '绩效奖金', '年终奖', '股权激励'],
      },
      {
        icon: 'Heart',
        title: '健康保障',
        description: '完善的医疗保险和健康管理',
        color: 'text-red-600',
        details: ['五险一金', '补充医疗', '年度体检', '健身补贴'],
      },
      {
        icon: 'GraduationCap',
        title: '学习发展',
        description: '丰富的培训和职业发展机会',
        color: 'text-blue-600',
        details: ['技能培训', '学历提升', '职业规划', '内部晋升'],
      },
      {
        icon: 'Users',
        title: '团队文化',
        description: '开放包容的工作环境和团队氛围',
        color: 'text-purple-600',
        details: ['团建活动', '弹性工作', '员工关怀', '创新激励'],
      },
    ]

    return NextResponse.json({
      jobs: formattedJobs,
      departments,
      benefits,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取招聘信息失败:', error)
    return NextResponse.json({ error: '获取招聘信息失败' }, { status: 500 })
  }
}
