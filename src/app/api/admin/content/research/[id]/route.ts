import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { CacheManager } from '@/lib/cache-utils'
import { z } from 'zod'

const prisma = new PrismaClient()

// 研究更新验证schema
const researchUpdateSchema = z.object({
  title: z.string().min(1, '标题不能为空').optional(),
  subtitle: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val)),
  description: z.string().min(1, '描述不能为空').optional(),
  category: z.enum(['AI_RESEARCH', 'INNOVATION', 'ACHIEVEMENTS', 'PAPERS']).optional(),
  content: z.string().min(1, '内容不能为空').optional(),
  image: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val))
    .refine(
      val => {
        if (!val) return true
        // 允许相对路径（如 /uploads/image.jpg）
        if (val.startsWith('/')) return true
        // 允许完整的URL
        try {
          new URL(val)
          return true
        } catch {
          return false
        }
      },
      { message: '请输入有效的图片URL地址' }
    ),
  slug: z.string().min(1, 'URL标识符不能为空').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  authors: z
    .array(
      z.object({
        name: z.string(),
        title: z.string().optional(),
        email: z
          .string()
          .optional()
          .refine(
            val => {
              if (!val || val === '') return true
              return z.string().email().safeParse(val).success
            },
            { message: '请输入有效的邮箱地址' }
          ),
        avatar: z
          .string()
          .optional()
          .transform(val => (val === '' ? undefined : val))
          .refine(
            val => {
              if (!val) return true
              // 允许相对路径（如 /uploads/avatar.jpg）
              if (val.startsWith('/')) return true
              // 允许完整的URL
              try {
                new URL(val)
                return true
              } catch {
                return false
              }
            },
            { message: '请输入有效的头像URL地址' }
          ),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string().optional(),
      })
    )
    .optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

// 权限验证中间件
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isAdmin: true },
  })

  if (!user?.isAdmin) {
    return NextResponse.json({ error: '权限不足' }, { status: 403 })
  }

  return user
}

// GET - 获取单个研究详情
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params

    const research = await prisma.research.findUnique({
      where: { id },
      include: {
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!research) {
      return NextResponse.json({ error: '研究不存在' }, { status: 404 })
    }

    return NextResponse.json(research)
  } catch (error) {
    console.error('获取研究详情失败:', error)
    return NextResponse.json({ error: '获取研究详情失败' }, { status: 500 })
  }
}

// PUT - 更新研究
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params
    const body = await request.json()
    const data = researchUpdateSchema.parse(body)

    // 检查研究是否存在
    const existingResearch = await prisma.research.findUnique({
      where: { id },
    })

    if (!existingResearch) {
      return NextResponse.json({ error: '研究不存在' }, { status: 404 })
    }

    // 如果更新了slug，检查是否与其他研究冲突
    if (data.slug && data.slug !== existingResearch.slug) {
      const slugConflict = await prisma.research.findUnique({
        where: { slug: data.slug },
      })

      if (slugConflict) {
        return NextResponse.json({ error: 'URL标识符已存在' }, { status: 400 })
      }
    }

    // 处理发布日期
    let publishedAt = existingResearch.publishedAt
    if (data.status === 'PUBLISHED' && existingResearch.status !== 'PUBLISHED') {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date()
    } else if (data.status !== 'PUBLISHED') {
      publishedAt = null
    }

    // 更新研究
    const research = await prisma.research.update({
      where: { id },
      data: {
        ...data,
        publishedAt,
        updatedBy: authResult.id,
      },
      include: {
        updater: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateResearch(research.slug, existingResearch.slug)

    return NextResponse.json(research)
  } catch (error) {
    console.error('更新研究失败:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    return NextResponse.json({ error: '更新研究失败' }, { status: 500 })
  }
}

// DELETE - 删除研究
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const authResult = await checkAdminAuth()
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params

    // 检查研究是否存在
    const existingResearch = await prisma.research.findUnique({
      where: { id },
    })

    if (!existingResearch) {
      return NextResponse.json({ error: '研究不存在' }, { status: 404 })
    }

    // 删除研究
    await prisma.research.delete({
      where: { id },
    })

    // 刷新相关页面缓存
    await CacheManager.revalidateResearch(existingResearch.slug)

    return NextResponse.json({ message: '研究删除成功' })
  } catch (error) {
    console.error('删除研究失败:', error)
    return NextResponse.json({ error: '删除研究失败' }, { status: 500 })
  }
}
