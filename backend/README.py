print("""
Backend Python (FastAPI)
1) Install dependencies: pip install -r scripts/backend/requirements.txt
2) Jalankan server: uvicorn scripts.backend.app:app --reload --host 0.0.0.0 --port 8000
3) Atur variabel environment opsional:
   - VL_SECRET_KEY, VL_TOKEN_TTL_MIN, VL_DATABASE_URL, VL_CORS_ORIGINS
4) Frontend melakukan fetch ke http://localhost:8000 (ubah di public/scripts/api.js bila perlu)
""")
