@echo off
echo ===================================================
echo   ResellSeba Fullstack Local Server Launcher
echo ===================================================
echo.
echo Starting Laravel Backend API on http://127.0.0.1:8000 ...
start "ResellSeba Backend API" cmd /k "cd /d backend && C:\tools\php\php.exe artisan serve --host=127.0.0.1 --port=8000"

echo Starting Vite React Frontend on http://localhost:3000 ...
start "ResellSeba Frontend" cmd /k "npm run dev"

echo.
echo ===================================================
echo  All services launched!
echo  Open browser at: http://localhost:3000
echo  Admin login: admin@resellseba.com / password
echo ===================================================
pause
