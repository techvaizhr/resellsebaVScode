@echo off
title ResellSeba Local Server (Backend + Frontend)
cd /d "%~dp0"

echo ===================================================
echo             ResellSeba Local Server Runner
echo ===================================================
echo.

set "PHP_EXE=%~dp0.tools\php\php.exe"
set "PHP_INI=%~dp0.tools\php\php.ini"

if not exist "%PHP_EXE%" (
    echo [ERROR] Local PHP runtime not found at .tools\php\php.exe!
    pause
    exit /b 1
)

echo [1/3] Starting Local Backend Server on port 8000...
start "ResellSeba Backend (Port 8000)" /B "%PHP_EXE%" -c "%PHP_INI%" -S 127.0.0.1:8000 -t "%~dp0backend\public"

echo [2/3] Checking Node.js frontend dependencies...
if not exist node_modules (
    echo [Info] Installing frontend dependencies...
    call npm install
)

echo [3/3] Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ===================================================
echo  Both Backend (8000) and Frontend (3000) Running!
echo  Admin Credentials:
echo    Email:    admin@resellseba.com
echo    Password: password
echo ===================================================
echo.

call npm run dev
pause
