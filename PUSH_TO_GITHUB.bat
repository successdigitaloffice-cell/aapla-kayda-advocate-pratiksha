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

echo [1/4] Staging and Committing all project files...
git add .
git commit -m "feat: permanent cloud deployment, 100% text-based visual explainer, and multi-user friend access"

echo.
echo [2/4] Configuring Remote Origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo [3/4] Setting Main Branch...
git branch -M main

echo.
echo [4/4] Pushing Code to GitHub...
echo (जर लॉगिन किंवा टोकन विचारले तर तुमची GitHub माहिती किंवा Personal Access Token टाका)
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo  [SUCCESS] GitHub वर सर्व कोड यशस्वीरीत्या अपलोड झाला आहे!
    echo  Repository Link: https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha
    echo  GitHub Pages:   https://successdigitaloffice-cell.github.io/aapla-kayda-advocate-pratiksha/
    echo ==============================================================================
) else (
    echo.
    echo ==============================================================================
    echo  [सूचना] जर पुश करताना अडचण आली, तर GitHub क्रेडेंशियल मॅनेजरमध्ये लॉगिन करा
    echo  किंवा GitHub Personal Access Token (PAT) वापरा.
    echo ==============================================================================
)

echo.
pause
