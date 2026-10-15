import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取产品分类列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 从数据库获取分类数据
    const categories = await prisma.productCategory.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({
      categories,
      total: categories.length,
    })
  } catch (error) {
    console.error('获取产品分类失败:', error)
    return NextResponse.json({ error: '获取产品分类失败' }, { status: 500 })
  }
}

// PUT - 更新分类排序
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const { categories } = await request.json()

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: '无效的分类数据' }, { status: 400 })
    }

    // 验证分类数据
    for (const cat of categories) {
      if (!cat.id || typeof cat.order !== 'number') {
        return NextResponse.json({ error: '分类数据格式错误' }, { status: 400 })
      }
    }

    // 批量更新分类数据
    for (const cat of categories) {
      await prisma.productCategory.update({
        where: { id: cat.id },
        data: {
          order: cat.order,
          isActive: cat.isActive,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: '分类排序更新成功',
      note: '分类配置已保存到数据库',
    })
  } catch (error) {
    console.error('更新分类排序失败:', error)
    return NextResponse.json({ error: '更新分类排序失败' }, { status: 500 })
  }
}
