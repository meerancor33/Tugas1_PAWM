import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, field_validator
from jose import jwt, JWTError
import bcrypt
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import SessionLocal, Base, engine, init_db
from models import User, FlashcardProgress, QuizResult, GameStat, LearningAction

# Configuration
SECRET_KEY = os.getenv("VL_SECRET_KEY", "dev-secret-change-me-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("VL_TOKEN_TTL_MIN", "43200"))  # 30 days

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Initialize FastAPI
app = FastAPI(
    title="Virtual Lab Backend", 
    version="1.0.0",
    description="Auto-initialized PostgreSQL backend with CRUD operations"
)

# CORS configuration
_frontend_env = os.getenv("FRONTEND_URL", "https://virtual-lab-kimia.vercel.app,http://localhost:3000")
origins = [u.strip().rstrip('/') for u in _frontend_env.split(",") if u.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Origin", "Content-Type", "Authorization"],
)


# ==================== STARTUP EVENT ====================
@app.on_event("startup")
async def startup_event():
    """Auto-initialize database on startup"""
    print("🚀 Starting Virtual Lab Backend...")
    print(f"📅 Server time: {datetime.now(timezone.utc).isoformat()}")
    
    # Auto-create all tables
    Base.metadata.create_all(bind=engine)
    if init_db():
        print("✅ PostgreSQL database ready for CRUD operations")
    else:
        print("⚠️ Database initialization failed - check PostgreSQL connection")


# ==================== PASSWORD UTILITIES ====================
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    if not password.strip():
        raise ValueError("Password cannot be empty")
    if len(password) > 72:
        raise ValueError("Password is too long (max 72 characters)")
    
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hashed password"""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), 
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


# ==================== TOKEN UTILITIES ====================
def create_token(user_id: int, email: str) -> str:
    """Create JWT access token"""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": email,
        "user_id": user_id,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# ==================== DEPENDENCIES ====================
def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


# ==================== PYDANTIC SCHEMAS ====================
class RegisterReq(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if not v.strip():
            raise ValueError('Password cannot be empty')
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        if len(v) > 72:
            raise ValueError('Password is too long (max 72 characters)')
        return v


class TokenResp(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: str


class FlashcardReq(BaseModel):
    module: str
    current: int
    total: int

    @field_validator('current', 'total')
    @classmethod
    def validate_positive(cls, v):
        if v < 0:
            raise ValueError('Value must be non-negative')
        return v


class QuizReq(BaseModel):
    module: str
    score: int
    total: int

    @field_validator('score', 'total')
    @classmethod
    def validate_positive(cls, v):
        if v < 0:
            raise ValueError('Value must be non-negative')
        return v


class GameReq(BaseModel):
    game: str
    metric: str
    value: int


class LearningReq(BaseModel):
    module: str
    action: str


# ==================== ROOT ROUTES ====================
@app.get("/")
def root():
    return {
        "message": "Virtual Learning API", 
        "version": "1.0.0", 
        "status": "running",
        "database": "PostgreSQL",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check with database connectivity test"""
    try:
        db.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy", 
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ==================== AUTH ROUTES ====================
@app.post("/auth/register")
def register(
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    db: Session = Depends(get_db)
):
    """Register new user"""
    # Validate password
    if not password.strip():
        raise HTTPException(
            status_code=400, 
            detail="Password cannot be empty"
        )
    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )
    if len(password) > 72:
        raise HTTPException(
            status_code=400, 
            detail="Password is too long (max 72 characters)"
        )
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="Email already registered"
        )
    
    # Hash password and create user
    try:
        hashed_password = hash_password(password)
        user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User registered successfully",
            "email": user.email
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )


@app.post("/auth/login", response_model=TokenResp)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user with OAuth2 password flow"""
    # Find user by email (username field in OAuth2)
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Verify credentials
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_token(user.id, user.email)
    
    return TokenResp(access_token=access_token)


@app.get("/users/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current authenticated user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at.isoformat()
    )


# ==================== PROFILE ROUTE ====================
@app.get("/profile")
def profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile with all progress data"""
    flashcards = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current_user.id
    ).order_by(FlashcardProgress.at.desc()).all()
    
    quizzes = db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id
    ).order_by(QuizResult.at.desc()).limit(100).all()
    
    games = db.query(GameStat).filter(
        GameStat.user_id == current_user.id
    ).order_by(GameStat.at.desc()).limit(100).all()
    
    learning = db.query(LearningAction).filter(
        LearningAction.user_id == current_user.id
    ).order_by(LearningAction.at.desc()).limit(100).all()
    
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat()
        },
        "flashcards": [fc.to_dict() for fc in flashcards],
        "quizzes": [q.to_dict() for q in quizzes],
        "games": [g.to_dict() for g in games],
        "learning": [l.to_dict() for l in learning],
    }


# ==================== PROGRESS ROUTES ====================
@app.post("/progress/flashcard")
def flashcard_progress(
    req: FlashcardReq,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save flashcard progress"""
    if req.total <= 0:
        raise HTTPException(
            status_code=400,
            detail="Total must be greater than 0"
        )
    
    if req.current > req.total:
        raise HTTPException(
            status_code=400,
            detail="Current cannot exceed total"
        )
    
    # Check existing progress
    existing = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current_user.id,
        FlashcardProgress.module == req.module
    ).order_by(desc(FlashcardProgress.at)).first()
    
    # Only create new record if progress changed
    if not existing or existing.current != req.current or existing.total != req.total:
        record = FlashcardProgress(
            user_id=current_user.id,
            module=req.module,
            current=req.current,
            total=req.total
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
        return {
            "ok": True,
            "id": record.id,
            "at": record.at.isoformat(),
            "progress": f"{req.current}/{req.total}"
        }
    
    return {
        "ok": True,
        "id": existing.id,
        "at": existing.at.isoformat(),
        "progress": f"{existing.current}/{existing.total}",
        "cached": True
    }


@app.post("/progress/quiz")
def quiz_result(
    req: QuizReq,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save quiz result"""
    record = QuizResult(
        user_id=current_user.id,
        module=req.module,
        score=req.score,
        total=req.total
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {
        "ok": True,
        "id": record.id,
        "at": record.at.isoformat()
    }


@app.post("/progress/game")
def game_stat(
    req: GameReq,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save game statistics"""
    record = GameStat(
        user_id=current_user.id,
        game=req.game,
        metric=req.metric,
        value=req.value
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {
        "ok": True,
        "id": record.id,
        "at": record.at.isoformat()
    }


@app.post("/progress/learning")
def learning_action(
    req: LearningReq,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Track learning action"""
    record = LearningAction(
        user_id=current_user.id,
        module=req.module,
        action=req.action
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {
        "ok": True,
        "id": record.id,
        "at": record.at.isoformat()
    }