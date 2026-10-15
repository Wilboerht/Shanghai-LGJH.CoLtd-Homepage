import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const queryParam = searchParams.get('q') || ''
    const typeParam = searchParams.get('type') || 'all'
    const limitParam = parseInt(searchParams.get('limit') || '8')
    const offsetParam = parseInt(searchParams.get('offset') || '0')

    const results = {
      query: queryParam,
      type: typeParam,
      results: [] as any[],
      categories: [] as any[],
      suggestions: [] as string[],
      total: 0,
    }

    // 如果查询为空或太短，返回搜索建议
    if (!queryParam || queryParam === 'default' || queryParam.length < 2) {
      results.suggestions = [
        '产品管理',
        '用户管理',
        '内容管理',
        '表单管理',
        '媒体库',
        '页面管理',
        '导航管理',
        '系统设置',
        '智能监控',
        '安防系统',
        '门禁控制',
        '统计报表',
      ]
      return NextResponse.json(results)
    }

    // 搜索所有类型的数据，然后在最后根据类型筛选
    const allResults: any[] = []

    // 搜索产品
    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: queryParam } },
            { description: { contains: queryParam } },
            { category: { contains: queryParam } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          status: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      })

      const productResults = products.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '暂无描述',
        type: 'product',
        category: item.category || '未分类',
        status: item.status,
        url: `/admin/content/products/${item.id}`,
        updatedAt: item.updatedAt,
      }))

      allResults.push(...productResults)

      if (products.length > 0) {
        results.categories.push({ name: '产品', count: products.length, type: 'product' })
      }
    } catch (error) {
      console.error('搜索产品失败:', error)
    }

    // 搜索研究
    try {
      const research = await prisma.research.findMany({
        where: {
          OR: [
            { title: { contains: queryParam } },
            { description: { contains: queryParam } },
            { content: { contains: queryParam } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          status: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      })

      const researchResults = research.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: 'research',
        category: item.category,
        status: item.status,
        url: `/admin/content/research/${item.id}`,
        updatedAt: item.updatedAt,
      }))

      allResults.push(...researchResults)

      if (research.length > 0) {
        results.categories.push({ name: '研究', count: research.length, type: 'research' })
      }
    } catch (error) {
      console.error('搜索研究失败:', error)
    }

    // 搜索联系表单
    try {
      const contacts = await prisma.contactSubmission.findMany({
        where: {
          OR: [
            { name: { contains: queryParam } },
            { email: { contains: queryParam } },
            { company: { contains: queryParam } },
            { message: { contains: queryParam } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          message: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      const contactResults = contacts.map(item => ({
        id: item.id,
        title: `联系表单 - ${item.name}`,
        description: `${item.company || '个人'} | ${item.email}`,
        type: 'contact',
        category: '联系表单',
        status: item.status,
        url: `/admin/forms/contacts/${item.id}`,
        updatedAt: item.createdAt,
      }))

      allResults.push(...contactResults)

      if (contacts.length > 0) {
        results.categories.push({ name: '表单', count: contacts.length, type: 'forms' })
      }
    } catch (error) {
      console.error('搜索联系表单失败:', error)
    }

    // 搜索管理功能（侧边栏导航）
    const adminFeatures = [
      {
        name: '仪表板',
        href: '/admin/dashboard',
        description: '系统概览和统计',
        category: '系统管理',
      },
      {
        name: '表单管理',
        href: '/admin/forms',
        description: '管理联系表单和招聘申请',
        category: '表单管理',
      },
      {
        name: '联系表单',
        href: '/admin/forms/contacts',
        description: '查看和管理联系表单',
        category: '表单管理',
      },
      {
        name: '招聘申请',
        href: '/admin/content/careers?tab=applications',
        description: '查看和管理招聘申请',
        category: '招聘管理',
      },
      {
        name: '内容管理',
        href: '/admin/content',
        description: '管理网站内容',
        category: '内容管理',
      },
      {
        name: '首页管理',
        href: '/admin/content/homepage',
        description: '管理首页内容和展示',
        category: '内容管理',
      },
      {
        name: '产品管理',
        href: '/admin/content/products',
        description: '管理产品信息和分类',
        category: '内容管理',
      },
      {
        name: '解决方案',
        href: '/admin/content/solutions',
        description: '管理解决方案',
        category: '内容管理',
      },
      {
        name: '研究管理',
        href: '/admin/content/research',
        description: '管理技术研究内容',
        category: '内容管理',
      },
      {
        name: '服务管理',
        href: '/admin/content/services',
        description: '统一管理所有服务内容',
        category: '内容管理',
      },
      {
        name: '产教融合',
        href: '/admin/content/mission/education-integration',
        description: '管理产教融合内容',
        category: '内容管理',
      },
      {
        name: '荣誉活动',
        href: '/admin/content/mission/honors-activities',
        description: '管理荣誉奖项和社会活动',
        category: '内容管理',
      },
      {
        name: '公司动态',
        href: '/admin/content/company-news',
        description: '管理公司新闻动态',
        category: '内容管理',
      },
      {
        name: '加入我们',
        href: '/admin/content/careers',
        description: '管理招聘职位和企业文化',
        category: '内容管理',
      },

      {
        name: '统计报表',
        href: '/admin/analytics',
        description: '查看数据统计',
        category: '统计分析',
      },
      {
        name: '用户管理',
        href: '/admin/users',
        description: '管理管理员账户',
        category: '用户管理',
      },
      {
        name: '地址管理',
        href: '/admin/locations',
        description: '管理公司多个地址',
        category: '系统设置',
      },
      {
        name: '系统设置',
        href: '/admin/settings',
        description: '网站配置和设置',
        category: '系统设置',
      },
    ]

    // 搜索管理功能
    const matchingFeatures = adminFeatures.filter(
      feature =>
        feature.name.includes(queryParam) ||
        feature.description.includes(queryParam) ||
        feature.category.includes(queryParam)
    )

    const featureResults = matchingFeatures.map((feature, index) => ({
      id: `feature-${feature.href.replace(/\//g, '-')}-${index}`,
      title: feature.name,
      description: feature.description,
      type: 'feature',
      category: feature.category,
      status: 'active',
      url: feature.href,
      updatedAt: new Date(),
    }))

    allResults.push(...featureResults)

    if (matchingFeatures.length > 0) {
      results.categories.push({ name: '功能', count: matchingFeatures.length, type: 'feature' })
    }

    // 按更新时间排序所有结果
    allResults.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    // 根据类型筛选结果
    let filteredResults = allResults
    if (typeParam !== 'all') {
      filteredResults = allResults.filter(result => {
        if (typeParam === 'forms') {
          return result.type === 'contact' || result.type === 'application'
        }
        return result.type === typeParam
      })
    }

    // 设置总数
    results.total = filteredResults.length

    // 应用分页
    results.results = filteredResults.slice(offsetParam, offsetParam + limitParam)

    // 添加相关搜索建议
    const suggestions = ['产品管理', '用户管理', '内容管理', '表单管理']
    if (queryParam.includes('管理')) {
      suggestions.push('媒体库', '页面管理', '导航管理', '系统设置')
    }
    if (queryParam.includes('智能')) {
      suggestions.push('智能摄像头', '智能门禁', '智能报警')
    }
    if (queryParam.includes('安防')) {
      suggestions.push('安防监控', '安防报警', '安防系统')
    }
    if (queryParam.includes('产品')) {
      suggestions.push('产品分类', '产品展示', '产品详情')
    }
    if (queryParam.includes('用户')) {
      suggestions.push('用户权限', '管理员', '账户管理')
    }
    if (queryParam.includes('表单')) {
      suggestions.push('联系表单', '招聘申请', '表单统计')
    }
    results.suggestions = suggestions.slice(0, 8)

    return NextResponse.json(results)
  } catch (error) {
    console.error('搜索失败:', error)
    return NextResponse.json(
      {
        error: '搜索失败',
        query: '',
        type: 'all',
        results: [],
        categories: [],
        suggestions: ['智能监控', '安防系统', '门禁控制', '视频监控'],
      },
      { status: 500 }
    )
  }
}
