@echo off
chcp 65001 >nul
title Aapla Kayda AI - Advocate Pratiksha Dashboard
color 0B

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
    echo [OK] Backend is active on Port 5050
)

echo.
echo ==============================================================================
echo  सर्व स्क्रीन व कॉम्प्युटर्ससाठी ॲक्सेस लिंक्स (Access on All Screens / PCs):
echo ==============================================================================
echo  1. या मुख्य PC वरून:           http://localhost:5050
echo  2. ऑफिस/घरातील इतर PC वरून:    http://192.168.101.5:5050
echo  3. मोबाईल किंवा कोणत्याही PC वरून: https://powers-segments-measurements-lenders.trycloudflare.com
echo  4. ॲडमिन सिक्युरिटी पिन:        2026
echo ==============================================================================
echo.
echo [LAUNCH] Opening Dashboard in browser...
start "" "http://localhost:5050"
start "" "https://powers-segments-measurements-lenders.trycloudflare.com"
timeout /t 3 /nobreak >nul
exit
