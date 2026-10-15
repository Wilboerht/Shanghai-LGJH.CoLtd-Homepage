import { notFound } from 'next/navigation'
import ProductDetailClient from './product-detail-client'
import { Monitor, Database, Activity, Heart, Zap, Wifi } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProductData(slug: string) {
  try {
    // 直接从数据库获取数据，避免HTTP请求
    const { prisma } = await import('@/lib/prisma')
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        status: {
          in: ['AVAILABLE', 'COMING_SOON'],
        },
      },
      select: {
        id: true,
        category: true,
        title: true,
        subtitle: true,
        description: true,
        features: true,
        specifications: true,
        applications: true,
        benefits: true,
        image: true,
        images: true, // 添加多张图片字段
        status: true,
        slug: true,
        tags: true,
        gradient: true,
        accentColor: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!product) {
      return null
    }

    // 获取相关产品（同分类的其他产品）
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        slug: { not: slug },
        status: {
          in: ['AVAILABLE', 'COMING_SOON'],
        },
      },
      take: 4,
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        image: true,
        slug: true,
        category: true,
        gradient: true,
        accentColor: true,
      },
    })

    return { product, relatedProducts }
  } catch (error) {
    console.error('获取产品数据失败:', error)
    return null
  }
}

// 启用 ISR - 每60秒重新验证一次
export const revalidate = 60

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const data = await getProductData(slug)

  if (!data || !data.product) {
    notFound()
  }

  const { product, relatedProducts } = data

  // 创建不包含函数的产品数据
  const productData = {
    id: product.id,
    title: product.title,
    subtitle: product.subtitle || '',
    description: product.description || '',
    image: product.image || '',
    images: Array.isArray(product.images)
      ? product.images.filter(
          (img): img is { id: string; url: string; alt?: string } =>
            typeof img === 'object' && img !== null && 'id' in img && 'url' in img
        )
      : [],
    category: product.category,
    features: Array.isArray(product.features)
      ? product.features.filter((f): f is string => typeof f === 'string')
      : [],
    specifications: Array.isArray(product.specifications)
      ? product.specifications.filter(
          (s): s is { name: string; value: string } =>
            typeof s === 'object' && s !== null && 'name' in s && 'value' in s
        )
      : [],
    applications: Array.isArray(product.applications)
      ? product.applications.filter((a): a is string => typeof a === 'string')
      : [],
    benefits: Array.isArray(product.benefits)
      ? product.benefits.filter((b): b is string => typeof b === 'string')
      : [],
    // priceInfo: product.priceInfo, // 字段已从数据库模型中移除
    gradient: product.gradient || '',
    accentColor: product.accentColor || '',
    slug: product.slug,
    status: (product.status === 'AVAILABLE'
      ? 'available'
      : product.status === 'COMING_SOON'
        ? 'coming-soon'
        : 'discontinued') as 'available' | 'coming-soon' | 'discontinued',
    tags: Array.isArray(product.tags)
      ? product.tags.filter((t): t is string => typeof t === 'string')
      : [],
  }

  // 格式化推荐产品数据
  const recommendedProducts = (relatedProducts || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    image: p.image,
    slug: p.slug,
    status: p.status,
  }))

  // 获取图标名称
  const getIconName = (icon: any) => {
    if (icon === Monitor) return 'Monitor'
    if (icon === Database) return 'Database'
    if (icon === Activity) return 'Activity'
    if (icon === Heart) return 'Heart'
    if (icon === Zap) return 'Zap'
    if (icon === Wifi) return 'Wifi'
    return 'Monitor' // 默认图标
  }

  // const iconName = getIconName(product.icon) // icon 字段已从数据库模型中移除
  const iconName = 'Monitor' // 默认图标

  return (
    <ProductDetailClient
      product={productData}
      recommendedProducts={recommendedProducts}
      iconName={iconName}
    />
  )
}

// 生成静态路径
export async function generateStaticParams() {
  try {
    // 在构建时直接从数据库获取数据，避免HTTP请求
    const { prisma } = await import('@/lib/prisma')
    const products = await prisma.product.findMany({
      where: {
        status: {
          in: ['AVAILABLE', 'COMING_SOON'],
        },
      },
      select: {
        slug: true,
      },
    })

    return products.map(product => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('生成静态路径失败:', error)
    return []
  }
}

// 生成元数据
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params

  try {
    // 直接从数据库获取数据
    const { prisma } = await import('@/lib/prisma')
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        status: {
          in: ['AVAILABLE', 'COMING_SOON'],
        },
      },
      select: {
        title: true,
        description: true,
      },
    })

    if (!product) {
      return {
        title: '产品未找到 - 临港景鸿',
      }
    }

    return {
      title: `${product.title} - 临港景鸿`,
      description: product.description,
    }
  } catch (error) {
    return {
      title: '产品 - 临港景鸿',
    }
  }
}
