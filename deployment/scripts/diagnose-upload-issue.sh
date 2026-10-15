#!/bin/bash

# 诊断生产环境图片上传问题的脚本
# 使用方法: ./diagnose-upload-issue.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 开始诊断生产环境图片上传问题...${NC}"
echo ""

# 1. 检查项目结构
echo -e "${BLUE}📁 检查项目结构...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 不在项目根目录${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 项目根目录正确${NC}"

# 2. 检查上传目录
echo -e "${BLUE}📂 检查上传目录...${NC}"
if [ -d "public/uploads" ]; then
    UPLOAD_COUNT=$(find public/uploads -type f | wc -l)
    echo -e "${GREEN}✅ 上传目录存在，包含 $UPLOAD_COUNT 个文件${NC}"
    
    # 显示最近的几个文件
    echo -e "${BLUE}最近上传的文件:${NC}"
    find public/uploads -type f -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" | head -5 | while read file; do
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "unknown")
        echo -e "${YELLOW}  - $file (${SIZE} bytes)${NC}"
    done
else
    echo -e "${RED}❌ 上传目录不存在${NC}"
    mkdir -p public/uploads
    echo -e "${YELLOW}⚠️  已创建上传目录${NC}"
fi

# 3. 检查Docker容器状态
echo -e "${BLUE}🐳 检查Docker容器状态...${NC}"
if command -v docker &> /dev/null; then
    if docker ps | grep -q "lgjh"; then
        CONTAINER_NAME=$(docker ps --format "table {{.Names}}" | grep lgjh | head -1)
        echo -e "${GREEN}✅ 发现运行中的容器: $CONTAINER_NAME${NC}"
        
        # 检查容器内的上传目录
        echo -e "${BLUE}检查容器内的上传目录...${NC}"
        docker exec "$CONTAINER_NAME" ls -la /app/public/uploads/ | head -10
        
        # 检查容器内的权限
        echo -e "${BLUE}检查容器内的权限...${NC}"
        docker exec "$CONTAINER_NAME" ls -ld /app/public/uploads/
        
    else
        echo -e "${YELLOW}⚠️  没有发现运行中的LGJH容器${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker未安装或不可用${NC}"
fi

# 4. 检查Nginx配置
echo -e "${BLUE}🌐 检查Nginx配置...${NC}"
NGINX_CONFIG="deployment/configs/nginx.conf"
if [ -f "$NGINX_CONFIG" ]; then
    echo -e "${GREEN}✅ Nginx配置文件存在${NC}"
    
    # 检查uploads路径配置
    if grep -q "location /uploads/" "$NGINX_CONFIG"; then
        echo -e "${GREEN}✅ 包含uploads路径配置${NC}"
        echo -e "${BLUE}uploads配置详情:${NC}"
        grep -A 10 "location /uploads/" "$NGINX_CONFIG" | head -15
    else
        echo -e "${RED}❌ 缺少uploads路径配置${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nginx配置文件不存在${NC}"
    if [ -f "deployment/configs/nginx.conf.example" ]; then
        echo -e "${BLUE}发现示例配置文件${NC}"
    fi
fi

# 5. 检查端口和网络
echo -e "${BLUE}🌐 检查网络连接...${NC}"
if command -v curl &> /dev/null; then
    # 测试本地连接
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/health | grep -q "200"; then
        echo -e "${GREEN}✅ 本地应用响应正常${NC}"
    else
        echo -e "${YELLOW}⚠️  本地应用无响应${NC}"
    fi
    
    # 测试生产域名
    if curl -s -o /dev/null -w "%{http_code}" https://lingangjh.com/api/health | grep -q "200"; then
        echo -e "${GREEN}✅ 生产域名响应正常${NC}"
    else
        echo -e "${YELLOW}⚠️  生产域名无响应或异常${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl未安装，跳过网络测试${NC}"
fi

# 6. 检查日志文件
echo -e "${BLUE}📋 检查日志文件...${NC}"
if [ -d "logs" ]; then
    echo -e "${GREEN}✅ 日志目录存在${NC}"
    find logs -name "*.log" -type f | head -3 | while read logfile; do
        echo -e "${BLUE}最近的日志 ($logfile):${NC}"
        tail -5 "$logfile" 2>/dev/null || echo -e "${YELLOW}无法读取日志文件${NC}"
    done
else
    echo -e "${YELLOW}⚠️  日志目录不存在${NC}"
fi

# 7. 检查环境变量
echo -e "${BLUE}🔧 检查环境配置...${NC}"
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ 生产环境配置文件存在${NC}"
    echo -e "${BLUE}关键配置项:${NC}"
    grep -E "^(NEXTAUTH_URL|NODE_ENV|DATABASE_URL)" .env.production 2>/dev/null || echo -e "${YELLOW}未找到关键配置项${NC}"
else
    echo -e "${YELLOW}⚠️  生产环境配置文件不存在${NC}"
fi

# 8. 生成诊断报告
echo ""
echo -e "${BLUE}📊 诊断报告总结${NC}"
echo -e "${BLUE}==================${NC}"

# 检查关键问题
ISSUES=0

if [ ! -d "public/uploads" ]; then
    echo -e "${RED}❌ 上传目录缺失${NC}"
    ((ISSUES++))
fi

if [ ! -f "$NGINX_CONFIG" ]; then
    echo -e "${RED}❌ Nginx配置文件缺失${NC}"
    ((ISSUES++))
fi

if ! docker ps | grep -q "lgjh"; then
    echo -e "${RED}❌ 应用容器未运行${NC}"
    ((ISSUES++))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ 未发现明显的配置问题${NC}"
    echo -e "${BLUE}建议检查:${NC}"
    echo -e "${YELLOW}1. 域名DNS解析${NC}"
    echo -e "${YELLOW}2. 防火墙和安全组设置${NC}"
    echo -e "${YELLOW}3. SSL证书配置${NC}"
    echo -e "${YELLOW}4. 负载均衡器配置${NC}"
else
    echo -e "${RED}发现 $ISSUES 个问题需要解决${NC}"
fi

echo ""
echo -e "${BLUE}🔧 建议的修复步骤:${NC}"
echo -e "${YELLOW}1. 运行修复脚本: ./deployment/scripts/fix-image-upload-production.sh${NC}"
echo -e "${YELLOW}2. 检查服务日志: docker-compose logs${NC}"
echo -e "${YELLOW}3. 测试图片上传功能${NC}"
echo -e "${YELLOW}4. 验证图片访问链接${NC}"
