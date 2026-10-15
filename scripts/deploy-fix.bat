@echo off
REM 部署修复脚本 - Windows版本
REM 使用方法: scripts\deploy-fix.bat

echo 🚀 开始部署修复流程...

REM 1. 设置环境变量
set PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma/
set PRISMA_CLI_BINARY_TARGETS=native

REM 2. 清理缓存
echo 🧹 清理缓存...
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma
if exist node_modules\@prisma\client rmdir /s /q node_modules\@prisma\client
npm cache clean --force

REM 3. 重新安装依赖
echo 📦 重新安装依赖...
npm install

REM 4. 尝试生成Prisma客户端
echo 🔧 生成Prisma客户端...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Prisma生成失败，尝试离线模式...
    
    REM 5. 离线模式设置
    set PRISMA_SKIP_POSTINSTALL_GENERATE=true
    set PRISMA_GENERATE_SKIP_AUTOINSTALL=true
    
    REM 创建目录
    if not exist node_modules\.prisma\client mkdir node_modules\.prisma\client
    
    REM 重新尝试
    npx prisma generate --skip-generate
)

REM 6. 数据库迁移
echo 🗄️ 执行数据库迁移...
npx prisma migrate deploy

REM 7. 构建项目
echo 🏗️ 构建项目...
npm run build

echo ✅ 部署修复完成！
pause
