@echo off
echo 清理Logo缓存和重启服务...

echo 1. 清理Next.js缓存...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 2. 重新生成Prisma客户端...
npx prisma generate

echo 3. 重新构建项目...
npm run build

echo 4. 清理完成！
echo.
echo 现在请：
echo 1. 重启服务: npm run start:production
echo 2. 清理浏览器缓存 (Ctrl+Shift+R 或 Ctrl+F5)
echo 3. 访问网站查看Logo是否正确显示
echo.
pause
