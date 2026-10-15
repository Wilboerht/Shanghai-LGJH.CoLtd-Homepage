#!/bin/bash

# 修复生产环境配置脚本
# 解决API认证和用户管理问题

echo "🔧 修复生产环境配置问题..."

# 1. 生成新的NextAuth密钥
echo "📝 生成NextAuth密钥..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 2. 创建生产环境配置文件
echo "📄 创建.env.local文件..."
cat > .env.local << EOF
# 生产环境配置
NODE_ENV=production

# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth配置
NEXTAUTH_URL=http://localhost:3100
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

# 其他配置
DOCKER_BUILD=false
EOF

echo "✅ 环境配置文件已创建"

# 3. 设置当前会话的环境变量
echo "🔧 设置环境变量..."
export NODE_ENV=production
export NEXTAUTH_URL=http://localhost:3100
export NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
export DOCKER_BUILD=false

# 4. 清理缓存
echo "🧹 清理缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 5. 重新生成Prisma客户端
echo "🗄️ 重新生成Prisma客户端..."
npx prisma generate

# 6. 重新构建项目
echo "🏗️ 重新构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "✅ 修复完成！"
echo ""
echo "🚀 现在可以启动服务:"
echo "   npm run start:production"
echo ""
echo "🌐 访问地址: http://localhost:3100/admin"
echo ""
