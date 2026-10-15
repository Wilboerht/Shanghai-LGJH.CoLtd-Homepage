import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - 获取荣誉活动管理数据
export async function GET(request: NextRequest) {
  try {
    console.log('🔥 GET /api/admin/content/mission/honors-activities - 开始处理请求')

    const session = await getServerSession(authOptions)
    console.log('🔥 Session:', session?.user?.email, '是否管理员:', session?.user?.isAdmin)

    if (!session?.user?.isAdmin) {
      console.log('🔥 权限检查失败 - 返回403')
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 获取荣誉活动模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'honors-activities' },
      include: {
        items: {
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!module) {
      return NextResponse.json({ error: '荣誉活动模块不存在' }, { status: 404 })
    }

    // 分类处理荣誉和活动
    const honors = module.items
      .filter(
        item =>
          item.category === '荣誉奖项' ||
          item.category === '认证资质' ||
          item.category === '技术奖项'
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        category: item.category || '行业奖项',
        year: item.date ? new Date(item.date).getFullYear().toString() : '2024',
        description: item.description || '',
        image: item.image || '/images/mission/innovation-award.jpg',
        issuer: (item.metadata as any)?.issuer || '相关机构',
        status: item.status,
        featured: item.featured,
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '2024-01-01',
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        author: item.author,
      }))

    const activities = module.items
      .filter(
        item =>
          item.category === '公益活动' ||
          item.category === '行业会议' ||
          item.category === '环保活动' ||
          item.category === '创新活动'
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '2024-01-01',
        type: item.category || '公益活动',
        description: item.description || '',
        image: item.image || '/images/mission/charity-activity.jpg',
        participants: (item.metadata as any)?.participants || '50+',
        impact: (item.metadata as any)?.impact || '积极影响',
        status: item.status,
        featured: item.featured,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        author: item.author,
      }))

    // 计算统计数据
    const stats = {
      totalHonors: honors.length,
      totalActivities: activities.length,
      totalParticipants: activities.reduce((sum, activity) => {
        const participantsStr = String(activity.participants || '0')
        const participants = parseInt(participantsStr.replace(/[^\d]/g, '')) || 0
        return sum + participants
      }, 0),
      publishedHonors: honors.filter(h => h.status === 'published').length,
      publishedActivities: activities.filter(a => a.status === 'published').length,
    }

    return NextResponse.json({
      honors,
      activities,
      stats,
      module: {
        id: module.id,
        title: module.title,
        subtitle: module.subtitle,
        description: module.description,
        category: module.category,
        status: module.status,
      },
    })
  } catch (error) {
    console.error('获取荣誉活动管理数据失败:', error)
    return NextResponse.json({ error: '获取荣誉活动管理数据失败' }, { status: 500 })
  }
}

// POST - 创建新的荣誉或活动项目
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/content/mission/honors-activities - 开始处理请求')

    const session = await getServerSession(authOptions)
    console.log('Session:', session?.user?.email, '是否管理员:', session?.user?.isAdmin)

    if (!session?.user?.isAdmin) {
      console.log('权限检查失败 - 返回403')
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    console.log('接收到的数据:', JSON.stringify(body, null, 2))

    const {
      title,
      description,
      date,
      category = '荣誉奖项',
      status = 'draft',
      featured = false,
    } = body

    // 验证必需字段
    if (!title) {
      console.log('标题验证失败')
      return NextResponse.json({ error: '标题是必需的' }, { status: 400 })
    }

    // 获取荣誉活动模块
    console.log('查找荣誉活动模块...')
    const module = await prisma.missionModule.findUnique({
      where: { category: 'honors-activities' },
    })

    if (!module) {
      console.log('荣誉活动模块不存在')
      return NextResponse.json({ error: '荣誉活动模块不存在' }, { status: 404 })
    }

    console.log('找到荣誉活动模块:', module.id)

    // 获取下一个排序号
    const maxOrder = await prisma.missionItem.findFirst({
      where: { moduleId: module.id },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })

    const sortOrder = (maxOrder?.sortOrder || 0) + 1

    // 创建项目
    const item = await prisma.missionItem.create({
      data: {
        title,
        description,
        date: date ? new Date(date) : new Date(),
        category,
        status,
        featured,
        sortOrder,
        moduleId: module.id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('创建荣誉活动项目失败:', error)
    return NextResponse.json({ error: '创建荣誉活动项目失败' }, { status: 500 })
  }
}
