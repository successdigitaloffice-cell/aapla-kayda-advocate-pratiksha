@echo off
chcp 65001 >nul
title Aapla Kayda - GitHub 1-Click Push & Pages Setup
color 0A

echo ==============================================================================
echo    आपला कायदा – Advocate Pratiksha | GitHub 1-Click Push & Auto-Setup
echo ==============================================================================
echo.

set PATH=%~dp0bin\git\cmd;%PATH%
cd /d "%~dp0"

set REPO_URL=https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha.git

echo [1/4] Staging and Committing all files (Docs, Dashboard, Video Engine)...
git add .
git commit -m "feat: complete cloud deployment, multi-user friend access, and docs for GitHub Pages" 2>nul

echo.
echo [2/4] Configuring Remote Origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [3/4] GitHub Authentication & Push:
echo ------------------------------------------------------------------------------
echo  GitHub वर कोड सुरक्षितपणे पाठवण्यासाठी खालीलपैकी एक पर्याय निवडा:
echo.
echo  पर्याय A: थेट [ENTER] दाबा (GitHub Browser Login विंडो उघडेल)
echo  पर्याय B: किंवा तुमचा GitHub Personal Access Token (PAT) खाली Paste करा:
echo ------------------------------------------------------------------------------
set /p GH_TOKEN="GitHub Token (किंवा थेट Enter दाबा): "

echo.
echo [4/4] Uploading to GitHub...

if not "%GH_TOKEN%"=="" (
    echo [Info] Personal Access Token द्वारे कोड पुश करत आहे...
    git push https://successdigitaloffice-cell:%GH_TOKEN%@github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha.git main
) else (
    echo [Info] Browser Login द्वारे कोड पुश करत आहे...
    git push -u origin main
)

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo  [SUCCESS] GitHub वर सर्व कोड आणि docs यशस्वीरीत्या अपलोड झाले आहेत!
    echo ==============================================================================
    echo.
    echo  आता GitHub Pages १-क्लिकने चालू करण्यासाठी खालील सेटिंग्ज पेज उघडत आहे:
    echo  Settings Link: https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha/settings/pages
    echo.
    echo  कृपया सेटिंग्ज पेजवर:
    echo    1. Build and deployment -> Source मध्ये "Deploy from a branch" निवडा.
    echo    2. Branch मध्ये "main" आणि फोल्डरमध्ये "/docs" निवडा.
    echo    3. Save वर क्लिक करा!
    echo.
    start "" "https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha/settings/pages"
) else (
    echo.
    echo ==============================================================================
    echo  [सूचना] जर पुश करताना अडचण आली असेल, तर:
    echo  1. https://github.com/settings/tokens वर जाऊन नवीन Token तयार करा.
    echo  2. ही फाईल पुन्हा चालवून टोकन येथे Paste करा.
    echo ==============================================================================
    echo.
    echo  टोकन तयार करण्यासाठी खालील लिंक उघडत आहे...
    start "" "https://github.com/settings/tokens/new?scopes=repo,workflow&description=AaplaKayda_AutoDeploy"
)

echo.
echo ==============================================================================
echo  डॅशबोर्ड इतर सर्व स्क्रीनवर वापरण्यासाठी (All PCs / Mobile):
echo  👉 https://powers-segments-measurements-lenders.trycloudflare.com
echo ==============================================================================
echo.
pause
