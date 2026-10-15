import * as React from 'react'
import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import ResearchDetailClient from './research-detail-client'

const prisma = new PrismaClient()

interface ResearchDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// 分类映射
const categoryConfig = {
  AI_RESEARCH: {
    name: 'AI研究与应用',
    description: '人工智能技术研发和应用',
  },
  INNOVATION: {
    name: '技术创新',
    description: '前沿技术创新研究',
  },
  ACHIEVEMENTS: {
    name: '研发成果',
    description: '重要研发成果展示',
  },
  PAPERS: {
    name: '技术论文',
    description: '学术论文和技术文档',
  },
}

// 确保数组字段的类型安全
function ensureArray(value: any): any[] {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

// 启用 ISR - 每60秒重新验证一次
export const revalidate = 60

export default async function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  const { slug } = await params

  // 从数据库获取研究数据
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
    notFound()
  }

  // 获取相关研究
  const relatedResearch = await prisma.research.findMany({
    where: {
      category: research.category,
      status: 'PUBLISHED',
      id: { not: research.id },
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      image: true,
      slug: true,
      publishedAt: true,
      featured: true,
      category: true,
      tags: true,
    },
    take: 3,
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })

  // 确保数组字段的类型安全
  const cleanResearch = {
    ...research,
    tags: ensureArray(research.tags),
    authors: ensureArray(research.authors),
    attachments: ensureArray(research.attachments),
    categoryName:
      categoryConfig[research.category as keyof typeof categoryConfig]?.name || research.category,
  }

  // 添加分类名称到相关研究
  const cleanRelatedResearch = relatedResearch.map(item => ({
    ...item,
    tags: ensureArray(item.tags),
    categoryName:
      categoryConfig[item.category as keyof typeof categoryConfig]?.name || item.category,
  }))

  // 创建分类数据
  const categoryData = {
    id: research.category,
    name:
      categoryConfig[research.category as keyof typeof categoryConfig]?.name || research.category,
    description:
      categoryConfig[research.category as keyof typeof categoryConfig]?.description ||
      `${research.category}相关的研究内容`,
  }

  return (
    <ResearchDetailClient
      research={{
        ...cleanResearch,
        subtitle: cleanResearch.subtitle || undefined,
        image: cleanResearch.image || undefined,
        publishedAt: cleanResearch.publishedAt || new Date(),
      }}
      category={{
        ...categoryData,
        slug: research.slug,
        categoryName: categoryData.name,
      }}
      relatedResearch={cleanRelatedResearch.map(item => ({
        ...item,
        publishedAt: item.publishedAt || new Date(),
      }))}
    />
  )
}
