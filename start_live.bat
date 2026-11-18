@echo off
title Optronix Full-Stack Live Runner
echo ================================================================
echo    Starting Optronix Sales Meeting & Visit Management System
echo ================================================================

echo.
echo [1/3] Starting Spring Boot Backend (Port 8080)...
start "Optronix Backend" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"

echo.
echo [2/3] Starting React Vite Frontend (Port 5173)...
start "Optronix Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Waiting 8 seconds for servers to start before opening Cloudflare Tunnel...
timeout /t 8 /nobreak >nul

echo.
echo [3/3] Starting Cloudflare Public Live Tunnel...
start "Optronix Public Link" cmd /k "cd /d %~dp0 && cloudflared.exe tunnel --protocol http2 --url http://localhost:5173"

echo.
echo ================================================================
echo   SUCCESS! All services are running!
echo   - Local Dashboard:  http://localhost:5173
echo   - Local API & H2:   http://localhost:8080/h2-console
echo   - Public Live Link: Check the 'Optronix Public Link' window
echo ================================================================
echo Keep the opened terminal windows open to keep your project live.
pause
