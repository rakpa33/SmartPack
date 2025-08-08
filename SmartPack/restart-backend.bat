@echo off
echo Stopping any running Node processes...
taskkill /IM node.exe /F 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
cd /d "%~dp0"
start cmd /k "npm run lambda:dev"

echo.
echo Backend server starting on http://localhost:3000
echo Please wait a few seconds for it to fully initialize...
echo.
pause