import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '临港景鸿 - 专业安防解决方案',
    short_name: '临港景鸿',
    description: '专业安防解决方案提供商，提供智能监控系统和全面的安防服务。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/logo.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '24x24',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
