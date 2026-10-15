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

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET - 根据slug获取解决方案详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const { slug } = await params

    const solution = await prisma.solution.findUnique({
      where: { slug },
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

    if (!solution) {
      return NextResponse.json({ error: '解决方案不存在' }, { status: 404 })
    }

    // 获取相关解决方案（同分类的其他解决方案）
    const relatedSolutions = await prisma.solution.findMany({
      where: {
        category: solution.category,
        slug: {
          not: slug,
        },
      },
      take: 3,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        image: true,
        gradient: true,
        accentColor: true,
      },
    })

    // 安全解析JSON字段
    const formattedSolution = {
      ...solution,
      features: safeParseJSON(solution.features),
      applications: safeParseJSON(solution.applications),
      metrics: safeParseJSON(solution.metrics),
      technologies: safeParseJSON(solution.technologies),
      benefits: safeParseJSON(solution.benefits),
    }

    return NextResponse.json({
      solution: formattedSolution,
      relatedSolutions,
    })
  } catch (error) {
    console.error('获取解决方案详情失败:', error)
    return NextResponse.json({ error: '获取解决方案详情失败' }, { status: 500 })
  }
}
