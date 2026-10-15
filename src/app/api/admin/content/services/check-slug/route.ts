import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 检查服务slug是否可用
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const excludeId = searchParams.get('excludeId')

    if (!slug) {
      return NextResponse.json({ error: '缺少slug参数' }, { status: 400 })
    }

    // 构建查询条件
    const where: any = { slug }

    // 如果是编辑现有服务，排除当前服务的ID
    if (excludeId && excludeId !== '') {
      where.id = {
        not: excludeId,
      }
    }

    // 检查是否存在相同的slug
    const existingService = await prisma.service.findFirst({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
      },
    })

    const available = !existingService

    return NextResponse.json({
      available,
      slug,
      ...(existingService && {
        conflictService: {
          id: existingService.id,
          title: existingService.title,
          slug: existingService.slug,
        },
      }),
    })
  } catch (error) {
    console.error('检查slug可用性失败:', error)
    return NextResponse.json({ error: '检查slug可用性失败' }, { status: 500 })
  }
}
