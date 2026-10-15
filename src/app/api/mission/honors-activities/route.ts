import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取荣誉活动模块数据
export async function GET(request: NextRequest) {
  try {
    // 获取荣誉活动模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'honors-activities' },
      include: {
        items: {
          where: { status: 'published' },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!module) {
      return NextResponse.json({ error: '荣誉活动模块不存在' }, { status: 404 })
    }

    // 格式化数据以匹配前端期望的结构
    const formattedData = {
      module: {
        id: module.id,
        title: module.title,
        subtitle: module.subtitle,
        description: module.description,
        icon: module.icon,
        image: module.image,
        highlights: module.highlights,
        features: module.features,
        achievements: module.achievements,
        gradient: module.gradient,
        accentColor: module.accentColor,
        href: module.href,
      },
      honors: module.items
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
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : '2024-12-31',
          description: item.description || item.summary,
          image: item.image || '/images/mission/innovation-award.jpg',
          issuer: (item.metadata as any)?.issuer || '相关机构',
        })),
      activities: module.items
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
          description: item.description || item.summary,
          image: item.image || '/images/mission/charity-activity.jpg',
          participants: (item.metadata as any)?.participants || '50+',
          impact: (item.metadata as any)?.impact || '积极影响',
        })),
      stats: {
        totalHonors: module.items.filter(
          item =>
            item.category === '荣誉奖项' ||
            item.category === '认证资质' ||
            item.category === '技术奖项'
        ).length,
        totalActivities: module.items.filter(
          item =>
            item.category === '公益活动' ||
            item.category === '行业会议' ||
            item.category === '环保活动' ||
            item.category === '创新活动'
        ).length,
        totalParticipants: module.items.reduce((sum, item) => {
          const participants = (item.metadata as any)?.participantCount || 0
          return sum + (typeof participants === 'number' ? participants : 0)
        }, 0),
      },
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('获取荣誉活动数据失败:', error)
    return NextResponse.json({ error: '获取荣誉活动数据失败' }, { status: 500 })
  }
}
