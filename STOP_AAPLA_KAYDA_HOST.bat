@echo off
TITLE Stop Aapla Kayda Host
COLOR 0C
echo ======================================================================
echo   STOPPING AAPLA KAYDA HOST & STUDIO (ISOLATED SHUTDOWN)
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/4] Stopping Watchdog supervisor...
if exist "data\watchdog.pid" (
    set /p WPID=<data\watchdog.pid
    taskkill /F /PID %WPID% >nul 2>&1
    del "data\watchdog.pid" >nul 2>&1
    echo  -> Watchdog stopped.
)

echo [2/4] Stopping Cloudflare Tunnel...
if exist "data\tunnel.pid" (
    set /p TPID=<data\tunnel.pid
    taskkill /F /PID %TPID% >nul 2>&1
    del "data\tunnel.pid" >nul 2>&1
    echo  -> Tunnel stopped.
)

echo [3/4] Stopping processes on Port 5050 (Aapla Kayda Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5050 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [4/4] Stopping processes on Port 5055 (Instagram Video Studio)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5055 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ======================================================================
echo [SUCCESS] Aapla Kayda Host safely stopped!
echo Note: Port 5000 and Market Pulse are 100% UNTOUCHED and PRESERVED.
echo ======================================================================
echo.
pause
