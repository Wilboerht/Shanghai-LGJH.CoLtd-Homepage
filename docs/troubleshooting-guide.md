# 故障排除手册

## 概述

本文档提供了临港景鸿项目常见问题的诊断和解决方案，帮助快速定位和修复问题。

## 快速诊断清单

### 🔍 系统状态检查

```bash
# 1. 检查应用状态
curl -f http://localhost:3000/api/health || echo "应用无响应"

# 2. 检查数据库连接
npx prisma db pull || echo "数据库连接失败"

# 3. 检查磁盘空间
df -h | grep -E "(/$|/var)" || echo "磁盘空间检查失败"

# 4. 检查内存使用
free -h || echo "内存检查失败"

# 5. 检查进程状态
pm2 status || docker-compose ps || echo "进程状态检查失败"
```

## 常见问题分类

### 🚀 应用启动问题

#### 问题1: 应用无法启动

**症状**: `npm start` 或 `pm2 start` 失败

**诊断步骤**:

```bash
# 检查端口占用
sudo netstat -tulpn | grep :3000

# 检查环境变量
cat .env.production | grep -v "^#"

# 检查依赖安装
npm list --depth=0

# 检查构建状态
ls -la .next/
```

**解决方案**:

```bash
# 1. 释放端口
sudo kill -9 $(sudo lsof -t -i:3000)

# 2. 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 3. 重新构建
npm run build

# 4. 检查环境变量配置
cp .env.example .env.production
# 编辑 .env.production
```

#### 问题2: 构建失败

**症状**: `npm run build` 报错

**常见错误**:

```bash
# TypeScript错误
Error: Type 'string | undefined' is not assignable to type 'string'

# 模块未找到
Error: Module not found: Can't resolve '@/components/...'

# 内存不足
Error: JavaScript heap out of memory
```

**解决方案**:

```bash
# TypeScript错误 - 检查类型定义
npx tsc --noEmit

# 模块路径错误 - 检查tsconfig.json
cat tsconfig.json | grep -A 5 "paths"

# 内存不足 - 增加内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 🗄️ 数据库问题

#### 问题1: 数据库连接失败

**症状**: `PrismaClientInitializationError`

**诊断步骤**:

```bash
# 检查数据库服务状态
sudo systemctl status postgresql

# 测试数据库连接
psql -h localhost -U postgres -d lgjh_prod -c "SELECT 1;"

# 检查连接字符串
echo $DATABASE_URL
```

**解决方案**:

```bash
# 1. 启动数据库服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 2. 检查用户权限
sudo -u postgres psql
\du  # 查看用户列表
GRANT ALL PRIVILEGES ON DATABASE lgjh_prod TO lgjh_user;

# 3. 重置连接
npx prisma generate
npx prisma db pull
```

#### 问题2: 数据库迁移失败

**症状**: `Migration failed` 错误

**诊断步骤**:

```bash
# 检查迁移状态
npx prisma migrate status

# 查看迁移历史
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma
```

**解决方案**:

```bash
# 1. 重置迁移 (开发环境)
npx prisma migrate reset

# 2. 手动应用迁移 (生产环境)
npx prisma migrate resolve --applied "20231201000000_migration_name"
npx prisma migrate deploy

# 3. 修复数据不一致
npx prisma db push --force-reset  # 谨慎使用
```

### 📁 文件上传问题

#### 问题1: 文件上传失败

**症状**: 上传接口返回500错误

**诊断步骤**:

```bash
# 检查上传目录权限
ls -la public/uploads/

# 检查磁盘空间
df -h public/uploads/

# 检查文件大小限制
grep -r "MAX_FILE_SIZE" src/
```

**解决方案**:

```bash
# 1. 修复目录权限
sudo chown -R $USER:$USER public/uploads/
sudo chmod -R 755 public/uploads/

# 2. 创建缺失目录
mkdir -p public/uploads/{admin,products,solutions,services}

# 3. 清理临时文件
find public/uploads/ -name "*.tmp" -delete
find public/uploads/ -type f -mtime +7 -delete  # 删除7天前的文件
```

#### 问题2: 图片无法显示

**症状**: 图片链接返回404

**诊断步骤**:

```bash
# 检查图片文件是否存在
ls -la public/uploads/admin/

# 检查图片访问路由
curl -I http://localhost:3000/uploads/admin/test.jpg

# 检查Nginx配置 (生产环境)
sudo nginx -t
```

**解决方案**:

```bash
# 1. 检查文件路径
find public/uploads/ -name "*.jpg" -o -name "*.png" | head -5

# 2. 修复Nginx配置
# 编辑 /etc/nginx/sites-available/lgjh
location /uploads/ {
    alias /var/www/lgjh/public/uploads/;
    expires 1y;
    add_header Cache-Control "public";
}

# 3. 重载Nginx
sudo nginx -s reload
```

### 🔐 认证问题

#### 问题1: 管理员无法登录

**症状**: 登录表单提交后返回错误

**诊断步骤**:

```bash
# 检查管理员账户
npx prisma studio
# 或者
psql -h localhost -U postgres -d lgjh_prod -c "SELECT * FROM users WHERE \"isAdmin\" = true;"

# 检查NextAuth配置
grep -r "NEXTAUTH" .env.production
```

**解决方案**:

```bash
# 1. 重置管理员密码
node -e "
const bcrypt = require('bcryptjs');
const password = 'new_password';
const hash = bcrypt.hashSync(password, 12);
console.log('新密码哈希:', hash);
"

# 2. 更新数据库
psql -h localhost -U postgres -d lgjh_prod -c "
UPDATE users SET password = '新密码哈希' WHERE email = 'admin@lgjh.com';
"

# 3. 检查会话配置
# 确保 NEXTAUTH_SECRET 已设置
echo $NEXTAUTH_SECRET
```

#### 问题2: 会话过期问题

**症状**: 频繁要求重新登录

**解决方案**:

```bash
# 1. 检查会话配置
# 在 src/lib/auth.ts 中调整会话时间
session: {
  maxAge: 30 * 24 * 60 * 60, // 30天
}

# 2. 清理旧会话
# 如果使用数据库存储会话
DELETE FROM sessions WHERE expires < NOW();
```

### 🌐 网络和性能问题

#### 问题1: 页面加载缓慢

**症状**: 页面响应时间超过5秒

**诊断步骤**:

```bash
# 检查数据库查询性能
tail -f /var/log/postgresql/postgresql-*.log | grep "slow query"

# 检查系统资源
htop
iotop

# 检查网络延迟
ping -c 4 your-domain.com
```

**解决方案**:

```bash
# 1. 优化数据库查询
# 添加索引
psql -h localhost -U postgres -d lgjh_prod -c "
CREATE INDEX CONCURRENTLY idx_products_category ON products(category);
CREATE INDEX CONCURRENTLY idx_products_status ON products(status);
"

# 2. 启用缓存
# 在 next.config.ts 中配置
experimental: {
  serverComponentsExternalPackages: ['@prisma/client'],
}

# 3. 优化图片
# 使用 Next.js Image 组件
# 启用图片压缩
```

#### 问题2: API响应错误

**症状**: API返回500或超时

**诊断步骤**:

```bash
# 检查API日志
pm2 logs lgjh-website --lines 50

# 测试API端点
curl -X GET "http://localhost:3000/api/products" -H "Accept: application/json"

# 检查数据库连接池
psql -h localhost -U postgres -d lgjh_prod -c "SELECT * FROM pg_stat_activity;"
```

**解决方案**:

```bash
# 1. 重启应用
pm2 restart lgjh-website

# 2. 检查错误日志
tail -f logs/error.log

# 3. 增加超时时间
# 在 API 路由中设置更长的超时
export const maxDuration = 30; // 30秒
```

### 🐳 Docker部署问题

#### 问题1: 容器启动失败

**症状**: `docker-compose up` 失败

**诊断步骤**:

```bash
# 检查容器状态
docker-compose ps

# 查看容器日志
docker-compose logs app
docker-compose logs db

# 检查镜像构建
docker images | grep lgjh
```

**解决方案**:

```bash
# 1. 重新构建镜像
docker-compose build --no-cache

# 2. 清理旧容器
docker-compose down -v
docker system prune -f

# 3. 检查环境变量
docker-compose config
```

#### 问题2: 数据库连接问题 (Docker)

**症状**: 应用无法连接到数据库容器

**解决方案**:

```bash
# 1. 检查网络连接
docker-compose exec app ping db

# 2. 检查数据库容器
docker-compose exec db psql -U postgres -d lgjh_prod -c "SELECT 1;"

# 3. 修复连接字符串
# 确保使用容器名称作为主机名
DATABASE_URL="postgresql://user:password@db:5432/lgjh_prod"
```

## 监控和预防

### 📊 性能监控脚本

```bash
#!/bin/bash
# monitor.sh - 系统监控脚本

echo "=== 系统监控报告 $(date) ==="

# 1. 应用状态
echo "1. 应用状态:"
curl -s http://localhost:3000/api/health | jq '.' || echo "应用无响应"

# 2. 系统资源
echo "2. 系统资源:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "内存: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
echo "磁盘: $(df -h / | awk 'NR==2{print $5}')"

# 3. 数据库状态
echo "3. 数据库状态:"
psql -h localhost -U postgres -d lgjh_prod -c "SELECT COUNT(*) as active_connections FROM pg_stat_activity;" 2>/dev/null || echo "数据库连接失败"

# 4. 错误日志
echo "4. 最近错误:"
tail -5 /var/log/lgjh/error.log 2>/dev/null || echo "无错误日志"

echo "=== 监控完成 ==="
```

### 🔧 自动修复脚本

```bash
#!/bin/bash
# auto-fix.sh - 自动修复常见问题

echo "开始自动修复..."

# 1. 检查并修复文件权限
if [ ! -w "public/uploads" ]; then
    echo "修复上传目录权限..."
    chmod -R 755 public/uploads/
fi

# 2. 清理临时文件
echo "清理临时文件..."
find public/uploads/ -name "*.tmp" -delete
find /tmp -name "next-*" -mtime +1 -delete

# 3. 重启应用 (如果无响应)
if ! curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "应用无响应，重启中..."
    pm2 restart lgjh-website
    sleep 10
fi

# 4. 检查数据库连接
if ! npx prisma db pull >/dev/null 2>&1; then
    echo "数据库连接失败，尝试重新连接..."
    npx prisma generate
fi

echo "自动修复完成"
```

### 📋 日常维护清单

#### 每日检查

- [ ] 应用状态正常
- [ ] 数据库连接正常
- [ ] 磁盘空间充足 (>20%)
- [ ] 内存使用正常 (<80%)
- [ ] 错误日志无异常

#### 每周维护

- [ ] 备份数据库
- [ ] 清理上传文件
- [ ] 更新系统补丁
- [ ] 检查SSL证书有效期
- [ ] 性能监控报告

#### 每月维护

- [ ] 更新依赖包
- [ ] 数据库性能优化
- [ ] 安全扫描
- [ ] 备份策略验证
- [ ] 文档更新

---

**创建时间**: 2025-09-23
**维护者**: 运维团队
**版本**: 1.0.0
