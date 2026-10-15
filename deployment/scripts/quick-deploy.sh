#!/bin/bash

# LGJH-Homepage 快速部署脚本
# 适用于开发和测试环境

set -e

echo "🚀 LGJH-Homepage 快速部署"
echo "=========================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js 18.0+"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 生成Prisma客户端
echo "🔧 生成Prisma客户端..."
npx prisma generate

# 构建项目
echo "🏗️  构建项目..."
npm run build

# 检查PM2
if ! command -v pm2 &> /dev/null; then
    echo "📥 安装PM2..."
    npm install -g pm2
fi

# 创建PM2配置
echo "📝 创建PM2配置..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'lgjh-homepage',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    max_memory_restart: '1G',
    restart_delay: 4000
  }]
};
EOF

# 创建日志目录
mkdir -p logs

# 停止现有服务
pm2 delete lgjh-homepage 2>/dev/null || true

# 启动服务
echo "🚀 启动服务..."
pm2 start ecosystem.config.js

# 保存配置
pm2 save

echo ""
echo "🎉 部署完成！"
echo "===================="
echo "🌐 访问地址: http://localhost:3000"
echo "📊 查看状态: pm2 status"
echo "📋 查看日志: pm2 logs lgjh-homepage"
echo "🔄 重启服务: pm2 restart lgjh-homepage"
echo "⏹️  停止服务: pm2 stop lgjh-homepage"
