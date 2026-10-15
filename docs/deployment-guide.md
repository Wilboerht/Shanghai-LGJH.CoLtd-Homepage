# 部署运维指南

## 概述

本文档详细说明了临港景鸿项目的部署流程、环境配置和日常运维操作。

## 环境要求

### 系统要求

- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **内存**: 最低4GB，推荐8GB+
- **存储**: 最低50GB，推荐100GB+
- **网络**: 稳定的互联网连接

### 软件依赖

- **Node.js**: 18.17.0+
- **npm**: 9.0.0+
- **PostgreSQL**: 14.0+
- **Docker**: 20.10+ (可选)
- **Nginx**: 1.18+ (生产环境)

## 环境配置

### 1. 环境变量配置

#### 开发环境 (.env.local)

```bash
# 数据库配置
DATABASE_URL="postgresql://postgres:password@localhost:5432/lgjh_dev"

# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-development-secret-key"

# 管理员账户
ADMIN_EMAIL="admin@lgjh.com"
ADMIN_PASSWORD="admin123456"

# 开发配置
NODE_ENV="development"
LOG_LEVEL="debug"
```

#### 生产环境 (.env.production)

```bash
# 数据库配置
DATABASE_URL="postgresql://username:password@db-host:5432/lgjh_prod"

# NextAuth配置
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret-key-very-long-and-secure"

# 管理员账户
ADMIN_EMAIL="admin@lgjh.com"
ADMIN_PASSWORD="secure-production-password"

# 生产配置
NODE_ENV="production"
LOG_LEVEL="info"

# 可选服务
REDIS_URL="redis://redis-host:6379"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@lgjh.com"
SMTP_PASS="email-password"

# 监控配置
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
SENTRY_DSN="https://your-sentry-dsn"
```

### 2. 数据库配置

#### PostgreSQL安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

#### 数据库初始化

```bash
# 创建数据库用户
sudo -u postgres createuser --interactive lgjh_user

# 创建数据库
sudo -u postgres createdb lgjh_prod -O lgjh_user

# 设置密码
sudo -u postgres psql
ALTER USER lgjh_user PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE lgjh_prod TO lgjh_user;
\q
```

## 部署方式

### 方式一：传统部署

#### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### 2. 项目部署

```bash
# 克隆项目
git clone <repository-url> /var/www/lgjh
cd /var/www/lgjh

# 安装依赖
npm ci --only=production

# 配置环境变量
cp .env.example .env.production
# 编辑 .env.production 文件

# 数据库迁移
npx prisma migrate deploy
npx prisma generate
npx prisma db seed

# 构建项目
npm run build

# 启动服务
npm start
```

#### 3. 进程管理 (PM2)

```bash
# 安装PM2
npm install -g pm2

# 创建PM2配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'lgjh-website',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/lgjh',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: '/var/log/lgjh/error.log',
    out_file: '/var/log/lgjh/out.log',
    log_file: '/var/log/lgjh/combined.log',
    time: true
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 方式二：Docker部署

#### 1. Docker配置

```dockerfile
# Dockerfile (已存在)
FROM node:18-alpine AS base
# ... (使用现有的Dockerfile)
```

#### 2. Docker Compose部署

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://lgjh_user:password@db:5432/lgjh_prod
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=your-secret-key
    depends_on:
      - db
      - redis
    volumes:
      - ./public/uploads:/app/public/uploads
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=lgjh_prod
      - POSTGRES_USER=lgjh_user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./public/uploads:/var/www/uploads
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### 3. 部署命令

```bash
# 构建并启动
docker-compose -f docker-compose.prod.yml up -d

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 停止服务
docker-compose -f docker-compose.prod.yml down
```

## Nginx配置

### 1. 基础配置

```nginx
# /etc/nginx/sites-available/lgjh
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL配置
    ssl_certificate /etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # 文件上传大小限制
    client_max_body_size 20M;

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 上传文件访问
    location /uploads/ {
        alias /var/www/lgjh/public/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # 主应用代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/lgjh /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

## SSL证书配置

### 1. Let's Encrypt (免费)

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. 商业证书

```bash
# 创建证书目录
sudo mkdir -p /etc/nginx/ssl

# 上传证书文件
sudo cp certificate.crt /etc/nginx/ssl/
sudo cp private.key /etc/nginx/ssl/
sudo chmod 600 /etc/nginx/ssl/private.key
```

## 监控和日志

### 1. 应用日志

```bash
# PM2日志
pm2 logs lgjh-website

# Docker日志
docker-compose logs -f app

# 系统日志
sudo journalctl -u nginx -f
```

### 2. 系统监控

```bash
# 系统资源监控
htop
df -h
free -h

# 数据库监控
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# 网络监控
netstat -tulpn | grep :3000
```

### 3. 备份策略

```bash
# 数据库备份脚本
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U lgjh_user lgjh_prod > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# 文件备份
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/lgjh/public/uploads

# 清理旧备份 (保留7天)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## 故障排除

### 1. 常见问题

#### 应用无法启动

```bash
# 检查端口占用
sudo netstat -tulpn | grep :3000

# 检查环境变量
cat .env.production

# 检查数据库连接
npx prisma db pull
```

#### 数据库连接失败

```bash
# 检查数据库状态
sudo systemctl status postgresql

# 测试连接
psql -h localhost -U lgjh_user -d lgjh_prod

# 检查防火墙
sudo ufw status
```

#### 文件上传失败

```bash
# 检查目录权限
ls -la public/uploads/

# 修复权限
sudo chown -R www-data:www-data public/uploads/
sudo chmod -R 755 public/uploads/
```

### 2. 性能优化

#### 数据库优化

```sql
-- 查看慢查询
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- 重建索引
REINDEX DATABASE lgjh_prod;

-- 更新统计信息
ANALYZE;
```

#### 应用优化

```bash
# 清理npm缓存
npm cache clean --force

# 重新构建
npm run build

# 重启应用
pm2 restart lgjh-website
```

---

**创建时间**: 2025-09-23
**维护者**: 运维团队
**版本**: 1.0.0
