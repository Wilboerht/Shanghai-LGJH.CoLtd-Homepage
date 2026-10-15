@echo off
REM 修复部署问题脚本 - Windows版本
REM 解决Next.js standalone配置和文件访问问题

echo 🚀 开始修复部署问题...

REM 1. 设置环境变量
echo 📝 设置环境变量...
set NODE_ENV=production
set DOCKER_BUILD=false

REM 2. 停止现有服务
echo 🛑 停止现有服务...
taskkill /f /im node.exe 2>nul || echo 没有运行的Node.js进程

REM 3. 清理构建缓存
echo 🧹 清理构建缓存...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM 4. 重新构建项目
echo 🏗️ 重新构建项目...
npm run build
if %errorlevel% neq 0 (
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)

REM 5. 检查上传目录权限
echo 📁 检查上传目录...
if not exist public\uploads mkdir public\uploads
if not exist public\uploads\admin mkdir public\uploads\admin

REM 6. 设置文件编码
echo 🔤 设置文件编码...
chcp 65001 >nul

REM 7. 启动服务
echo 🎉 启动服务...
echo 服务将在 http://localhost:3100 启动
echo 按 Ctrl+C 停止服务
npm start

pause
