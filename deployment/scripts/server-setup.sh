#!/bin/bash

# LGJH Homepage Linux 服务器一键安装脚本
# 适用于 Ubuntu/Debian/CentOS 系统

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐧 LGJH Homepage Linux 服务器部署${NC}"
echo "=================================="

# 检测操作系统
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo -e "${RED}❌ 无法检测操作系统${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 检测到系统: $OS $VER${NC}"

# 检查是否为root用户
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  检测到root用户，建议使用普通用户运行此脚本${NC}"
    read -p "是否继续? (y/N): " continue_as_root
    if [[ ! $continue_as_root =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 更新系统
echo -e "${BLUE}📦 更新系统包...${NC}"
if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl wget git unzip software-properties-common
elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
    sudo yum update -y
    sudo yum install -y curl wget git unzip
else
    echo -e "${YELLOW}⚠️  未识别的系统，请手动安装必要工具${NC}"
fi

# 检查并安装 Docker
echo -e "${BLUE}🐳 检查 Docker 安装...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📥 安装 Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    
    # 启动 Docker 服务
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # 添加用户到 docker 组
    sudo usermod -aG docker $USER
    
    echo -e "${GREEN}✅ Docker 安装完成${NC}"
else
    echo -e "${GREEN}✅ Docker 已安装: $(docker --version)${NC}"
fi

# 检查并安装 Docker Compose
echo -e "${BLUE}🔧 检查 Docker Compose 安装...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}📥 安装 Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose 安装完成${NC}"
else
    echo -e "${GREEN}✅ Docker Compose 已安装: $(docker-compose --version)${NC}"
fi

# 创建项目目录
PROJECT_DIR="/opt/lgjh-homepage"
echo -e "${BLUE}📁 创建项目目录: $PROJECT_DIR${NC}"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# 询问部署方式
echo ""
echo "请选择部署方式:"
echo "1) 从 Git 仓库克隆 (推荐)"
echo "2) 手动上传项目文件"
read -p "请输入选择 (1 或 2): " deploy_method

case $deploy_method in
    1)
        read -p "请输入 Git 仓库地址: " git_repo
        if [ -z "$git_repo" ]; then
            echo -e "${RED}❌ Git 仓库地址不能为空${NC}"
            exit 1
        fi
        
        echo -e "${BLUE}📥 克隆项目...${NC}"
        git clone $git_repo $PROJECT_DIR
        ;;
    2)
        echo -e "${YELLOW}📋 请手动上传项目文件到: $PROJECT_DIR${NC}"
        echo "可以使用 scp 命令:"
        echo "scp -r ./project-files user@server:$PROJECT_DIR"
        read -p "文件上传完成后按回车继续..."
        ;;
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

# 进入项目目录
cd $PROJECT_DIR

# 检查项目文件
echo -e "${BLUE}🔍 检查项目文件...${NC}"
required_files=("package.json" "Dockerfile" "docker-compose.yml" "prisma/schema.prisma")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ 缺少必要文件: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✅ 项目文件检查通过${NC}"

# 配置环境变量
echo -e "${BLUE}⚙️  配置环境变量...${NC}"
if [ ! -f ".env.production" ]; then
    if [ -f ".env.production.example" ]; then
        cp .env.production.example .env.production
        echo -e "${YELLOW}⚠️  已创建 .env.production 文件，请编辑配置${NC}"
    else
        echo -e "${YELLOW}⚠️  创建基本的 .env.production 文件${NC}"
        cat > .env.production << EOF
NODE_ENV=production
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3100"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
PORT=3100
EOF
    fi
    
    echo -e "${BLUE}📝 请编辑环境变量文件:${NC}"
    echo "nano .env.production"
    echo ""
    echo -e "${YELLOW}重要: 请修改以下配置:${NC}"
    echo "- NEXTAUTH_URL: 改为您的域名"
    echo "- NEXTAUTH_SECRET: 已自动生成安全密钥"
    echo ""
    read -p "配置完成后按回车继续..."
fi

# 配置 Nginx (如果需要)
if [ -f "nginx.conf.example" ] && [ ! -f "nginx.conf" ]; then
    echo -e "${BLUE}🌐 配置 Nginx...${NC}"
    cp nginx.conf.example nginx.conf
    echo -e "${YELLOW}⚠️  请编辑 nginx.conf 文件并配置您的域名${NC}"
    read -p "是否现在编辑 nginx.conf? (y/N): " edit_nginx
    if [[ $edit_nginx =~ ^[Yy]$ ]]; then
        nano nginx.conf
    fi
fi

# 创建必要目录
echo -e "${BLUE}📂 创建必要目录...${NC}"
mkdir -p logs ssl public/uploads
chmod 755 logs public/uploads

# 配置防火墙
echo -e "${BLUE}🔒 配置防火墙...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
    echo -e "${GREEN}✅ UFW 防火墙配置完成${NC}"
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=22/tcp
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --permanent --add-port=443/tcp
    sudo firewall-cmd --reload
    echo -e "${GREEN}✅ Firewalld 防火墙配置完成${NC}"
else
    echo -e "${YELLOW}⚠️  请手动配置防火墙开放 22, 80, 443 端口${NC}"
fi

# 选择部署模式
echo ""
echo "请选择部署模式:"
echo "1) 简单模式 (仅应用)"
echo "2) 完整模式 (应用 + Redis + Nginx)"
read -p "请输入选择 (1 或 2): " deploy_mode

# 部署应用
echo -e "${BLUE}🚀 部署应用...${NC}"

# 如果需要重新登录以获取docker组权限
if ! docker ps &> /dev/null; then
    echo -e "${YELLOW}⚠️  需要重新登录以获取Docker权限${NC}"
    echo "请运行: newgrp docker"
    echo "然后继续部署: ./deploy-docker.sh"
    exit 0
fi

case $deploy_mode in
    1)
        echo -e "${BLUE}🚀 启动简单模式部署...${NC}"
        docker-compose -f docker-compose.simple.yml up -d --build
        ;;
    2)
        echo -e "${BLUE}🚀 启动完整模式部署...${NC}"
        if [ -f "docker-compose.production.yml" ]; then
            docker-compose -f docker-compose.production.yml up -d --build
        else
            echo -e "${YELLOW}⚠️  使用标准配置部署${NC}"
            docker-compose up -d --build --profile with-redis
        fi
        ;;
    *)
        echo -e "${YELLOW}⚠️  默认使用简单模式${NC}"
        docker-compose -f docker-compose.simple.yml up -d --build
        ;;
esac

# 等待服务启动
echo -e "${BLUE}⏳ 等待服务启动...${NC}"
sleep 15

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
    echo "查看日志: docker-compose logs app"
    exit 1
fi

# 显示部署结果
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "===================="

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "your-server-ip")

if [ "$deploy_mode" = "2" ]; then
    echo -e "${GREEN}🌐 访问地址:${NC}"
    echo "  HTTP:  http://$SERVER_IP"
    echo "  应用:  http://$SERVER_IP:3000"
else
    echo -e "${GREEN}🌐 访问地址: http://$SERVER_IP:3000${NC}"
fi

echo ""
echo -e "${BLUE}📋 管理命令:${NC}"
echo "  查看状态: docker-compose ps"
echo "  查看日志: docker-compose logs -f app"
echo "  重启服务: docker-compose restart app"
echo "  停止服务: docker-compose down"

echo ""
echo -e "${YELLOW}📝 后续步骤:${NC}"
echo "1. 配置域名解析指向服务器IP: $SERVER_IP"
echo "2. 配置SSL证书 (生产环境推荐)"
echo "3. 设置定期备份"
echo "4. 配置监控"

echo ""
echo -e "${GREEN}✅ 服务器部署完成！${NC}"
