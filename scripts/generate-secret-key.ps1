# LGJH-Homepage 安全密钥生成脚本
# 使用方法: 在 PowerShell 中运行此脚本

Write-Host "🔐 LGJH-Homepage 安全密钥生成器" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# 生成多个密钥选项
Write-Host "正在生成安全密钥..." -ForegroundColor Yellow
Write-Host ""

# 生成密钥1 - 32位字母数字
$key1 = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
Write-Host "密钥选项 1 (32位字母数字):" -ForegroundColor Cyan
Write-Host $key1 -ForegroundColor White
Write-Host ""

# 生成密钥2 - 64位字母数字
$key2 = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
Write-Host "密钥选项 2 (64位字母数字):" -ForegroundColor Cyan
Write-Host $key2 -ForegroundColor White
Write-Host ""

# 生成密钥3 - 包含特殊字符
$key3 = -join ((65..90) + (97..122) + (48..57) + (33,35,36,37,38,42,43,45,61,63,64) | Get-Random -Count 48 | % {[char]$_})
Write-Host "密钥选项 3 (48位包含特殊字符):" -ForegroundColor Cyan
Write-Host $key3 -ForegroundColor White
Write-Host ""

Write-Host "📝 使用说明:" -ForegroundColor Green
Write-Host "1. 选择上面任意一个密钥" -ForegroundColor White
Write-Host "2. 复制密钥到剪贴板" -ForegroundColor White
Write-Host "3. 打开 .env.production 文件" -ForegroundColor White
Write-Host "4. 找到 NEXTAUTH_SECRET= 这一行" -ForegroundColor White
Write-Host "5. 将密钥粘贴到引号中" -ForegroundColor White
Write-Host ""

Write-Host "示例配置:" -ForegroundColor Green
Write-Host "NEXTAUTH_SECRET=`"$key1`"" -ForegroundColor Yellow
Write-Host ""

# 询问是否自动更新配置文件
$envFile = ".\.env.production"
if (Test-Path $envFile) {
    $update = Read-Host "是否自动更新 .env.production 文件? (y/n)"
    if ($update -eq "y" -or $update -eq "Y") {
        try {
            $content = Get-Content $envFile
            $newContent = $content -replace 'NEXTAUTH_SECRET=".*"', "NEXTAUTH_SECRET=`"$key1`""
            $newContent | Set-Content $envFile
            Write-Host "✅ 配置文件已更新!" -ForegroundColor Green
            Write-Host "使用的密钥: $key1" -ForegroundColor Yellow
        }
        catch {
            Write-Host "❌ 更新失败，请手动复制密钥" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  未找到 .env.production 文件，请手动创建并添加密钥" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 密钥生成完成!" -ForegroundColor Green
Read-Host "按回车键退出"
