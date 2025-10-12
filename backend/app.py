import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, field_validator
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import SessionLocal, Base, engine
from models import User, FlashcardProgress, QuizResult, GameStat, LearningAction

# Configuration
SECRET_KEY = os.getenv("VL_SECRET_KEY", "dev-secret-change-me-in-production-2024")
ALGO = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("VL_TOKEN_TTL_MIN", "43200"))  # 30 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# DB init
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Virtual Lab Backend", version="1.0.0")

# CORS configuration
origins = os.getenv("VL_CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class RegisterReq(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class TokenResp(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

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

# Utilities
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_token(user_id: int, email: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "email": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGO)

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = creds.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Routes
@app.get("/")
def root():
    return {
        "message": "Virtual Learning API", 
        "version": "1.0.0", 
        "status": "running",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/auth/register")
def register(req: RegisterReq, db: Session = Depends(get_db)):
    existed = db.query(User).filter(User.email == req.email).first()
    if existed:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = pwd_context.hash(req.password)
    user = User(email=req.email, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "message": "User registered successfully", 
        "user": {
            "email": user.email, 
            "created_at": user.created_at.isoformat()
        }
    }

@app.post("/auth/login", response_model=TokenResp)
def login(req: LoginReq, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not pwd_context.verify(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user.id, user.email)
    return TokenResp(
        access_token=token,
        user={"email": user.email, "created_at": user.created_at.isoformat()}
    )

@app.get("/profile")
def profile(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get all flashcard progress for this user
    fcs = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current.id
    ).order_by(FlashcardProgress.at.desc()).all()
    
    quizzes = db.query(QuizResult).filter(
        QuizResult.user_id == current.id
    ).order_by(QuizResult.at.desc()).limit(100).all()
    
    games = db.query(GameStat).filter(
        GameStat.user_id == current.id
    ).order_by(GameStat.at.desc()).limit(100).all()
    
    learn = db.query(LearningAction).filter(
        LearningAction.user_id == current.id
    ).order_by(LearningAction.at.desc()).limit(100).all()
    
    return {
        "user": {
            "email": current.email, 
            "created_at": current.created_at.isoformat()
        },
        "flashcards": [fc.to_dict() for fc in fcs],
        "quizzes": [q.to_dict() for q in quizzes],
        "games": [g.to_dict() for g in games],
        "learning": [l.to_dict() for l in learn],
    }

@app.post("/progress/flashcard")
def flashcard_progress(
    req: FlashcardReq, 
    current: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Save flashcard progress for a specific module.
    Updates existing record for the module or creates a new one.
    """
    # Validate input
    if req.total <= 0:
        raise HTTPException(status_code=400, detail="Total must be greater than 0")
    
    if req.current > req.total:
        raise HTTPException(status_code=400, detail="Current cannot exceed total")
    
    # Check if there's an existing progress for this user and module
    existing = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current.id,
        FlashcardProgress.module == req.module
    ).order_by(desc(FlashcardProgress.at)).first()
    
    # Only create new record if progress has changed
    if not existing or existing.current != req.current or existing.total != req.total:
        rec = FlashcardProgress(
            user_id=current.id, 
            module=req.module, 
            current=req.current, 
            total=req.total
        )
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return {
            "ok": True, 
            "id": rec.id, 
            "at": rec.at.isoformat(),
            "progress": f"{req.current}/{req.total}"
        }
    
    # Return existing record if no change
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
    current: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    rec = QuizResult(
        user_id=current.id, 
        module=req.module, 
        score=req.score, 
        total=req.total
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"ok": True, "id": rec.id, "at": rec.at.isoformat()}

@app.post("/progress/game")
def game_stat(
    req: GameReq, 
    current: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    rec = GameStat(
        user_id=current.id, 
        game=req.game, 
        metric=req.metric, 
        value=req.value
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"ok": True, "id": rec.id, "at": rec.at.isoformat()}

@app.post("/progress/learning")
def learning_action(
    req: LearningReq, 
    current: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    rec = LearningAction(
        user_id=current.id, 
        module=req.module, 
        action=req.action
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"ok": True, "id": rec.id, "at": rec.at.isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))