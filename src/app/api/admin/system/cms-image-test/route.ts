import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * CMS图片上传功能测试API
 * 用于检查各个CMS模块的图片上传和显示功能
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const testResults = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production',
        isDocker: existsSync('/.dockerenv'),
        platform: process.platform,
      },
      modules: [],
      uploadComponents: [],
      uploadAPIs: [],
      directories: [],
      sampleImages: [],
      recommendations: [],
    }

    // 1. 检查CMS模块配置
    const cmsModules = [
      {
        name: '产品管理',
        adminPage: 'src/app/admin/content/products/page.tsx',
        component: 'MultiImageUpload',
        uploadType: 'product',
        api: 'src/app/api/admin/content/products/route.ts',
        frontendPage: 'src/app/products',
        description: '产品图片展示，支持多图上传',
      },
      {
        name: '服务管理',
        adminPage: 'src/app/admin/content/services/page.tsx',
        component: 'CoverImageUpload',
        uploadType: 'service',
        api: 'src/app/api/admin/content/services/route.ts',
        frontendPage: 'src/app/services',
        description: '服务背景图片和图标',
      },
      {
        name: '公司动态',
        adminPage: 'src/app/admin/content/company-news/create/page.tsx',
        component: 'CoverImageUpload',
        uploadType: 'company-news',
        api: 'src/app/api/admin/content/company-news/route.ts',
        frontendPage: 'src/app/mission/company-news',
        description: '新闻封面图片',
      },
      {
        name: '荣誉奖项',
        adminPage: 'src/app/admin/content/homepage/awards/simple-page.tsx',
        component: '自定义上传',
        uploadType: 'awards',
        api: 'src/app/api/admin/content/awards/route.ts',
        frontendPage: 'src/app/about',
        description: '奖项证书图片',
      },
      {
        name: '企业资质',
        adminPage: 'src/app/admin/content/homepage/qualifications/page.tsx',
        component: '自定义上传',
        uploadType: 'qualifications',
        api: 'src/app/api/admin/content/qualifications/route.ts',
        frontendPage: 'src/app/about',
        description: '资质证书图片',
      },
      {
        name: '客户案例',
        adminPage: 'src/app/admin/content/client-cases/page.tsx',
        component: 'ImageUpload',
        uploadType: 'client-case',
        api: 'src/app/api/admin/content/client-cases/route.ts',
        frontendPage: 'src/app/client-cases',
        description: '案例展示图片',
      },
      {
        name: '合作伙伴',
        adminPage: 'src/app/admin/content/partners/page.tsx',
        component: 'ImageUpload',
        uploadType: 'partner',
        api: 'src/app/api/admin/content/partners/route.ts',
        frontendPage: 'src/app/about',
        description: '合作伙伴Logo',
      },
    ]

    // 检查每个CMS模块
    for (const module of cmsModules) {
      const moduleResult = {
        name: module.name,
        description: module.description,
        uploadType: module.uploadType,
        component: module.component,
        status: 'ok',
        issues: [],
      }

      // 检查管理页面
      const adminPagePath = join(process.cwd(), module.adminPage)
      if (existsSync(adminPagePath)) {
        moduleResult.adminPageExists = true

        // 检查是否包含图片上传功能
        try {
          const pageContent = require('fs').readFileSync(adminPagePath, 'utf8')
          if (
            pageContent.includes(module.component) ||
            pageContent.includes('ImageUpload') ||
            pageContent.includes('图片上传')
          ) {
            moduleResult.hasUploadComponent = true
          } else {
            moduleResult.hasUploadComponent = false
            moduleResult.issues.push('管理页面可能缺少图片上传功能')
          }

          // 检查上传类型配置
          if (
            pageContent.includes(`uploadType.*${module.uploadType}`) ||
            pageContent.includes(`'${module.uploadType}'`) ||
            pageContent.includes(`"${module.uploadType}"`)
          ) {
            moduleResult.hasCorrectUploadType = true
          } else {
            moduleResult.hasCorrectUploadType = false
            moduleResult.issues.push('上传类型配置可能有问题')
          }
        } catch (error) {
          moduleResult.issues.push('无法读取管理页面文件')
        }
      } else {
        moduleResult.adminPageExists = false
        moduleResult.issues.push('管理页面文件不存在')
        moduleResult.status = 'error'
      }

      // 检查API接口
      const apiPath = join(process.cwd(), module.api)
      if (existsSync(apiPath)) {
        moduleResult.apiExists = true

        try {
          const apiContent = require('fs').readFileSync(apiPath, 'utf8')
          if (
            apiContent.includes('image') ||
            apiContent.includes('logo') ||
            apiContent.includes('cover')
          ) {
            moduleResult.hasImageHandling = true
          } else {
            moduleResult.hasImageHandling = false
            moduleResult.issues.push('API可能缺少图片字段处理')
          }
        } catch (error) {
          moduleResult.issues.push('无法读取API文件')
        }
      } else {
        moduleResult.apiExists = false
        moduleResult.issues.push('API接口文件不存在')
        moduleResult.status = 'error'
      }

      // 检查前端页面
      const frontendPath = join(process.cwd(), module.frontendPage)
      moduleResult.frontendPageExists = existsSync(frontendPath)
      if (!moduleResult.frontendPageExists) {
        moduleResult.issues.push('前端展示页面可能缺失')
      }

      if (moduleResult.issues.length > 0) {
        moduleResult.status = moduleResult.status === 'error' ? 'error' : 'warning'
      }

      testResults.modules.push(moduleResult)
    }

    // 2. 检查图片上传组件
    const uploadComponents = [
      {
        name: 'ImageUpload',
        file: 'src/components/ui/image-upload.tsx',
        description: '单图上传组件',
      },
      {
        name: 'MultiImageUpload',
        file: 'src/components/ui/multi-image-upload.tsx',
        description: '多图上传组件',
      },
      {
        name: 'CoverImageUpload',
        file: 'src/components/ui/cover-image-upload.tsx',
        description: '封面图片上传组件',
      },
    ]

    for (const component of uploadComponents) {
      const componentPath = join(process.cwd(), component.file)
      const componentResult = {
        name: component.name,
        description: component.description,
        exists: existsSync(componentPath),
        hasErrorHandling: false,
        usesCorrectAPI: false,
        issues: [],
      }

      if (componentResult.exists) {
        try {
          const componentContent = require('fs').readFileSync(componentPath, 'utf8')

          // 检查错误处理
          if (
            componentContent.includes('toast.error') ||
            componentContent.includes('error') ||
            componentContent.includes('catch')
          ) {
            componentResult.hasErrorHandling = true
          } else {
            componentResult.issues.push('可能缺少完整的错误处理')
          }

          // 检查API使用
          if (componentContent.includes('/api/upload')) {
            componentResult.usesCorrectAPI = true
          } else {
            componentResult.issues.push('上传API路径可能有问题')
          }
        } catch (error) {
          componentResult.issues.push('无法读取组件文件')
        }
      } else {
        componentResult.issues.push('组件文件不存在')
      }

      testResults.uploadComponents.push(componentResult)
    }

    // 3. 检查上传API
    const uploadAPIs = [
      {
        name: '普通上传API',
        file: 'src/app/api/upload/route.ts',
        description: '处理前端图片上传',
      },
      {
        name: '管理员上传API',
        file: 'src/app/api/admin/media/upload/route.ts',
        description: '处理管理员图片上传',
      },
      {
        name: '图片访问路由',
        file: 'src/app/uploads/[...path]/route.ts',
        description: '处理图片访问请求',
      },
    ]

    for (const api of uploadAPIs) {
      const apiPath = join(process.cwd(), api.file)
      testResults.uploadAPIs.push({
        name: api.name,
        description: api.description,
        exists: existsSync(apiPath),
        path: api.file,
      })
    }

    // 4. 检查上传目录
    const uploadDirs = [
      { path: 'public/uploads', name: '主上传目录' },
      { path: 'public/uploads/admin', name: '管理员上传目录' },
    ]

    for (const dir of uploadDirs) {
      const fullPath = join(process.cwd(), dir.path)
      const dirResult = {
        name: dir.name,
        path: dir.path,
        exists: existsSync(fullPath),
        totalFiles: 0,
        imageFiles: 0,
        recentImages: [],
      }

      if (dirResult.exists) {
        try {
          const files = readdirSync(fullPath)
          dirResult.totalFiles = files.length

          const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(file))
          dirResult.imageFiles = imageFiles.length

          // 获取最近的3个图片文件
          const recentImages = imageFiles
            .map(file => {
              const filePath = join(fullPath, file)
              const stats = statSync(filePath)
              return {
                filename: file,
                size: stats.size,
                lastModified: stats.mtime.toISOString(),
                url: `/${dir.path.replace('public/', '')}/${file}`,
              }
            })
            .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
            .slice(0, 3)

          dirResult.recentImages = recentImages
          testResults.sampleImages.push(...recentImages)
        } catch (error) {
          dirResult.error = error.message
        }
      }

      testResults.directories.push(dirResult)
    }

    // 5. 生成建议
    const moduleIssues = testResults.modules.filter(m => m.status !== 'ok').length
    const componentIssues = testResults.uploadComponents.filter(c => c.issues.length > 0).length
    const apiIssues = testResults.uploadAPIs.filter(a => !a.exists).length

    if (moduleIssues === 0 && componentIssues === 0 && apiIssues === 0) {
      testResults.recommendations.push('所有CMS模块图片上传功能配置正常')
    } else {
      if (moduleIssues > 0) {
        testResults.recommendations.push(`发现 ${moduleIssues} 个CMS模块存在问题，需要检查配置`)
      }
      if (componentIssues > 0) {
        testResults.recommendations.push(`发现 ${componentIssues} 个上传组件存在问题，需要修复`)
      }
      if (apiIssues > 0) {
        testResults.recommendations.push(`发现 ${apiIssues} 个API接口缺失，需要创建`)
      }
    }

    // 生产环境特殊建议
    if (testResults.environment.isProduction) {
      testResults.recommendations.push('生产环境建议：定期检查图片上传功能，监控错误日志')
      testResults.recommendations.push('建议测试各种图片格式和大小的上传功能')
    }

    return NextResponse.json({
      success: true,
      message: 'CMS图片上传功能检查完成',
      testResults,
    })
  } catch (error) {
    console.error('CMS图片上传功能检查失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '检查失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
