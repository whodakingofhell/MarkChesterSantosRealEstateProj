@echo off
title Philippine Skyland - Starting...
echo.
echo ============================================
echo   Philippine Skyland MGT and DEVT OPC
echo   (PPSMDO) - Licensed Real Estate
echo   Broker and Appraiser
echo   Nelson Aczon
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] Setting up database...
call npx prisma generate >nul 2>&1
call npx prisma db push >nul 2>&1
echo      Database ready!
echo.

echo [2/3] Starting server...
echo.
echo ============================================
echo   Website will open at:
echo   http://localhost:3000
echo.
echo   To access from other devices on your
echo   network, use your PC's IP address:
echo   http://YOUR-IP-ADDRESS:3000
echo.
echo   Press Ctrl+C to stop the server
echo ============================================
echo.

call npm run dev
