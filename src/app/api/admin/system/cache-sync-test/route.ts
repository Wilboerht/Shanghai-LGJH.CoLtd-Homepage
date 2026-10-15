import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CacheManager } from '@/lib/cache-utils'

/**
 * 缓存同步测试API
 * 用于测试所有CMS模块的缓存刷新功能
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
      modules: [],
      summary: {
        total: 0,
        available: 0,
        missing: 0,
      },
    }

    // 定义所有CMS模块及其缓存方法
    const cmsModules = [
      {
        name: '产品管理',
        method: 'revalidateProduct',
        description: '产品创建/更新/删除后刷新产品页面',
        testSlug: 'test-product',
      },
      {
        name: '服务管理',
        method: 'revalidateService',
        description: '服务创建/更新/删除后刷新服务页面',
        testSlug: 'test-service',
      },
      {
        name: '研究管理',
        method: 'revalidateResearch',
        description: '研究创建/更新/删除后刷新研究页面',
        testSlug: 'test-research',
      },
      {
        name: '客户案例',
        method: 'revalidateClientCase',
        description: '客户案例创建/更新/删除后刷新相关页面',
      },
      {
        name: '招聘职位',
        method: 'revalidateCareer',
        description: '招聘职位创建/更新/删除后刷新招聘页面',
      },
      {
        name: '合作伙伴',
        method: 'revalidatePartner',
        description: '合作伙伴创建/更新/删除后刷新相关页面',
      },
      {
        name: '使命模块',
        method: 'revalidateMission',
        description: '使命内容创建/更新后刷新使命页面',
      },
      {
        name: '荣誉奖项',
        method: 'revalidateAward',
        description: '荣誉奖项创建/更新后刷新关于页面',
      },
      {
        name: '企业资质',
        method: 'revalidateQualification',
        description: '企业资质创建/更新后刷新关于页面',
      },
      {
        name: '解决方案',
        method: 'revalidateSolution',
        description: '解决方案创建/更新后刷新解决方案页面',
      },
    ]

    // 测试每个模块的缓存方法
    for (const module of cmsModules) {
      const moduleResult = {
        name: module.name,
        method: module.method,
        description: module.description,
        available: false,
        tested: false,
        error: null,
      }

      try {
        // 检查方法是否存在
        if (typeof CacheManager[module.method] === 'function') {
          moduleResult.available = true
          testResults.summary.available++
        } else {
          moduleResult.error = '缓存方法不存在'
          testResults.summary.missing++
        }
      } catch (error) {
        moduleResult.error = error instanceof Error ? error.message : '未知错误'
        testResults.summary.missing++
      }

      testResults.modules.push(moduleResult)
      testResults.summary.total++
    }

    return NextResponse.json({
      success: true,
      message: '缓存同步测试完成',
      results: testResults,
    })
  } catch (error) {
    console.error('缓存同步测试失败:', error)
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

/**
 * 执行缓存刷新测试
 */
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { testType, modules } = await request.json()

    if (testType === 'refresh-all') {
      // 测试所有缓存刷新方法
      const testResults = {
        timestamp: new Date().toISOString(),
        tests: [],
        summary: {
          total: 0,
          success: 0,
          failed: 0,
        },
      }

      const cacheTests = [
        { name: '产品缓存', method: 'revalidateProduct', args: ['test-slug'] },
        { name: '服务缓存', method: 'revalidateService', args: ['test-slug'] },
        { name: '研究缓存', method: 'revalidateResearch', args: ['test-slug'] },
        { name: '客户案例缓存', method: 'revalidateClientCase', args: [] },
        { name: '招聘职位缓存', method: 'revalidateCareer', args: [] },
        { name: '合作伙伴缓存', method: 'revalidatePartner', args: [] },
        { name: '使命模块缓存', method: 'revalidateMission', args: [] },
        { name: '荣誉奖项缓存', method: 'revalidateAward', args: [] },
        { name: '企业资质缓存', method: 'revalidateQualification', args: [] },
        { name: '解决方案缓存', method: 'revalidateSolution', args: [] },
      ]

      for (const test of cacheTests) {
        const testResult = {
          name: test.name,
          method: test.method,
          success: false,
          duration: 0,
          error: null,
        }

        const startTime = Date.now()

        try {
          if (typeof CacheManager[test.method] === 'function') {
            await CacheManager[test.method](...test.args)
            testResult.success = true
            testResults.summary.success++
          } else {
            testResult.error = '方法不存在'
            testResults.summary.failed++
          }
        } catch (error) {
          testResult.error = error instanceof Error ? error.message : '未知错误'
          testResults.summary.failed++
        }

        testResult.duration = Date.now() - startTime
        testResults.tests.push(testResult)
        testResults.summary.total++
      }

      return NextResponse.json({
        success: true,
        message: '缓存刷新测试完成',
        results: testResults,
      })
    }

    if (testType === 'refresh-single' && modules && modules.length > 0) {
      // 测试单个模块的缓存刷新
      const results = []

      for (const moduleName of modules) {
        try {
          const methodName = `revalidate${moduleName}`
          if (typeof CacheManager[methodName] === 'function') {
            await CacheManager[methodName]()
            results.push({
              module: moduleName,
              success: true,
              message: '缓存刷新成功',
            })
          } else {
            results.push({
              module: moduleName,
              success: false,
              error: '缓存方法不存在',
            })
          }
        } catch (error) {
          results.push({
            module: moduleName,
            success: false,
            error: error instanceof Error ? error.message : '未知错误',
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: '单模块缓存刷新测试完成',
        results,
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
    console.error('缓存刷新测试失败:', error)
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
