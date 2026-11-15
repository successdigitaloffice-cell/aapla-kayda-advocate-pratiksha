@echo off
chcp 65001 >nul
TITLE Aapla Kayda AI - Advocate Pratiksha Dashboard
COLOR 0B

echo ==============================================================================
echo    आपला कायदा – Advocate Pratiksha AI Legal System (Port 5050)
echo ==============================================================================
echo.

:: Check if backend is running on port 5050
netstat -ano | findstr :5050 | findstr LISTENING >nul
if %errorlevel% neq 0 (
    echo [INFO] Backend is not running. Starting backend server...
    start "Aapla Kayda Backend (Port 5050)" /min cmd /c "cd /d D:\INSTA SCRIPT AI\backend && npm start"
    echo [INFO] Waiting 3 seconds for server initialization...
    timeout /t 3 /nobreak >nul
) else (
    echo [OK] Backend is already running on http://localhost:5050
)

echo.
echo [LAUNCH] Opening Dashboard in browser: http://localhost:5050
start "" "http://localhost:5050"
timeout /t 2 /nobreak >nul
exit
