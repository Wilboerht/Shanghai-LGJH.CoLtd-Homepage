@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 📦 LGJH Homepage 服务器部署打包
echo ================================

REM 检查必要文件
echo 🔍 检查项目文件...
set missing_files=0

if not exist "package.json" (
    echo ❌ 缺少文件: package.json
    set /a missing_files+=1
)
if not exist "Dockerfile" (
    echo ❌ 缺少文件: Dockerfile
    set /a missing_files+=1
)
if not exist "docker-compose.yml" (
    echo ❌ 缺少文件: docker-compose.yml
    set /a missing_files+=1
)
if not exist "prisma\schema.prisma" (
    echo ❌ 缺少文件: prisma\schema.prisma
    set /a missing_files+=1
)
if not exist "src" (
    echo ❌ 缺少目录: src
    set /a missing_files+=1
)

if %missing_files% gtr 0 (
    echo ❌ 项目文件检查失败，请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

echo ✅ 项目文件检查通过

REM 创建临时目录
set TEMP_DIR=lgjh-homepage-deploy
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set TIMESTAMP=%dt:~0,8%_%dt:~8,6%
set PACKAGE_NAME=lgjh-homepage-%TIMESTAMP%.zip

echo 📁 创建部署包...

REM 清理旧的临时目录
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"

REM 创建部署目录结构
mkdir "%TEMP_DIR%"
mkdir "%TEMP_DIR%\logs"
mkdir "%TEMP_DIR%\ssl"

echo 📋 复制项目文件...

REM 核心文件
copy "package.json" "%TEMP_DIR%\" >nul
if exist "package-lock.json" copy "package-lock.json" "%TEMP_DIR%\" >nul
copy "next.config.ts" "%TEMP_DIR%\" >nul
copy "tailwind.config.js" "%TEMP_DIR%\" >nul
copy "postcss.config.js" "%TEMP_DIR%\" >nul
copy "tsconfig.json" "%TEMP_DIR%\" >nul

REM Docker 相关文件
copy "Dockerfile" "%TEMP_DIR%\" >nul
copy "docker-compose.yml" "%TEMP_DIR%\" >nul
if exist "docker-compose.simple.yml" copy "docker-compose.simple.yml" "%TEMP_DIR%\" >nul
if exist "docker-compose.production.yml" copy "docker-compose.production.yml" "%TEMP_DIR%\" >nul
if exist ".dockerignore" copy ".dockerignore" "%TEMP_DIR%\" >nul

REM 配置文件
if exist ".env.production.example" copy ".env.production.example" "%TEMP_DIR%\" >nul
if exist "nginx.conf.example" copy "nginx.conf.example" "%TEMP_DIR%\" >nul

REM 部署脚本
if exist "deploy-docker.sh" copy "deploy-docker.sh" "%TEMP_DIR%\" >nul
if exist "deploy-docker.bat" copy "deploy-docker.bat" "%TEMP_DIR%\" >nul
if exist "server-setup.sh" copy "server-setup.sh" "%TEMP_DIR%\" >nul
if exist "check-deployment.sh" copy "check-deployment.sh" "%TEMP_DIR%\" >nul

REM 文档文件
if exist "README.md" copy "README.md" "%TEMP_DIR%\" >nul
if exist "DEPLOYMENT.md" copy "DEPLOYMENT.md" "%TEMP_DIR%\" >nul
if exist "DOCKER_DEPLOYMENT.md" copy "DOCKER_DEPLOYMENT.md" "%TEMP_DIR%\" >nul
if exist "LINUX_SERVER_DEPLOYMENT.md" copy "LINUX_SERVER_DEPLOYMENT.md" "%TEMP_DIR%\" >nul

echo 📂 复制项目目录...

REM 复制目录
xcopy "src" "%TEMP_DIR%\src" /e /i /q >nul
xcopy "prisma" "%TEMP_DIR%\prisma" /e /i /q >nul
xcopy "public" "%TEMP_DIR%\public" /e /i /q >nul

echo 🧹 清理不必要的文件...

REM 清理数据库备份文件
if exist "%TEMP_DIR%\prisma\*.backup" del /q "%TEMP_DIR%\prisma\*.backup" >nul 2>&1

REM 清理上传文件 (保留目录结构)
if exist "%TEMP_DIR%\public\uploads" (
    for /r "%TEMP_DIR%\public\uploads" %%f in (*.*) do del "%%f" >nul 2>&1
)

REM 清理临时文件
for /r "%TEMP_DIR%" %%f in (.DS_Store, Thumbs.db, *.tmp) do del "%%f" >nul 2>&1

echo 📝 创建部署说明...

REM 创建部署说明文件
(
echo LGJH Homepage 服务器部署包
echo ========================
echo.
echo 此部署包包含了在Linux服务器上部署LGJH Homepage所需的所有文件。
echo.
echo 快速部署步骤:
echo 1. 解压此文件到服务器 /opt/lgjh-homepage 目录
echo 2. 运行: chmod +x server-setup.sh ^&^& ./server-setup.sh
echo 3. 或者手动运行: chmod +x deploy-docker.sh ^&^& ./deploy-docker.sh
echo.
echo 文件说明:
echo - server-setup.sh: 服务器环境一键安装脚本
echo - deploy-docker.sh: Docker部署脚本
echo - docker-compose.yml: Docker编排配置
echo - .env.production.example: 环境变量模板
echo - nginx.conf.example: Nginx配置模板
echo - LINUX_SERVER_DEPLOYMENT.md: 详细部署文档
echo.
echo 重要提醒:
echo 1. 请先配置 .env.production 文件
echo 2. 生产环境请配置SSL证书
echo 3. 建议配置防火墙和定期备份
echo.
echo 技术支持: 请查看相关文档文件
) > "%TEMP_DIR%\DEPLOY_README.txt"

echo 🗜️  创建压缩包...

REM 检查是否有 PowerShell (用于创建 ZIP)
powershell -command "& {}" >nul 2>&1
if %errorlevel% equ 0 (
    powershell -command "Compress-Archive -Path '%TEMP_DIR%' -DestinationPath '%PACKAGE_NAME%' -Force"
) else (
    echo ⚠️  PowerShell 不可用，请手动压缩 %TEMP_DIR% 目录
    echo 或者使用其他压缩工具创建 %PACKAGE_NAME%
    goto :show_results
)

REM 清理临时目录
rmdir /s /q "%TEMP_DIR%"

:show_results
REM 显示结果
echo.
echo 🎉 打包完成！
echo ====================
if exist "%PACKAGE_NAME%" (
    echo 📦 部署包: %PACKAGE_NAME%
    for %%A in ("%PACKAGE_NAME%") do echo 📏 文件大小: %%~zA 字节
) else (
    echo 📦 部署目录: %TEMP_DIR%
    echo ⚠️  请手动压缩此目录
)

echo.
echo 📤 上传到服务器:
echo scp %PACKAGE_NAME% user@your-server:/opt/
echo 或使用 WinSCP、FileZilla 等工具上传

echo.
echo 🚀 服务器部署命令:
echo cd /opt
if exist "%PACKAGE_NAME%" (
    echo unzip %PACKAGE_NAME%
) else (
    echo tar -xzf lgjh-homepage.tar.gz
)
echo cd lgjh-homepage-deploy
echo chmod +x server-setup.sh
echo ./server-setup.sh

echo.
echo 📝 提醒:
echo 1. 请确保服务器已安装 Docker 和 Docker Compose
echo 2. 上传后请配置环境变量文件
echo 3. 生产环境请配置域名和SSL证书
echo 4. 查看 LINUX_SERVER_DEPLOYMENT.md 获取详细说明

echo.
echo ✅ 部署包创建完成！

pause
