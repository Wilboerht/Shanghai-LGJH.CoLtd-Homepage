import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

/**
 * 职位创建诊断API
 * 用于检查职位创建功能是否正常工作
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const diagnostics = {
      timestamp: new Date().toISOString(),
      database: {},
      schema: {},
      permissions: {},
      sampleData: {},
      recommendations: [],
    }

    // 1. 检查数据库连接和表结构
    try {
      const tableInfo = (await prisma.$queryRaw`
        PRAGMA table_info(job_positions);
      `) as any[]

      diagnostics.database = {
        connected: true,
        tableExists: tableInfo.length > 0,
        columns: tableInfo.map(col => ({
          name: col.name,
          type: col.type,
          notNull: col.notnull === 1,
          defaultValue: col.dflt_value,
        })),
      }

      // 检查必需字段
      const requiredFields = [
        'title',
        'department',
        'location',
        'type',
        'experience',
        'description',
        'requirements',
        'benefits',
      ]
      const missingFields = requiredFields.filter(
        field => !tableInfo.some(col => col.name === field)
      )

      if (missingFields.length > 0) {
        diagnostics.recommendations.push(`数据库缺少必需字段: ${missingFields.join(', ')}`)
      }
    } catch (dbError) {
      diagnostics.database = {
        connected: false,
        error: dbError instanceof Error ? dbError.message : '数据库连接失败',
      }
      diagnostics.recommendations.push('检查数据库连接和迁移状态')
    }

    // 2. 检查验证Schema
    const createJobSchema = z.object({
      title: z.string().min(1).max(100),
      department: z.string().min(1).max(50),
      location: z.string().min(1).max(50),
      type: z.string().min(1).max(20),
      experience: z.string().min(1).max(50),
      salary: z.string().max(50).optional(),
      description: z.string().min(10).max(5000),
      requirements: z.array(z.string().min(1)).min(1),
      benefits: z.array(z.string().min(1)).optional().default([]),
      tags: z.string().optional().default(''),
      isHot: z.boolean().optional().default(false),
      isUrgent: z.boolean().optional().default(false),
      status: z.enum(['draft', 'published', 'archived']).optional().default('published'),
    })

    // 测试数据验证
    const testData = {
      title: '测试职位',
      department: '技术部',
      location: '上海',
      type: '全职',
      experience: '1-3年',
      description: '这是一个测试职位描述，用于验证系统功能是否正常工作。',
      requirements: ['本科学历', '相关工作经验'],
      benefits: ['五险一金', '年终奖'],
      tags: '测试,诊断',
      isHot: false,
      isUrgent: false,
      status: 'draft' as const,
    }

    try {
      const validationResult = createJobSchema.safeParse(testData)
      diagnostics.schema = {
        valid: validationResult.success,
        errors: validationResult.success ? null : validationResult.error.issues,
      }
    } catch (schemaError) {
      diagnostics.schema = {
        valid: false,
        error: schemaError instanceof Error ? schemaError.message : '验证失败',
      }
    }

    // 3. 检查用户权限
    diagnostics.permissions = {
      hasSession: !!session,
      isAdmin: session?.user?.isAdmin || false,
      userId: session?.user?.id || null,
      userName: session?.user?.name || null,
    }

    if (!session?.user?.isAdmin) {
      diagnostics.recommendations.push('当前用户没有管理员权限')
    }

    // 4. 获取现有职位数据样本
    try {
      const jobCount = await prisma.jobPosition.count()
      const recentJobs = await prisma.jobPosition.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          department: true,
          status: true,
          createdAt: true,
        },
      })

      diagnostics.sampleData = {
        totalJobs: jobCount,
        recentJobs: recentJobs,
      }
    } catch (dataError) {
      diagnostics.sampleData = {
        error: dataError instanceof Error ? dataError.message : '获取数据失败',
      }
    }

    // 5. 生成建议
    if (
      diagnostics.database.connected &&
      diagnostics.schema.valid &&
      diagnostics.permissions.isAdmin
    ) {
      diagnostics.recommendations.push('✅ 系统状态正常，可以创建职位')
    } else {
      if (!diagnostics.database.connected) {
        diagnostics.recommendations.push('❌ 数据库连接问题')
      }
      if (!diagnostics.schema.valid) {
        diagnostics.recommendations.push('❌ 数据验证配置问题')
      }
      if (!diagnostics.permissions.isAdmin) {
        diagnostics.recommendations.push('❌ 权限不足')
      }
    }

    return NextResponse.json({
      success: true,
      message: '职位创建诊断完成',
      diagnostics,
    })
  } catch (error) {
    console.error('职位创建诊断失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '诊断失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

/**
 * 测试职位创建功能
 */
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { testType, cleanup } = await request.json()

    if (testType === 'create-test') {
      // 创建测试职位
      const testJobData = {
        title: `测试职位-${Date.now()}`,
        department: '测试部门',
        location: '测试地点',
        type: '全职',
        experience: '不限',
        salary: '面议',
        description: '这是一个用于测试系统功能的职位，创建后会自动删除。',
        requirements: JSON.stringify(['测试要求1', '测试要求2']),
        benefits: JSON.stringify(['测试福利1', '测试福利2']),
        tags: '测试,诊断',
        isHot: false,
        isUrgent: false,
        status: 'draft',
        createdBy: session.user.id,
      }

      try {
        const testJob = await prisma.jobPosition.create({
          data: testJobData,
        })

        // 如果需要清理，立即删除测试数据
        if (cleanup) {
          await prisma.jobPosition.delete({
            where: { id: testJob.id },
          })
        }

        return NextResponse.json({
          success: true,
          message: cleanup ? '测试职位创建并删除成功' : '测试职位创建成功',
          testJob: cleanup ? null : testJob,
        })
      } catch (createError) {
        return NextResponse.json(
          {
            success: false,
            error: '测试职位创建失败',
            details: createError instanceof Error ? createError.message : '未知错误',
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: '不支持的测试类型',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('职位创建测试失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '测试失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
