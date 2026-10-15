'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  MapPin,
  Navigation,
  AlertCircle,
  RefreshCw,
  Settings,
  Building2,
  Store,
  Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useLocations } from '@/hooks/use-locations'

// 高德地图API密钥
const AMAP_KEY = 'ecc7df37a4199688fe9d3f5fcfdfb8c0'

// 公司信息和地址配置
const LOCATIONS = {
  headquarters: {
    name: '公司总部 - 上海临港景鸿安防科技有限公司',
    address: '上海市徐汇区宜山路508号景鸿大楼5楼',
    phone: '+86 13816579552',
    email: 'zhoujunting@lingangjinghong.com',
    coordinates: { lng: 121.4258, lat: 31.182 },
  },
  showroom: {
    name: '创晶展厅 - 上海临港景鸿安防科技有限公司',
    address: '上海市浦东新区海洋一路99号',
    phone: '+86 13816579552',
    email: 'zhoujunting@lingangjinghong.com',
    coordinates: { lng: 121.9118, lat: 30.8708 },
  },
}

interface CompanyMapProps {
  className?: string
  markerStyle?: 'default' | 'modern' | 'corporate' | 'minimal' | 'animated'
}

export function CompanyMap({ className = '', markerStyle = 'modern' }: CompanyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0)

  // 获取地址数据
  const { locations, loading: locationsLoading, error: locationsError } = useLocations()

  // 获取当前选中的地址
  const currentLocation = locations[currentLocationIndex] || null

  // 获取当前位置的信息
  const getCurrentLocationInfo = () => {
    if (!currentLocation) {
      // 如果没有地址数据，返回默认信息
      return {
        name: LOCATIONS.headquarters.name,
        address: LOCATIONS.headquarters.address,
        phone: LOCATIONS.headquarters.phone,
        email: LOCATIONS.headquarters.email,
        coordinates: LOCATIONS.headquarters.coordinates,
      }
    }

    return {
      name: currentLocation.name,
      address: currentLocation.address,
      phone: currentLocation.phone || '',
      email: currentLocation.email || '',
      coordinates: {
        lng: currentLocation.longitude || LOCATIONS.headquarters.coordinates.lng,
        lat: currentLocation.latitude || LOCATIONS.headquarters.coordinates.lat,
      },
    }
  }

  // 当地址数据加载完成后，设置默认地址
  useEffect(() => {
    if (!locationsLoading && locations.length > 0) {
      // 找到默认地址，如果没有默认地址则使用第一个
      const defaultLocationIndex = locations.findIndex(loc => loc.isDefault)
      setCurrentLocationIndex(defaultLocationIndex >= 0 ? defaultLocationIndex : 0)
    }
  }, [locationsLoading, locations])

  // 加载高德地图
  useEffect(() => {
    let mounted = true

    const loadMap = async () => {
      // 如果没有地址数据或正在加载，不渲染地图
      if (locationsLoading || !currentLocation) {
        return
      }

      try {
        setIsLoading(true)
        setMapError(null)

        // 检查是否已经加载了高德地图
        if (!(window as any).AMap) {
          // 动态加载高德地图脚本
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
            script.onload = resolve
            script.onerror = () => reject(new Error('高德地图脚本加载失败'))
            document.head.appendChild(script)
          })
        }

        if (!mounted || !mapRef.current) return

        // 获取当前位置信息
        const currentLocationInfo = getCurrentLocationInfo()
        const coordinates = currentLocationInfo.coordinates

        // 创建地图
        const map = new (window as any).AMap.Map(mapRef.current, {
          center: [coordinates.lng, coordinates.lat],
          zoom: 17,
          mapStyle: 'amap://styles/normal',
          viewMode: '2D',
          // 禁用缩放功能
          scrollWheel: false, // 禁用鼠标滚轮缩放
          doubleClickZoom: false, // 禁用双击缩放
          keyboardEnable: false, // 禁用键盘操作
          dragEnable: true, // 保留拖拽功能
          zoomEnable: false, // 禁用所有缩放操作
          rotateEnable: false, // 禁用旋转
          pitchEnable: false, // 禁用倾斜
          touchZoom: false, // 禁用触摸缩放
          touchZoomCenter: 1, // 触摸缩放中心点
        })

        // 创建不同样式的标记图标
        const createCustomMarkerIcon = (style: string) => {
          let svgIcon = ''

          switch (style) {
            case 'modern':
              svgIcon = `
                <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="modernGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#E53E3E;stop-opacity:1" />
                    </linearGradient>
                    <filter id="modernShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
                    </filter>
                  </defs>
                  <ellipse cx="20" cy="46" rx="8" ry="3" fill="rgba(0,0,0,0.2)"/>

                  <!-- 外层脉冲圆环 -->
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#FF6B35" stroke-width="2" opacity="0.3">
                    <animate attributeName="r" values="12;25;12" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite"/>
                  </circle>

                  <!-- 中层脉冲圆环 -->
                  <circle cx="20" cy="20" r="15" fill="none" stroke="#FF6B35" stroke-width="3" opacity="0.4">
                    <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite"/>
                  </circle>

                  <!-- 内层脉冲圆环 -->
                  <circle cx="20" cy="20" r="12" fill="none" stroke="#FF6B35" stroke-width="2" opacity="0.6">
                    <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite"/>
                  </circle>

                  <!-- 主标记点 -->
                  <path d="M20 5 C28 5 35 12 35 20 C35 28 20 40 20 40 C20 40 5 28 5 20 C5 12 12 5 20 5 Z"
                        fill="url(#modernGradient)" filter="url(#modernShadow)" stroke="#fff" stroke-width="2"/>
                  <circle cx="20" cy="20" r="8" fill="#fff" opacity="0.9"/>
                  <circle cx="20" cy="20" r="5" fill="#FF6B35">
                    <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              `
              break

            case 'corporate':
              svgIcon = `
                <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="corpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#1E40AF;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#1E3A8A;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="18" cy="44" rx="6" ry="2" fill="rgba(0,0,0,0.15)"/>
                  <rect x="6" y="8" width="24" height="28" rx="12" fill="url(#corpGradient)" stroke="#fff" stroke-width="2"/>
                  <circle cx="18" cy="18" r="6" fill="#fff"/>
                  <path d="M18 12 L22 16 L18 20 L14 16 Z" fill="#1E40AF"/>
                </svg>
              `
              break

            case 'minimal':
              svgIcon = `
                <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#10B981" stroke="#fff" stroke-width="3"/>
                  <circle cx="12" cy="12" r="4" fill="#fff"/>
                  <line x1="12" y1="22" x2="12" y2="28" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
                </svg>
              `
              break

            case 'animated':
              svgIcon = `
                <svg width="44" height="54" viewBox="0 0 44 54" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="animGradient" cx="50%" cy="30%" r="70%">
                      <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#D97706;stop-opacity:1" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="22" cy="50" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/>

                  <!-- 最外层脉冲圆环 -->
                  <circle cx="22" cy="22" r="30" fill="none" stroke="#F59E0B" stroke-width="1.5" opacity="0.2">
                    <animate attributeName="r" values="18;35;18" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite"/>
                  </circle>

                  <!-- 外层脉冲圆环 -->
                  <circle cx="22" cy="22" r="25" fill="none" stroke="#F59E0B" stroke-width="2" opacity="0.4">
                    <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
                  </circle>

                  <!-- 中层脉冲圆环 -->
                  <circle cx="22" cy="22" r="20" fill="none" stroke="#F59E0B" stroke-width="2.5" opacity="0.5">
                    <animate attributeName="r" values="15;25;15" dur="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="1.5s" repeatCount="indefinite"/>
                  </circle>

                  <!-- 主圆形标记 -->
                  <circle cx="22" cy="22" r="18" fill="url(#animGradient)" stroke="#fff" stroke-width="3">
                    <animate attributeName="r" values="16;20;16" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="22" cy="22" r="8" fill="#fff"/>
                  <circle cx="22" cy="22" r="4" fill="#F59E0B">
                    <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              `
              break

            default: // 'default' 样式
              return null // 使用高德地图默认标记
          }

          if (!svgIcon) return null

          // 将SVG转换为Data URL
          const svgBlob = new Blob([svgIcon], { type: 'image/svg+xml' })
          return URL.createObjectURL(svgBlob)
        }

        // 添加标记
        const customIcon = createCustomMarkerIcon(markerStyle)
        const markerOptions: any = {
          position: [coordinates.lng, coordinates.lat],
          title: currentLocationInfo.name,
        }

        // 如果有自定义图标，则使用自定义图标，否则使用默认图标
        if (customIcon) {
          const iconSize =
            markerStyle === 'minimal'
              ? [24, 32]
              : markerStyle === 'corporate'
                ? [36, 48]
                : markerStyle === 'animated'
                  ? [44, 54]
                  : [40, 50]

          markerOptions.icon = new (window as any).AMap.Icon({
            image: customIcon,
            size: new (window as any).AMap.Size(iconSize[0], iconSize[1]),
            imageSize: new (window as any).AMap.Size(iconSize[0], iconSize[1]),
            anchor: new (window as any).AMap.Pixel(iconSize[0] / 2, iconSize[1]),
          })
        }

        const marker = new (window as any).AMap.Marker(markerOptions)

        map.add(marker)

        // 添加信息窗体
        const infoWindow = new (window as any).AMap.InfoWindow({
          content: `
            <div style="padding: 10px; font-size: 14px; line-height: 1.5;">
              <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #333;">
                ${currentLocationInfo.name}
              </h4>
              <p style="margin: 0 0 6px 0; color: #666;">
                <strong>地址:</strong> ${currentLocationInfo.address}
              </p>
              ${
                currentLocationInfo.phone
                  ? `
                <p style="margin: 0 0 6px 0; color: #666;">
                  <strong>电话:</strong> ${currentLocationInfo.phone}
                </p>
              `
                  : ''
              }
              ${
                currentLocationInfo.email
                  ? `
                <p style="margin: 0 0 6px 0; color: #666;">
                  <strong>邮箱:</strong> ${currentLocationInfo.email}
                </p>
              `
                  : ''
              }
              ${
                currentLocation.contactPerson
                  ? `
                <p style="margin: 0; color: #666;">
                  <strong>联系人:</strong> ${currentLocation.contactPerson}
                </p>
              `
                  : ''
              }
            </div>
          `,
          offset: new (window as any).AMap.Pixel(0, -30),
        })

        // 点击标记显示信息窗体
        marker.on('click', () => {
          infoWindow.open(map, [coordinates.lng, coordinates.lat])
        })

        if (mounted) {
          setMapLoaded(true)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('地图加载失败:', error)
        if (mounted) {
          setMapError('地图加载失败，请检查网络连接')
          setIsLoading(false)
        }
      }
    }

    loadMap()

    return () => {
      mounted = false
    }
  }, [locationsLoading, currentLocation, currentLocationIndex])

  // 重试加载
  const retryLoad = () => {
    setMapError(null)
    setMapLoaded(false)
    setIsLoading(true)

    // 重新触发useEffect
    const event = new Event('retry-map-load')
    window.dispatchEvent(event)

    // 延迟重新加载
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  // 切换坐标位置
  const switchCoordinate = () => {
    if (locations.length === 0) return

    const nextIndex = (currentLocationIndex + 1) % locations.length
    setCurrentLocationIndex(nextIndex)
  }

  // 打开导航
  const openNavigation = () => {
    if (!currentLocation) return

    const currentLocationInfo = getCurrentLocationInfo()
    const coordinates = currentLocationInfo.coordinates
    const url = `https://uri.amap.com/navigation?to=${coordinates.lng},${coordinates.lat},${encodeURIComponent(currentLocationInfo.name)}&mode=car&policy=1&src=webapp&coordinate=gaode&callnative=0`
    window.open(url, '_blank')
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-gray-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90 ${className}`}
    >
      {/* 地图容器 */}
      <div className='relative h-80 w-full'>
        <div ref={mapRef} className='h-full w-full' style={{ minHeight: '320px' }} />

        {/* 公司信息卡片 - 只在地图加载成功后显示 */}
        {mapLoaded &&
          (() => {
            const currentLocationInfo = getCurrentLocationInfo()

            // 根据地址类型选择合适的图标
            const getLocationIcon = () => {
              const name = currentLocationInfo.name.toLowerCase()
              if (name.includes('总部') || name.includes('headquarters') || name.includes('公司')) {
                return Building2
              } else if (
                name.includes('展厅') ||
                name.includes('showroom') ||
                name.includes('展示')
              ) {
                return Store
              } else if (name.includes('办公') || name.includes('office')) {
                return Home
              } else {
                return MapPin // 默认图标
              }
            }

            const LocationIcon = getLocationIcon()

            return (
              <div className='absolute right-4 top-4 max-w-xs rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:bg-slate-800/95'>
                <div className='flex items-start space-x-3'>
                  <div className='mt-0.5 flex-shrink-0'>
                    <div className='flex h-6 w-6 items-center justify-center'>
                      <LocationIcon className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    </div>
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold leading-tight text-gray-900 dark:text-white'>
                      {currentLocationInfo.name}
                    </h4>
                    <p className='mt-1 text-xs text-gray-600 dark:text-gray-300'>
                      {currentLocationInfo.address}
                    </p>
                    <div className='mt-2 flex space-x-1'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={openNavigation}
                        className='h-auto px-2 py-1 text-xs'
                      >
                        <Navigation className='mr-1 h-3 w-3' />
                        导航
                      </Button>
                      {locations.length > 1 && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={switchCoordinate}
                          className='h-auto px-2 py-1 text-xs'
                          title={`切换位置 (${currentLocationIndex + 1}/${locations.length})`}
                        >
                          <Settings className='mr-1 h-3 w-3' />
                          切换 ({currentLocationIndex + 1}/{locations.length})
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

        {/* 加载状态 */}
        {(isLoading || locationsLoading) && !mapError && !locationsError && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700'>
            <div className='text-center'>
              <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                {locationsLoading ? '正在加载地址信息...' : '正在加载地图...'}
              </p>
            </div>
          </div>
        )}

        {/* 地址数据错误状态 */}
        {locationsError && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700'>
            <div className='p-6 text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
                <AlertCircle className='h-6 w-6 text-red-600 dark:text-red-400' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                地址信息加载失败
              </h3>
              <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>{locationsError}</p>
            </div>
          </div>
        )}

        {/* 错误状态 */}
        {mapError && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700'>
            <div className='p-6 text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
                <AlertCircle className='h-6 w-6 text-red-600 dark:text-red-400' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                地图加载失败
              </h3>
              <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>{mapError}</p>
              <div className='space-y-2'>
                <Button variant='outline' size='sm' onClick={retryLoad} className='text-xs'>
                  <RefreshCw className='mr-1 h-3 w-3' />
                  重试
                </Button>
                <div className='text-xs text-gray-500 dark:text-gray-400'>或使用导航功能</div>
                <Button variant='outline' size='sm' onClick={openNavigation} className='text-xs'>
                  <Navigation className='mr-1 h-3 w-3' />
                  打开导航
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
