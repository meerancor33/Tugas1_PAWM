from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("VL_DATABASE_URL") or "sqlite:///./virtual_lab.db"

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        # Ensure users.full_name exists (for old DBs)
        with engine.connect() as conn:
            inspector = inspect(engine)
            if "users" in inspector.get_table_names():
                cols = [c["name"] for c in inspector.get_columns("users")]
                if "full_name" not in cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR(255)"))
                    conn.commit()
        return True
    except Exception as e:
        print("init_db error:", e)
        return False