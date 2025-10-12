# ---- base image yang lebih ramping
FROM python:3.10-slim

# ---- env dasar python
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# (opsional) install util kecil untuk healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# ---- workdir
WORKDIR /app

# ---- install deps lebih awal agar cache maksimal
COPY backend/requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt \
 && pip install --no-cache-dir "uvicorn[standard]"

# ---- copy source
COPY backend/ /app

# ---- konfigurasi port & module
# Railway akan mengisi PORT. Default 8000 utk lokal/docker run biasa.
ARG PORT=8000
ENV PORT=${PORT}

# APP_MODULE = "module:app" -> sesuaikan dengan strukturmu:
#   - kalau ada file backend/main.py dan di dalamnya FastAPI() bernama app  -> "main:app"
#   - kalau __init__.py di package "app" berisi app FastAPI                -> "app:app"
#   - kalau ada package app/main.py                                        -> "app.main:app"
ENV APP_MODULE="app:app"

# (opsional) EXPOSE: tidak wajib di Railway, tapi bagus untuk dokumentasi / lokal
EXPOSE 8000

# ---- healthcheck sederhana (opsional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/health || curl -fsS http://127.0.0.1:${PORT}/ || exit 1

# ---- jalankan uvicorn
# Gunakan APP_MODULE dan PORT, dengan fallback aman untuk lokal
CMD ["sh", "-c", "echo Using PORT=${PORT:-8000} APP_MODULE=${APP_MODULE:-app:app} && uvicorn ${APP_MODULE:-app:app} --host 0.0.0.0 --port ${PORT:-8000}"]