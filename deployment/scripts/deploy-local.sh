#!/bin/bash

# LGJH-Homepage 本地服务器部署脚本
# 适用于 Linux/macOS 系统

set -e  # 遇到错误立即退出

echo "🚀 开始部署 LGJH-Homepage 到本地服务器..."
echo "=================================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="lgjh-homepage"
DEPLOY_DIR="/opt/${PROJECT_NAME}"
SERVICE_NAME="${PROJECT_NAME}"
PORT=3100
USER="www-data"  # 运行服务的用户

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ 请以root权限运行此脚本${NC}"
    echo "使用: sudo ./deploy-local.sh"
    exit 1
fi

echo -e "${BLUE}📋 部署配置:${NC}"
echo "  项目名称: ${PROJECT_NAME}"
echo "  部署目录: ${DEPLOY_DIR}"
echo "  运行端口: ${PORT}"
echo "  运行用户: ${USER}"
echo ""

# 1. 检查系统依赖
echo -e "${BLUE}🔍 检查系统依赖...${NC}"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js 18.0 或更高版本"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
echo -e "${GREEN}✅ Node.js 版本: v${NODE_VERSION}${NC}"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm 版本: ${NPM_VERSION}${NC}"

# 检查pm2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 未安装，正在安装...${NC}"
    npm install -g pm2
fi

PM2_VERSION=$(pm2 --version)
echo -e "${GREEN}✅ PM2 版本: ${PM2_VERSION}${NC}"

# 2. 创建部署目录
echo -e "${BLUE}📁 创建部署目录...${NC}"
mkdir -p ${DEPLOY_DIR}
mkdir -p ${DEPLOY_DIR}/logs

# 3. 复制项目文件
echo -e "${BLUE}📦 复制项目文件...${NC}"
rsync -av --exclude='node_modules' --exclude='.git' --exclude='.next' ./ ${DEPLOY_DIR}/

# 4. 设置权限
echo -e "${BLUE}🔐 设置文件权限...${NC}"
chown -R ${USER}:${USER} ${DEPLOY_DIR}
chmod -R 755 ${DEPLOY_DIR}

# 5. 安装依赖
echo -e "${BLUE}📥 安装项目依赖...${NC}"
cd ${DEPLOY_DIR}
sudo -u ${USER} npm ci --production

# 6. 生成Prisma客户端
echo -e "${BLUE}🔧 生成Prisma客户端...${NC}"
sudo -u ${USER} npx prisma generate

# 7. 构建项目
echo -e "${BLUE}🏗️  构建项目...${NC}"
sudo -u ${USER} npm run build

# 8. 创建生产环境配置
echo -e "${BLUE}⚙️  创建生产环境配置...${NC}"
cat > ${DEPLOY_DIR}/.env.production << EOF
# 生产环境配置
NODE_ENV=production
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:${PORT}"
NEXTAUTH_SECRET="lgjh-cms-secret-key-production-$(openssl rand -hex 32)"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token-here"
EOF

chown ${USER}:${USER} ${DEPLOY_DIR}/.env.production

# 9. 创建PM2配置文件
echo -e "${BLUE}📝 创建PM2配置文件...${NC}"
cat > ${DEPLOY_DIR}/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${SERVICE_NAME}',
    script: 'npm',
    args: 'start',
    cwd: '${DEPLOY_DIR}',
    instances: 1,
    exec_mode: 'fork',
    user: '${USER}',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    },
    log_file: '${DEPLOY_DIR}/logs/combined.log',
    out_file: '${DEPLOY_DIR}/logs/out.log',
    error_file: '${DEPLOY_DIR}/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
EOF

chown ${USER}:${USER} ${DEPLOY_DIR}/ecosystem.config.js

# 10. 启动服务
echo -e "${BLUE}🚀 启动服务...${NC}"
cd ${DEPLOY_DIR}

# 停止现有服务（如果存在）
sudo -u ${USER} pm2 delete ${SERVICE_NAME} 2>/dev/null || true

# 启动新服务
sudo -u ${USER} pm2 start ecosystem.config.js

# 保存PM2配置
sudo -u ${USER} pm2 save

# 11. 设置开机自启
echo -e "${BLUE}⚡ 设置开机自启...${NC}"
sudo -u ${USER} pm2 startup systemd -u ${USER} --hp /home/${USER}

# 12. 创建Nginx配置（可选）
echo -e "${BLUE}🌐 创建Nginx配置...${NC}"
if command -v nginx &> /dev/null; then
    cat > /etc/nginx/sites-available/${PROJECT_NAME} << EOF
server {
    listen 80;
    server_name localhost your-domain.com;

    location / {
        proxy_pass http://localhost:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # 启用站点
    ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/
    
    # 测试Nginx配置
    nginx -t && systemctl reload nginx
    echo -e "${GREEN}✅ Nginx配置已创建并重载${NC}"
else
    echo -e "${YELLOW}⚠️  Nginx未安装，跳过反向代理配置${NC}"
fi

# 13. 显示部署结果
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "=================================================="
echo -e "${BLUE}📊 服务状态:${NC}"
sudo -u ${USER} pm2 status

echo ""
echo -e "${BLUE}🌐 访问地址:${NC}"
echo "  本地访问: http://localhost:${PORT}"
echo "  局域网访问: http://$(hostname -I | awk '{print $1}'):${PORT}"

echo ""
echo -e "${BLUE}📋 管理命令:${NC}"
echo "  查看状态: sudo -u ${USER} pm2 status"
echo "  查看日志: sudo -u ${USER} pm2 logs ${SERVICE_NAME}"
echo "  重启服务: sudo -u ${USER} pm2 restart ${SERVICE_NAME}"
echo "  停止服务: sudo -u ${USER} pm2 stop ${SERVICE_NAME}"
echo "  删除服务: sudo -u ${USER} pm2 delete ${SERVICE_NAME}"

echo ""
echo -e "${BLUE}📁 重要文件位置:${NC}"
echo "  项目目录: ${DEPLOY_DIR}"
echo "  日志文件: ${DEPLOY_DIR}/logs/"
echo "  数据库文件: ${DEPLOY_DIR}/prisma/dev.db"
echo "  配置文件: ${DEPLOY_DIR}/.env.production"

echo ""
echo -e "${GREEN}✅ 部署成功完成！${NC}"
