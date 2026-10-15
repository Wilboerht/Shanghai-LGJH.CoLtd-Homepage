import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('测试API被调用')

    // 简单测试数据库连接
    const productCount = await prisma.product.count()
    console.log('产品总数:', productCount)

    // 获取前5个产品
    const products = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
      },
    })

    console.log('查询到的产品:', products)

    return NextResponse.json({
      success: true,
      count: productCount,
      products: products,
      message: '数据库连接正常',
    })
  } catch (error) {
    console.error('测试API错误:', error)
    return NextResponse.json(
      {
        error: '测试失败',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
