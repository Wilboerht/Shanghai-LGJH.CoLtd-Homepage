#!/bin/bash

# 修复生产环境图片上传问题的脚本
# 使用方法: ./fix-image-upload.sh

set -e

echo "🔧 开始修复生产环境图片上传问题..."

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 1. 停止现有服务
echo "📦 停止现有Docker服务..."
docker-compose -f deployment/docker/docker-compose.production.yml down

# 2. 确保上传目录存在且权限正确
echo "📁 创建并设置上传目录权限..."
mkdir -p public/uploads
chmod 755 public/uploads

# 3. 备份现有Nginx配置
if [ -f "deployment/configs/nginx.conf" ]; then
    echo "💾 备份现有Nginx配置..."
    cp deployment/configs/nginx.conf deployment/configs/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
fi

# 4. 复制新的Nginx配置
echo "⚙️ 更新Nginx配置..."
cp deployment/configs/nginx.conf.example deployment/configs/nginx.conf

# 5. 重新构建应用
echo "🏗️ 重新构建应用..."
docker-compose -f deployment/docker/docker-compose.production.yml build --no-cache

# 6. 启动服务
echo "🚀 启动服务..."
docker-compose -f deployment/docker/docker-compose.production.yml up -d

# 7. 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 8. 检查服务状态
echo "🔍 检查服务状态..."
docker-compose -f deployment/docker/docker-compose.production.yml ps

# 9. 测试图片上传功能
echo "🧪 测试服务健康状态..."
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ 服务健康检查通过"
else
    echo "❌ 服务健康检查失败"
    echo "📋 查看日志:"
    docker-compose -f deployment/docker/docker-compose.production.yml logs --tail=50
    exit 1
fi

echo "🎉 图片上传问题修复完成!"
echo ""
echo "📝 修复内容:"
echo "  ✅ 统一了图片上传API路径"
echo "  ✅ 修复了Nginx静态文件服务配置"
echo "  ✅ 添加了管理后台根路由"
echo "  ✅ 增强了错误处理和日志记录"
echo ""
echo "🔗 测试链接:"
echo "  - 主页: http://localhost"
echo "  - 管理后台: http://localhost/admin"
echo "  - API健康检查: http://localhost/api/health"
echo ""
echo "📊 查看日志:"
echo "  docker-compose -f deployment/docker/docker-compose.production.yml logs -f"
