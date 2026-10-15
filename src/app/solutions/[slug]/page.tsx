import * as React from 'react'
import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import SolutionDetailClient from './solution-detail-client'

const prisma = new PrismaClient()

interface SolutionDetailPageProps {
  params: Promise<{
    slug: string
  }>
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

export default async function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const { slug } = await params

  // 从数据库获取解决方案数据
  const solution = await prisma.solution.findFirst({
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
    notFound()
  }

  // 获取相关解决方案
  const relatedSolutions = await prisma.solution.findMany({
    where: {
      category: solution.category,
      id: { not: solution.id },
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      image: true,
      slug: true,
      gradient: true,
      accentColor: true,
    },
    take: 3,
  })

  // 确保数组字段的类型安全
  const cleanSolution = {
    ...solution,
    features: ensureArray(solution.features),
    applications: ensureArray(solution.applications),
    metrics: ensureArray(solution.metrics),
    technologies: ensureArray(solution.technologies),
    benefits: ensureArray(solution.benefits),
  }

  // 创建分类数据
  const categoryData = {
    id: solution.category,
    name: solution.category,
    description: `${solution.category}相关的智能化解决方案`,
    iconName: 'Building',
  }

  return (
    <SolutionDetailClient
      solution={{
        ...cleanSolution,
        subtitle: cleanSolution.subtitle || undefined,
        description: cleanSolution.description || undefined,
        content: cleanSolution.content || undefined,
        image: cleanSolution.image || undefined,
        gradient: cleanSolution.gradient || undefined,
        accentColor: cleanSolution.accentColor || undefined,
      }}
      category={categoryData}
      relatedSolutions={relatedSolutions.map(sol => ({
        ...sol,
        category: (sol as any).category || 'default',
        subtitle: sol.subtitle || undefined,
        description: sol.description || undefined,
        image: sol.image || undefined,
        gradient: sol.gradient || undefined,
        accentColor: sol.accentColor || undefined,
      }))}
      solutionIconName='Glasses'
    />
  )
}
