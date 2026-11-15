@echo off
TITLE Aapla Kayda AI Legal System - Advocate Pratiksha
echo ======================================================================
echo   AAPLA KAYDA AI LEGAL CONTENT & INSTAGRAM GROWTH AGENT
echo   Advocate Pratiksha - 60 Days Legal Mastery System
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js runtime...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH! Please install Node.js v20+ or v24+.
    pause
    exit /b 1
)

echo [2/3] Checking and initializing persistent database...
cd backend
node src/db/seed.js

echo.
echo [3/3] Starting Aapla Kayda Server with auto-recovery...
echo Server running at: http://localhost:5050
echo Teleprompter and Dashboard ready!
echo.
start "" "http://localhost:5050"
:loop
node src/server.js
echo [WARNING] Server stopped at %date% %time%. Restarting in 3 seconds...
timeout /t 3
goto loop
