@echo off
TITLE Aapla Kayda - Host Status Checker
COLOR 0A
echo ======================================================================
echo   AAPLA KAYDA - SEPARATE HOST AND STUDIO STATUS
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1] Checking Local Port 5050 (Aapla Kayda Main Backend)...
netstat -ano | findstr :5050 | findstr LISTENING
if %errorlevel% equ 0 (
    echo  -> Port 5050 is ACTIVE (Online)
) else (
    echo  -> Port 5050 is OFFLINE
)

echo.
echo [2] Checking Local Port 5055 (Direct Video Generator Studio)...
netstat -ano | findstr :5055 | findstr LISTENING
if %errorlevel% equ 0 (
    echo  -> Port 5055 is ACTIVE (Online)
) else (
    echo  -> Port 5055 is OFFLINE
)

echo.
echo [3] Checking Separate Cloudflare Public URL...
if exist "PUBLIC_HOST_URL.txt" (
    echo   ===========================================================
    type PUBLIC_HOST_URL.txt
    echo   ===========================================================
) else (
    echo  -> PUBLIC_HOST_URL.txt not generated yet.
)

echo.
netstat -ano | findstr :5000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo  -> Port 5000 is PRESERVED and UNTOUCHED for Market Pulse!
) else (
    echo  -> Port 5000 is free.
)
echo ======================================================================
ping 127.0.0.1 -n 3 >nul
