import { prisma } from '@/lib/prisma'

export interface SiteSettings {
  // 基本信息
  site_name?: string
  site_description?: string
  site_keywords?: string

  // 联系信息
  company_name?: string
  company_address?: string
  company_phone?: string
  company_email?: string

  // 社交媒体
  wechat_qr?: string
  weibo_url?: string
  linkedin_url?: string

  // SEO设置
  meta_title?: string
  meta_description?: string
  google_analytics?: string

  // 系统设置
  maintenance_mode?: string
  max_upload_size?: string
  cache_duration?: string
}

// 服务端获取网站设置
export async function getSiteSettings(category?: string, keys?: string[]): Promise<SiteSettings> {
  try {
    // 构建查询条件
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (keys && keys.length > 0) {
      where.key = { in: keys }
    }

    const settings = await prisma.siteConfig.findMany({
      where,
      select: {
        key: true,
        value: true,
      },
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    })

    // 转换为键值对格式
    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value || ''
        return acc
      },
      {} as Record<string, string>
    )

    return settingsMap as SiteSettings
  } catch (error) {
    console.error('获取网站设置失败:', error)
    return {}
  }
}

// 获取联系信息设置
export async function getContactSettings(): Promise<SiteSettings> {
  return getSiteSettings('contact')
}

// 获取基本信息设置
export async function getGeneralSettings(): Promise<SiteSettings> {
  return getSiteSettings('general')
}

// 获取SEO设置
export async function getSEOSettings(): Promise<SiteSettings> {
  return getSiteSettings('seo')
}

// 获取社交媒体设置
export async function getSocialSettings(): Promise<SiteSettings> {
  return getSiteSettings('social')
}

// 获取特定设置项
export async function getSpecificSettings(keys: string[]): Promise<SiteSettings> {
  return getSiteSettings(undefined, keys)
}

// 获取所有设置
export async function getAllSettings(): Promise<SiteSettings> {
  return getSiteSettings()
}
