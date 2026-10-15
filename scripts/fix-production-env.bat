@echo off
chcp 65001 >nul
REM Fix production environment configuration script
REM Solve API authentication and user management issues

echo Fix production environment configuration issues...

REM 1. Generate new NextAuth secret key
echo Generate NextAuth secret key...
powershell -Command "$secret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)); echo $secret" > temp_secret.txt
set /p NEXTAUTH_SECRET=<temp_secret.txt
del temp_secret.txt

REM 2. Create production environment configuration file
echo Create .env.local file...
echo # Production environment configuration > .env.local
echo NODE_ENV=production >> .env.local
echo. >> .env.local
echo # Database configuration >> .env.local
echo DATABASE_URL="file:./dev.db" >> .env.local
echo. >> .env.local
echo # NextAuth configuration >> .env.local
echo NEXTAUTH_URL=http://localhost:3100 >> .env.local
echo NEXTAUTH_SECRET=%NEXTAUTH_SECRET% >> .env.local
echo. >> .env.local
echo # Other configuration >> .env.local
echo DOCKER_BUILD=false >> .env.local

echo Environment configuration file created successfully

REM 3. Set current session environment variables
echo Set environment variables...
set NODE_ENV=production
set NEXTAUTH_URL=http://localhost:3100
set DOCKER_BUILD=false

REM 4. Clean cache
echo Clean cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM 5. Regenerate Prisma client
echo Regenerate Prisma client...
npx prisma generate

REM 6. Rebuild project
echo Rebuild project...
npm run build
if %errorlevel% neq 0 (
    echo Build failed
    pause
    exit /b 1
)

echo.
echo Fix completed successfully!
echo.
echo Now you can start the service:
echo    npm run start:production
echo.
echo Access URL: http://localhost:3100/admin
echo.
pause
