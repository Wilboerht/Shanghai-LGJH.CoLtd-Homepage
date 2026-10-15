import { revalidatePath } from 'next/cache'

/**
 * 缓存刷新工具类
 * 用于在CMS内容更新后自动刷新相关页面缓存
 */
export class CacheManager {
  /**
   * 刷新产品相关页面缓存
   */
  static async revalidateProduct(slug: string, oldSlug?: string) {
    try {
      // 刷新产品列表页
      revalidatePath('/products')

      // 刷新产品详情页
      revalidatePath(`/products/${slug}`)

      // 如果slug发生变化，也刷新旧的slug页面
      if (oldSlug && oldSlug !== slug) {
        revalidatePath(`/products/${oldSlug}`)
      }

      console.log(`✅ 产品缓存刷新成功: ${slug}`)
      return true
    } catch (error) {
      console.warn('产品缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新服务相关页面缓存
   */
  static async revalidateService(slug: string, oldSlug?: string) {
    try {
      // 刷新服务列表页
      revalidatePath('/services')

      // 刷新服务详情页
      revalidatePath(`/services/${slug}`)

      // 如果slug发生变化，也刷新旧的slug页面
      if (oldSlug && oldSlug !== slug) {
        revalidatePath(`/services/${oldSlug}`)
      }

      console.log(`✅ 服务缓存刷新成功: ${slug}`)
      return true
    } catch (error) {
      console.warn('服务缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新研究相关页面缓存
   */
  static async revalidateResearch(slug: string, oldSlug?: string) {
    try {
      // 刷新研究列表页
      revalidatePath('/research')

      // 刷新研究详情页
      revalidatePath(`/research/${slug}`)

      // 如果slug发生变化，也刷新旧的slug页面
      if (oldSlug && oldSlug !== slug) {
        revalidatePath(`/research/${oldSlug}`)
      }

      console.log(`✅ 研究缓存刷新成功: ${slug}`)
      return true
    } catch (error) {
      console.warn('研究缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新合作伙伴相关页面缓存
   */
  static async revalidatePartner() {
    try {
      // 刷新包含合作伙伴信息的页面
      revalidatePath('/')
      revalidatePath('/about')

      console.log(`✅ 合作伙伴缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('合作伙伴缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新客户案例相关页面缓存
   */
  static async revalidateClientCase() {
    try {
      // 刷新包含客户案例的页面
      revalidatePath('/')
      revalidatePath('/services')

      console.log(`✅ 客户案例缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('客户案例缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新招聘职位相关页面缓存
   */
  static async revalidateCareer() {
    try {
      // 刷新包含招聘信息的页面
      revalidatePath('/careers')
      revalidatePath('/mission/join-us')
      revalidatePath('/admin/careers')
      revalidatePath('/admin/careers/positions')
      revalidatePath('/admin/forms/careers')

      console.log(`✅ 招聘职位缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('招聘职位缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新荣誉奖项相关页面缓存
   */
  static async revalidateAward() {
    try {
      // 刷新包含荣誉奖项的页面
      revalidatePath('/')
      revalidatePath('/about')
      revalidatePath('/mission')

      console.log(`✅ 荣誉奖项缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('荣誉奖项缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新企业资质相关页面缓存
   */
  static async revalidateQualification() {
    try {
      // 刷新包含企业资质的页面
      revalidatePath('/')
      revalidatePath('/about')
      revalidatePath('/mission')

      console.log(`✅ 企业资质缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('企业资质缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新解决方案相关页面缓存
   */
  static async revalidateSolution() {
    try {
      // 刷新包含解决方案的页面
      revalidatePath('/')
      revalidatePath('/solutions')
      revalidatePath('/services')

      console.log(`✅ 解决方案缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('解决方案缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新使命相关页面缓存
   */
  static async revalidateMission() {
    try {
      // 刷新使命相关页面
      revalidatePath('/mission')
      revalidatePath('/')

      console.log(`✅ 使命缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('使命缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 刷新首页缓存
   */
  static async revalidateHomepage() {
    try {
      revalidatePath('/')
      console.log(`✅ 首页缓存刷新成功`)
      return true
    } catch (error) {
      console.warn('首页缓存刷新失败:', error)
      return false
    }
  }

  /**
   * 批量刷新多个路径
   */
  static async revalidateMultiple(paths: string[]) {
    const results: { path: string; success: boolean }[] = []

    for (const path of paths) {
      try {
        revalidatePath(path)
        results.push({ path, success: true })
        console.log(`✅ 缓存刷新成功: ${path}`)
      } catch (error) {
        results.push({ path, success: false })
        console.warn(`缓存刷新失败: ${path}`, error)
      }
    }

    return results
  }

  /**
   * 根据内容类型自动选择刷新策略
   */
  static async revalidateByContentType(
    contentType: 'product' | 'service' | 'research' | 'partner' | 'client-case' | 'mission',
    slug?: string,
    oldSlug?: string
  ) {
    switch (contentType) {
      case 'product':
        return slug ? this.revalidateProduct(slug, oldSlug) : false
      case 'service':
        return slug ? this.revalidateService(slug, oldSlug) : false
      case 'research':
        return slug ? this.revalidateResearch(slug, oldSlug) : false
      case 'partner':
        return this.revalidatePartner()
      case 'client-case':
        return this.revalidateClientCase()
      case 'mission':
        return this.revalidateMission()
      default:
        console.warn(`未知的内容类型: ${contentType}`)
        return false
    }
  }
}
