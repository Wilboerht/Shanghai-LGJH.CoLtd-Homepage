import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 设置更新验证
const settingsUpdateSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string(),
      value: z.string().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
    })
  ),
})

// GET - 获取网站设置
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // 构建查询条件
    const where: any = {}
    if (category) {
      where.category = category
    }

    const settings = await prisma.siteConfig.findMany({
      where,
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    })

    // 按分类组织设置
    const settingsByCategory = settings.reduce(
      (acc, setting) => {
        const cat = setting.category || 'general'
        if (!acc[cat]) {
          acc[cat] = []
        }
        acc[cat].push(setting)
        return acc
      },
      {} as Record<string, typeof settings>
    )

    return NextResponse.json({
      settings: settingsByCategory,
      total: settings.length,
    })
  } catch (error) {
    console.error('获取网站设置失败:', error)
    return NextResponse.json({ error: '获取网站设置失败' }, { status: 500 })
  }
}

// PUT - 批量更新网站设置
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = settingsUpdateSchema.parse(body)

    // 使用事务批量更新设置
    const updatedSettings = await prisma.$transaction(
      validatedData.settings.map(setting =>
        prisma.siteConfig.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            category: setting.category,
            description: setting.description,
          },
          create: {
            key: setting.key,
            value: setting.value,
            category: setting.category,
            description: setting.description,
          },
        })
      )
    )

    return NextResponse.json({
      message: '设置更新成功',
      updated: updatedSettings.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新网站设置失败:', error)
    return NextResponse.json({ error: '更新网站设置失败' }, { status: 500 })
  }
}

// POST - 创建新设置项
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const settingSchema = z.object({
      key: z.string().min(1, '设置键不能为空'),
      value: z.string().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
    })

    const validatedData = settingSchema.parse(body)

    // 检查设置键是否已存在
    const existingSetting = await prisma.siteConfig.findUnique({
      where: { key: validatedData.key },
    })

    if (existingSetting) {
      return NextResponse.json({ error: '设置键已存在' }, { status: 400 })
    }

    const setting = await prisma.siteConfig.create({
      data: validatedData,
    })

    return NextResponse.json(setting, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('创建设置失败:', error)
    return NextResponse.json({ error: '创建设置失败' }, { status: 500 })
  }
}
