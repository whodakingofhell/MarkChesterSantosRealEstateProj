@echo off
title Philippine Skyland - Building for Production...
cd /d "%~dp0"

echo Building Philippine Skyland for production...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo.
echo Build complete! Starting production server...
call npm run start
