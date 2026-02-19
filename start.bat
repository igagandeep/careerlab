@echo off
echo ========================================
echo    Career Lab - Local Setup
echo ========================================
echo.

echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Installing dependencies...
call npm run install:all

echo Setting up local database...
call npm run setup-local

echo Starting Career Lab...
echo.
echo ========================================
echo  App will open at http://localhost:3000
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev-local