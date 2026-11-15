@echo off
TITLE Aapla Kayda - 24/7 Separate Live Host and Studio
COLOR 0B
echo ======================================================================
echo   AAPLA KAYDA - ADVOCATE PRATIKSHA
echo   SEPARATE 24/7 LIVE CLOUDFLARE HOST AND INSTAGRAM STUDIO
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking runtimes (Node.js and Python)...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is missing. Please install Node.js.
    pause
    exit /b 1
)

python -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is missing. Please install Python.
    pause
    exit /b 1
)

echo [2/3] Starting Aapla Kayda 24/7 Host and Watchdog...
echo - Dashboard on: http://localhost:5050
echo - Video Studio on: http://localhost:5055
echo - Cloudflare Tunnel connecting...
echo.

start "" /B node scripts\host_watchdog.js

echo Waiting 5 seconds for Cloudflare tunnel URL assignment...
ping 127.0.0.1 -n 6 >nul

echo.
echo ======================================================================
if exist "PUBLIC_HOST_URL.txt" (
    echo [SUCCESS] Your Separate Public Link is Live!
    echo.
    echo PUBLIC LINK:
    type PUBLIC_HOST_URL.txt
    echo.
) else (
    echo [INFO] Generating tunnel link... Local URL: http://localhost:5050
)
echo ======================================================================
echo.

echo Opening Aapla Kayda Dashboard on http://localhost:5050...
start "" "http://localhost:5050"

if exist "AAPLA_KAYDA_PORTAL_PERMANENT.html" (
    start "" "AAPLA_KAYDA_PORTAL_PERMANENT.html"
)

echo.
echo Aapla Kayda Host is running in the background.
echo To check status: run CHECK_HOST_STATUS.bat
echo To stop host:    run STOP_AAPLA_KAYDA_HOST.bat
echo.
pause
