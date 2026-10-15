# 增量部署脚本 - 只更新代码，保留生产数据
# 使用方法: .\scripts\deploy-incremental.ps1 -ServerIP "your-server-ip" -Username "your-username"

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [string]$ServerProjectPath = "C:\path\to\your\project\on\server",
    [string]$ExcludeFile = ".\deployment\incremental-exclude.txt"
)

Write-Host "开始增量部署..." -ForegroundColor Green

# 创建排除文件列表（如果不存在）
if (!(Test-Path $ExcludeFile)) {
    $excludeContent = @"
# 排除生产环境数据文件
prisma/dev.db
prisma/dev.db.backup
public/uploads/
node_modules/
.next/
.git/
.env.local
.env.production
backups/
*.log
.DS_Store
Thumbs.db
"@
    New-Item -ItemType Directory -Path (Split-Path $ExcludeFile) -Force -ErrorAction SilentlyContinue
    Set-Content -Path $ExcludeFile -Value $excludeContent
    Write-Host "创建排除文件: $ExcludeFile" -ForegroundColor Yellow
}

# 构建项目
Write-Host "构建项目..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败，停止部署" -ForegroundColor Red
    exit 1
}

# 在服务器上备份当前生产数据
Write-Host "备份服务器生产数据..." -ForegroundColor Cyan
$backupTimestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
$serverBackupCmd = @"
mkdir -p ${ServerProjectPath}/backups/pre-deploy-${backupTimestamp} && \
cp ${ServerProjectPath}/prisma/dev.db ${ServerProjectPath}/backups/pre-deploy-${backupTimestamp}/ 2>/dev/null || true && \
cp -r ${ServerProjectPath}/public/uploads ${ServerProjectPath}/backups/pre-deploy-${backupTimestamp}/ 2>/dev/null || true
"@

ssh "${Username}@${ServerIP}" $serverBackupCmd

# 停止服务器上的应用
Write-Host "停止服务器应用..." -ForegroundColor Cyan
ssh "${Username}@${ServerIP}" "cd ${ServerProjectPath} && pm2 stop all || pkill -f 'next start' || true"

# 使用 rsync 同步代码（排除数据文件）
Write-Host "同步代码到服务器..." -ForegroundColor Cyan
try {
    # 使用 rsync 进行增量同步，排除数据文件
    $rsyncCmd = "rsync -avz --delete --exclude-from='$ExcludeFile' ./ ${Username}@${ServerIP}:${ServerProjectPath}/"
    Invoke-Expression $rsyncCmd
    
    if ($LASTEXITCODE -ne 0) {
        throw "rsync 同步失败"
    }
    
    # 在服务器上安装依赖和重启服务
    Write-Host "在服务器上安装依赖..." -ForegroundColor Cyan
    ssh "${Username}@${ServerIP}" "cd ${ServerProjectPath} && npm ci --production"
    
    Write-Host "生成 Prisma 客户端..." -ForegroundColor Cyan
    ssh "${Username}@${ServerIP}" "cd ${ServerProjectPath} && npm run db:generate"
    
    Write-Host "启动应用..." -ForegroundColor Cyan
    ssh "${Username}@${ServerIP}" "cd ${ServerProjectPath} && pm2 start ecosystem.config.js || npm run start:production &"
    
    Write-Host "增量部署完成！" -ForegroundColor Green
    Write-Host "服务器备份保存在: ${ServerProjectPath}/backups/pre-deploy-${backupTimestamp}" -ForegroundColor Yellow
    
} catch {
    Write-Host "部署过程中出现错误: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "正在恢复服务器备份..." -ForegroundColor Yellow
    
    # 恢复备份
    $restoreCmd = @"
cp ${ServerProjectPath}/backups/pre-deploy-${backupTimestamp}/dev.db ${ServerProjectPath}/prisma/ 2>/dev/null || true && \
rm -rf ${ServerProjectPath}/public/uploads && \
cp -r ${ServerProjectPath}/backups/pre-deploy-${backupTimestamp}/uploads ${ServerProjectPath}/public/ 2>/dev/null || true && \
cd ${ServerProjectPath} && pm2 restart all || npm run start:production &
"@
    
    ssh "${Username}@${ServerIP}" $restoreCmd
    Write-Host "已恢复到部署前状态" -ForegroundColor Yellow
}

Write-Host "部署操作完成" -ForegroundColor Green
