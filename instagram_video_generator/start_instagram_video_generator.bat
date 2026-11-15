@echo off
TITLE Aapla Kayda - Direct Instagram Video Generator (Port 5055)
echo ======================================================================
echo   AAPLA KAYDA - ADVOCATE PRATIKSHA
echo   Direct Instagram Video Generator & Social Media Studio
echo   Isolated Module running on Port: 5055
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python 3.12 runtime and video modules...
python -c "import edge_tts, imageio_ffmpeg, flask; print('All video generation engines ready!')" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Required python modules are missing. Installing portable dependencies...
    python -m pip install edge-tts imageio-ffmpeg pillow flask flask-cors
)

echo [2/3] Launching Independent Video Generator Server...
echo Server URL: http://localhost:5055
echo Opening browser in 3 seconds...
start "" http://localhost:5055

echo.
echo [3/3] Video Generator active. Press Ctrl+C to stop.
echo.

:loop
python server.py
echo [WARNING] Video Generator stopped at %date% %time%. Restarting in 3 seconds...
timeout /t 3
goto loop
