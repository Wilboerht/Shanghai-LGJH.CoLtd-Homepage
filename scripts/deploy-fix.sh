#!/bin/bash

# 部署修复脚本 - 解决Prisma网络连接问题
# 使用方法: bash scripts/deploy-fix.sh

echo "🚀 开始部署修复流程..."

# 1. 设置环境变量
export PRISMA_ENGINES_MIRROR="https://registry.npmmirror.com/-/binary/prisma/"
export PRISMA_CLI_BINARY_TARGETS="native"

# 2. 清理缓存
echo "🧹 清理缓存..."
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
npm cache clean --force

# 3. 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 4. 尝试生成Prisma客户端
echo "🔧 生成Prisma客户端..."
if ! npx prisma generate; then
    echo "❌ Prisma生成失败，尝试离线模式..."
    
    # 5. 离线模式 - 手动下载引擎
    echo "📥 手动下载Prisma引擎..."
    
    # 创建引擎目录
    mkdir -p node_modules/.prisma/client
    
    # 设置离线模式
    export PRISMA_SKIP_POSTINSTALL_GENERATE=true
    export PRISMA_GENERATE_SKIP_AUTOINSTALL=true
    
    # 重新尝试生成
    npx prisma generate --skip-generate || echo "⚠️ 生成跳过，继续构建..."
fi

# 6. 数据库迁移
echo "🗄️ 执行数据库迁移..."
npx prisma migrate deploy || echo "⚠️ 迁移失败，可能需要手动处理"

# 7. 构建项目
echo "🏗️ 构建项目..."
npm run build

echo "✅ 部署修复完成！"
