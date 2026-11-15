@echo off
chcp 65001 >nul
title Aapla Kayda - GitHub Repository Sync
color 0A

echo ==============================================================================
echo    आपला कायदा – Advocate Pratiksha | GitHub Repository Pusher
echo ==============================================================================
echo.
echo Local Git Repository is initialized with main branch and 2 verified commits.
echo.

set PATH=%~dp0bin\git\cmd;%PATH%

if "%~1"=="" (
    set /p REPO_URL="कृपया तुमची GitHub Repository URL टाका (उदा. https://github.com/username/aapla-kayda.git): "
) else (
    set REPO_URL=%~1
)

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL दिली नाही.
    pause
    exit /b 1
)

echo.
echo [1/3] Setting remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Setting branch to main...
git branch -M main

echo [3/3] Pushing to GitHub (%REPO_URL%)...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo  [SUCCESS] GitHub वर सर्व कोड आणि फाइल्स यशस्वीरीत्या ट्रान्सफर झाल्या आहेत!
    echo ==============================================================================
) else (
    echo.
    echo [NOTE] जर लॉगिन विचारले तर तुमची GitHub Username आणि Personal Access Token (PAT) प्रविष्ट करा.
)

echo.
pause
