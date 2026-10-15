import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取公共网站设置（无需认证）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const keys = searchParams.get('keys')?.split(',')

    // 构建查询条件
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (keys && keys.length > 0) {
      where.key = { in: keys }
    }

    const settings = await prisma.siteConfig.findMany({
      where,
      select: {
        key: true,
        value: true,
        category: true,
      },
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    })

    // 转换为键值对格式，方便前端使用
    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value || ''
        return acc
      },
      {} as Record<string, string>
    )

    // 按分类组织设置
    const settingsByCategory = settings.reduce(
      (acc, setting) => {
        const cat = setting.category || 'general'
        if (!acc[cat]) {
          acc[cat] = {}
        }
        acc[cat][setting.key] = setting.value || ''
        return acc
      },
      {} as Record<string, Record<string, string>>
    )

    return NextResponse.json({
      settings: settingsMap,
      categories: settingsByCategory,
      total: settings.length,
    })
  } catch (error) {
    console.error('获取网站设置失败:', error)
    return NextResponse.json({ error: '获取网站设置失败' }, { status: 500 })
  }
}
