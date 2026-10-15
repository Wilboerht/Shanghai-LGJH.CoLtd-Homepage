#!/usr/bin/env node

/**
 * 诊断API问题脚本
 * 检查所有可能导致用户管理功能失效的问题
 */

const fs = require('fs')
const path = require('path')
const http = require('http')

console.log('🔍 开始诊断API问题...')

// 检查环境变量
function checkEnvironmentVariables() {
  console.log('\n📝 检查环境变量...')

  const requiredVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'DATABASE_URL']

  const missing = []
  const present = []

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      present.push(varName)
    } else {
      missing.push(varName)
    }
  }

  console.log('✅ 已设置的环境变量:')
  present.forEach(v =>
    console.log(`  - ${v}: ${v === 'NEXTAUTH_SECRET' ? '[HIDDEN]' : process.env[v]}`)
  )

  if (missing.length > 0) {
    console.log('❌ 缺失的环境变量:')
    missing.forEach(v => console.log(`  - ${v}`))
    return false
  }

  return true
}

// 检查文件存在性
function checkFiles() {
  console.log('\n📁 检查关键文件...')

  const criticalFiles = [
    'src/lib/auth.ts',
    'src/lib/prisma.ts',
    'src/middleware.ts',
    'src/app/api/admin/users/route.ts',
    'src/app/api/admin/users/[id]/route.ts',
    'src/app/api/admin/system/status/route.ts',
    'prisma/schema.prisma',
  ]

  const missing = []

  for (const file of criticalFiles) {
    const fullPath = path.join(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file}`)
      missing.push(file)
    }
  }

  return missing.length === 0
}

// 检查数据库
async function checkDatabase() {
  console.log('\n🗄️ 检查数据库...')

  try {
    const { prisma } = require('../src/lib/prisma')

    // 测试连接
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 检查用户表
    const userCount = await prisma.user.count()
    console.log(`✅ 用户表正常，用户数量: ${userCount}`)

    // 检查管理员用户
    const adminCount = await prisma.user.count({
      where: { isAdmin: true },
    })
    console.log(`✅ 管理员用户数量: ${adminCount}`)

    if (adminCount === 0) {
      console.log('⚠️ 警告: 没有管理员用户')
    }

    await prisma.$disconnect()
    return true
  } catch (error) {
    console.log('❌ 数据库检查失败:', error.message)
    return false
  }
}

// 测试API端点
function testApiEndpoint(path, method = 'GET') {
  return new Promise(resolve => {
    const options = {
      hostname: 'localhost',
      port: 3100,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = http.request(options, res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        })
      })
    })

    req.on('error', error => {
      resolve({
        status: 0,
        error: error.message,
      })
    })

    req.setTimeout(5000, () => {
      req.destroy()
      resolve({
        status: 0,
        error: 'Timeout',
      })
    })

    req.end()
  })
}

// 检查API端点
async function checkApiEndpoints() {
  console.log('\n🌐 检查API端点...')

  const endpoints = ['/api/admin/users', '/api/admin/system/status', '/api/auth/session']

  for (const endpoint of endpoints) {
    try {
      const result = await testApiEndpoint(endpoint)

      if (result.status === 0) {
        console.log(`❌ ${endpoint}: ${result.error}`)
      } else if (result.status === 405) {
        console.log(`⚠️ ${endpoint}: Method Not Allowed (${result.status})`)
      } else if (result.status === 403) {
        console.log(`🔒 ${endpoint}: Forbidden - 需要认证 (${result.status})`)
      } else if (result.status === 200) {
        console.log(`✅ ${endpoint}: OK (${result.status})`)
      } else {
        console.log(`⚠️ ${endpoint}: ${result.status}`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`)
    }
  }
}

// 检查Next.js配置
function checkNextConfig() {
  console.log('\n⚙️ 检查Next.js配置...')

  const configPath = path.join(process.cwd(), 'next.config.ts')
  if (fs.existsSync(configPath)) {
    console.log('✅ next.config.ts 存在')

    const content = fs.readFileSync(configPath, 'utf8')
    if (content.includes("output: 'standalone'")) {
      console.log('⚠️ 检测到standalone配置，可能影响API路由')
    } else {
      console.log('✅ Next.js配置正常')
    }
  } else {
    console.log('❌ next.config.ts 不存在')
  }
}

// 生成修复建议
function generateFixSuggestions(envOk, filesOk, dbOk) {
  console.log('\n💡 修复建议:')

  if (!envOk) {
    console.log('1. 运行环境变量修复脚本:')
    console.log('   scripts\\fix-production-env.bat (Windows)')
    console.log('   bash scripts/fix-production-env.sh (Linux/Mac)')
  }

  if (!filesOk) {
    console.log('2. 检查缺失的文件，可能需要重新克隆代码库')
  }

  if (!dbOk) {
    console.log('3. 修复数据库问题:')
    console.log('   npx prisma migrate reset --force')
    console.log('   npx prisma db seed')
  }

  console.log('4. 重启服务:')
  console.log('   停止当前服务 (Ctrl+C)')
  console.log('   npm run start:production')

  console.log('5. 如果问题仍然存在，检查浏览器控制台和网络标签页')
}

// 主函数
async function main() {
  try {
    console.log('🔍 CMS API问题诊断工具')
    console.log('=' * 50)

    // 1. 检查环境变量
    const envOk = checkEnvironmentVariables()

    // 2. 检查文件
    const filesOk = checkFiles()

    // 3. 检查数据库
    const dbOk = await checkDatabase()

    // 4. 检查Next.js配置
    checkNextConfig()

    // 5. 检查API端点（如果服务正在运行）
    await checkApiEndpoints()

    // 6. 生成修复建议
    generateFixSuggestions(envOk, filesOk, dbOk)

    console.log('\n📊 诊断完成!')
  } catch (error) {
    console.error('❌ 诊断过程出错:', error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
