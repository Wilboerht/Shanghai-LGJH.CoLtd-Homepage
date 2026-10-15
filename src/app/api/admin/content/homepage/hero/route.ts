import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Hero配置验证schema
const heroConfigSchema = z.object({
  config: z.object({
    videoUrl: z.string().min(1, '视频URL不能为空'),
    videoFallbackUrl: z.string().optional(),
    title: z.string().min(1, '标题不能为空'),
    subtitle: z.string().min(1, '副标题不能为空'),
    titleStyle: z.object({
      fontSize: z.number().min(12).max(200),
      fontWeight: z.number().min(100).max(900),
      fontFamily: z.string(),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '请输入有效的颜色值'),
      letterSpacing: z.number().min(-10).max(20),
      lineHeight: z.number().min(0.5).max(3),
      textShadow: z.boolean(),
      gradient: z.object({
        enabled: z.boolean(),
        colors: z
          .array(z.string().regex(/^#[0-9A-Fa-f]{6}$/))
          .min(2)
          .max(5),
        direction: z.string(),
      }),
    }),
    subtitleStyle: z.object({
      fontSize: z.number().min(8).max(100),
      fontWeight: z.number().min(100).max(900),
      fontFamily: z.string(),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '请输入有效的颜色值'),
      letterSpacing: z.number().min(-10).max(20),
      lineHeight: z.number().min(0.5).max(3),
      textShadow: z.boolean(),
      opacity: z.number().min(0).max(100),
    }),
    overlayOpacity: z.number().min(0).max(100),
    autoplay: z.boolean(),
    muted: z.boolean(),
    loop: z.boolean(),
  }),
})

// GET - 获取Hero配置
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    // 获取Hero配置
    const heroConfig = await prisma.siteConfig.findFirst({
      where: {
        key: 'homepage_hero_config',
        category: 'homepage',
      },
    })

    let config = {
      videoUrl: '/videos/Home.mp4',
      videoFallbackUrl: '',
      title: '专业安防解决方案 值得信赖的选择',
      subtitle:
        '临港景鸿是智能安防系统、视频监控、门禁控制和全面安防解决方案的领先提供商，为住宅、商业和工业客户提供专业服务。',
      titleStyle: {
        fontSize: 64,
        fontWeight: 700,
        fontFamily: 'font-dingtalk-jinbu',
        color: '#ffffff',
        letterSpacing: 0,
        lineHeight: 1.2,
        textShadow: true,
        gradient: {
          enabled: false,
          colors: ['#ffffff', '#e0e7ff'],
          direction: 'to right',
        },
      },
      subtitleStyle: {
        fontSize: 24,
        fontWeight: 400,
        fontFamily: 'font-sans',
        color: '#ffffff',
        letterSpacing: 0,
        lineHeight: 1.5,
        textShadow: true,
        opacity: 90,
      },
      overlayOpacity: 30,
      autoplay: true,
      muted: true,
      loop: true,
    }

    if (heroConfig?.value) {
      try {
        const savedConfig = JSON.parse(heroConfig.value)
        config = { ...config, ...savedConfig }
      } catch (error) {
        console.error('解析Hero配置失败:', error)
      }
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error('获取Hero配置失败:', error)
    return NextResponse.json({ error: '获取配置失败' }, { status: 500 })
  }
}

// PUT - 更新Hero配置
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = heroConfigSchema.parse(body)

    // 保存Hero配置
    await prisma.siteConfig.upsert({
      where: {
        key: 'homepage_hero_config',
      },
      update: {
        value: JSON.stringify(validatedData.config),
        category: 'homepage',
        description: '首页Hero区域配置',
      },
      create: {
        key: 'homepage_hero_config',
        value: JSON.stringify(validatedData.config),
        category: 'homepage',
        description: '首页Hero区域配置',
      },
    })

    return NextResponse.json({
      message: 'Hero配置更新成功',
      config: validatedData.config,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '数据验证失败', details: error.issues }, { status: 400 })
    }

    console.error('更新Hero配置失败:', error)
    return NextResponse.json({ error: '更新配置失败' }, { status: 500 })
  }
}
