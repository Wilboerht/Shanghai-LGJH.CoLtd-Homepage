import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取公开的企业资质列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 构建查询条件
    const where: any = {
      isActive: true,
    }

    if (category) {
      where.category = category
    }

    if (featured === 'true') {
      where.featured = true
    }

    // 获取企业资质列表
    const qualifications = await prisma.qualification.findMany({
      where,
      take: limit,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        category: true,
        issuer: true,
        issueDate: true,
        expiryDate: true,
        certificateNumber: true,
        displayOrder: true,
        featured: true,
      },
    })

    return NextResponse.json({
      qualifications,
    })
  } catch (error) {
    console.error('获取企业资质失败:', error)
    return NextResponse.json({ error: '获取企业资质失败' }, { status: 500 })
  }
}
