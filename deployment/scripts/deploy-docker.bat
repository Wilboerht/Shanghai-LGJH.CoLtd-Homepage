@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 LGJH Homepage Docker 部署
echo =============================

REM 检查 Docker
docker --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM 检查 Docker Compose
docker-compose --version >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Docker Compose 未安装，请先安装 Docker Compose
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker --version') do echo ✅ Docker 版本: %%i
for /f "tokens=*" %%i in ('docker-compose --version') do echo ✅ Docker Compose 版本: %%i

REM 检查环境变量文件
if not exist ".env.production" (
    echo ⚠️  .env.production 文件不存在
    if exist ".env.production.example" (
        echo 📋 复制 .env.production.example 到 .env.production
        copy ".env.production.example" ".env.production"
        echo ⚠️  请编辑 .env.production 文件并配置正确的环境变量
        echo    特别是 NEXTAUTH_SECRET 和 NEXTAUTH_URL
        pause
    ) else (
        echo ❌ 请创建 .env.production 文件
        pause
        exit /b 1
    )
)

REM 检查 Nginx 配置
if not exist "nginx.conf" (
    echo ⚠️  nginx.conf 文件不存在
    if exist "nginx.conf.example" (
        echo 📋 复制 nginx.conf.example 到 nginx.conf
        copy "nginx.conf.example" "nginx.conf"
        echo ⚠️  请编辑 nginx.conf 文件并配置正确的域名
    )
)

REM 创建必要的目录
echo 📁 创建必要的目录...
if not exist "logs" mkdir logs
if not exist "ssl" mkdir ssl
if not exist "public\uploads" mkdir public\uploads

REM 选择部署模式
echo.
echo 请选择部署模式：
echo 1) 简单模式 (仅应用 + Redis)
echo 2) 完整模式 (应用 + Redis + Nginx)
set /p deploy_mode="请输入选择 (1 或 2): "

if "%deploy_mode%"=="1" (
    echo 🚀 启动简单模式部署...
    set COMPOSE_FILE=../docker/docker-compose.yml
    set PROFILES=--profile with-redis
) else if "%deploy_mode%"=="2" (
    echo 🚀 启动完整模式部署...
    set COMPOSE_FILE=../docker/docker-compose.production.yml
    set PROFILES=
) else (
    echo ❌ 无效选择，使用简单模式
    set COMPOSE_FILE=../docker/docker-compose.yml
    set PROFILES=--profile with-redis
)

REM 停止现有服务
echo ⏹️  停止现有服务...
docker-compose -f %COMPOSE_FILE% down %PROFILES% 2>nul

REM 清理旧镜像 (可选)
set /p cleanup_images="是否清理旧的 Docker 镜像? (y/N): "
if /i "%cleanup_images%"=="y" (
    echo 🧹 清理旧镜像...
    docker system prune -f
)

REM 构建并启动服务
echo 🏗️  构建并启动服务...
docker-compose -f %COMPOSE_FILE% up -d --build %PROFILES%

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 📊 检查服务状态...
docker-compose -f %COMPOSE_FILE% ps

REM 健康检查
echo 🏥 执行健康检查...
set max_attempts=30
set attempt=1

:health_check_loop
curl -f http://localhost:3100/api/health >nul 2>&1
if %errorLevel% equ 0 (
    echo ✅ 应用健康检查通过
    goto health_check_success
)

echo ⏳ 等待应用启动... (尝试 %attempt%/%max_attempts%)
timeout /t 5 /nobreak >nul
set /a attempt+=1

if %attempt% leq %max_attempts% goto health_check_loop

echo ❌ 应用启动失败，请检查日志
echo 📋 查看日志: docker-compose -f %COMPOSE_FILE% logs app
pause
exit /b 1

:health_check_success

REM 显示部署信息
echo.
echo 🎉 部署完成！
echo ====================

if "%deploy_mode%"=="2" (
    echo 🌐 访问地址: http://localhost
    echo 🌐 应用直接访问: http://localhost:3000
) else (
    echo 🌐 访问地址: http://localhost:3000
)

echo.
echo 管理命令：
echo 📊 查看状态: docker-compose -f %COMPOSE_FILE% ps
echo 📋 查看日志: docker-compose -f %COMPOSE_FILE% logs -f app
echo 🔄 重启服务: docker-compose -f %COMPOSE_FILE% restart app
echo ⏹️  停止服务: docker-compose -f %COMPOSE_FILE% down
echo 🧹 清理数据: docker-compose -f %COMPOSE_FILE% down -v

echo.
echo ⚠️  重要提醒:
echo 1. 请定期备份 prisma\dev.db 数据库文件
echo 2. 请定期备份 public\uploads 上传文件目录
echo 3. 生产环境请配置 SSL 证书
echo 4. 建议配置防火墙只开放必要端口

pause
