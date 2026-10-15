#!/usr/bin/env node

/**
 * 清理NextAuth会话数据
 * 解决JWT解密失败问题
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 清理NextAuth会话数据...')

// 清理可能的会话存储文件
function clearSessionFiles() {
  const sessionPaths = ['.next/cache', 'node_modules/.cache', '.env.local.bak']

  sessionPaths.forEach(sessionPath => {
    const fullPath = path.join(process.cwd(), sessionPath)
    if (fs.existsSync(fullPath)) {
      try {
        if (fs.statSync(fullPath).isDirectory()) {
          fs.rmSync(fullPath, { recursive: true, force: true })
          console.log(`✅ 已删除目录: ${sessionPath}`)
        } else {
          fs.unlinkSync(fullPath)
          console.log(`✅ 已删除文件: ${sessionPath}`)
        }
      } catch (error) {
        console.log(`⚠️ 无法删除 ${sessionPath}: ${error.message}`)
      }
    }
  })
}

// 检查环境变量
function checkEnvironment() {
  console.log('\n📝 检查环境变量...')

  // 检查.env.local文件
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')

    if (envContent.includes('NEXTAUTH_SECRET')) {
      console.log('✅ NEXTAUTH_SECRET 已配置')
    } else {
      console.log('❌ NEXTAUTH_SECRET 未配置')
    }

    if (envContent.includes('NEXTAUTH_URL')) {
      console.log('✅ NEXTAUTH_URL 已配置')
    } else {
      console.log('❌ NEXTAUTH_URL 未配置')
    }
  } else {
    console.log('❌ .env.local 文件不存在')
  }
}

// 生成浏览器清理指令
function generateBrowserInstructions() {
  console.log('\n🌐 浏览器清理指令:')
  console.log('1. 打开开发者工具 (F12)')
  console.log('2. 转到 Application 标签页')
  console.log('3. 在左侧找到 Storage 部分')
  console.log('4. 清理以下内容:')
  console.log('   - Cookies → http://localhost:3100')
  console.log('   - Local Storage → http://localhost:3100')
  console.log('   - Session Storage → http://localhost:3100')
  console.log('5. 或者使用无痕模式测试 (Ctrl+Shift+N)')
}

// 主函数
async function main() {
  try {
    console.log('🔧 NextAuth会话清理工具')
    console.log('=' * 40)

    // 1. 清理会话文件
    clearSessionFiles()

    // 2. 检查环境变量
    checkEnvironment()

    // 3. 生成浏览器清理指令
    generateBrowserInstructions()

    console.log('\n📋 完成后的步骤:')
    console.log('1. 重启服务: npm run start:production')
    console.log('2. 清理浏览器数据 (按上面的指令)')
    console.log('3. 重新访问: http://localhost:3100/admin')
    console.log('4. 重新登录')

    console.log('\n✅ 会话清理完成!')
  } catch (error) {
    console.error('❌ 清理过程出错:', error.message)
    process.exit(1)
  }
}

// 运行主函数
main()
