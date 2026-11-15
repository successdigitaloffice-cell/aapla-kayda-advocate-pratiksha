@echo off
TITLE Setup Permanent Windows Autostart - Aapla Kayda
COLOR 0A
echo ======================================================================
echo   AAPLA KAYDA - ADVOCATE PRATIKSHA
echo   CONFIGURE 24/7 PERMANENT REBOOT / AUTOSTART SURVIVAL
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/2] Verifying Node.js and startup scripts...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is missing. Please install Node.js.
    pause
    exit /b 1
)

echo [2/2] Registering Aapla Kayda in Windows Startup folder...
node scripts\register_autostart.js

echo.
echo ======================================================================
echo  After your PC restarts, Aapla Kayda will automatically start
echo  silently in the background. The Cloudflare Public Link will be
echo  updated, and your Desktop shortcut will always connect!
echo ======================================================================
echo.
pause
