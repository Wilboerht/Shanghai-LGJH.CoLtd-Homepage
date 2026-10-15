import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// 查询参数验证schema
const querySchema = z.object({
  category: z.enum(['AI_RESEARCH', 'INNOVATION', 'ACHIEVEMENTS', 'PAPERS']).optional(),
  featured: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
})

// 分类映射
const categoryMap = {
  AI_RESEARCH: 'AI研究与应用',
  INNOVATION: '技术创新',
  ACHIEVEMENTS: '研发成果',
  PAPERS: '技术论文',
}

// GET - 获取已发布的研究列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    // 构建查询条件
    const where: any = {
      status: 'PUBLISHED',
    }

    if (query.category) {
      where.category = query.category
    }

    if (query.featured !== undefined) {
      where.featured = query.featured
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { content: { contains: query.search } },
      ]
    }

    // 查询数据
    const research = await prisma.research.findMany({
      where,
      take: query.limit,
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { publishedAt: 'desc' }],
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        image: true,
        slug: true,
        publishedAt: true,
        tags: true,
        authors: true,
        featured: true,
        sortOrder: true,
      },
    })

    // 转换分类名称为中文
    const researchWithCategoryNames = research.map(item => ({
      ...item,
      categoryName: categoryMap[item.category as keyof typeof categoryMap],
    }))

    return NextResponse.json({
      research: researchWithCategoryNames,
      total: researchWithCategoryNames.length,
    })
  } catch (error) {
    console.error('获取研究列表失败:', error)
    return NextResponse.json({ error: '获取研究列表失败' }, { status: 500 })
  }
}

// 获取研究统计信息
export async function HEAD(request: NextRequest) {
  try {
    const stats = await prisma.research.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { category: true },
    })

    const categoryStats = stats.reduce(
      (acc, stat) => {
        acc[stat.category] = stat._count.category
        return acc
      },
      {} as Record<string, number>
    )

    return new NextResponse(null, {
      status: 200,
      headers: {
        'X-Research-Stats': JSON.stringify(categoryStats),
      },
    })
  } catch (error) {
    console.error('获取研究统计失败:', error)
    return new NextResponse(null, { status: 500 })
  }
}
