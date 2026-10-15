import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取首页Hero配置（公开API）
export async function GET(request: NextRequest) {
  try {
    // 获取Hero配置
    const heroConfig = await prisma.siteConfig.findFirst({
      where: {
        key: 'homepage_hero_config',
        category: 'homepage',
      },
    })

    // 默认配置
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

        // 向后兼容性处理：如果是旧格式，转换为新格式
        if (savedConfig.textColor && !savedConfig.titleStyle) {
          // 旧格式转换为新格式
          const legacyConfig = {
            ...savedConfig,
            titleStyle: {
              fontSize: 64,
              fontWeight: 700,
              fontFamily: 'font-dingtalk-jinbu',
              color: savedConfig.textColor || '#ffffff',
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
              color: savedConfig.textColor || '#ffffff',
              letterSpacing: 0,
              lineHeight: 1.5,
              textShadow: true,
              opacity: 90,
            },
          }
          // 移除旧的textColor字段
          delete legacyConfig.textColor
          config = { ...config, ...legacyConfig }
        } else {
          // 新格式直接合并
          config = { ...config, ...savedConfig }
        }
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
