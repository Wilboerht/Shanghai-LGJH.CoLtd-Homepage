import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { UnifiedServicePage } from '@/components/services/unified-service-page'
// import { ModernServiceData } from '@/components/services/modern-service-template'
// 临时定义类型，因为模板文件不存在
interface ModernServiceData {
  id?: string
  title: string
  subtitle?: string
  description?: string
  category?: string
  level?: string
  duration?: string
  backgroundImage?: string
  hero?: any
  learning?: any
  courseInfo?: any
  about?: any
  cta?: any
  process?: any
  visualElements?: any
  ctaConfig?: any
  metrics?: any
}

interface PageProps {
  params: { slug: string }
}

// 从数据库获取服务数据
async function getServiceFromDB(slug: string): Promise<ModernServiceData | null> {
  try {
    // 在服务器端直接调用数据库，避免fetch localhost的问题
    const { prisma } = await import('@/lib/prisma')

    const dbService = await prisma.service.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        category: true,
        serviceType: true,
        level: true,
        duration: true,
        backgroundImage: true,
        highlight: true,
        features: true,
        hero: true,
        learning: true,
        courseInfo: true,
        about: true,
        cta: true,
        process: true,
        visualElements: true,
        ctaConfig: true,
        metrics: true,
        seo: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!dbService) {
      return null
    }

    // 转换数据库数据为组件需要的格式
    const modernData: ModernServiceData = {
      id: dbService.id,
      title: dbService.title,
      subtitle: dbService.subtitle || '',
      description: dbService.description || '',
      category: dbService.category,
      level: (dbService.level as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
      duration: dbService.duration || '',
      backgroundImage: dbService.backgroundImage || undefined,

      hero: {
        title: (dbService.hero as any)?.title || dbService.title,
        subtitle: (dbService.hero as any)?.subtitle || dbService.subtitle || '',
        description: (dbService.hero as any)?.description || dbService.description || '',
        instructor: (dbService.hero as any)?.instructor || {
          name: '专业团队',
          title: '服务专家',
          company: '临港景鸿',
        },
      },

      learning: {
        title: (dbService.learning as any)?.title || '服务内容',
        objectives: (dbService.learning as any)?.objectives || [],
      },

      courseInfo: {
        level: (dbService.courseInfo as any)?.level || dbService.level || 'intermediate',
        duration: (dbService.courseInfo as any)?.duration || dbService.duration || '',
        lessons: (dbService.courseInfo as any)?.lessons || 1,
        instructor: (dbService.courseInfo as any)?.instructor || '专业团队',
        company: (dbService.courseInfo as any)?.company || '临港景鸿',
      },

      about: {
        title: (dbService.about as any)?.title || '关于此服务',
        subtitle: (dbService.about as any)?.subtitle || undefined,
        description: (dbService.about as any)?.description || dbService.description || '',
        content: (dbService.about as any)?.content || undefined,
        details: (dbService.about as any)?.details || [],
        sections: (dbService.about as any)?.sections || undefined,
      },

      cta: {
        buttonText: (dbService.cta as any)?.buttonText || '立即咨询',
        isEnrollment: (dbService.cta as any)?.isEnrollment || false,
      },

      process: dbService.process || [],
      visualElements: dbService.visualElements || undefined,
      ctaConfig: dbService.ctaConfig || undefined,
      metrics: dbService.metrics || [],
    }

    return modernData
  } catch (error) {
    console.error('获取服务数据失败:', error)
    return null
  }
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params

  // 优先从数据库获取SEO数据
  const dbService = await getServiceFromDB(resolvedParams.slug)
  if (dbService && dbService.about) {
    const seoData = (dbService as any).seo || {}
    return {
      title: seoData.metaTitle || `${dbService.title} - 临港景鸿`,
      description:
        seoData.metaDescription || dbService.description || `了解我们的${dbService.title}服务`,
      keywords: seoData.keywords || [dbService.title, dbService.category, '临港景鸿'],
      openGraph: {
        title: dbService.title,
        description: dbService.description,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/services/${resolvedParams.slug}`,
        images: dbService.backgroundImage ? [dbService.backgroundImage] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: dbService.title,
        description: dbService.description,
      },
    }
  }

  return {
    title: '服务不存在 - 临港景鸿',
    description: '找不到指定的服务页面',
  }
}

// 预生成静态路径
export async function generateStaticParams() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    })

    return services.map(service => ({
      slug: service.slug,
    }))
  } catch (error) {
    console.error('生成静态路径失败:', error)
    return []
  }
}

export default async function ServicePage({ params }: PageProps) {
  const resolvedParams = await params

  // 从数据库获取服务数据
  const dbService = await getServiceFromDB(resolvedParams.slug)

  if (!dbService) {
    notFound()
  }

  return <UnifiedServicePage data={dbService} />
}
