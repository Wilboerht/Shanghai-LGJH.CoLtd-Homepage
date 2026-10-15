/**
 * 公共地址API
 * 供前端获取公司地址信息（无需认证）
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取公开的地址信息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const activeOnly = searchParams.get('activeOnly') !== 'false' // 默认只返回启用的地址

    // 构建查询条件
    const where: any = {}

    if (activeOnly) {
      where.isActive = true
    }

    if (type) {
      where.type = type
    }

    const locations = await prisma.companyLocation.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' }, // 默认地址排在前面
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        type: true,
        address: true,
        phone: true,
        email: true,
        longitude: true,
        latitude: true,
        description: true,
        isDefault: true,
        businessHours: true,
        contactPerson: true,
      },
    })

    // 解析营业时间
    const locationsWithParsedHours = locations.map(location => {
      let businessHours = null
      if (location.businessHours) {
        try {
          businessHours = JSON.parse(location.businessHours)
        } catch (e) {
          console.warn('解析营业时间失败:', e)
        }
      }

      return {
        ...location,
        businessHours,
      }
    })

    return NextResponse.json({
      success: true,
      data: locationsWithParsedHours,
    })
  } catch (error) {
    console.error('获取地址信息失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取地址信息失败',
      },
      { status: 500 }
    )
  }
}
