import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

// 服务更新验证
const serviceUpdateSchema = z.object({
  title: z.string().min(1, '服务标题不能为空').optional(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().min(1, '服务分类不能为空').optional(),
  serviceType: z.enum(['core', 'specialized']).optional(),
  level: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),

  // 服务页面展示配置
  icon: z.string().optional().nullable(),
  backgroundImage: z.string().optional().nullable(),
  highlight: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  displayOrder: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform(val => {
      if (val === null || val === undefined) return 0
      if (typeof val === 'string') return parseInt(val) || 0
      return val
    }),

  // 页面内容结构
  hero: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      instructor: z
        .object({
          name: z.string().optional(),
          title: z.string().optional(),
          company: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .nullable(),
  learning: z
    .object({
      title: z.string().optional(),
      objectives: z.array(z.string()).optional(),
    })
    .optional()
    .nullable(),
  courseInfo: z
    .object({
      level: z.string().optional(),
      duration: z.string().optional(),
      lessons: z
        .union([z.number(), z.string()])
        .optional()
        .transform(val => {
          if (typeof val === 'string') return parseInt(val) || 0
          return val
        }),
      instructor: z.string().optional(),
      company: z.string().optional(),
    })
    .optional()
    .nullable(),
  about: z
    .object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      content: z.string().optional(),
      details: z.array(z.string()).optional(),
      sections: z
        .array(
          z.object({
            id: z.string(),
            type: z.enum(['text', 'image', 'list', 'quote', 'divider']),
            title: z.string().optional(),
            content: z.string().optional(),
            imageUrl: z.string().optional(),
            imageAlt: z.string().optional(),
            items: z.array(z.string()).optional(),
            order: z.number(),
          })
        )
        .optional(),
    })
    .optional()
    .nullable(),
  cta: z
    .object({
      buttonText: z.string().optional(),
      isEnrollment: z.boolean().optional(),
    })
    .optional()
    .nullable(),

  process: z
    .array(
      z.object({
        step: z.number(),
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      })
    )
    .optional(),
  visualElements: z
    .object({
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      icon: z.string().optional(),
    })
    .optional()
    .nullable(),
  ctaConfig: z
    .object({
      text: z.string().optional(),
      link: z.string().optional(),
      style: z.string().optional(),
    })
    .optional()
    .nullable(),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        unit: z.string().optional(),
      })
    )
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  slug: z.string().min(1, '服务标识不能为空').optional(),
})

// GET - 获取单个服务详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const service = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!service) {
      return NextResponse.json({ error: '服务不存在' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('获取服务详情失败:', error)
    return NextResponse.json({ error: '获取服务详情失败' }, { status: 500 })
  }
}

// PUT - 更新服务
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    const body = await request.json()
    console.log('🔍 Service update request body:', JSON.stringify(body, null, 2))

    try {
      const validatedData = serviceUpdateSchema.parse(body)
      console.log('✅ Validation successful:', JSON.stringify(validatedData, null, 2))
    } catch (validationError) {
      console.error('❌ Validation failed:', validationError)
      if (validationError instanceof z.ZodError) {
        console.error('Validation details:', validationError.issues)
        return NextResponse.json(
          {
            error: '数据验证失败',
            details: validationError.issues,
          },
          { status: 400 }
        )
      }
      throw validationError
    }

    const validatedData = serviceUpdateSchema.parse(body)

    // 检查服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingService) {
      return NextResponse.json({ error: '服务不存在' }, { status: 404 })
    }

    // 如果更新slug，检查是否与其他服务冲突
    if (validatedData.slug && validatedData.slug !== existingService.slug) {
      const slugConflict = await prisma.service.findUnique({
        where: { slug: validatedData.slug },
      })

      if (slugConflict) {
        return NextResponse.json({ error: '服务标识已存在' }, { status: 400 })
      }
    }

    // 验证用户是否存在
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    })

    // 处理null值，确保必需字段不为null，JSON字段不能为null
    const updateData = {
      ...validatedData,
      level: validatedData.level || 'intermediate', // 确保 level 不为 null
      hero: validatedData.hero || undefined, // 确保 hero 不为 null，使用 undefined 代替
      learning: validatedData.learning || undefined, // 确保 learning 不为 null
      about: validatedData.about || undefined, // 确保 about 不为 null
      courseInfo: validatedData.courseInfo || undefined, // 确保 courseInfo 不为 null
      cta: validatedData.cta || undefined, // 确保 cta 不为 null
      visualElements: validatedData.visualElements || undefined, // 确保 visualElements 不为 null
      ctaConfig: validatedData.ctaConfig || undefined, // 确保 ctaConfig 不为 null
    }

    const service = await prisma.service.update({
      where: { id: resolvedParams.id },
      data: {
        ...updateData,
        updatedBy: userExists ? session.user.id : null, // 如果用户不存在则设为null
      },
      include: {
        updater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateService(service.slug, existingService.slug)

    return NextResponse.json(service)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新服务失败:', error)
    return NextResponse.json({ error: '更新服务失败' }, { status: 500 })
  }
}

// DELETE - 删除服务
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 })
    }

    // 检查服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!existingService) {
      return NextResponse.json({ error: '服务不存在' }, { status: 404 })
    }

    await prisma.service.delete({
      where: { id: resolvedParams.id },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateService(existingService.slug)

    return NextResponse.json({ message: '服务删除成功' })
  } catch (error) {
    console.error('删除服务失败:', error)
    return NextResponse.json({ error: '删除服务失败' }, { status: 500 })
  }
}
