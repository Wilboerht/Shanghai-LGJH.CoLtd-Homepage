/**
 * Logo配置文件
 * 静态Logo配置 - 直接修改此文件来更改网站Logo
 *
 * 使用说明：
 * 1. 将Logo图片文件上传到 /public/uploads/ 目录
 * 2. 修改下面的配置项指向新的图片路径
 * 3. 调整尺寸参数以获得最佳显示效果
 * 4. 保存文件后刷新页面即可看到效果
 */

export interface LogoConfig {
  primaryLogoUrl: string
  secondaryLogoUrl: string
  primaryLogoAlt: string
  secondaryLogoAlt: string
  primaryLogoWidth: number
  primaryLogoHeight: number
  secondaryLogoWidth: number
  secondaryLogoHeight: number
}

// 默认Logo配置
export const defaultLogoConfig: LogoConfig = {
  primaryLogoUrl: '/logo.png',
  secondaryLogoUrl: '/logo2.png',
  primaryLogoAlt: '临港景鸿主Logo',
  secondaryLogoAlt: '临港景鸿副Logo',
  primaryLogoWidth: 40,
  primaryLogoHeight: 40,
  secondaryLogoWidth: 60,
  secondaryLogoHeight: 60,
}

// 获取当前Logo配置
export function getLogoConfig(): LogoConfig {
  return defaultLogoConfig
}
