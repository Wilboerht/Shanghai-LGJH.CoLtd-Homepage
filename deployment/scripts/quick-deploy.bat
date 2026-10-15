@echo off
chcp 65001 >nul

echo 🚀 LGJH-Homepage 快速部署
echo ==========================

REM 检查Node.js
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ 请先安装 Node.js 18.0+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ 请先安装 npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js 版本: %%i
for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm 版本: %%i

REM 安装依赖
echo 📦 安装依赖...
call npm install

REM 生成Prisma客户端
echo 🔧 生成Prisma客户端...
call npx prisma generate

REM 构建项目
echo 🏗️  构建项目...
call npm run build

REM 检查PM2
pm2 --version >nul 2>&1
if %errorLevel% neq 0 (
    echo 📥 安装PM2...
    call npm install -g pm2
    call npm install -g pm2-windows-service
)

REM 创建PM2配置
echo 📝 创建PM2配置...
(
echo module.exports = {
echo   apps: [{
echo     name: 'lgjh-homepage',
echo     script: 'npm',
echo     args: 'start',
echo     instances: 1,
echo     exec_mode: 'fork',
echo     env: {
echo       NODE_ENV: 'production',
echo       PORT: 3000
echo     },
echo     log_file: './logs/combined.log',
echo     out_file: './logs/out.log',
echo     error_file: './logs/error.log',
echo     max_memory_restart: '1G',
echo     restart_delay: 4000
echo   }]
echo };
) > ecosystem.config.js

REM 创建日志目录
if not exist "logs" mkdir logs

REM 停止现有服务
pm2 delete lgjh-homepage 2>nul

REM 启动服务
echo 🚀 启动服务...
pm2 start ecosystem.config.js

REM 保存配置
pm2 save

echo.
echo 🎉 部署完成！
echo ====================
echo 🌐 访问地址: http://localhost:3000
echo 📊 查看状态: pm2 status
echo 📋 查看日志: pm2 logs lgjh-homepage
echo 🔄 重启服务: pm2 restart lgjh-homepage
echo ⏹️  停止服务: pm2 stop lgjh-homepage

pause
