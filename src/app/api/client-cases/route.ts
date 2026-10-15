import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取公开的客户案例列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const limit = parseInt(searchParams.get('limit') || '10')

    // 构建查询条件
    const where: any = {
      isActive: true,
    }

    if (industry) {
      where.industry = industry
    }

    // 获取客户案例列表
    const clientCases = await prisma.clientCase.findMany({
      where,
      take: limit,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        logo: true,
        logoText: true,
        logoColor: true,
        industry: true,
        title: true,
        description: true,
        image: true,
        metrics: true,
        tags: true,
        displayOrder: true,
      },
    })

    // 安全解析JSON字段
    const processedCases = clientCases.map(clientCase => {
      let metrics = null
      let tags = null

      // 安全解析metrics
      if (clientCase.metrics) {
        try {
          metrics = JSON.parse(clientCase.metrics)
        } catch (error) {
          console.error(`解析客户案例 ${clientCase.name} 的metrics失败:`, error)
          metrics = null
        }
      }

      // 安全解析tags
      if (clientCase.tags) {
        try {
          // 如果tags是字符串格式（用逗号分隔），转换为数组
          if (typeof clientCase.tags === 'string' && !clientCase.tags.startsWith('[')) {
            tags = clientCase.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag)
          } else {
            tags = JSON.parse(clientCase.tags)
          }
        } catch (error) {
          console.error(`解析客户案例 ${clientCase.name} 的tags失败:`, error)
          // 尝试作为逗号分隔的字符串处理
          if (typeof clientCase.tags === 'string') {
            tags = clientCase.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag)
          } else {
            tags = null
          }
        }
      }

      return {
        ...clientCase,
        metrics,
        tags,
      }
    })

    return NextResponse.json({
      clientCases: processedCases,
    })
  } catch (error) {
    console.error('获取客户案例失败:', error)
    return NextResponse.json({ error: '获取客户案例失败' }, { status: 500 })
  }
}
