# 服务器连接设置脚本
# 帮助配置与服务器的连接

Write-Host "=== 服务器连接配置向导 ===" -ForegroundColor Green

# 检查连接方式
Write-Host "`n请选择你的服务器连接方式:" -ForegroundColor Yellow
Write-Host "1. SSH 连接 (Linux/Unix 服务器)"
Write-Host "2. 远程桌面 + 共享文件夹 (Windows 服务器)"
Write-Host "3. FTP/SFTP 连接"
Write-Host "4. 其他方式"

$connectionType = Read-Host "请输入选项 (1-4)"

switch ($connectionType) {
    "1" {
        Write-Host "`n=== SSH 连接配置 ===" -ForegroundColor Cyan
        Write-Host "需要安装的工具:"
        Write-Host "- OpenSSH Client (Windows 10/11 通常已内置)"
        Write-Host "- 或者 PuTTY + pscp"
        Write-Host ""
        Write-Host "测试连接命令:"
        $serverIP = Read-Host "请输入服务器IP地址"
        $username = Read-Host "请输入用户名"
        Write-Host "ssh ${username}@${serverIP}" -ForegroundColor Green
        Write-Host ""
        Write-Host "如果需要密钥认证，请确保已配置 SSH 密钥"
    }
    "2" {
        Write-Host "`n=== Windows 远程桌面配置 ===" -ForegroundColor Cyan
        Write-Host "1. 启用远程桌面连接"
        Write-Host "2. 设置共享文件夹或使用 robocopy 命令"
        Write-Host "3. 确保防火墙允许文件共享"
    }
    "3" {
        Write-Host "`n=== FTP/SFTP 配置 ===" -ForegroundColor Cyan
        Write-Host "推荐工具:"
        Write-Host "- WinSCP (图形界面)"
        Write-Host "- FileZilla"
        Write-Host "- PowerShell 的 SFTP 模块"
    }
    "4" {
        Write-Host "`n请描述你的连接方式，我们会相应调整脚本" -ForegroundColor Yellow
    }
}

Write-Host "`n=== 项目路径确认 ===" -ForegroundColor Cyan
Write-Host "请确认以下信息:"
Write-Host "1. 服务器上项目的完整路径"
Write-Host "2. 数据库文件位置: [项目路径]/prisma/dev.db"
Write-Host "3. 上传文件位置: [项目路径]/public/uploads/"
Write-Host ""
Write-Host "示例路径:"
Write-Host "- Linux: /home/user/myproject"
Write-Host "- Windows: C:\inetpub\wwwroot\myproject"
