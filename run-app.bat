@echo off
title ResellSeba Local Runner
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%"

echo ===================================================
echo             ResellSeba Local Server Runner
echo ===================================================
echo.

if not exist node_modules (
    echo [Info] Installing frontend dependencies...
    call npm install
)

echo [Info] Starting ResellSeba Local Server at http://localhost:3000 ...
echo [Info] Opening browser...
start http://localhost:3000

call npm run dev
pause
