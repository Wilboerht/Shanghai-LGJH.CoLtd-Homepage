@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM LGJH Homepage Standalone 模式部署脚本
REM ========================================

echo.
echo 🚀 LGJH Homepage Standalone 模式部署
echo =====================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ 请以管理员身份运行此脚本
    pause
    exit /b 1
)

REM 设置路径
set SOURCE_DIR=%CD%
set DEPLOY_DIR=D:\WWW\Node\lgjh-standalone
set PROJECT_NAME=lgjh-homepage
set PORT=3100

echo 📋 部署配置:
echo   源目录: %SOURCE_DIR%
echo   部署目录: %DEPLOY_DIR%
echo   项目名称: %PROJECT_NAME%
echo   运行端口: %PORT%
echo.

REM 1. 检查构建文件
echo 🔍 检查构建文件...
if not exist ".next\standalone" (
    echo ❌ 未找到 standalone 构建文件
    echo 正在执行构建...
    
    REM 清理旧构建
    if exist ".next" rmdir /s /q .next
    
    REM 安装依赖
    echo 📦 安装依赖...
    call npm install
    
    REM 生成 Prisma 客户端
    echo 🔧 生成 Prisma 客户端...
    call npx prisma generate
    
    REM 构建项目
    echo 🏗️ 构建项目...
    call npm run build
    
    if %errorLevel% neq 0 (
        echo ❌ 构建失败
        pause
        exit /b 1
    )
    
    if not exist ".next\standalone" (
        echo ❌ Standalone 构建失败
        pause
        exit /b 1
    )
)

echo ✅ Standalone 构建文件检查通过

REM 2. 创建部署目录
echo 📁 创建部署目录...
if exist "%DEPLOY_DIR%" (
    echo 🧹 清理旧的部署目录...
    rmdir /s /q "%DEPLOY_DIR%"
)

mkdir "%DEPLOY_DIR%"
mkdir "%DEPLOY_DIR%\logs"
mkdir "%DEPLOY_DIR%\prisma"
mkdir "%DEPLOY_DIR%\public"

echo ✅ 部署目录创建完成

REM 3. 复制 Standalone 文件
echo 📋 复制 Standalone 应用文件...
xcopy /E /I /Y ".next\standalone\*" "%DEPLOY_DIR%\"

REM 4. 复制静态文件
echo 📋 复制静态文件...
if exist ".next\static" (
    mkdir "%DEPLOY_DIR%\.next\static"
    xcopy /E /I /Y ".next\static\*" "%DEPLOY_DIR%\.next\static\"
)

REM 5. 复制 public 目录
echo 📋 复制 public 目录...
if exist "public" (
    xcopy /E /I /Y "public\*" "%DEPLOY_DIR%\public\"
)

REM 6. 复制 prisma 文件
echo 📋 复制 prisma 文件...
if exist "prisma" (
    xcopy /E /I /Y "prisma\*" "%DEPLOY_DIR%\prisma\"
)

REM 7. 创建环境配置文件
echo ⚙️ 创建环境配置...
(
echo NODE_ENV=production
echo PORT=%PORT%
echo DATABASE_URL=file:./prisma/dev.db
echo NEXTAUTH_URL=http://localhost:%PORT%
echo NEXTAUTH_SECRET=lgjh-cms-secret-key-change-in-production-2024
) > "%DEPLOY_DIR%\.env.production"

REM 8. 创建启动脚本
echo 📝 创建启动脚本...

REM 直接启动脚本
(
echo @echo off
echo echo 启动 LGJH Homepage ^(Standalone 模式^)
echo echo =====================================
echo.
echo REM 设置环境变量
echo set NODE_ENV=production
echo set PORT=%PORT%
echo.
echo REM 启动应用
echo echo 启动服务器...
echo node server.js
echo.
echo pause
) > "%DEPLOY_DIR%\start.bat"

REM PM2 启动脚本
(
echo @echo off
echo echo 使用 PM2 启动 LGJH Homepage
echo echo ============================
echo.
echo REM 停止现有服务
echo pm2 delete %PROJECT_NAME% 2^>nul
echo.
echo REM 启动新服务
echo pm2 start server.js --name "%PROJECT_NAME%" --env production
echo.
echo REM 保存 PM2 配置
echo pm2 save
echo.
echo echo 服务已启动
echo echo 查看状态: pm2 status
echo echo 查看日志: pm2 logs %PROJECT_NAME%
echo.
echo pause
) > "%DEPLOY_DIR%\start-pm2.bat"

REM Windows 服务脚本
(
echo @echo off
echo echo 安装 Windows 服务
echo echo ==================
echo.
echo REM 安装 PM2 Windows 服务
echo pm2-service-install -n PM2
echo.
echo REM 启动服务
echo net start PM2
echo.
echo echo Windows 服务安装完成
echo pause
) > "%DEPLOY_DIR%\install-service.bat"

echo ✅ 启动脚本创建完成

REM 9. 创建 PM2 配置文件
echo 📝 创建 PM2 配置文件...
(
echo module.exports = {
echo   apps: [{
echo     name: '%PROJECT_NAME%',
echo     script: './server.js',
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

echo ✅ PM2 配置文件创建完成

REM 10. 设置权限
echo 🔐 设置文件权限...
icacls "%DEPLOY_DIR%" /grant Everyone:(OI)(CI)F /T >nul 2>&1

REM 11. 配置防火墙
echo 🔥 配置防火墙规则...
netsh advfirewall firewall show rule name="LGJH-Homepage-Standalone" >nul 2>&1
if %errorLevel% neq 0 (
    netsh advfirewall firewall add rule name="LGJH-Homepage-Standalone" dir=in action=allow protocol=TCP localport=%PORT%
    echo ✅ 防火墙规则配置完成
) else (
    echo ✅ 防火墙规则已存在
)

REM 12. 测试启动
echo 🧪 测试应用启动...
cd /d "%DEPLOY_DIR%"

REM 设置环境变量
set NODE_ENV=production
set PORT=%PORT%

echo 正在测试启动...
timeout /t 2 /nobreak >nul

REM 启动测试（后台运行）
start /B node server.js

REM 等待启动
timeout /t 5 /nobreak >nul

REM 测试连接
curl -f http://localhost:%PORT% >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ 应用启动测试成功
    
    REM 停止测试进程
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%PORT%') do (
        taskkill /PID %%a /F >nul 2>&1
    )
) else (
    echo ⚠️  应用启动测试未通过，但部署文件已准备完成
)

echo.
echo 🎉 Standalone 模式部署完成！
echo =====================================
echo.
echo 📁 部署目录: %DEPLOY_DIR%
echo.
echo 🚀 启动方式:
echo   1. 直接启动: 双击 %DEPLOY_DIR%\start.bat
echo   2. PM2 启动: 双击 %DEPLOY_DIR%\start-pm2.bat
echo   3. 命令行启动: cd %DEPLOY_DIR% ^&^& node server.js
echo.
echo 📊 管理命令:
echo   查看状态: pm2 status
echo   查看日志: pm2 logs %PROJECT_NAME%
echo   重启服务: pm2 restart %PROJECT_NAME%
echo   停止服务: pm2 stop %PROJECT_NAME%
echo.
echo 🌐 访问地址:
echo   本地: http://localhost:%PORT%
echo   网络: http://172.20.245.85:%PORT%
echo.
echo 📋 重要文件:
echo   启动脚本: %DEPLOY_DIR%\start.bat
echo   PM2配置: %DEPLOY_DIR%\ecosystem.config.js
echo   环境配置: %DEPLOY_DIR%\.env.production
echo   日志目录: %DEPLOY_DIR%\logs\
echo.

REM 询问是否立即启动
set /p START_NOW="是否现在启动应用? (y/n): "
if /i "%START_NOW%"=="y" (
    echo.
    echo 🚀 启动应用...
    cd /d "%DEPLOY_DIR%"
    
    REM 检查是否安装了 PM2
    pm2 --version >nul 2>&1
    if %errorLevel% equ 0 (
        echo 使用 PM2 启动...
        pm2 start ecosystem.config.js
        pm2 save
        echo ✅ PM2 服务已启动
    ) else (
        echo 使用直接启动...
        start "" "%DEPLOY_DIR%\start.bat"
        echo ✅ 应用已启动
    )
) else (
    echo.
    echo 💡 您可以稍后手动启动应用
    echo 进入目录: cd %DEPLOY_DIR%
    echo 启动命令: node server.js
)

echo.
echo ✅ 部署完成！
pause
