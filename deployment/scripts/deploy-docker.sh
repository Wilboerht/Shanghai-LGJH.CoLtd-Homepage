#!/bin/bash

# LGJH Homepage Docker 部署脚本
# 用于生产环境的 Docker 部署

set -e

echo "🚀 LGJH Homepage Docker 部署"
echo "============================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
    echo "安装指南: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安装，请先安装 Docker Compose${NC}"
    echo "安装指南: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker 版本: $(docker --version)${NC}"
echo -e "${GREEN}✅ Docker Compose 版本: $(docker-compose --version)${NC}"

# 检查环境变量文件
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production 文件不存在${NC}"
    if [ -f ".env.production.example" ]; then
        echo -e "${BLUE}📋 复制 .env.production.example 到 .env.production${NC}"
        cp .env.production.example .env.production
        echo -e "${YELLOW}⚠️  请编辑 .env.production 文件并配置正确的环境变量${NC}"
        echo -e "${YELLOW}   特别是 NEXTAUTH_SECRET 和 NEXTAUTH_URL${NC}"
        read -p "按回车键继续..."
    else
        echo -e "${RED}❌ 请创建 .env.production 文件${NC}"
        exit 1
    fi
fi

# 检查 Nginx 配置
if [ ! -f "nginx.conf" ]; then
    echo -e "${YELLOW}⚠️  nginx.conf 文件不存在${NC}"
    if [ -f "nginx.conf.example" ]; then
        echo -e "${BLUE}📋 复制 nginx.conf.example 到 nginx.conf${NC}"
        cp nginx.conf.example nginx.conf
        echo -e "${YELLOW}⚠️  请编辑 nginx.conf 文件并配置正确的域名${NC}"
    fi
fi

# 创建必要的目录
echo -e "${BLUE}📁 创建必要的目录...${NC}"
mkdir -p logs
mkdir -p ssl
mkdir -p public/uploads

# 设置权限
echo -e "${BLUE}🔐 设置目录权限...${NC}"
chmod 755 logs
chmod 755 public/uploads

# 选择部署模式
echo ""
echo "请选择部署模式："
echo "1) 简单模式 (仅应用 + Redis)"
echo "2) 完整模式 (应用 + Redis + Nginx)"
read -p "请输入选择 (1 或 2): " deploy_mode

case $deploy_mode in
    1)
        echo -e "${BLUE}🚀 启动简单模式部署...${NC}"
        COMPOSE_FILE="../docker/docker-compose.yml"
        PROFILES="--profile with-redis"
        ;;
    2)
        echo -e "${BLUE}🚀 启动完整模式部署...${NC}"
        COMPOSE_FILE="../docker/docker-compose.production.yml"
        PROFILES=""
        ;;
    *)
        echo -e "${RED}❌ 无效选择，使用简单模式${NC}"
        COMPOSE_FILE="../docker/docker-compose.yml"
        PROFILES="--profile with-redis"
        ;;
esac

# 停止现有服务
echo -e "${YELLOW}⏹️  停止现有服务...${NC}"
docker-compose -f $COMPOSE_FILE down $PROFILES 2>/dev/null || true

# 清理旧镜像 (可选)
read -p "是否清理旧的 Docker 镜像? (y/N): " cleanup_images
if [[ $cleanup_images =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧹 清理旧镜像...${NC}"
    docker system prune -f
fi

# 构建并启动服务
echo -e "${BLUE}🏗️  构建并启动服务...${NC}"
docker-compose -f $COMPOSE_FILE up -d --build $PROFILES

# 等待服务启动
echo -e "${BLUE}⏳ 等待服务启动...${NC}"
sleep 10

# 检查服务状态
echo -e "${BLUE}📊 检查服务状态...${NC}"
docker-compose -f $COMPOSE_FILE ps

# 健康检查
echo -e "${BLUE}🏥 执行健康检查...${NC}"
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 应用健康检查通过${NC}"
        break
    else
        echo -e "${YELLOW}⏳ 等待应用启动... (尝试 $attempt/$max_attempts)${NC}"
        sleep 5
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo -e "${RED}❌ 应用启动失败，请检查日志${NC}"
    echo -e "${BLUE}📋 查看日志: docker-compose -f $COMPOSE_FILE logs app${NC}"
    exit 1
fi

# 显示部署信息
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "===================="

if [ "$deploy_mode" = "2" ]; then
    echo -e "${GREEN}🌐 访问地址: http://localhost${NC}"
    echo -e "${GREEN}🌐 应用直接访问: http://localhost:3000${NC}"
else
    echo -e "${GREEN}🌐 访问地址: http://localhost:3000${NC}"
fi

echo ""
echo "管理命令："
echo -e "${BLUE}📊 查看状态: docker-compose -f $COMPOSE_FILE ps${NC}"
echo -e "${BLUE}📋 查看日志: docker-compose -f $COMPOSE_FILE logs -f app${NC}"
echo -e "${BLUE}🔄 重启服务: docker-compose -f $COMPOSE_FILE restart app${NC}"
echo -e "${BLUE}⏹️  停止服务: docker-compose -f $COMPOSE_FILE down${NC}"
echo -e "${BLUE}🧹 清理数据: docker-compose -f $COMPOSE_FILE down -v${NC}"

echo ""
echo -e "${YELLOW}⚠️  重要提醒:${NC}"
echo "1. 请定期备份 prisma/dev.db 数据库文件"
echo "2. 请定期备份 public/uploads 上传文件目录"
echo "3. 生产环境请配置 SSL 证书"
echo "4. 建议配置防火墙只开放必要端口"
