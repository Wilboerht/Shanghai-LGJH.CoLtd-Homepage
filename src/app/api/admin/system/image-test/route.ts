import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * 图片访问诊断API
 * 用于检查图片上传和访问是否正常工作
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const diagnostics = {
      timestamp: new Date().toISOString(),
      directories: {},
      sampleImages: [],
      accessTests: [],
      recommendations: [],
    }

    // 1. 检查上传目录
    const uploadDirs = [
      { path: 'public/uploads', name: '主上传目录' },
      { path: 'public/uploads/admin', name: '管理员上传目录' },
    ]

    for (const dir of uploadDirs) {
      const fullPath = join(process.cwd(), dir.path)

      if (existsSync(fullPath)) {
        const files = readdirSync(fullPath)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(file))

        diagnostics.directories[dir.name] = {
          exists: true,
          path: dir.path,
          totalFiles: files.length,
          imageFiles: imageFiles.length,
          permissions: 'readable',
        }

        // 获取示例图片
        if (imageFiles.length > 0) {
          const sampleFile = imageFiles[0]
          const filePath = join(fullPath, sampleFile)
          const stats = statSync(filePath)

          diagnostics.sampleImages.push({
            filename: sampleFile,
            directory: dir.name,
            size: stats.size,
            url: `/${dir.path.replace('public/', '')}/${sampleFile}`,
            lastModified: stats.mtime.toISOString(),
          })
        }
      } else {
        diagnostics.directories[dir.name] = {
          exists: false,
          path: dir.path,
          error: '目录不存在',
        }

        diagnostics.recommendations.push(`创建缺失的目录: ${dir.path}`)
      }
    }

    // 2. 检查路由配置
    const routeFiles = ['src/app/uploads/[...path]/route.ts']

    for (const routeFile of routeFiles) {
      const routePath = join(process.cwd(), routeFile)
      if (existsSync(routePath)) {
        diagnostics.accessTests.push({
          type: 'route',
          name: '动态图片路由',
          status: 'exists',
          path: routeFile,
        })
      } else {
        diagnostics.accessTests.push({
          type: 'route',
          name: '动态图片路由',
          status: 'missing',
          path: routeFile,
        })

        diagnostics.recommendations.push('缺少图片访问路由，可能导致图片无法显示')
      }
    }

    // 3. 环境检查
    const isProduction = process.env.NODE_ENV === 'production'
    const isDocker = existsSync('/.dockerenv')

    diagnostics.environment = {
      nodeEnv: process.env.NODE_ENV,
      isProduction,
      isDocker,
      platform: process.platform,
    }

    // 4. 生成建议
    if (diagnostics.sampleImages.length === 0) {
      diagnostics.recommendations.push('上传目录中没有图片文件，建议上传测试图片')
    }

    if (isProduction && isDocker) {
      diagnostics.recommendations.push('生产环境Docker部署，请确保Nginx配置正确处理/uploads路径')
    }

    // 5. 生成测试URL
    if (diagnostics.sampleImages.length > 0) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3100'
      diagnostics.testUrls = diagnostics.sampleImages.map(img => ({
        filename: img.filename,
        directUrl: `${baseUrl}${img.url}`,
        apiUrl: `${baseUrl}/uploads/${img.filename}`,
        nginxUrl: `${baseUrl}/uploads/${img.filename}`, // Nginx直接访问
        nextjsUrl: `${baseUrl}/uploads/${img.filename}`, // Next.js路由访问
      }))
    }

    // 6. 检查常见400错误原因
    diagnostics.commonIssues = []

    // 检查路径分隔符问题
    if (process.platform === 'win32') {
      diagnostics.commonIssues.push({
        type: 'path_separator',
        description: 'Windows路径分隔符可能导致访问问题',
        severity: 'medium',
      })
    }

    // 检查权限问题
    try {
      const testDir = join(process.cwd(), 'public', 'uploads')
      const testFile = join(testDir, 'test-access.tmp')
      require('fs').writeFileSync(testFile, 'test')
      require('fs').unlinkSync(testFile)
    } catch (error) {
      diagnostics.commonIssues.push({
        type: 'permission',
        description: '上传目录权限不足',
        severity: 'high',
        error: error.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: '图片访问诊断完成',
      diagnostics,
    })
  } catch (error) {
    console.error('图片访问诊断失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '诊断失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}

/**
 * 测试图片上传功能
 */
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { testType } = await request.json()

    if (testType === 'upload-test') {
      // 创建一个简单的测试图片数据
      const testResults = {
        uploadEndpoints: [
          {
            name: '管理员上传',
            url: '/api/admin/media/upload',
            method: 'POST',
            requiresAuth: true,
          },
          {
            name: '普通上传',
            url: '/api/upload',
            method: 'POST',
            requiresAuth: false,
          },
        ],
        recommendations: [
          '使用Postman或类似工具测试上传接口',
          '检查文件大小限制（管理员10MB，普通20MB）',
          '确保Content-Type为multipart/form-data',
        ],
      }

      return NextResponse.json({
        success: true,
        message: '上传测试信息生成完成',
        testResults,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: '不支持的测试类型',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('上传测试失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '测试失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
