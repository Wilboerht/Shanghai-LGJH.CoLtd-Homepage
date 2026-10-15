import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 安全解析JSON字段的辅助函数
function safeParseJSON(jsonString: any) {
  if (typeof jsonString === 'string') {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      console.warn('JSON解析失败:', error)
      return null
    }
  }
  return jsonString
}

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET - 根据slug获取服务详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const { slug } = await params

    const service = await prisma.service.findUnique({
      where: {
        slug,
        status: 'PUBLISHED', // 只返回已发布的服务
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        serviceType: true,
        level: true,
        duration: true,
        backgroundImage: true,
        highlight: true,
        features: true,
        hero: true,
        learning: true,
        courseInfo: true,
        about: true,
        cta: true,
        process: true,
        visualElements: true,
        ctaConfig: true,
        metrics: true,
        seo: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!service) {
      return NextResponse.json({ error: '服务不存在' }, { status: 404 })
    }

    // 获取相关服务（其他服务）
    const relatedServices = await prisma.service.findMany({
      where: {
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
        visualElements: true,
      },
    })

    // 安全解析JSON字段
    const formattedService = {
      ...service,
      features: safeParseJSON(service.features),
      hero: safeParseJSON(service.hero),
      learning: safeParseJSON(service.learning),
      courseInfo: safeParseJSON(service.courseInfo),
      about: safeParseJSON(service.about),
      cta: safeParseJSON(service.cta),
      process: safeParseJSON(service.process),
      visualElements: safeParseJSON(service.visualElements),
      ctaConfig: safeParseJSON(service.ctaConfig),
      metrics: safeParseJSON(service.metrics),
    }

    const formattedRelatedServices = relatedServices.map(relatedService => ({
      ...relatedService,
      visualElements: safeParseJSON(relatedService.visualElements),
    }))

    return NextResponse.json({
      service: formattedService,
      relatedServices: formattedRelatedServices,
    })
  } catch (error) {
    console.error('获取服务详情失败:', error)
    return NextResponse.json({ error: '获取服务详情失败' }, { status: 500 })
  }
}
