import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 安全解析JSON的辅助函数
function safeParseJSON(value: any): any[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.warn('JSON解析失败:', value, error)
      // 如果是逗号分隔的字符串，尝试分割
      if (value.includes(',')) {
        return value
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean)
      }
      return []
    }
  }
  return []
}

// GET - 获取前台解决方案列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 分类ID映射表 - 将URL中的ID转换为实际的分类名称
    const categoryIdMap: Record<string, string> = {
      // 支持中文分类名称（直接映射）
      园区管理: '园区管理',
      社区管理: '社区管理',
      公共交通: '公共交通',
      工业制造: '工业制造',
      物流运输: '物流运输',
      大健康: '大健康',
      商业综合体: '商业综合体',
      其他方案: '其他方案',
      // 支持英文ID映射
      'park-management': '园区管理',
      'community-management': '社区管理',
      'public-transport': '公共交通',
      'industrial-manufacturing': '工业制造',
      'logistics-transport': '物流运输',
      'big-health': '大健康',
      healthcare: '大健康',
      'commercial-complex': '商业综合体',
      'other-solutions': '其他方案',
      others: '其他方案',
    }

    // 构建查询条件
    const where: any = {}

    if (category) {
      // 获取实际的分类名称
      const actualCategoryName = categoryIdMap[category] || category
      where.category = actualCategoryName
    }

    // 获取解决方案列表
    const solutions = await prisma.solution.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        category: true,
        title: true,
        subtitle: true,
        description: true,
        content: true, // 新增富文本内容字段
        features: true,
        applications: true,
        metrics: true,
        technologies: true,
        benefits: true,
        image: true,
        slug: true,
        gradient: true,
        accentColor: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // 安全解析JSON字段
    const formattedSolutions = solutions.map(solution => ({
      ...solution,
      features: safeParseJSON(solution.features),
      applications: safeParseJSON(solution.applications),
      metrics: safeParseJSON(solution.metrics),
      technologies: safeParseJSON(solution.technologies),
      benefits: safeParseJSON(solution.benefits),
    }))

    return NextResponse.json(formattedSolutions)
  } catch (error) {
    console.error('获取解决方案列表失败:', error)
    return NextResponse.json({ error: '获取解决方案列表失败' }, { status: 500 })
  }
}
