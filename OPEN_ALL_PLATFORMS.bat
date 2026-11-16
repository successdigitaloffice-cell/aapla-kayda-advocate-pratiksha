@echo off
chcp 65001 >nul
title Aapla Kayda - All Platforms Access
color 0A

echo ==============================================================================
echo    आपला कायदा – Advocate Pratiksha | सर्व प्लॅटफॉर्म लिंक्स (All Access Links)
echo ==============================================================================
echo.

set CLOUD_URL=https://powers-segments-measurements-lenders.trycloudflare.com
set GITHUB_PAGES=https://successdigitaloffice-cell.github.io/aapla-kayda-advocate-pratiksha/
set GITHUB_REPO=https://github.com/successdigitaloffice-cell/aapla-kayda-advocate-pratiksha
set LAN_URL=http://192.168.101.5:5050
set LOCAL_URL=http://localhost:5050

echo [1] जागतिक लाईव्ह डॅशबोर्ड (Any PC / Mobile):
echo     %CLOUD_URL%
echo.
echo [2] इतर कोणत्याही PC साठी (Same Wi-Fi Network):
echo     %LAN_URL%
echo.
echo [3] GitHub Pages थेट ॲप:
echo     %GITHUB_PAGES%
echo.
echo [4] GitHub Repository (Source Code):
echo     %GITHUB_REPO%
echo.
echo [5] स्थानिक मुख्य PC डॅशबोर्ड:
echo     %LOCAL_URL%
echo.
echo ==============================================================================
echo  सर्व लिंक्स ब्राउझरमध्ये उघडत आहेत...
echo ==============================================================================

start "" "%CLOUD_URL%"
start "" "%GITHUB_REPO%"

echo.
echo [Done] डॅशबोर्ड व GitHub यशस्वीरीत्या उघडले आहेत!
timeout /t 5 >nul
exit
