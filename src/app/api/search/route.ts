import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 搜索参数验证
const searchSchema = z.object({
  q: z.string().min(1, '搜索关键词不能为空'),
  type: z.enum(['all', 'products', 'solutions', 'services', 'research', 'news']).default('all'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(20)).default(10),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = searchSchema.parse({
      q: searchParams.get('q') || '',
      type: searchParams.get('type') || 'all',
      limit: searchParams.get('limit') || '10',
    })

    const results: any[] = []
    const categories: any[] = []

    // 搜索产品
    if (params.type === 'all' || params.type === 'products') {
      try {
        const products = await prisma.product.findMany({
          where: {
            AND: [
              { status: 'AVAILABLE' },
              {
                OR: [
                  { title: { contains: params.q } },
                  { description: { contains: params.q } },
                  { subtitle: { contains: params.q } },
                ],
              },
            ],
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            image: true,
          },
          take: params.limit,
        })

        const productResults = products.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || '暂无描述',
          type: 'product',
          category: product.category,
          url: `/products/${product.id}`,
          imageUrl: product.image,
        }))

        results.push(...productResults)
        if (products.length > 0) {
          categories.push({ name: '产品', count: products.length, type: 'products' })
        }
      } catch (error) {
        console.error('搜索产品失败:', error)
      }
    }

    // 搜索解决方案 - 暂时跳过，因为Solution模型可能不存在
    // if (params.type === 'all' || params.type === 'solutions') {
    //   // Solution模型搜索逻辑
    // }

    // 搜索服务
    if (params.type === 'all' || params.type === 'services') {
      try {
        const services = await prisma.service.findMany({
          where: {
            AND: [
              { status: 'ACTIVE' },
              {
                OR: [
                  { title: { contains: params.q } },
                  { description: { contains: params.q } },
                  { subtitle: { contains: params.q } },
                ],
              },
            ],
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            // image字段已从Service模型中移除
            // image: true,
          },
          take: params.limit,
        })

        const serviceResults = services.map(service => ({
          id: service.id,
          title: service.title,
          description: service.description || '暂无描述',
          type: 'service',
          category: service.category,
          url: `/services/${service.id}`,
          imageUrl: '/images/services/default.jpg', // 使用默认图片
        }))

        results.push(...serviceResults)
        if (services.length > 0) {
          categories.push({ name: '服务', count: services.length, type: 'services' })
        }
      } catch (error) {
        console.error('搜索服务失败:', error)
      }
    }

    // 搜索研究
    if (params.type === 'all' || params.type === 'research') {
      try {
        const research = await prisma.research.findMany({
          where: {
            AND: [
              { status: 'PUBLISHED' },
              {
                OR: [
                  { title: { contains: params.q } },
                  { description: { contains: params.q } },
                  { content: { contains: params.q } },
                  { subtitle: { contains: params.q } },
                ],
              },
            ],
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            image: true,
          },
          take: params.limit,
        })

        const researchResults = research.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: 'research',
          category: item.category,
          url: `/research/${item.id}`,
          imageUrl: item.image,
        }))

        results.push(...researchResults)
        if (research.length > 0) {
          categories.push({ name: '研究', count: research.length, type: 'research' })
        }
      } catch (error) {
        console.error('搜索研究失败:', error)
      }
    }

    // 搜索文章/动态
    if (params.type === 'all' || params.type === 'news') {
      try {
        const articles = await prisma.article.findMany({
          where: {
            AND: [
              { status: 'PUBLISHED' },
              {
                OR: [
                  { title: { contains: params.q } },
                  { excerpt: { contains: params.q } },
                  { content: { contains: params.q } },
                ],
              },
            ],
          },
          select: {
            id: true,
            title: true,
            excerpt: true,
            featuredImage: true,
            category: true,
            publishedAt: true,
          },
          take: params.limit,
        })

        const articleResults = articles.map(item => ({
          id: item.id,
          title: item.title,
          description: item.excerpt || '暂无摘要',
          type: 'news',
          category: item.category || '文章',
          url: `/articles/${item.id}`,
          imageUrl: item.featuredImage,
          publishedAt: item.publishedAt,
        }))

        results.push(...articleResults)
        if (articles.length > 0) {
          categories.push({ name: '文章动态', count: articles.length, type: 'news' })
        }
      } catch (error) {
        console.error('搜索文章失败:', error)
      }
    }

    // 生成搜索建议
    const suggestions: string[] = []
    if (params.q.includes('智能')) {
      suggestions.push('智能监控', '智能安防', '智能医疗', '智慧养老')
    }
    if (params.q.includes('安防')) {
      suggestions.push('安防系统', '视频监控', '门禁控制', '消防工程')
    }
    if (params.q.includes('数字')) {
      suggestions.push('数字化转型', '数字化产品', '智能数字化')
    }

    return NextResponse.json({
      query: params.q,
      results: results.slice(0, params.limit),
      categories,
      suggestions: suggestions.slice(0, 6),
      total: results.length,
    })
  } catch (error) {
    console.error('全局搜索失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '搜索参数验证失败', details: (error as any).errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: '搜索失败', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}
