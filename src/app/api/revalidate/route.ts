import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 支持的重新验证类型
type RevalidateType = 'path' | 'tag'

interface RevalidateRequest {
  type: RevalidateType
  target: string
  secret?: string
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const body: RevalidateRequest = await request.json()
    const { type, target } = body

    if (!type || !target) {
      return NextResponse.json(
        {
          error: '缺少必要参数：type 和 target',
        },
        { status: 400 }
      )
    }

    console.log(`🔄 开始重新验证: ${type} - ${target}`)

    try {
      if (type === 'path') {
        // 重新验证特定路径
        revalidatePath(target)
        console.log(`✅ 路径重新验证成功: ${target}`)
      } else if (type === 'tag') {
        // 重新验证特定标签
        revalidateTag(target)
        console.log(`✅ 标签重新验证成功: ${target}`)
      } else {
        return NextResponse.json(
          {
            error: `不支持的重新验证类型: ${type}`,
          },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `${type === 'path' ? '路径' : '标签'} "${target}" 重新验证成功`,
        timestamp: new Date().toISOString(),
      })
    } catch (revalidateError) {
      console.error('重新验证失败:', revalidateError)
      return NextResponse.json(
        {
          error: '重新验证失败',
          details: revalidateError instanceof Error ? revalidateError.message : '未知错误',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('重新验证API错误:', error)
    return NextResponse.json(
      {
        error: '服务器内部错误',
      },
      { status: 500 }
    )
  }
}

// GET - 获取可重新验证的路径列表
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 常用的重新验证路径
    const commonPaths = [
      // 首页
      '/',

      // 产品相关
      '/products',
      '/products/[slug]',

      // 服务相关
      '/services',
      '/services/[slug]',

      // 研究相关
      '/research',
      '/research/[slug]',

      // 其他页面
      '/about',
      '/contact',
      '/mission',
    ]

    // 常用的缓存标签
    const commonTags = ['products', 'services', 'research', 'partners', 'client-cases', 'mission']

    return NextResponse.json({
      paths: commonPaths,
      tags: commonTags,
      usage: {
        path: {
          description: '重新验证特定路径的缓存',
          example: { type: 'path', target: '/products' },
        },
        tag: {
          description: '重新验证带有特定标签的所有缓存',
          example: { type: 'tag', target: 'products' },
        },
      },
    })
  } catch (error) {
    console.error('获取重新验证信息失败:', error)
    return NextResponse.json(
      {
        error: '服务器内部错误',
      },
      { status: 500 }
    )
  }
}
