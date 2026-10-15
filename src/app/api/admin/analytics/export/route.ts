import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取日期范围
function getDateRange(range: string) {
  const now = new Date()
  const start = new Date()

  switch (range) {
    case '7d':
      start.setDate(now.getDate() - 7)
      break
    case '30d':
      start.setDate(now.getDate() - 30)
      break
    case '90d':
      start.setDate(now.getDate() - 90)
      break
    case '1y':
      start.setFullYear(now.getFullYear() - 1)
      break
    default:
      start.setDate(now.getDate() - 30)
  }

  return { start, end: now }
}

// 将数据转换为CSV格式
function arrayToCSV(data: any[], headers: string[]) {
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row =>
    headers
      .map(header => {
        const value = row[header]
        // 处理包含逗号或引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      .join(',')
  )

  return [csvHeaders, ...csvRows].join('\n')
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    const type = searchParams.get('type') || 'overview' // overview, submissions, users, content

    const { start, end } = getDateRange(range)

    let csvData = ''
    let filename = `analytics-${range}-${new Date().toISOString().split('T')[0]}.csv`

    switch (type) {
      case 'submissions':
        // 导出表单提交数据
        const submissions = await prisma.contactSubmission.findMany({
          where: { createdAt: { gte: start, lte: end } },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        })

        const submissionData = submissions.map(item => ({
          ID: item.id,
          姓名: item.name,
          邮箱: item.email,
          电话: item.phone || '',
          公司: item.company || '',
          状态:
            item.status === 'NEW'
              ? '新提交'
              : item.status === 'READ'
                ? '已查看'
                : item.status === 'PROCESSING'
                  ? '处理中'
                  : item.status === 'REPLIED'
                    ? '已回复'
                    : item.status === 'CLOSED'
                      ? '已关闭'
                      : '垃圾邮件',
          创建时间: item.createdAt.toLocaleString('zh-CN'),
        }))

        csvData = arrayToCSV(submissionData, [
          'ID',
          '姓名',
          '邮箱',
          '电话',
          '公司',
          '类型',
          '状态',
          '创建时间',
          '更新时间',
        ])
        filename = `submissions-${range}-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'users':
        // 导出用户数据
        const users = await prisma.user.findMany({
          where: { createdAt: { gte: start, lte: end } },
          select: {
            id: true,
            name: true,
            email: true,
            isAdmin: true,
            lastLogin: true,
            createdAt: true,
            _count: {
              select: {
                contactSubmissions: true,
                articles: true,
                products: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        })

        const userData = users.map(item => ({
          ID: item.id,
          姓名: item.name,
          邮箱: item.email,
          角色: item.isAdmin ? '管理员' : '普通用户',
          最后登录: item.lastLogin ? item.lastLogin.toLocaleString('zh-CN') : '从未登录',
          处理表单数: item._count.contactSubmissions,
          管理文章数: item._count.articles,
          管理产品数: item._count.products,
          注册时间: item.createdAt.toLocaleString('zh-CN'),
        }))

        csvData = arrayToCSV(userData, [
          'ID',
          '姓名',
          '邮箱',
          '角色',
          '最后登录',
          '处理表单数',
          '管理文章数',
          '管理产品数',
          '注册时间',
        ])
        filename = `users-${range}-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'content':
        // 导出内容统计数据
        const [products, solutions, services, research, articles] = await Promise.all([
          prisma.product.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: {
              id: true,
              title: true,
              category: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              updater: {
                select: { name: true },
              },
            },
          }),
          prisma.solution.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: {
              id: true,
              title: true,
              category: true,
              createdAt: true,
              updatedAt: true,
              updater: { select: { name: true } },
            },
          }),
          prisma.service.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: {
              id: true,
              title: true,
              category: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              updater: { select: { name: true } },
            },
          }),
          prisma.research.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: {
              id: true,
              title: true,
              category: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              updater: { select: { name: true } },
            },
          }),
          prisma.article.findMany({
            where: { createdAt: { gte: start, lte: end } },
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              author: { select: { name: true } },
            },
          }),
        ])

        const contentData = [
          ...products.map(item => ({
            ID: item.id,
            类型: '产品',
            标题: item.title,
            分类: item.category || '',
            状态:
              item.status === 'AVAILABLE'
                ? '可用'
                : item.status === 'COMING_SOON'
                  ? '即将推出'
                  : '已停产',
            创建时间: item.createdAt.toLocaleString('zh-CN'),
            更新时间: item.updatedAt.toLocaleString('zh-CN'),
            更新人: item.updater?.name || '',
          })),
          ...solutions.map(item => ({
            ID: item.id,
            类型: '解决方案',
            标题: item.title,
            分类: item.category || '',
            状态: '解决方案', // Solution模型没有status字段
            创建时间: item.createdAt.toLocaleString('zh-CN'),
            更新时间: item.updatedAt.toLocaleString('zh-CN'),
            更新人: item.updater?.name || '',
          })),
          ...services.map(item => ({
            ID: item.id,
            类型: '服务',
            标题: item.title,
            分类: item.category || '',
            状态:
              item.status === 'AVAILABLE'
                ? '可用'
                : item.status === 'COMING_SOON'
                  ? '即将推出'
                  : '已停产',
            创建时间: item.createdAt.toLocaleString('zh-CN'),
            更新时间: item.updatedAt.toLocaleString('zh-CN'),
            更新人: item.updater?.name || '',
          })),
          ...research.map(item => ({
            ID: item.id,
            类型: '研究',
            标题: item.title,
            分类: item.category || '',
            状态:
              item.status === 'PUBLISHED' ? '已发布' : item.status === 'DRAFT' ? '草稿' : '已归档',
            创建时间: item.createdAt.toLocaleString('zh-CN'),
            更新时间: item.updatedAt.toLocaleString('zh-CN'),
            更新人: item.updater?.name || '',
          })),
          ...articles.map(item => ({
            ID: item.id,
            类型: '文章',
            标题: item.title,
            分类: item.slug || '',
            状态: item.status === 'PUBLISHED' ? '已发布' : '草稿',
            创建时间: item.createdAt.toLocaleString('zh-CN'),
            更新时间: item.updatedAt.toLocaleString('zh-CN'),
            更新人: item.author?.name || '',
          })),
        ].sort((a, b) => new Date(b.创建时间).getTime() - new Date(a.创建时间).getTime())

        csvData = arrayToCSV(contentData, [
          'ID',
          '类型',
          '标题',
          '分类',
          '状态',
          '创建时间',
          '更新时间',
          '更新人',
        ])
        filename = `content-${range}-${new Date().toISOString().split('T')[0]}.csv`
        break

      default:
        // 导出概览统计数据
        const overviewData = [
          {
            指标: '用户总数',
            数量: await prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
            时间范围: range,
          },
          {
            指标: '表单提交总数',
            数量: await prisma.contactSubmission.count({
              where: { createdAt: { gte: start, lte: end } },
            }),
            时间范围: range,
          },
          {
            指标: '产品数量',
            数量: await prisma.product.count({ where: { createdAt: { gte: start, lte: end } } }),
            时间范围: range,
          },
          {
            指标: '解决方案数量',
            数量: await prisma.solution.count({ where: { createdAt: { gte: start, lte: end } } }),
            时间范围: range,
          },
          {
            指标: '服务数量',
            数量: await prisma.service.count({ where: { createdAt: { gte: start, lte: end } } }),
            时间范围: range,
          },
          {
            指标: '研究数量',
            数量: await prisma.research.count({ where: { createdAt: { gte: start, lte: end } } }),
            时间范围: range,
          },
        ]

        csvData = arrayToCSV(overviewData, ['指标', '数量', '时间范围'])
        break
    }

    // 添加BOM以支持中文显示
    const bom = '\uFEFF'
    const csvWithBom = bom + csvData

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('导出数据失败:', error)
    return NextResponse.json({ error: '导出数据失败' }, { status: 500 })
  }
}
