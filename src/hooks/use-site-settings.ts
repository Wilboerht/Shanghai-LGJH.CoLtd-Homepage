'use client'

import { useState, useEffect, useCallback } from 'react'

interface SiteSettings {
  // 基本信息
  site_name?: string
  site_description?: string
  site_keywords?: string

  // 联系信息
  company_name?: string
  company_address?: string
  company_phone?: string
  company_email?: string

  // 地图位置信息
  headquarters_name?: string
  headquarters_address?: string
  headquarters_phone?: string
  headquarters_email?: string
  headquarters_lng?: string
  headquarters_lat?: string

  showroom_name?: string
  showroom_address?: string
  showroom_phone?: string
  showroom_email?: string
  showroom_lng?: string
  showroom_lat?: string

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

interface UseSiteSettingsReturn {
  settings: SiteSettings
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// 默认设置
function getDefaultSettings(): SiteSettings {
  return {
    site_name: '临港金鸿',
    site_description: '专业的数字化解决方案提供商',
    company_name: '临港金鸿科技有限公司',
    company_address: '上海市浦东新区临港新片区',
    company_phone: '+86 21 1234 5678',
    company_email: 'contact@lgjh.com',
    headquarters_name: '总部',
    headquarters_address: '上海市浦东新区临港新片区海基六路218号',
    headquarters_phone: '+86 21 1234 5678',
    headquarters_email: 'hq@lgjh.com',
    headquarters_lng: '121.9',
    headquarters_lat: '30.9',
    showroom_name: '展示中心',
    showroom_address: '上海市浦东新区临港新片区申港大道1500号',
    showroom_phone: '+86 21 1234 5679',
    showroom_email: 'showroom@lgjh.com',
    showroom_lng: '121.85',
    showroom_lat: '30.85',
    meta_title: '临港金鸿 - 数字化解决方案专家',
    meta_description:
      '临港金鸿专注于为企业提供数字化转型、智能运维、智能化工程等专业服务，助力企业实现数字化升级。',
  }
}

export function useSiteSettings(category?: string, keys?: string[]): UseSiteSettingsReturn {
  const [settings, setSettings] = useState<SiteSettings>(getDefaultSettings())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (keys && keys.length > 0) params.append('keys', keys.join(','))

      const response = await fetch(`/api/settings?${params.toString()}`)

      if (!response.ok) {
        // 如果是 404 或其他错误，使用默认设置
        console.warn('API 路由不可用，使用默认设置')
        setSettings(getDefaultSettings())
        return
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // 如果返回的不是 JSON，使用默认设置
        console.warn('API 返回非 JSON 数据，使用默认设置')
        setSettings(getDefaultSettings())
        return
      }

      const data = await response.json()
      setSettings(data.settings || {})
    } catch (err) {
      // 发生错误时使用默认设置，而不是显示错误
      console.warn('获取网站设置失败，使用默认设置:', err)
      setSettings(getDefaultSettings())
      setError(null) // 不显示错误，静默回退到默认设置
    } finally {
      setLoading(false)
    }
  }, [category, keys])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  }
}

// 预定义的设置获取函数
export function useContactSettings() {
  return useSiteSettings('contact')
}

export function useGeneralSettings() {
  return useSiteSettings('general')
}

export function useSEOSettings() {
  return useSiteSettings('seo')
}

export function useSocialSettings() {
  return useSiteSettings('social')
}

// 获取特定设置项
export function useSpecificSettings(keys: string[]) {
  return useSiteSettings(undefined, keys)
}
