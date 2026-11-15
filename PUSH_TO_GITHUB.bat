@echo off
chcp 65001 >nul
title Aapla Kayda - Push to GitHub
color 0A

echo ==============================================================================
echo    आपला कायदा – Advocate Pratiksha | GitHub 1-Click Sync
echo ==============================================================================
echo.

set PATH=%~dp0bin\git\cmd;%PATH%
cd /d "%~dp0"

set REPO_URL=https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha.git

echo [Target Repository]: %REPO_URL%
echo.
echo [1/3] Configuring Remote Origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Setting Main Branch...
git branch -M main

echo [3/3] Pushing Code to GitHub...
echo (जर लॉगिन किंवा टोकन विचारले तर तुमची GitHub माहिती टाका)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo  [SUCCESS] GitHub वर सर्व कोड यशस्वीरीत्या अपलोड झाला आहे!
    echo  Repository Link: https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha
    echo ==============================================================================
) else (
    echo.
    echo ==============================================================================
    echo  [सूचना] जर रिपॉझिटरी आधीच तयार नसेल, तर कृपया खालील लिंकवर जाऊन 
    echo  "Create repository" वर १-क्लिक करा:
    echo  https://github.com/new?name=aapla-kayda-advocate-pratiksha^&private=true
    echo ==============================================================================
)

echo.
pause
