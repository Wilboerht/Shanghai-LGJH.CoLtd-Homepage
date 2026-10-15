@echo off
echo 重置NextAuth认证系统...

echo 1. 停止当前服务...
taskkill /f /im node.exe 2>nul

echo 2. 清理缓存和构建文件...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 3. 重新生成Prisma客户端...
npx prisma generate

echo 4. 重新构建项目...
npm run build

echo 5. 重置完成！
echo.
echo 现在请按以下步骤操作:
echo.
echo 🌐 清理浏览器数据:
echo 1. 打开开发者工具 (F12)
echo 2. Application 标签页 → Storage
echo 3. 删除所有 localhost:3100 的数据:
echo    - Cookies
echo    - Local Storage  
echo    - Session Storage
echo.
echo 🚀 重新启动:
echo 1. npm run start:production
echo 2. 访问 http://localhost:3100/admin
echo 3. 重新登录
echo.
echo 💡 或者使用无痕模式测试 (Ctrl+Shift+N)
echo.
pause
