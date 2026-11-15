#!/usr/bin/env bash
set -e

echo "=================================================="
echo " Starting Aapla Kayda Cloud Platform Engine"
echo " Advocate Pratiksha – 24/7 Always-On Legal System"
echo "=================================================="

# Export default ports
export PORT="${PORT:-5050}"
export VIDEO_STUDIO_PORT="5055"
export PYTHON_STUDIO_URL="http://127.0.0.1:${VIDEO_STUDIO_PORT}"

echo "[Cloud Init] Starting Python Video Studio on port ${VIDEO_STUDIO_PORT}..."
python3 -u instagram_video_generator/server.py &
PYTHON_PID=$!

# Wait briefly for Python Studio to initialize
sleep 2

echo "[Cloud Init] Starting Node.js API & Web Server on port ${PORT}..."
node backend/src/server.js &
NODE_PID=$!

echo "[Cloud Init] Services started: Node (PID: ${NODE_PID}), Python (PID: ${PYTHON_PID})"

# Trap signals for graceful shutdown
trap "kill -TERM ${NODE_PID} ${PYTHON_PID} 2>/dev/null; exit 0" SIGINT SIGTERM

# Keep container alive and monitor child processes
while true; do
  if ! kill -0 ${NODE_PID} 2>/dev/null; then
    echo "[Cloud Error] Node.js backend died unexpectedly. Exiting."
    exit 1
  fi
  if ! kill -0 ${PYTHON_PID} 2>/dev/null; then
    echo "[Cloud Warn] Python Video Studio died. Restarting..."
    python3 -u instagram_video_generator/server.py &
    PYTHON_PID=$!
  fi
  sleep 10
done
