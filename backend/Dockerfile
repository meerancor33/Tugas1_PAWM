# backend/Dockerfile (build context = backend/)
FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Karena build context = backend/, file ini cukup:
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt \
 && pip install --no-cache-dir "uvicorn[standard]"

# Copy seluruh source backend
COPY . /app

ARG PORT=8000
ENV PORT=${PORT}
# Sesuaikan dgn file yang punya FastAPI() bernama 'app'
ENV APP_MODULE="app:app"

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT}/health || curl -fsS http://127.0.0.1:${PORT}/ || exit 1

CMD ["sh", "-c", "echo Using PORT=${PORT:-8000} APP_MODULE=${APP_MODULE:-app:app} && uvicorn ${APP_MODULE:-app:app} --host 0.0.0.0 --port ${PORT:-8000}"]