# 数据完整性检查脚本
# 检查本地和服务器数据的差异

param(
    [string]$ServerIP,
    [string]$Username,
    [string]$ServerProjectPath = "C:\path\to\your\project\on\server"
)

Write-Host "检查数据完整性..." -ForegroundColor Green

function Get-FileHash-Safe {
    param([string]$Path)
    if (Test-Path $Path) {
        return (Get-FileHash $Path -Algorithm MD5).Hash
    }
    return "FILE_NOT_FOUND"
}

function Get-DirectoryInfo {
    param([string]$Path)
    if (Test-Path $Path) {
        $files = Get-ChildItem $Path -Recurse -File
        return @{
            Count = $files.Count
            TotalSize = ($files | Measure-Object -Property Length -Sum).Sum
            LastModified = ($files | Sort-Object LastWriteTime -Descending | Select-Object -First 1).LastWriteTime
        }
    }
    return @{
        Count = 0
        TotalSize = 0
        LastModified = $null
    }
}

# 检查本地数据
Write-Host "检查本地数据..." -ForegroundColor Cyan
$localDbHash = Get-FileHash-Safe ".\prisma\dev.db"
$localUploadsInfo = Get-DirectoryInfo ".\public\uploads"

Write-Host "本地数据库哈希: $localDbHash" -ForegroundColor White
Write-Host "本地上传文件: $($localUploadsInfo.Count) 个文件, 总大小: $([math]::Round($localUploadsInfo.TotalSize/1MB, 2)) MB" -ForegroundColor White
if ($localUploadsInfo.LastModified) {
    Write-Host "最后修改时间: $($localUploadsInfo.LastModified)" -ForegroundColor White
}

# 如果提供了服务器信息，检查服务器数据
if ($ServerIP -and $Username) {
    Write-Host "`n检查服务器数据..." -ForegroundColor Cyan
    
    # 获取服务器数据库哈希
    $serverDbHashCmd = "cd ${ServerProjectPath} && md5sum prisma/dev.db 2>/dev/null | cut -d' ' -f1 || echo 'FILE_NOT_FOUND'"
    $serverDbHash = ssh "${Username}@${ServerIP}" $serverDbHashCmd
    
    # 获取服务器上传文件信息
    $serverUploadsCmd = @"
cd ${ServerProjectPath}/public/uploads 2>/dev/null && \
echo "COUNT:\$(find . -type f | wc -l)" && \
echo "SIZE:\$(du -sb . | cut -f1)" && \
echo "LAST_MODIFIED:\$(find . -type f -printf '%T@\n' | sort -n | tail -1)" || \
echo "COUNT:0" && echo "SIZE:0" && echo "LAST_MODIFIED:0"
"@
    
    $serverUploadsOutput = ssh "${Username}@${ServerIP}" $serverUploadsCmd
    
    # 解析服务器输出
    $serverCount = 0
    $serverSize = 0
    $serverLastModified = $null
    
    foreach ($line in $serverUploadsOutput -split "`n") {
        if ($line -match "COUNT:(\d+)") { $serverCount = [int]$matches[1] }
        if ($line -match "SIZE:(\d+)") { $serverSize = [long]$matches[1] }
        if ($line -match "LAST_MODIFIED:(\d+\.?\d*)") { 
            if ([double]$matches[1] -gt 0) {
                $serverLastModified = [DateTime]::new(1970,1,1).AddSeconds([double]$matches[1])
            }
        }
    }
    
    Write-Host "服务器数据库哈希: $serverDbHash" -ForegroundColor White
    Write-Host "服务器上传文件: $serverCount 个文件, 总大小: $([math]::Round($serverSize/1MB, 2)) MB" -ForegroundColor White
    if ($serverLastModified) {
        Write-Host "最后修改时间: $serverLastModified" -ForegroundColor White
    }
    
    # 比较差异
    Write-Host "`n数据差异分析:" -ForegroundColor Yellow
    
    if ($localDbHash -eq $serverDbHash) {
        Write-Host "✓ 数据库文件一致" -ForegroundColor Green
    } else {
        Write-Host "✗ 数据库文件不一致" -ForegroundColor Red
        Write-Host "  建议: 根据需要同步数据库" -ForegroundColor Yellow
    }
    
    if ($localUploadsInfo.Count -eq $serverCount) {
        Write-Host "✓ 上传文件数量一致" -ForegroundColor Green
    } else {
        Write-Host "✗ 上传文件数量不一致 (本地: $($localUploadsInfo.Count), 服务器: $serverCount)" -ForegroundColor Red
        Write-Host "  建议: 同步上传文件目录" -ForegroundColor Yellow
    }
    
    $sizeDiff = [math]::Abs($localUploadsInfo.TotalSize - $serverSize)
    if ($sizeDiff -lt 1MB) {
        Write-Host "✓ 上传文件大小基本一致" -ForegroundColor Green
    } else {
        Write-Host "✗ 上传文件大小差异较大 (差异: $([math]::Round($sizeDiff/1MB, 2)) MB)" -ForegroundColor Red
    }
}

Write-Host "`n检查完成" -ForegroundColor Green
