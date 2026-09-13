@echo off
title ResellSeba Local Runner
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ===================================================
echo             ResellSeba Local Runner
echo ===================================================
echo.

if not exist node_modules (
    echo [Info] Installing frontend dependencies for first time run...
    call npm install --legacy-peer-deps
)

echo [1/2] Starting Laravel Backend Server (Port: 8000)...
start "ResellSeba Backend" cmd /k "cd backend && php artisan serve --port=8000"

echo [2/2] Starting React Frontend Server (Port: 5173)...
start "ResellSeba Frontend" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && npm run dev"

echo.
echo ===================================================
echo   Backend API : http://127.0.0.1:8000
echo   Frontend App: http://localhost:5173
echo ===================================================
echo.
pause

