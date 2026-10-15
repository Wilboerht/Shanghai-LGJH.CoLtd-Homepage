@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM LGJH-Homepage Windows本地服务器部署脚本

echo 🚀 开始部署 LGJH-Homepage 到本地服务器...
echo ==================================================

REM 配置变量
set PROJECT_NAME=lgjh-homepage
set DEPLOY_DIR=C:\inetpub\%PROJECT_NAME%
set PORT=3100

echo 📋 部署配置:
echo   项目名称: %PROJECT_NAME%
echo   部署目录: %DEPLOY_DIR%
echo   运行端口: %PORT%
echo.

REM 1. 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ 请以管理员身份运行此脚本
    pause
    exit /b 1
)

REM 2. 检查Node.js
echo 🔍 检查系统依赖...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Node.js 未安装
    echo 请从 https://nodejs.org/ 下载并安装 Node.js 18.0 或更高版本
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

REM 3. 检查npm
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ npm 未安装
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm 版本: %NPM_VERSION%

REM 4. 检查并安装PM2
pm2 --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  PM2 未安装，正在安装...
    npm install -g pm2
    npm install -g pm2-windows-service
)

for /f "tokens=*" %%i in ('pm2 --version') do set PM2_VERSION=%%i
echo ✅ PM2 版本: %PM2_VERSION%

REM 5. 创建部署目录
echo 📁 创建部署目录...
if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"
if not exist "%DEPLOY_DIR%\logs" mkdir "%DEPLOY_DIR%\logs"

REM 6. 复制项目文件
echo 📦 复制项目文件...
robocopy . "%DEPLOY_DIR%" /E /XD node_modules .git .next /XF .gitignore *.log

REM 7. 安装依赖
echo 📥 安装项目依赖...
cd /d "%DEPLOY_DIR%"
call npm ci --production

REM 8. 生成Prisma客户端
echo 🔧 生成Prisma客户端...
call npx prisma generate

REM 9. 构建项目
echo 🏗️  构建项目...
call npm run build

REM 10. 创建生产环境配置
echo ⚙️  创建生产环境配置...
(
echo # 生产环境配置
echo NODE_ENV=production
echo DATABASE_URL="file:./prisma/dev.db"
echo NEXTAUTH_URL="http://localhost:%PORT%"
echo NEXTAUTH_SECRET="lgjh-cms-secret-key-production-windows"
echo BLOB_READ_WRITE_TOKEN="your-vercel-blob-token-here"
) > "%DEPLOY_DIR%\.env.production"

REM 11. 创建PM2配置文件
echo 📝 创建PM2配置文件...
(
echo module.exports = {
echo   apps: [{
echo     name: '%PROJECT_NAME%',
echo     script: 'npm',
echo     args: 'start',
echo     cwd: '%DEPLOY_DIR%',
echo     instances: 1,
echo     exec_mode: 'fork',
echo     env: {
echo       NODE_ENV: 'production',
echo       PORT: %PORT%
echo     },
echo     log_file: '%DEPLOY_DIR%/logs/combined.log',
echo     out_file: '%DEPLOY_DIR%/logs/out.log',
echo     error_file: '%DEPLOY_DIR%/logs/error.log',
echo     log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
echo     merge_logs: true,
echo     max_memory_restart: '1G',
echo     restart_delay: 4000,
echo     max_restarts: 10,
echo     min_uptime: '10s'
echo   }]
echo };
) > "%DEPLOY_DIR%\ecosystem.config.js"

REM 12. 启动服务
echo 🚀 启动服务...
cd /d "%DEPLOY_DIR%"

REM 停止现有服务（如果存在）
pm2 delete %PROJECT_NAME% 2>nul

REM 启动新服务
pm2 start ecosystem.config.js

REM 保存PM2配置
pm2 save

REM 13. 安装Windows服务
echo ⚡ 安装Windows服务...
pm2-service-install -n PM2

REM 14. 创建IIS配置（可选）
echo 🌐 检查IIS...
where iisreset >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ 检测到IIS，可以配置反向代理
    echo 请手动配置IIS反向代理到 http://localhost:%PORT%
) else (
    echo ⚠️  未检测到IIS
)

REM 15. 创建防火墙规则
echo 🔥 配置防火墙...
netsh advfirewall firewall add rule name="LGJH-Homepage" dir=in action=allow protocol=TCP localport=%PORT% >nul 2>&1

REM 16. 显示部署结果
echo.
echo 🎉 部署完成！
echo ==================================================
echo 📊 服务状态:
pm2 status

echo.
echo 🌐 访问地址:
echo   本地访问: http://localhost:%PORT%
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%i
    set IP=!IP: =!
    echo   局域网访问: http://!IP!:%PORT%
    goto :found_ip
)
:found_ip

echo.
echo 📋 管理命令:
echo   查看状态: pm2 status
echo   查看日志: pm2 logs %PROJECT_NAME%
echo   重启服务: pm2 restart %PROJECT_NAME%
echo   停止服务: pm2 stop %PROJECT_NAME%
echo   删除服务: pm2 delete %PROJECT_NAME%

echo.
echo 📁 重要文件位置:
echo   项目目录: %DEPLOY_DIR%
echo   日志文件: %DEPLOY_DIR%\logs\
echo   数据库文件: %DEPLOY_DIR%\prisma\dev.db
echo   配置文件: %DEPLOY_DIR%\.env.production

echo.
echo ✅ 部署成功完成！
echo 💡 提示: 服务已设置为Windows服务，系统重启后会自动启动

pause
