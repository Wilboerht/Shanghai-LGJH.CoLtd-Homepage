import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 分类映射
const categoryMap = {
  AI_RESEARCH: 'AI研究与应用',
  INNOVATION: '技术创新',
  ACHIEVEMENTS: '研发成果',
  PAPERS: '技术论文',
}

// GET - 获取单个研究详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const { slug } = await params

    // 查询研究详情
    const research = await prisma.research.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        content: true,
        image: true,
        slug: true,
        publishedAt: true,
        tags: true,
        authors: true,
        attachments: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!research) {
      return NextResponse.json({ error: '研究不存在或未发布' }, { status: 404 })
    }

    // 获取相关研究（同分类的其他研究）
    const relatedResearch = await prisma.research.findMany({
      where: {
        category: research.category,
        status: 'PUBLISHED',
        id: { not: research.id },
      },
      take: 3,
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        image: true,
        slug: true,
        publishedAt: true,
        featured: true,
      },
    })

    // 转换分类名称为中文
    const researchWithCategoryName = {
      ...research,
      categoryName: categoryMap[research.category as keyof typeof categoryMap],
    }

    return NextResponse.json({
      research: researchWithCategoryName,
      relatedResearch,
    })
  } catch (error) {
    console.error('获取研究详情失败:', error)
    return NextResponse.json({ error: '获取研究详情失败' }, { status: 500 })
  }
}
