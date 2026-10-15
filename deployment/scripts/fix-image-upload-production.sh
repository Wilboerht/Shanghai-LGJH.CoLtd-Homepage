#!/bin/bash

# 修复生产环境图片上传访问问题的脚本
# 使用方法: ./fix-image-upload-production.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 开始修复生产环境图片上传访问问题...${NC}"

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 1. 检查当前部署状态
echo -e "${BLUE}📊 检查当前部署状态...${NC}"
if docker ps | grep -q "lgjh"; then
    echo -e "${GREEN}✅ 发现运行中的容器${NC}"
    CONTAINER_NAME=$(docker ps --format "table {{.Names}}" | grep lgjh | head -1)
    echo -e "${BLUE}容器名称: ${CONTAINER_NAME}${NC}"
else
    echo -e "${YELLOW}⚠️  没有发现运行中的LGJH容器${NC}"
fi

# 2. 检查上传目录
echo -e "${BLUE}📁 检查上传目录...${NC}"
if [ ! -d "public/uploads" ]; then
    echo -e "${YELLOW}⚠️  创建上传目录...${NC}"
    mkdir -p public/uploads
fi

# 设置正确的权限
chmod 755 public/uploads
echo -e "${GREEN}✅ 上传目录权限已设置${NC}"

# 3. 检查并修复Nginx配置
echo -e "${BLUE}🌐 检查Nginx配置...${NC}"
NGINX_CONFIG="deployment/configs/nginx.conf"

if [ ! -f "$NGINX_CONFIG" ]; then
    if [ -f "deployment/configs/nginx.conf.example" ]; then
        echo -e "${YELLOW}⚠️  复制示例配置文件...${NC}"
        cp deployment/configs/nginx.conf.example "$NGINX_CONFIG"
        echo -e "${GREEN}✅ Nginx配置文件已创建${NC}"
    else
        echo -e "${RED}❌ 错误: 找不到Nginx配置文件${NC}"
        exit 1
    fi
fi

# 4. 验证Nginx配置中的uploads路径
if grep -q "location /uploads/" "$NGINX_CONFIG"; then
    echo -e "${GREEN}✅ Nginx配置包含uploads路径配置${NC}"
else
    echo -e "${RED}❌ 错误: Nginx配置缺少uploads路径配置${NC}"
    echo -e "${YELLOW}请检查 $NGINX_CONFIG 文件${NC}"
fi

# 5. 重启服务
echo -e "${BLUE}🔄 重启Docker服务...${NC}"

# 选择合适的docker-compose文件
COMPOSE_FILE="deployment/docker/docker-compose.production.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    COMPOSE_FILE="deployment/docker/docker-compose.yml"
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ 错误: 找不到docker-compose配置文件${NC}"
    exit 1
fi

echo -e "${BLUE}使用配置文件: $COMPOSE_FILE${NC}"

# 停止现有服务
echo -e "${YELLOW}⏹️  停止现有服务...${NC}"
docker-compose -f "$COMPOSE_FILE" down

# 启动服务
echo -e "${GREEN}🚀 启动服务...${NC}"
docker-compose -f "$COMPOSE_FILE" up -d

# 6. 等待服务启动
echo -e "${BLUE}⏳ 等待服务启动...${NC}"
sleep 10

# 7. 验证服务状态
echo -e "${BLUE}🔍 验证服务状态...${NC}"
if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
    echo -e "${GREEN}✅ 服务启动成功${NC}"
else
    echo -e "${RED}❌ 服务启动失败${NC}"
    echo -e "${YELLOW}查看日志:${NC}"
    docker-compose -f "$COMPOSE_FILE" logs --tail=20
    exit 1
fi

# 8. 测试图片访问
echo -e "${BLUE}🧪 测试图片访问...${NC}"

# 创建测试图片
TEST_IMAGE="public/uploads/test-image-$(date +%s).txt"
echo "Test image for upload verification" > "$TEST_IMAGE"

# 获取容器中的文件路径
if [ -n "$CONTAINER_NAME" ]; then
    echo -e "${BLUE}检查容器中的文件...${NC}"
    docker exec "$CONTAINER_NAME" ls -la /app/public/uploads/ | head -10
fi

# 清理测试文件
rm -f "$TEST_IMAGE"

echo ""
echo -e "${GREEN}🎉 修复完成！${NC}"
echo ""
echo -e "${BLUE}📋 接下来的步骤:${NC}"
echo -e "${YELLOW}1. 访问管理后台: https://lingangjh.com/admin${NC}"
echo -e "${YELLOW}2. 进入产品管理页面${NC}"
echo -e "${YELLOW}3. 创建新产品并测试图片上传${NC}"
echo -e "${YELLOW}4. 检查上传的图片是否可以正常访问${NC}"
echo ""
echo -e "${BLUE}🔧 如果问题仍然存在:${NC}"
echo -e "${YELLOW}1. 检查域名DNS解析${NC}"
echo -e "${YELLOW}2. 检查防火墙设置${NC}"
echo -e "${YELLOW}3. 查看Nginx错误日志: docker-compose -f $COMPOSE_FILE logs nginx${NC}"
echo -e "${YELLOW}4. 查看应用日志: docker-compose -f $COMPOSE_FILE logs app${NC}"
