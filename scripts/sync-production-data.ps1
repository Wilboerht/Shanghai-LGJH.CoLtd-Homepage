# 生产环境数据同步脚本
# 支持多种连接方式：SSH、Windows共享、FTP等
# 使用方法: .\scripts\sync-production-data.ps1 -ServerIP "your-server-ip" -Username "your-username"

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,

    [Parameter(Mandatory=$true)]
    [string]$Username,

    [string]$ProjectPath = "/home/user/myproject",  # Linux 默认路径
    [string]$LocalBackupDir = ".\backups\production-sync",
    [string]$ConnectionType = "SSH",  # SSH, RDP, SFTP
    [string]$Password = "",  # 可选，不建议在脚本中硬编码
    [int]$Port = 22  # SSH 默认端口
)

Write-Host "开始同步生产环境数据..." -ForegroundColor Green

# 创建本地备份目录
if (!(Test-Path $LocalBackupDir)) {
    New-Item -ItemType Directory -Path $LocalBackupDir -Force
    Write-Host "创建备份目录: $LocalBackupDir" -ForegroundColor Yellow
}

# 备份当前本地数据
$timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
$localBackupPath = "$LocalBackupDir\local-backup-$timestamp"
New-Item -ItemType Directory -Path $localBackupPath -Force

Write-Host "备份当前本地数据到: $localBackupPath" -ForegroundColor Yellow
Copy-Item ".\prisma\dev.db" "$localBackupPath\dev.db" -ErrorAction SilentlyContinue
Copy-Item ".\public\uploads" "$localBackupPath\uploads" -Recurse -ErrorAction SilentlyContinue

# 使用 SCP 或 SFTP 从服务器下载数据
Write-Host "从服务器下载数据库文件..." -ForegroundColor Cyan
try {
    # 下载数据库文件
    scp "${Username}@${ServerIP}:${ProjectPath}/prisma/dev.db" ".\prisma\dev.db.temp"
    
    # 下载上传文件目录
    Write-Host "从服务器下载上传文件..." -ForegroundColor Cyan
    scp -r "${Username}@${ServerIP}:${ProjectPath}/public/uploads" ".\public\uploads.temp"
    
    # 验证下载完整性
    if (Test-Path ".\prisma\dev.db.temp") {
        Move-Item ".\prisma\dev.db.temp" ".\prisma\dev.db" -Force
        Write-Host "数据库文件同步成功" -ForegroundColor Green
    }
    
    if (Test-Path ".\public\uploads.temp") {
        if (Test-Path ".\public\uploads") {
            Remove-Item ".\public\uploads" -Recurse -Force
        }
        Move-Item ".\public\uploads.temp" ".\public\uploads" -Force
        Write-Host "上传文件同步成功" -ForegroundColor Green
    }
    
    # 重新生成 Prisma 客户端
    Write-Host "重新生成 Prisma 客户端..." -ForegroundColor Cyan
    npm run db:generate
    
    Write-Host "生产环境数据同步完成！" -ForegroundColor Green
    Write-Host "本地备份保存在: $localBackupPath" -ForegroundColor Yellow
    
} catch {
    Write-Host "同步过程中出现错误: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "正在恢复本地备份..." -ForegroundColor Yellow
    
    # 恢复备份
    if (Test-Path "$localBackupPath\dev.db") {
        Copy-Item "$localBackupPath\dev.db" ".\prisma\dev.db" -Force
    }
    if (Test-Path "$localBackupPath\uploads") {
        if (Test-Path ".\public\uploads") {
            Remove-Item ".\public\uploads" -Recurse -Force
        }
        Copy-Item "$localBackupPath\uploads" ".\public\uploads" -Recurse -Force
    }
}

# 清理临时文件
Remove-Item ".\prisma\dev.db.temp" -ErrorAction SilentlyContinue
Remove-Item ".\public\uploads.temp" -Recurse -ErrorAction SilentlyContinue

Write-Host "同步操作完成" -ForegroundColor Green
