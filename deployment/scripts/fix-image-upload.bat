@echo off
setlocal enabledelayedexpansion

echo 🔧 开始修复生产环境图片上传问题...

REM 检查是否在项目根目录
if not exist "package.json" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 1. 停止现有服务
echo 📦 停止现有Docker服务...
docker-compose -f deployment/docker/docker-compose.production.yml down

REM 2. 确保上传目录存在
echo 📁 创建上传目录...
if not exist "public\uploads" mkdir "public\uploads"

REM 3. 备份现有Nginx配置
if exist "deployment\configs\nginx.conf" (
    echo 💾 备份现有Nginx配置...
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
    for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
    copy "deployment\configs\nginx.conf" "deployment\configs\nginx.conf.backup.!mydate!_!mytime!"
)

REM 4. 复制新的Nginx配置
echo ⚙️ 更新Nginx配置...
copy "deployment\configs\nginx.conf.example" "deployment\configs\nginx.conf"

REM 5. 重新构建应用
echo 🏗️ 重新构建应用...
docker-compose -f deployment/docker/docker-compose.production.yml build --no-cache

REM 6. 启动服务
echo 🚀 启动服务...
docker-compose -f deployment/docker/docker-compose.production.yml up -d

REM 7. 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 30 /nobreak > nul

REM 8. 检查服务状态
echo 🔍 检查服务状态...
docker-compose -f deployment/docker/docker-compose.production.yml ps

REM 9. 测试服务健康状态
echo 🧪 测试服务健康状态...
curl -f http://localhost/api/health > nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ 服务健康检查通过
) else (
    echo ❌ 服务健康检查失败
    echo 📋 查看日志:
    docker-compose -f deployment/docker/docker-compose.production.yml logs --tail=50
    pause
    exit /b 1
)

echo.
echo 🎉 图片上传问题修复完成!
echo.
echo 📝 修复内容:
echo   ✅ 统一了图片上传API路径
echo   ✅ 修复了Nginx静态文件服务配置
echo   ✅ 添加了管理后台根路由
echo   ✅ 增强了错误处理和日志记录
echo.
echo 🔗 测试链接:
echo   - 主页: http://localhost
echo   - 管理后台: http://localhost/admin
echo   - API健康检查: http://localhost/api/health
echo.
echo 📊 查看日志:
echo   docker-compose -f deployment/docker/docker-compose.production.yml logs -f
echo.
pause
