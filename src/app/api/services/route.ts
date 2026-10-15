import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取服务数据
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: 开始获取服务数据')

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const serviceType = searchParams.get('serviceType') // core, specialized
    const status = searchParams.get('status') || 'PUBLISHED'

    console.log('📋 API: 查询参数', { limit, serviceType, status })

    // 构建查询条件
    const where: any = {
      status: status, // 只返回已发布的服务
    }

    if (serviceType) {
      where.serviceType = serviceType
    }

    console.log('🔍 API: 查询条件', where)

    // 获取服务列表
    const services = await prisma.service.findMany({
      where,
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        serviceType: true,
        icon: true,
        backgroundImage: true,
        highlight: true,
        features: true,
        displayOrder: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit,
    })

    console.log(`📊 API: 从数据库获取到 ${services.length} 个服务`)

    // 解析JSON字段的辅助函数
    const parseJsonField = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field)
        } catch (e) {
          console.warn('JSON解析失败:', field)
          return []
        }
      }
      return Array.isArray(field) ? field : []
    }

    // 格式化服务数据
    const formattedServices = services.map((service, index) => {
      const features = parseJsonField(service.features)

      console.log(`📋 API: 处理服务 ${index + 1}: ${service.title}`)
      console.log(`   - 服务类型: ${service.serviceType}`)
      console.log(`   - 特性数量: ${features.length}`)
      console.log(`   - 特性内容: ${features.slice(0, 3).join(', ')}`)

      return {
        id: service.id,
        title: service.title,
        subtitle: service.subtitle,
        description: service.description,
        serviceType: service.serviceType,
        icon: service.icon || 'Settings',
        backgroundImage: service.backgroundImage,
        highlight: service.highlight,
        features: features,
        displayOrder: service.displayOrder,
        slug: service.slug,
        href: `/services/${service.slug}`,
        status: service.status,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
      }
    })

    console.log(`✅ API: 返回 ${formattedServices.length} 个格式化服务`)

    return NextResponse.json({
      success: true,
      services: formattedServices,
      count: formattedServices.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('获取服务数据失败:', error)
    return NextResponse.json({ error: '获取服务数据失败' }, { status: 500 })
  }
}
