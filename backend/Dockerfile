# ========== Base image ==========
FROM python:3.10-slim

# Non-interaktif, no pycache
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# Install dependency untuk psycopg2 dan curl (buat healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# ========== Set workdir ==========
WORKDIR /app

# ========== Install dependencies ==========
COPY backend/requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt \
 && pip install --no-cache-dir "uvicorn[standard]"

# ========== Copy source ==========
COPY backend/ /app

# ========== Expose and environment ==========
ARG PORT=8000
ENV PORT=${PORT}
ENV APP_MODULE="app:app"

EXPOSE 8000

# ========== Healthcheck ==========
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/health || exit 1

# ========== Run uvicorn ==========
CMD ["sh", "-c", "echo Using PORT=${PORT:-8000} APP_MODULE=${APP_MODULE:-app:app} && uvicorn ${APP_MODULE:-app:app} --host 0.0.0.0 --port ${PORT:-8000}"]