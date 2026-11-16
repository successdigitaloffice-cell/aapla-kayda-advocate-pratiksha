@echo off
chcp 65001 >nul
title Aapla Kayda - 1-Click GitHub Sync
color 0A

echo ==============================================================================
echo    आपला कायदा – Advocate Pratiksha | 1-Click GitHub Sync & Auto-Deploy
echo ==============================================================================
echo.

set PATH=%~dp0bin\git\cmd;%PATH%
cd /d "%~dp0"

echo [1/3] Staging and Committing all files...
git add .
git commit -m "feat: automatic update and sync to GitHub" 2>nul

echo.
echo [2/3] Uploading to GitHub Repository...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo  [SUCCESS] सर्व नवीन कोड आणि docs यशस्वीरीत्या GitHub वर सिंक झाले आहेत!
    echo ==============================================================================
    echo.
    echo  GitHub Repository: https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha
    echo  GitHub Pages App:  https://successdigitaloffice-cell.github.io/aapla-kayda-advocate-pratiksha/
    echo.
) else (
    echo.
    echo [ERROR] पुश करताना अडचण आली. कृपया इंटरनेट कनेक्शन तपासा.
)

echo.
timeout /t 5 >nul
exit
