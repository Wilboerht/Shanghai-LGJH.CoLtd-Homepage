# Next.js Standalone 模式部署脚本
# 使用方法: .\deploy-standalone.ps1

param(
    [string]$TargetPath = "C:\deploy\lgjh-homepage",
    [switch]$Local = $false
)

Write-Host "Next.js Standalone 模式部署" -ForegroundColor Blue
Write-Host "目标路径: $TargetPath" -ForegroundColor Green

# 检查是否在项目根目录
if (-not (Test-Path "package.json")) {
    Write-Host "错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 检查是否已构建
if (-not (Test-Path ".next\standalone\server.js")) {
    Write-Host "错误: 未找到构建文件，请先运行 npm run build" -ForegroundColor Red
    exit 1
}

# 1. 创建目标目录
Write-Host "创建部署目录..." -ForegroundColor Blue
if (Test-Path $TargetPath) {
    Write-Host "目标目录已存在，将清理旧文件..." -ForegroundColor Yellow
    Remove-Item "$TargetPath\*" -Recurse -Force -ErrorAction SilentlyContinue
} else {
    New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
}

# 2. 复制 standalone 文件
Write-Host "复制 standalone 应用文件..." -ForegroundColor Blue
Copy-Item ".next\standalone\*" -Destination $TargetPath -Recurse -Force

# 3. 复制静态文件
Write-Host "复制静态资源文件..." -ForegroundColor Blue
if (Test-Path ".next\static") {
    $staticTarget = "$TargetPath\.next\static"
    New-Item -ItemType Directory -Path $staticTarget -Force | Out-Null
    Copy-Item ".next\static\*" -Destination $staticTarget -Recurse -Force
}

# 4. 复制并合并 public 目录
Write-Host "复制 public 目录..." -ForegroundColor Blue
if (Test-Path "public") {
    # 先复制原始 public 目录
    Copy-Item "public\*" -Destination "$TargetPath\public" -Recurse -Force
    
    # 确保 uploads 目录存在
    $uploadsDir = "$TargetPath\public\uploads"
    if (-not (Test-Path $uploadsDir)) {
        New-Item -ItemType Directory -Path $uploadsDir -Force | Out-Null
    }
    
    Write-Host "public 目录复制完成" -ForegroundColor Green
}

# 5. 复制必要的配置文件
Write-Host "复制配置文件..." -ForegroundColor Blue
$configFiles = @(
    "prisma",
    ".env.production",
    "ecosystem.config.js"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $TargetPath -Recurse -Force
        Write-Host "已复制: $file" -ForegroundColor Green
    } else {
        Write-Host "跳过: $file (不存在)" -ForegroundColor Yellow
    }
}

# 6. 创建启动脚本
Write-Host "创建启动脚本..." -ForegroundColor Blue

# 创建直接启动脚本
$startScript = @"
@echo off
echo 启动 LGJH Homepage (Standalone 模式)
echo =====================================

REM 设置环境变量
set NODE_ENV=production
set PORT=3100

REM 启动应用
echo 启动服务器...
node server.js

pause
"@

$startScript | Out-File -FilePath "$TargetPath\start.bat" -Encoding UTF8

# 创建 PM2 启动脚本
$pm2Script = @"
@echo off
echo 使用 PM2 启动 LGJH Homepage
echo ============================

REM 停止现有服务
pm2 delete lgjh-homepage 2>nul

REM 启动新服务
pm2 start server.js --name "lgjh-homepage" --env production

REM 保存 PM2 配置
pm2 save

echo 服务已启动
echo 查看状态: pm2 status
echo 查看日志: pm2 logs lgjh-homepage

pause
"@

$pm2Script | Out-File -FilePath "$TargetPath\start-pm2.bat" -Encoding UTF8

# 7. 创建环境配置文件（如果不存在）
if (-not (Test-Path "$TargetPath\.env.production")) {
    Write-Host "创建环境配置文件..." -ForegroundColor Blue
    $envContent = @"
NODE_ENV=production
PORT=3100
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_URL=https://lingangjh.com
NEXTAUTH_SECRET=your-secret-key-here
"@
    $envContent | Out-File -FilePath "$TargetPath\.env.production" -Encoding UTF8
    Write-Host "请编辑 .env.production 文件配置正确的环境变量" -ForegroundColor Yellow
}

# 8. 设置权限（Windows）
Write-Host "设置文件权限..." -ForegroundColor Blue
try {
    icacls $TargetPath /grant "Everyone:(OI)(CI)F" /T | Out-Null
    Write-Host "权限设置完成" -ForegroundColor Green
} catch {
    Write-Host "权限设置失败，请手动设置" -ForegroundColor Yellow
}

# 9. 显示部署信息
Write-Host ""
Write-Host "部署完成!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Blue
Write-Host "部署路径: $TargetPath" -ForegroundColor White
Write-Host "启动文件: $TargetPath\server.js" -ForegroundColor White
Write-Host ""
Write-Host "启动方式:" -ForegroundColor Blue
Write-Host "1. 直接启动: 双击 start.bat" -ForegroundColor White
Write-Host "2. PM2 启动: 双击 start-pm2.bat" -ForegroundColor White
Write-Host "3. 命令行启动: cd $TargetPath && node server.js" -ForegroundColor White
Write-Host ""
Write-Host "重要提醒:" -ForegroundColor Yellow
Write-Host "1. 请编辑 .env.production 配置环境变量" -ForegroundColor White
Write-Host "2. 确保数据库文件路径正确" -ForegroundColor White
Write-Host "3. 检查端口 3100 是否可用" -ForegroundColor White
Write-Host "4. 配置防火墙允许端口访问" -ForegroundColor White

# 10. 验证部署
Write-Host "验证部署文件..." -ForegroundColor Blue
$criticalFiles = @(
    "$TargetPath\server.js",
    "$TargetPath\package.json",
    "$TargetPath\.next\static",
    "$TargetPath\public\uploads"
)

$allGood = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (缺失)" -ForegroundColor Red
        $allGood = $false
    }
}

if ($allGood) {
    Write-Host ""
    Write-Host "所有关键文件都已就位，可以启动应用!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "部分文件缺失，请检查构建过程" -ForegroundColor Red
}
