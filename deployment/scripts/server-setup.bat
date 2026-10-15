@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM LGJH-Homepage Windows 服务器环境自动配置脚本

echo 🖥️ LGJH-Homepage 服务器环境配置向导
echo =============================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ 请以管理员身份运行此脚本
    echo 右键点击脚本，选择"以管理员身份运行"
    pause
    exit /b 1
)

echo ✅ 管理员权限验证通过
echo.

REM 1. 检查和安装 Node.js
echo 🔍 检查 Node.js 环境...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  Node.js 未安装，开始安装...
    
    REM 检查是否有 winget
    winget --version >nul 2>&1
    if %errorLevel% equ 0 (
        echo 📦 使用 winget 安装 Node.js...
        winget install OpenJS.NodeJS.LTS
    ) else (
        echo 📦 请手动安装 Node.js:
        echo 1. 访问 https://nodejs.org/
        echo 2. 下载 LTS 版本
        echo 3. 安装后重新运行此脚本
        pause
        exit /b 1
    )
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js 已安装: !NODE_VERSION!
)

REM 2. 检查 npm
echo 🔍 检查 npm...
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ npm 未找到，请重新安装 Node.js
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm 已安装: !NPM_VERSION!
)

REM 3. 安装 PM2
echo 🔍 检查 PM2...
pm2 --version >nul 2>&1
if %errorLevel% neq 0 (
    echo 📦 安装 PM2 进程管理器...
    npm install -g pm2
    npm install -g pm2-windows-service
    echo ✅ PM2 安装完成
) else (
    for /f "tokens=*" %%i in ('pm2 --version') do set PM2_VERSION=%%i
    echo ✅ PM2 已安装: !PM2_VERSION!
)

REM 4. 创建目录结构
echo 📁 创建应用目录...
set APP_DIR=C:\inetpub\lgjh-homepage
if not exist "%APP_DIR%" (
    mkdir "%APP_DIR%"
    mkdir "%APP_DIR%\logs"
    echo ✅ 应用目录创建完成: %APP_DIR%
) else (
    echo ✅ 应用目录已存在: %APP_DIR%
)

REM 创建备份目录
set BACKUP_DIR=C:\backups\lgjh-homepage
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo ✅ 备份目录创建完成: %BACKUP_DIR%
)

REM 5. 配置防火墙
echo 🔥 配置防火墙规则...
netsh advfirewall firewall show rule name="LGJH-Homepage-HTTP" >nul 2>&1
if %errorLevel% neq 0 (
    netsh advfirewall firewall add rule name="LGJH-Homepage-HTTP" dir=in action=allow protocol=TCP localport=80
    netsh advfirewall firewall add rule name="LGJH-Homepage-HTTPS" dir=in action=allow protocol=TCP localport=443
    netsh advfirewall firewall add rule name="LGJH-Homepage-App" dir=in action=allow protocol=TCP localport=3100
    echo ✅ 防火墙规则配置完成
) else (
    echo ✅ 防火墙规则已存在
)

REM 6. 设置环境变量
echo ⚙️  配置环境变量...
setx NODE_ENV "production" /M >nul 2>&1
setx PORT "3100" /M >nul 2>&1
echo ✅ 环境变量配置完成

REM 7. 检查可选组件
echo 🔍 检查可选组件...

REM 检查 Git
git --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  Git 未安装 (可选)
    echo 💡 建议安装 Git 以便代码更新: https://git-scm.com/
) else (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo ✅ Git 已安装: !GIT_VERSION!
)

REM 检查 IIS
iisreset /status >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ IIS 已安装并运行
) else (
    echo ⚠️  IIS 未安装 (可选)
    echo 💡 如需域名绑定，建议安装 IIS 作为反向代理
)

REM 8. 显示配置总结
echo.
echo 🎉 服务器环境配置完成！
echo =====================================
echo.
echo 📊 环境信息:
echo   Node.js: !NODE_VERSION!
echo   npm: !NPM_VERSION!
echo   PM2: !PM2_VERSION!
echo   应用目录: %APP_DIR%
echo   备份目录: %BACKUP_DIR%
echo.
echo 🚀 下一步操作:
echo 1. 将项目文件复制到: %APP_DIR%
echo 2. 配置 .env.production 文件
echo 3. 运行部署脚本: deploy-local.bat
echo.
echo 📋 部署命令:
echo   cd /d "%APP_DIR%"
echo   deployment\scripts\deploy-local.bat
echo.

REM 9. 询问是否立即部署
set /p DEPLOY_NOW="是否现在就部署项目? (y/n): "
if /i "%DEPLOY_NOW%"=="y" (
    echo.
    echo 🚀 开始部署项目...
    if exist "deployment\scripts\deploy-local.bat" (
        call deployment\scripts\deploy-local.bat
    ) else (
        echo ❌ 部署脚本未找到
        echo 请确保项目文件已复制到应用目录
    )
) else (
    echo.
    echo 💡 环境配置完成，您可以稍后手动部署项目
)

echo.
echo ✅ 服务器环境配置向导完成！
pause
