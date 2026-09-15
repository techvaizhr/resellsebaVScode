@echo off
echo ===================================================
echo   ResellSeba Fullstack Local Server Launcher
echo ===================================================
echo.

echo 1. Starting MySQL Server (Port 3306)...
start "ResellSeba MySQL" cmd /k "cd /d C:\tools\mariadb && start_mysql.bat"

timeout /t 2 /nobreak >nul

echo 2. Starting Laravel API Backend (Port 8000)...
start "ResellSeba Backend API" cmd /k "cd /d backend && C:\tools\php\php.exe artisan serve --host=127.0.0.1 --port=8000"

echo 3. Starting Vite React Frontend (Port 3000)...
start "ResellSeba Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo  All services (MySQL, Laravel, React) are LIVE!
echo.
echo  Website URL : http://localhost:3000
echo  Login URL   : http://localhost:3000/login
echo  Admin Email : admin@resellseba.com
echo  Password    : password
echo ===================================================
pause
