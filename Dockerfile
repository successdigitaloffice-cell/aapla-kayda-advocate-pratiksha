# ==============================================================================
# Multi-Runtime Cloud Dockerfile for Aapla Kayda – Advocate Pratiksha
# Combined Node.js 20 + Python 3.12 + FFmpeg + Chromium Headless Architecture
# ==============================================================================

FROM python:3.12-slim-bookworm

# Prevent python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV PORT=5050
ENV VIDEO_STUDIO_PORT=5055

WORKDIR /app

# 1. Install System Dependencies, FFmpeg, Chromium Headless, Devanagari Fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    ffmpeg \
    fonts-dejavu \
    fonts-mukti \
    fonts-lohit-deva \
    fonts-indic \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libasound2 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Python Dependencies for AI Video & TTS Studio
COPY instagram_video_generator/requirements.txt ./instagram_video_generator/requirements.txt
RUN pip install --no-cache-dir -r ./instagram_video_generator/requirements.txt \
    && pip install --no-cache-dir edge-tts fastapi uvicorn pillow numpy requests

# 3. Build Frontend Application
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# 4. Install Backend Dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# 5. Copy Application Source Code
COPY backend/ ./backend/
COPY instagram_video_generator/ ./instagram_video_generator/
COPY data/ ./data/
COPY docs/ ./docs/
COPY start_cloud.sh ./start_cloud.sh

# Ensure script is executable and create required directories
RUN chmod +x ./start_cloud.sh \
    && mkdir -p /app/backend/data/uploads/avatars \
    && mkdir -p /app/instagram_video_generator/output_reels \
    && mkdir -p /app/instagram_video_generator/temp_audio

# Expose ports (Node: 5050, Python Studio: 5055) - NEVER 5000
EXPOSE 5050 5055

# Healthcheck against backend API
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5050/api/health || exit 1

# Start Multi-Process Runner
CMD ["./start_cloud.sh"]
