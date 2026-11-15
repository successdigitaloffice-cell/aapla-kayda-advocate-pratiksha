@echo off
TITLE Uninstall Aapla Kayda Autostart
COLOR 0C
echo ======================================================================
echo   UNINSTALL AAPLA KAYDA WINDOWS AUTOSTART
echo ======================================================================
echo.

cd /d "%~dp0"
node scripts\register_autostart.js --uninstall

echo.
pause
