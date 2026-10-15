'use client'

import React, { useEffect, useState } from 'react'
import { useSEOSettings, useGeneralSettings } from '@/hooks/use-site-settings'

interface DynamicMetadataProps {
  title?: string
  description?: string
  keywords?: string
}

export function DynamicMetadata({ title, description, keywords }: DynamicMetadataProps) {
  const { settings: seoSettings } = useSEOSettings()
  const { settings: generalSettings } = useGeneralSettings()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // 动态更新页面标题
    const pageTitle = title || seoSettings.meta_title || generalSettings.site_name || '临港景鸿'
    document.title = pageTitle

    // 动态更新meta描述
    const metaDescription =
      description || seoSettings.meta_description || generalSettings.site_description
    if (metaDescription) {
      let descriptionMeta = document.querySelector('meta[name="description"]')
      if (!descriptionMeta) {
        descriptionMeta = document.createElement('meta')
        descriptionMeta.setAttribute('name', 'description')
        document.head.appendChild(descriptionMeta)
      }
      descriptionMeta.setAttribute('content', metaDescription)
    }

    // 动态更新meta关键词
    const metaKeywords = keywords || generalSettings.site_keywords
    if (metaKeywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]')
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta')
        keywordsMeta.setAttribute('name', 'keywords')
        document.head.appendChild(keywordsMeta)
      }
      keywordsMeta.setAttribute('content', metaKeywords)
    }

    // 动态更新Open Graph标签
    const ogTitle = title || seoSettings.meta_title || generalSettings.site_name
    if (ogTitle) {
      let ogTitleMeta = document.querySelector('meta[property="og:title"]')
      if (!ogTitleMeta) {
        ogTitleMeta = document.createElement('meta')
        ogTitleMeta.setAttribute('property', 'og:title')
        document.head.appendChild(ogTitleMeta)
      }
      ogTitleMeta.setAttribute('content', ogTitle)
    }

    const ogDescription =
      description || seoSettings.meta_description || generalSettings.site_description
    if (ogDescription) {
      let ogDescMeta = document.querySelector('meta[property="og:description"]')
      if (!ogDescMeta) {
        ogDescMeta = document.createElement('meta')
        ogDescMeta.setAttribute('property', 'og:description')
        document.head.appendChild(ogDescMeta)
      }
      ogDescMeta.setAttribute('content', ogDescription)
    }
  }, [mounted, title, description, keywords, seoSettings, generalSettings])

  return null
}

// Google Analytics组件
export function GoogleAnalytics() {
  const { settings: seoSettings } = useSEOSettings()

  useEffect(() => {
    if (seoSettings.google_analytics && typeof window !== 'undefined') {
      // 动态加载Google Analytics
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${seoSettings.google_analytics}`
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${seoSettings.google_analytics}');
      `
      document.head.appendChild(script2)
    }
  }, [seoSettings.google_analytics])

  return null
}
