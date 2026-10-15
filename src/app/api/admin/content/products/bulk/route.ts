import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 批量操作验证schema
const bulkActionSchema = z.object({
  action: z.enum(['delete']),
  productIds: z.array(z.string()).min(1, '至少选择一个产品'),
})

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    const { action, productIds } = bulkActionSchema.parse(body)

    // 批量删除产品
    const result = await prisma.product.deleteMany({
      where: {
        id: { in: productIds },
      },
    })

    return NextResponse.json({
      success: true,
      message: `成功删除${result.count}个产品`,
      affectedCount: result.count,
    })
  } catch (error) {
    console.error('批量操作失败:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '参数验证失败', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: '批量操作失败' }, { status: 500 })
  }
}

// 批量导出产品数据
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productIds = searchParams.get('ids')?.split(',') || []
    const format = searchParams.get('format') || 'json'

    // 查询产品数据
    const products = await prisma.product.findMany({
      where: productIds.length > 0 ? { id: { in: productIds } } : {},
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 格式化数据
    const formattedProducts = products.map(product => ({
      ...product,
      features:
        typeof product.features === 'string' ? JSON.parse(product.features) : product.features,
      specifications:
        typeof product.specifications === 'string'
          ? JSON.parse(product.specifications)
          : product.specifications,
      applications:
        typeof product.applications === 'string'
          ? JSON.parse(product.applications)
          : product.applications,
      benefits:
        typeof product.benefits === 'string' ? JSON.parse(product.benefits) : product.benefits,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
      // priceInfo 字段在 Product 模型中不存在，移除
      // priceInfo: typeof product.priceInfo === 'string'
      //   ? JSON.parse(product.priceInfo)
      //   : product.priceInfo,
    }))

    if (format === 'csv') {
      // 返回CSV格式
      const csvHeaders = [
        'ID',
        '分类',
        '标题',
        '副标题',
        '描述',
        '状态',
        'URL别名',
        '创建时间',
        '更新时间',
        '更新者',
      ].join(',')

      const csvRows = formattedProducts.map(product =>
        [
          product.id,
          product.category,
          `"${product.title}"`,
          `"${product.subtitle || ''}"`,
          `"${product.description || ''}"`,
          product.status,
          product.slug,
          product.createdAt.toISOString(),
          product.updatedAt.toISOString(),
          product.updater?.name || '',
        ].join(',')
      )

      const csvContent = [csvHeaders, ...csvRows].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    // 返回JSON格式
    return NextResponse.json({
      products: formattedProducts,
      total: formattedProducts.length,
      exportTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error('导出产品数据失败:', error)
    return NextResponse.json({ error: '导出产品数据失败' }, { status: 500 })
  }
}
