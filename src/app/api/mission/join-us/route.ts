import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取加入我们模块数据（重定向到招聘系统）
export async function GET(request: NextRequest) {
  try {
    // 获取加入我们模块基本信息
    const module = await prisma.missionModule.findUnique({
      where: { category: 'join-us' },
    })

    if (!module) {
      return NextResponse.json({ error: '加入我们模块不存在' }, { status: 404 })
    }

    // 获取招聘职位数据（这是主要内容）
    const rawJobPositions = await prisma.jobPosition.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
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
        createdAt: true,
      },
    })

    // 解析JSON字段
    const jobPositions = rawJobPositions.map(job => ({
      ...job,
      requirements: job.requirements ? JSON.parse(job.requirements) : [],
      benefits: job.benefits ? JSON.parse(job.benefits) : [],
    }))

    // 获取招聘统计数据
    const stats = await prisma.jobPosition.aggregate({
      where: { status: 'published' },
      _count: { id: true },
    })

    // 获取部门统计
    const departments = await prisma.jobPosition.groupBy({
      by: ['department'],
      where: { status: 'published' },
      _count: { department: true },
    })

    // 组合返回数据 - 主要基于招聘系统
    const responseData = {
      // 模块基本信息
      id: module.id,
      title: module.title || '加入我们',
      subtitle: module.subtitle || '与我们一起创造未来',
      description: module.description || '我们正在寻找有才华、有激情的人才加入我们的团队',
      image: module.image,
      highlights: module.highlights || [
        '具有竞争力的薪酬待遇',
        '完善的职业发展路径',
        '开放包容的工作环境',
        '丰富的学习成长机会',
      ],
      features: module.features || [
        '弹性工作制度',
        '五险一金',
        '年度体检',
        '团队建设活动',
        '技能培训',
        '绩效奖金',
      ],
      achievements: module.achievements || [
        { value: '100+', label: '团队成员' },
        { value: '5+', label: '技术部门' },
        { value: '95%', label: '员工满意度' },
        { value: '3年', label: '平均工作年限' },
      ],
      gradient: module.gradient || 'from-blue-600 to-purple-600',
      accentColor: module.accentColor || 'blue',
      href: '/careers', // 重定向到招聘页面
      status: module.status,

      // 招聘相关数据
      jobs: jobPositions,
      stats: {
        totalJobs: stats._count.id,
        departments: departments.map(d => ({
          name: d.department,
          count: d._count.department,
        })),
        locations: [...new Set(jobPositions.map(job => job.location))],
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('获取加入我们模块失败:', error)
    return NextResponse.json({ error: '获取加入我们模块失败' }, { status: 500 })
  }
}
