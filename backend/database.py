import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Railway PostgreSQL akan set DATABASE_URL, fallback ke SQLite untuk local
DB_URL = os.getenv("DATABASE_URL") or os.getenv("VL_DATABASE_URL", "sqlite:///./virtual_lab.db")

# Fix PostgreSQL URL (Railway pakai postgres://, SQLAlchemy butuh postgresql://)
if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)

# Connection settings
if DB_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine_kwargs = {"echo": False}
else:
    # PostgreSQL settings
    connect_args = {}
    engine_kwargs = {
        "echo": False,
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 10,
        "max_overflow": 20
    }

engine = create_engine(DB_URL, connect_args=connect_args, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()