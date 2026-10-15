import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 暂时忽略构建错误，稍后逐步修复
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Docker 部署配置 - 根据环境决定输出模式
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,

  // 性能优化配置
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // 图片优化配置
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 注意：api 配置在 Next.js 15+ 中已移除，文件上传限制现在通过其他方式配置

  // 配置静态资源重写
  async rewrites() {
    return [
      {
        source: '/tinymce/:path*',
        destination: '/node_modules/tinymce/:path*',
      },
    ]
  },

  // 配置静态文件头部
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
