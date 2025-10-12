import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_URL = os.getenv(
    "DATABASE_URL",
    # 👇 PASTE YOUR CLOUD DATABASE URL HERE (or set env var)
    "postgresql://postgres:WWkvzlmBiObtMIAFSBBvOlwWquRwHxNM@postgres.railway.internal:5432/railway"  # Replace with your cloud DB
)

# Auto-fix Railway/Heroku format
if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)

# ============================================
# CLOUD-OPTIMIZED ENGINE SETTINGS
# ============================================
engine = create_engine(
    DB_URL,
    echo=False,                      # Set True to see SQL queries (debug)
    pool_pre_ping=True,              # Test connection health before use
    pool_recycle=300,                # Recycle connections every 5 min
    pool_size=5,                     # Smaller pool for cloud databases
    max_overflow=10,                 # Extra connections when needed
    pool_timeout=30,                 # Wait 30s for connection
    connect_args={
        "connect_timeout": 100000,       # Connection timeout
        "options": "-c timezone=utc", # Force UTC
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def init_db():
    """
    Auto-create all tables on cloud database.
    Safe to run multiple times - won't delete existing data.
    """
    try:
        print("🔗 Connecting to cloud database...")
        Base.metadata.create_all(bind=engine)
        print("✅ Cloud database tables initialized successfully")
        print(f"📊 Database: {DB_URL.split('@')[1].split('/')[0] if '@' in DB_URL else 'configured'}")
        return True
    except Exception as e:
        print(f"❌ Cloud database error: {e}")
        print("💡 Tips:")
        print("   - Check your DATABASE_URL is correct")
        print("   - Verify database is accessible from your IP")
        print("   - Check firewall/security group settings")
        return False


def get_db_session():
    """Get database session with automatic cleanup"""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()