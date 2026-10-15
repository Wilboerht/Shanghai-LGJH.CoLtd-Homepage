#!/bin/bash

# LGJH Homepage 服务器部署打包脚本
# 将项目打包为可部署的压缩文件

set -e

echo "📦 LGJH Homepage 服务器部署打包"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查必要文件
echo -e "${BLUE}🔍 检查项目文件...${NC}"
required_files=("package.json" "Dockerfile" "docker-compose.yml" "prisma/schema.prisma" "src")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo -e "${RED}❌ 缺少必要文件:${NC}"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

echo -e "${GREEN}✅ 项目文件检查通过${NC}"

# 创建临时目录
TEMP_DIR="lgjh-homepage-deploy"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="lgjh-homepage-${TIMESTAMP}.tar.gz"

echo -e "${BLUE}📁 创建部署包...${NC}"

# 清理旧的临时目录
rm -rf $TEMP_DIR

# 创建部署目录结构
mkdir -p $TEMP_DIR

# 复制必要文件和目录
echo -e "${BLUE}📋 复制项目文件...${NC}"

# 核心文件
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/ 2>/dev/null || echo "package-lock.json 不存在，跳过"
cp next.config.ts $TEMP_DIR/
cp tailwind.config.js $TEMP_DIR/
cp postcss.config.js $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/

# Docker 相关文件
cp Dockerfile $TEMP_DIR/
cp docker-compose.yml $TEMP_DIR/
cp docker-compose.simple.yml $TEMP_DIR/ 2>/dev/null || echo "docker-compose.simple.yml 不存在，跳过"
cp docker-compose.production.yml $TEMP_DIR/ 2>/dev/null || echo "docker-compose.production.yml 不存在，跳过"
cp .dockerignore $TEMP_DIR/ 2>/dev/null || echo ".dockerignore 不存在，跳过"

# 配置文件
cp .env.production.example $TEMP_DIR/ 2>/dev/null || echo ".env.production.example 不存在，跳过"
cp nginx.conf.example $TEMP_DIR/ 2>/dev/null || echo "nginx.conf.example 不存在，跳过"

# 部署脚本
cp deploy-docker.sh $TEMP_DIR/ 2>/dev/null || echo "deploy-docker.sh 不存在，跳过"
cp deploy-docker.bat $TEMP_DIR/ 2>/dev/null || echo "deploy-docker.bat 不存在，跳过"
cp server-setup.sh $TEMP_DIR/ 2>/dev/null || echo "server-setup.sh 不存在，跳过"
cp check-deployment.sh $TEMP_DIR/ 2>/dev/null || echo "check-deployment.sh 不存在，跳过"

# 文档文件
cp README.md $TEMP_DIR/ 2>/dev/null || echo "README.md 不存在，跳过"
cp DEPLOYMENT.md $TEMP_DIR/ 2>/dev/null || echo "DEPLOYMENT.md 不存在，跳过"
cp DOCKER_DEPLOYMENT.md $TEMP_DIR/ 2>/dev/null || echo "DOCKER_DEPLOYMENT.md 不存在，跳过"
cp LINUX_SERVER_DEPLOYMENT.md $TEMP_DIR/ 2>/dev/null || echo "LINUX_SERVER_DEPLOYMENT.md 不存在，跳过"

# 复制目录
echo -e "${BLUE}📂 复制项目目录...${NC}"
cp -r src $TEMP_DIR/
cp -r prisma $TEMP_DIR/
cp -r public $TEMP_DIR/

# 创建必要的空目录
mkdir -p $TEMP_DIR/logs
mkdir -p $TEMP_DIR/ssl

# 清理不需要的文件
echo -e "${BLUE}🧹 清理不必要的文件...${NC}"

# 清理数据库备份文件
find $TEMP_DIR/prisma -name "*.backup" -delete 2>/dev/null || true

# 清理上传文件 (保留目录结构)
if [ -d "$TEMP_DIR/public/uploads" ]; then
    find $TEMP_DIR/public/uploads -type f -delete 2>/dev/null || true
fi

# 清理临时文件
find $TEMP_DIR -name ".DS_Store" -delete 2>/dev/null || true
find $TEMP_DIR -name "Thumbs.db" -delete 2>/dev/null || true
find $TEMP_DIR -name "*.tmp" -delete 2>/dev/null || true

# 设置脚本执行权限
chmod +x $TEMP_DIR/*.sh 2>/dev/null || true

# 创建部署说明文件
echo -e "${BLUE}📝 创建部署说明...${NC}"
cat > $TEMP_DIR/DEPLOY_README.txt << 'EOF'
LGJH Homepage 服务器部署包
========================

此部署包包含了在Linux服务器上部署LGJH Homepage所需的所有文件。

快速部署步骤:
1. 解压此文件到服务器 /opt/lgjh-homepage 目录
2. 运行: chmod +x server-setup.sh && ./server-setup.sh
3. 或者手动运行: chmod +x deploy-docker.sh && ./deploy-docker.sh

文件说明:
- server-setup.sh: 服务器环境一键安装脚本
- deploy-docker.sh: Docker部署脚本
- docker-compose.yml: Docker编排配置
- .env.production.example: 环境变量模板
- nginx.conf.example: Nginx配置模板
- LINUX_SERVER_DEPLOYMENT.md: 详细部署文档

重要提醒:
1. 请先配置 .env.production 文件
2. 生产环境请配置SSL证书
3. 建议配置防火墙和定期备份

技术支持: 请查看相关文档文件
EOF

# 创建压缩包
echo -e "${BLUE}🗜️  创建压缩包...${NC}"
tar -czf $PACKAGE_NAME $TEMP_DIR

# 清理临时目录
rm -rf $TEMP_DIR

# 显示结果
echo ""
echo -e "${GREEN}🎉 打包完成！${NC}"
echo "===================="
echo -e "${GREEN}📦 部署包: $PACKAGE_NAME${NC}"
echo -e "${GREEN}📏 文件大小: $(du -h $PACKAGE_NAME | cut -f1)${NC}"

echo ""
echo -e "${BLUE}📤 上传到服务器:${NC}"
echo "scp $PACKAGE_NAME user@your-server:/opt/"

echo ""
echo -e "${BLUE}🚀 服务器部署命令:${NC}"
echo "cd /opt"
echo "tar -xzf $PACKAGE_NAME"
echo "cd lgjh-homepage-deploy"
echo "chmod +x server-setup.sh"
echo "./server-setup.sh"

echo ""
echo -e "${YELLOW}📝 提醒:${NC}"
echo "1. 请确保服务器已安装 Docker 和 Docker Compose"
echo "2. 上传后请配置环境变量文件"
echo "3. 生产环境请配置域名和SSL证书"
echo "4. 查看 LINUX_SERVER_DEPLOYMENT.md 获取详细说明"

echo ""
echo -e "${GREEN}✅ 部署包创建完成！${NC}"
