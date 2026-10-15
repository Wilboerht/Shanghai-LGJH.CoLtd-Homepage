#!/bin/bash

# 修复部署问题脚本 - Linux/Mac版本
# 解决Next.js standalone配置和文件访问问题

echo "🚀 开始修复部署问题..."

# 1. 设置环境变量
echo "📝 设置环境变量..."
export NODE_ENV=production
export DOCKER_BUILD=false

# 2. 停止现有服务
echo "🛑 停止现有服务..."
pkill -f "next start" 2>/dev/null || echo "没有运行的Next.js进程"

# 3. 清理构建缓存
echo "🧹 清理构建缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 4. 重新构建项目
echo "🏗️ 重新构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 5. 检查上传目录权限
echo "📁 检查上传目录..."
mkdir -p public/uploads
mkdir -p public/uploads/admin
chmod 755 public/uploads
chmod 755 public/uploads/admin

# 6. 检查文件权限
echo "🔐 设置文件权限..."
find public/uploads -type f -exec chmod 644 {} \;
find public/uploads -type d -exec chmod 755 {} \;

# 7. 启动服务
echo "🎉 启动服务..."
echo "服务将在 http://localhost:3100 启动"
echo "按 Ctrl+C 停止服务"
npm start
