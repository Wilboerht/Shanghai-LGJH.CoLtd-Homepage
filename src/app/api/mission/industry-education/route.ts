import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取产教融合模块数据
export async function GET(request: NextRequest) {
  try {
    // 获取产教融合模块
    const module = await prisma.missionModule.findUnique({
      where: { category: 'industry-education' },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!module) {
      return NextResponse.json({ error: '产教融合模块不存在' }, { status: 404 })
    }

    // 处理数据，按类型分组
    // 合作概况 - 直接可编辑的富文本内容
    const overview = module.items.find(item => item.category === 'cooperation-overview')

    // 合作院校 - 每篇文章代表一个学校
    const universities = module.items
      .filter(item => item.category === 'university' && item.status === 'published')
      .map(item => {
        // 解析metadata中的额外信息
        let metadata = {}
        try {
          metadata = item.metadata
            ? typeof item.metadata === 'string'
              ? JSON.parse(item.metadata)
              : item.metadata
            : {}
        } catch {
          metadata = {}
        }

        // 解析tags
        let tags = []
        try {
          tags = item.tags
            ? typeof item.tags === 'string'
              ? JSON.parse(item.tags)
              : item.tags
            : []
        } catch {
          tags = []
        }

        return {
          id: item.id,
          name: item.title,
          field: (metadata as any).field || '未分类',
          description: item.description || '',
          content: item.content || '',
          image: item.image || '/images/mission/university-default.jpg',
          featured: item.featured || false,
          cooperationDetails: {
            overview: item.description || '',
            timeline: (metadata as any).timeline || '长期合作',
            contact: (metadata as any).contact || '',
            projects: (metadata as any).projects || [],
            achievements: (metadata as any).achievements || [],
          },
          tags: tags,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }
      })

    // 成功案例 - 每篇文章代表一个案例
    const successCases = module.items
      .filter(item => item.category === 'success-case' && item.status === 'published')
      .map(item => {
        // 解析metadata中的额外信息
        let metadata = {}
        try {
          metadata = item.metadata
            ? typeof item.metadata === 'string'
              ? JSON.parse(item.metadata)
              : item.metadata
            : {}
        } catch {
          metadata = {}
        }

        // 解析tags
        let tags = []
        try {
          tags = item.tags
            ? typeof item.tags === 'string'
              ? JSON.parse(item.tags)
              : item.tags
            : []
        } catch {
          tags = []
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description || '',
          content: item.content || '',
          partner: (metadata as any).partner || '合作伙伴',
          year: (metadata as any).year || new Date().getFullYear().toString(),
          image: item.image || '/images/mission/case-default.jpg',
          category: (metadata as any).category || '合作案例',
          tags: tags,
          featured: item.featured || false,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }
      })

    return NextResponse.json({
      module: {
        title: module.title,
        description: module.description,
      },
      overview: overview
        ? {
            content: overview.content || '',
            updatedAt: overview.updatedAt,
          }
        : null,
      universities,
      successCases,
    })
  } catch (error) {
    console.error('获取产教融合数据失败:', error)
    return NextResponse.json({ error: '获取产教融合数据失败' }, { status: 500 })
  }
}
