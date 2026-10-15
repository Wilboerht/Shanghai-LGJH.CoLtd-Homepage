# 修复生产环境图片上传访问问题的PowerShell脚本
# 使用方法: .\fix-upload-simple.ps1

param(
    [switch]$Force = $false
)

# 设置错误处理
$ErrorActionPreference = "Stop"

Write-Host "开始修复生产环境图片上传访问问题..." -ForegroundColor Blue

# 检查是否在项目根目录
if (-not (Test-Path "package.json")) {
    Write-Host "错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 1. 检查当前部署状态
Write-Host "检查当前部署状态..." -ForegroundColor Blue
try {
    $containers = docker ps --format "table {{.Names}}" | Select-String "lgjh"
    if ($containers) {
        Write-Host "发现运行中的容器" -ForegroundColor Green
        $containerName = $containers[0].ToString().Trim()
        Write-Host "容器名称: $containerName" -ForegroundColor Blue
    } else {
        Write-Host "没有发现运行中的LGJH容器" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Docker不可用或未安装" -ForegroundColor Yellow
}

# 2. 检查上传目录
Write-Host "检查上传目录..." -ForegroundColor Blue
if (-not (Test-Path "public\uploads")) {
    Write-Host "创建上传目录..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "public\uploads" -Force | Out-Null
}

Write-Host "上传目录已确认存在" -ForegroundColor Green

# 显示上传目录中的文件
$uploadFiles = Get-ChildItem "public\uploads" -File | Select-Object -First 5
if ($uploadFiles) {
    Write-Host "最近上传的文件:" -ForegroundColor Blue
    foreach ($file in $uploadFiles) {
        Write-Host "  - $($file.Name) ($($file.Length) bytes)" -ForegroundColor Yellow
    }
} else {
    Write-Host "上传目录为空" -ForegroundColor Yellow
}

# 3. 检查并修复Nginx配置
Write-Host "检查Nginx配置..." -ForegroundColor Blue
$nginxConfig = "deployment\configs\nginx.conf"

if (-not (Test-Path $nginxConfig)) {
    if (Test-Path "deployment\configs\nginx.conf.example") {
        Write-Host "复制示例配置文件..." -ForegroundColor Yellow
        Copy-Item "deployment\configs\nginx.conf.example" $nginxConfig
        Write-Host "Nginx配置文件已创建" -ForegroundColor Green
    } else {
        Write-Host "错误: 找不到Nginx配置文件" -ForegroundColor Red
        exit 1
    }
}

# 验证Nginx配置中的uploads路径
$nginxContent = Get-Content $nginxConfig -Raw
if ($nginxContent -match "location /uploads/") {
    Write-Host "Nginx配置包含uploads路径配置" -ForegroundColor Green
} else {
    Write-Host "错误: Nginx配置缺少uploads路径配置" -ForegroundColor Red
    Write-Host "请检查 $nginxConfig 文件" -ForegroundColor Yellow
}

# 4. 重启服务
Write-Host "重启Docker服务..." -ForegroundColor Blue

# 选择合适的docker-compose文件
$composeFile = "deployment\docker\docker-compose.production.yml"
if (-not (Test-Path $composeFile)) {
    $composeFile = "deployment\docker\docker-compose.yml"
}

if (-not (Test-Path $composeFile)) {
    Write-Host "错误: 找不到docker-compose配置文件" -ForegroundColor Red
    exit 1
}

Write-Host "使用配置文件: $composeFile" -ForegroundColor Blue

try {
    # 停止现有服务
    Write-Host "停止现有服务..." -ForegroundColor Yellow
    docker-compose -f $composeFile down

    # 启动服务
    Write-Host "启动服务..." -ForegroundColor Green
    docker-compose -f $composeFile up -d

    # 等待服务启动
    Write-Host "等待服务启动..." -ForegroundColor Blue
    Start-Sleep -Seconds 10

    # 验证服务状态
    Write-Host "验证服务状态..." -ForegroundColor Blue
    $services = docker-compose -f $composeFile ps
    if ($services -match "Up") {
        Write-Host "服务启动成功" -ForegroundColor Green
    } else {
        Write-Host "服务启动失败" -ForegroundColor Red
        Write-Host "查看日志:" -ForegroundColor Yellow
        docker-compose -f $composeFile logs --tail=20
        exit 1
    }

} catch {
    Write-Host "Docker操作失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. 测试图片访问
Write-Host "测试图片访问..." -ForegroundColor Blue

# 创建测试图片
$testImage = "public\uploads\test-image-$(Get-Date -Format 'yyyyMMddHHmmss').txt"
"Test image for upload verification" | Out-File -FilePath $testImage -Encoding UTF8

# 检查容器中的文件
if ($containerName) {
    Write-Host "检查容器中的文件..." -ForegroundColor Blue
    try {
        docker exec $containerName ls -la /app/public/uploads/ | Select-Object -First 10
    } catch {
        Write-Host "无法访问容器文件系统" -ForegroundColor Yellow
    }
}

# 清理测试文件
Remove-Item $testImage -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "修复完成!" -ForegroundColor Green
Write-Host ""
Write-Host "接下来的步骤:" -ForegroundColor Blue
Write-Host "1. 访问管理后台: https://lingangjh.com/admin" -ForegroundColor Yellow
Write-Host "2. 进入产品管理页面" -ForegroundColor Yellow
Write-Host "3. 创建新产品并测试图片上传" -ForegroundColor Yellow
Write-Host "4. 检查上传的图片是否可以正常访问" -ForegroundColor Yellow
Write-Host ""
Write-Host "如果问题仍然存在:" -ForegroundColor Blue
Write-Host "1. 检查域名DNS解析" -ForegroundColor Yellow
Write-Host "2. 检查防火墙设置" -ForegroundColor Yellow
Write-Host "3. 查看Nginx错误日志: docker-compose -f $composeFile logs nginx" -ForegroundColor Yellow
Write-Host "4. 查看应用日志: docker-compose -f $composeFile logs app" -ForegroundColor Yellow

Write-Host ""
Write-Host "提示: 如果使用的是云服务器，请确保:" -ForegroundColor Cyan
Write-Host "- 安全组开放了80和443端口" -ForegroundColor White
Write-Host "- 域名正确解析到服务器IP" -ForegroundColor White
Write-Host "- SSL证书配置正确" -ForegroundColor White
