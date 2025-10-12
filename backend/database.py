import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ============================================
# CLOUD DATABASE CONFIGURATION (NO LOCAL INSTALL NEEDED!)
# ============================================
# Pilih salah satu cloud provider di bawah:

# Option 1: Railway.app (Recommended - Auto deploy)
# 1. Sign up: https://railway.app
# 2. New Project → Add PostgreSQL
# 3. Copy DATABASE_URL from Variables tab
# 4. Set environment variable atau paste di bawah

# Option 2: Supabase (Free 500MB)
# 1. Sign up: https://supabase.com  
# 2. New project → Settings → Database
# 3. Copy connection string (URI mode)
# Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Option 3: Neon.tech (Free 10GB + Serverless)
# 1. Sign up: https://neon.tech
# 2. Create project → Connection string
# Format: postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]

# Option 4: ElephantSQL (Free 20MB)
# 1. Sign up: https://www.elephantsql.com
# 2. Create instance → Details → URL
# Format: postgres://[user]:[password]@[server].db.elephantsql.com/[user]

# ============================================
# SET YOUR DATABASE URL HERE OR VIA ENVIRONMENT
# ============================================
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


def init_database():
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