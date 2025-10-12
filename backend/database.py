from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# ---- Konfigurasi koneksi database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    """Inisialisasi database dan sinkronisasi kolom penting (misal: full_name)"""
    try:
        # Buat tabel kalau belum ada
        Base.metadata.create_all(bind=engine)

        # Tambahkan kolom 'full_name' di tabel users kalau belum ada
        with engine.connect() as conn:
            inspector = inspect(engine)
            cols = [col["name"] for col in inspector.get_columns("users")]

            if "full_name" not in cols:
                print("🧩 Menambahkan kolom 'full_name' ke tabel users ...")
                conn.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR(255);"))
                conn.commit()
                print("✅ Kolom 'full_name' berhasil ditambahkan.")

        print("✅ Cloud database tables initialized successfully")
        return True

    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        return False