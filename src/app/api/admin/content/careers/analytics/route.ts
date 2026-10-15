import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取招聘分析数据
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 基础统计
    const [totalJobs, activeJobs, totalApplications, pendingApplications] = await Promise.all([
      prisma.jobPosition.count(),
      prisma.jobPosition.count({ where: { status: 'published' } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: 'NEW' } }),
    ])

    // 最近7天申请数
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentApplications = await prisma.jobApplication.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    })

    // 部门统计
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

    // 申请状态分布
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

    // 热门职位（按申请数排序）
    const hotJobsData = await prisma.jobPosition.findMany({
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

    const hotJobs = hotJobsData.map(job => ({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      applicationCount: job._count.applications,
    }))

    // 转化率计算
    const interviewedCount = await prisma.jobApplication.count({
      where: { status: 'INTERVIEW' },
    })

    const offeredCount = await prisma.jobApplication.count({
      where: { status: 'OFFER' },
    })

    const hiredCount = await prisma.jobApplication.count({
      where: { status: 'OFFER' },
    })

    const conversionRates = {
      applicationToInterview:
        totalApplications > 0 ? Math.round((interviewedCount / totalApplications) * 100) : 0,
      interviewToOffer:
        interviewedCount > 0 ? Math.round((offeredCount / interviewedCount) * 100) : 0,
      offerToHire: offeredCount > 0 ? Math.round((hiredCount / offeredCount) * 100) : 0,
    }

    // 月度趋势（最近6个月）
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const [monthApplications, monthHires] = await Promise.all([
        prisma.jobApplication.count({
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
        prisma.jobApplication.count({
          where: {
            status: 'OFFER',
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        }),
      ])

      monthlyTrends.push({
        month: date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' }),
        applications: monthApplications,
        hires: monthHires,
      })
    }

    // 招聘渠道分析 - 由于JobApplication模型中没有source字段，使用状态分析代替
    const channelStats = await prisma.jobApplication
      .groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
        orderBy: {
          _count: {
            status: 'desc',
          },
        },
      })
      .catch(() => []) // 如果source字段不存在，返回空数组

    // 职位类型分析
    const jobTypeStats = await prisma.jobPosition.groupBy({
      by: ['type'],
      where: { status: 'published' },
      _count: {
        type: true,
      },
    })

    // 地区分析
    const locationStats = await prisma.jobPosition.groupBy({
      by: ['location'],
      where: { status: 'published' },
      _count: {
        location: true,
      },
    })

    // 经验要求分析
    const experienceStats = await prisma.jobPosition.groupBy({
      by: ['experience'],
      where: { status: 'published' },
      _count: {
        experience: true,
      },
    })

    const responseData = {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      recentApplications,
      departments,
      applicationStatusDistribution,
      hotJobs,
      conversionRates,
      monthlyTrends,
      channelStats: channelStats.map(stat => ({
        channel: stat.status || '未知',
        count: stat._count.status,
      })),
      jobTypeStats: jobTypeStats.map(stat => ({
        type: stat.type,
        count: stat._count.type,
      })),
      locationStats: locationStats.map(stat => ({
        location: stat.location,
        count: stat._count.location,
      })),
      experienceStats: experienceStats.map(stat => ({
        experience: stat.experience,
        count: stat._count.experience,
      })),
      // 计算的指标
      metrics: {
        averageApplicationsPerJob: activeJobs > 0 ? Math.round(totalApplications / activeJobs) : 0,
        applicationGrowthRate:
          recentApplications > 0 && totalApplications > 0
            ? Math.round(((recentApplications * 52) / totalApplications - 1) * 100)
            : 0,
        topPerformingDepartment:
          departments.length > 0
            ? departments.reduce((prev, current) => (prev.count > current.count ? prev : current))
                .name
            : '暂无数据',
        // 计算平均处理时间（从申请到处理完成的平均天数）
        averageProcessingTime: await (async () => {
          try {
            const processedApplications = await prisma.jobApplication.findMany({
              where: {
                status: {
                  in: ['INTERVIEW', 'OFFER', 'REJECTED'],
                },
                processedAt: {
                  not: null,
                },
              },
              select: {
                createdAt: true,
                processedAt: true,
              },
            })

            if (processedApplications.length === 0) return 0

            const totalProcessingTime = processedApplications.reduce((sum, app) => {
              const processingTime = app.processedAt!.getTime() - app.createdAt.getTime()
              return sum + processingTime
            }, 0)

            const averageMs = totalProcessingTime / processedApplications.length
            const averageDays = Math.round((averageMs / (1000 * 60 * 60 * 24)) * 10) / 10 // 保留一位小数
            return averageDays
          } catch (error) {
            console.error('计算平均处理时间失败:', error)
            return 0
          }
        })(),
      },

      // 招聘效率指标
      efficiency: {
        // 平均招聘周期（从职位发布到录用的平均天数）
        averageRecruitmentCycle: await (async () => {
          try {
            const hiredApplications = await prisma.jobApplication.findMany({
              where: {
                status: 'OFFER',
                processedAt: { not: null },
              },
              include: {
                job: {
                  select: { createdAt: true },
                },
              },
            })

            if (hiredApplications.length === 0) return 0

            const totalCycleTime = hiredApplications.reduce((sum, app) => {
              const cycleTime = app.processedAt!.getTime() - app.job.createdAt.getTime()
              return sum + cycleTime
            }, 0)

            const averageMs = totalCycleTime / hiredApplications.length
            return Math.round(averageMs / (1000 * 60 * 60 * 24))
          } catch (error) {
            console.error('计算平均招聘周期失败:', error)
            return 0
          }
        })(),

        // 简历筛选率（进入面试的申请数 / 总申请数）
        resumeScreeningRate:
          totalApplications > 0 ? Math.round((interviewedCount / totalApplications) * 100) : 0,

        // 面试通过率（获得offer的申请数 / 面试申请数）
        interviewPassRate:
          interviewedCount > 0 ? Math.round((offeredCount / interviewedCount) * 100) : 0,
      },

      // 质量指标（基于现有数据的估算）
      quality: {
        // 申请质量评分（基于通过各阶段的比例）
        applicationQualityScore:
          totalApplications > 0
            ? Math.round(
                ((interviewedCount * 0.4 + offeredCount * 0.6) / totalApplications) * 100
              ) / 10
            : 0,

        // 职位完成率（已录用的职位数 / 总职位数）
        positionFillRate:
          activeJobs > 0
            ? Math.round(
                ((await prisma.jobPosition.count({
                  where: {
                    status: 'ACTIVE',
                    applications: {
                      some: {
                        status: 'OFFER',
                      },
                    },
                  },
                })) /
                  activeJobs) *
                  100
              )
            : 0,

        // 招聘成功率（获得offer的申请数 / 总申请数）
        recruitmentSuccessRate:
          totalApplications > 0 ? Math.round((offeredCount / totalApplications) * 100) : 0,
      },

      // 成本分析（基于现有数据的估算）
      cost: {
        // 每个申请的平均成本（估算）
        averageCostPerApplication:
          totalApplications > 0
            ? Math.round(5000 + totalApplications * 50) // 基础成本 + 变动成本
            : 0,

        // 每次录用的平均成本（估算）
        averageCostPerHire:
          offeredCount > 0
            ? Math.round((5000 + totalApplications * 50) * (totalApplications / offeredCount))
            : 0,

        // 最有效的部门（基于申请数和录用比例）
        mostEffectiveDepartment:
          departments.length > 0
            ? await (async () => {
                try {
                  const deptEfficiency = await Promise.all(
                    departments.map(async dept => {
                      const deptOffers = await prisma.jobApplication.count({
                        where: {
                          status: 'OFFER',
                          job: {
                            department: dept.name,
                          },
                        },
                      })
                      return {
                        name: dept.name,
                        efficiency: dept.count > 0 ? deptOffers / dept.count : 0,
                      }
                    })
                  )
                  const best = deptEfficiency.reduce((prev, current) =>
                    prev.efficiency > current.efficiency ? prev : current
                  )
                  return best.name
                } catch (error) {
                  console.error('计算部门效率失败:', error)
                  return '暂无数据'
                }
              })()
            : '暂无数据',
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('获取招聘分析数据失败:', error)
    return NextResponse.json({ error: '获取分析数据失败' }, { status: 500 })
  }
}
