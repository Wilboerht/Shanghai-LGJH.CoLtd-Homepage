#!/bin/bash

# LGJH Homepage 部署前检查脚本
# 检查所有必要的文件和配置是否就绪

set -e

echo "🔍 LGJH Homepage 部署前检查"
echo "=========================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查计数器
checks_passed=0
checks_total=0

# 检查函数
check_item() {
    local description="$1"
    local command="$2"
    local required="$3"  # true/false
    
    ((checks_total++))
    echo -n "检查 $description... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 通过${NC}"
        ((checks_passed++))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}❌ 失败 (必需)${NC}"
        else
            echo -e "${YELLOW}⚠️  跳过 (可选)${NC}"
            ((checks_passed++))
        fi
        return 1
    fi
}

echo -e "${BLUE}📋 系统环境检查${NC}"
echo "===================="

# 检查 Docker
check_item "Docker 安装" "command -v docker" true
if command -v docker >/dev/null 2>&1; then
    echo "   Docker 版本: $(docker --version)"
fi

# 检查 Docker Compose
check_item "Docker Compose 安装" "command -v docker-compose" true
if command -v docker-compose >/dev/null 2>&1; then
    echo "   Docker Compose 版本: $(docker-compose --version)"
fi

# 检查 Docker 服务状态
check_item "Docker 服务运行" "docker info" true

echo ""
echo -e "${BLUE}📁 项目文件检查${NC}"
echo "===================="

# 检查关键文件
check_item "Dockerfile" "test -f Dockerfile" true
check_item "package.json" "test -f package.json" true
check_item "next.config.ts" "test -f next.config.ts" true
check_item "prisma/schema.prisma" "test -f prisma/schema.prisma" true

# 检查配置文件
check_item ".dockerignore" "test -f .dockerignore" false
check_item "docker-compose.yml" "test -f docker-compose.yml" true
check_item "docker-compose.production.yml" "test -f docker-compose.production.yml" false

echo ""
echo -e "${BLUE}⚙️  配置文件检查${NC}"
echo "===================="

# 检查环境变量文件
check_item ".env.production" "test -f .env.production" false
if [ ! -f ".env.production" ]; then
    echo -e "   ${YELLOW}建议: 复制 .env.production.example 到 .env.production${NC}"
fi

check_item ".env.production.example" "test -f .env.production.example" true

# 检查 Nginx 配置
check_item "nginx.conf" "test -f nginx.conf" false
if [ ! -f "nginx.conf" ]; then
    echo -e "   ${YELLOW}建议: 复制 nginx.conf.example 到 nginx.conf${NC}"
fi

check_item "nginx.conf.example" "test -f nginx.conf.example" true

echo ""
echo -e "${BLUE}📂 目录结构检查${NC}"
echo "===================="

# 检查必要目录
check_item "prisma 目录" "test -d prisma" true
check_item "public 目录" "test -d public" true
check_item "src 目录" "test -d src" true

# 检查可选目录
check_item "logs 目录" "test -d logs" false
check_item "ssl 目录" "test -d ssl" false
check_item "public/uploads 目录" "test -d public/uploads" false

echo ""
echo -e "${BLUE}🔧 配置内容检查${NC}"
echo "===================="

# 检查 Next.js 配置
if [ -f "next.config.ts" ]; then
    check_item "Next.js standalone 输出配置" "grep -q \"output.*standalone\" next.config.ts" true
fi

# 检查 package.json 脚本
if [ -f "package.json" ]; then
    check_item "build 脚本" "grep -q '\"build\"' package.json" true
    check_item "start 脚本" "grep -q '\"start\"' package.json" true
fi

# 检查 Dockerfile 配置
if [ -f "Dockerfile" ]; then
    check_item "Dockerfile 多阶段构建" "grep -q \"FROM.*AS\" Dockerfile" true
    check_item "Dockerfile 健康检查端点" "grep -q \"server.js\" Dockerfile" true
fi

echo ""
echo -e "${BLUE}🗄️  数据库检查${NC}"
echo "===================="

# 检查数据库文件
check_item "SQLite 数据库文件" "test -f prisma/dev.db" false
if [ ! -f "prisma/dev.db" ]; then
    echo -e "   ${YELLOW}提示: 首次部署时会自动创建数据库${NC}"
fi

# 检查迁移文件
check_item "数据库迁移文件" "test -d prisma/migrations" true

echo ""
echo -e "${BLUE}📊 部署脚本检查${NC}"
echo "===================="

# 检查部署脚本
check_item "Docker 部署脚本 (Linux)" "test -f deploy-docker.sh" true
check_item "Docker 部署脚本 (Windows)" "test -f deploy-docker.bat" true
check_item "检查脚本" "test -f check-deployment.sh" true

# 检查脚本权限 (Linux/macOS)
if [ -f "deploy-docker.sh" ]; then
    check_item "部署脚本执行权限" "test -x deploy-docker.sh" false
    if [ ! -x "deploy-docker.sh" ]; then
        echo -e "   ${YELLOW}建议: 运行 chmod +x deploy-docker.sh${NC}"
    fi
fi

echo ""
echo -e "${BLUE}📋 总结报告${NC}"
echo "===================="

echo "检查项目总数: $checks_total"
echo "通过项目数量: $checks_passed"

if [ $checks_passed -eq $checks_total ]; then
    echo -e "${GREEN}🎉 所有检查项目都已通过！项目已准备好进行 Docker 部署。${NC}"
    echo ""
    echo -e "${GREEN}🚀 部署建议:${NC}"
    echo "1. 运行简单部署: docker-compose -f docker-compose.simple.yml up -d"
    echo "2. 运行完整部署: ./deploy-docker.sh"
    echo "3. 查看部署文档: cat DOCKER_DEPLOYMENT.md"
    exit 0
else
    failed=$((checks_total - checks_passed))
    echo -e "${YELLOW}⚠️  有 $failed 个检查项目需要注意。${NC}"
    echo ""
    echo -e "${YELLOW}📝 建议操作:${NC}"
    echo "1. 检查上述失败的必需项目"
    echo "2. 创建缺失的配置文件"
    echo "3. 重新运行此检查脚本"
    echo "4. 查看部署文档获取详细说明"
    exit 1
fi
