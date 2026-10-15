# Fix production environment configuration script
# Solve API authentication and user management issues

Write-Host "🔧 Fix production environment configuration issues..." -ForegroundColor Green

# 1. Generate new NextAuth secret key
Write-Host "📝 Generate NextAuth secret key..." -ForegroundColor Yellow
$NEXTAUTH_SECRET = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
Write-Host "Generated secret key: $($NEXTAUTH_SECRET.Substring(0,10))..." -ForegroundColor Cyan

# 2. Create production environment configuration file
Write-Host "📄 Create .env.local file..." -ForegroundColor Yellow
$envContent = @"
# Production environment configuration
NODE_ENV=production

# Database configuration
DATABASE_URL="file:./dev.db"

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3100
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Other configuration
DOCKER_BUILD=false
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ Environment configuration file created successfully" -ForegroundColor Green

# 3. Set current session environment variables
Write-Host "🔧 Set environment variables..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
$env:NEXTAUTH_URL = "http://localhost:3100"
$env:NEXTAUTH_SECRET = $NEXTAUTH_SECRET
$env:DOCKER_BUILD = "false"

# 4. Clean cache
Write-Host "🧹 Clean cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force
    Write-Host "Removed .next directory" -ForegroundColor Gray
}
if (Test-Path "node_modules\.cache") {
    Remove-Item "node_modules\.cache" -Recurse -Force
    Write-Host "Removed node_modules cache" -ForegroundColor Gray
}

# 5. Regenerate Prisma client
Write-Host "🗄️ Regenerate Prisma client..." -ForegroundColor Yellow
try {
    & npx prisma generate
    Write-Host "✅ Prisma client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Rebuild project
Write-Host "🏗️ Rebuild project..." -ForegroundColor Yellow
try {
    & npm run build
    Write-Host "✅ Project built successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Fix completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Now you can start the service:" -ForegroundColor Cyan
Write-Host "   npm run start:production" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access URL: http://localhost:3100/admin" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
