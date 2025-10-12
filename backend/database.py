import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Railway akan set DATABASE_URL otomatis
# Untuk local development, fallback ke SQLite
DB_URL = os.getenv("DATABASE_URL", "sqlite:///./virtual_lab.db")

# PENTING: Railway pakai 'postgres://' tapi SQLAlchemy 2.0 butuh 'postgresql://'
if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)

# Setup connection berdasarkan database type
if DB_URL.startswith("sqlite"):
    # SQLite untuk local development
    connect_args = {"check_same_thread": False}
    engine_kwargs = {
        "echo": False
    }
else:
    # PostgreSQL untuk production
    connect_args = {}
    engine_kwargs = {
        "echo": False,
        "pool_pre_ping": True,      # Check connection sebelum use
        "pool_recycle": 300,         # Recycle connection setiap 5 menit
        "pool_size": 10,             # Max 10 connections
        "max_overflow": 20           # Extra 20 connections kalau pool penuh
    }

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()