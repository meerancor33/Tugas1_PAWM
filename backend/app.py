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
from sqlalchemy import desc, text

from database import SessionLocal, Base, engine, init_db
from models import User, FlashcardProgress, QuizResult, GameStat, LearningAction

# ====== Config ======
SECRET_KEY = os.getenv("VL_SECRET_KEY") or os.getenv("SECRET_KEY", "dev-secret-change-me-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("VL_TOKEN_TTL_MIN", os.getenv("TOKEN_TTL_MIN", "43200")))  # 30 days

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(title="Virtual Lab Backend", version="1.1.0")

# ====== CORS ======
_frontend_env = os.getenv("VL_CORS_ORIGINS") or os.getenv("FRONTEND_URL", "https://virtual-lab-kimia.vercel.app,http://localhost:3000")
origins = [u.strip().rstrip('/') for u in _frontend_env.split(",") if u.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Origin", "Content-Type", "Authorization"],
)

# ====== Startup ======
@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    if not init_db():
        print("⚠️ Database init failed — check DATABASE_URL")

# ====== Password utils ======
def hash_password(password: str) -> str:
    if not password.strip():
        raise ValueError("Password cannot be empty")
    if len(password) > 72:
        raise ValueError("Password is too long (max 72 chars)")
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

# ====== Token utils ======
def create_token(user_id: int, email: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "email": email, "user_id": user_id, "exp": exp}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

# ====== DB dep ======
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token", headers={"WWW-Authenticate": "Bearer"})
    # tolerate either payload["user_id"] or payload["sub"] (string id)
    uid = payload.get("user_id") or payload.get("sub")
    try:
        uid = int(uid)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ====== Schemas ======
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

# ====== Root/health ======
@app.get("/")
def root():
    return {
        "message": "Virtual Learning API",
        "version": "1.1.0",
        "status": "running",
        "database": os.getenv("DATABASE_URL") or os.getenv("VL_DATABASE_URL") or "sqlite",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"
    return {"status": "healthy", "database": db_status, "timestamp": datetime.now(timezone.utc).isoformat()}

# ====== Auth ======
@app.post("/auth/register")
def register_form(
    email: str = Form(...),
    password: str = Form(...),
    full_name: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=email, password_hash=hash_password(password), full_name=full_name)
    db.add(user)
    db.commit()
    return {"message": "User registered successfully", "email": user.email}


# Back-compat: JSON body login (old frontend)
@app.post("/auth/login/json", response_model=TokenResp)
def login_json(body: dict, db: Session = Depends(get_db)):
    email = (body or {}).get("email")
    password = (body or {}).get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="email & password required")
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResp(access_token=create_token(user.id, user.email))


# OAuth2 Password Flow (current)
@app.post("/auth/login", response_model=TokenResp)
def login_oauth(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})
    return TokenResp(access_token=create_token(user.id, user.email))


@app.get("/users/me", response_model=UserResponse)
def users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at.isoformat(),
    )

# ====== Profile & Progress ======
@app.get("/profile")
def profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fcs = db.query(FlashcardProgress).filter(FlashcardProgress.user_id == current_user.id).order_by(FlashcardProgress.at.desc()).all()
    quizzes = db.query(QuizResult).filter(QuizResult.user_id == current_user.id).order_by(QuizResult.at.desc()).limit(100).all()
    games = db.query(GameStat).filter(GameStat.user_id == current_user.id).order_by(GameStat.at.desc()).limit(100).all()
    learn = db.query(LearningAction).filter(LearningAction.user_id == current_user.id).order_by(LearningAction.at.desc()).limit(100).all()
    return {
        "user": {"id": current_user.id, "email": current_user.email, "full_name": current_user.full_name, "created_at": current_user.created_at.isoformat()},
        "flashcards": [fc.to_dict() for fc in fcs],
        "quizzes": [q.to_dict() for q in quizzes],
        "games": [g.to_dict() for g in games],
        "learning": [l.to_dict() for l in learn],
    }


@app.post("/progress/flashcard")
def flashcard_progress(req: FlashcardReq, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.total <= 0:
        raise HTTPException(status_code=400, detail="Total must be greater than 0")
    if req.current > req.total:
        raise HTTPException(status_code=400, detail="Current cannot exceed total")
    existing = db.query(FlashcardProgress).filter(FlashcardProgress.user_id == current_user.id, FlashcardProgress.module == req.module).order_by(desc(FlashcardProgress.at)).first()
    if not existing or existing.current != req.current or existing.total != req.total:
        rec = FlashcardProgress(user_id=current_user.id, module=req.module, current=req.current, total=req.total)
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return {"ok": True, "id": rec.id, "at": rec.at.isoformat(), "progress": f"{req.current}/{req.total}"}
    return {"ok": True, "id": existing.id, "at": existing.at.isoformat(), "progress": f"{existing.current}/{existing.total}", "cached": True}


@app.post("/progress/quiz")
def quiz_result(req: QuizReq, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = QuizResult(user_id=current_user.id, module=req.module, score=req.score, total=req.total)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"ok": True, "id": rec.id, "at": rec.at.isoformat()}


@app.post("/progress/game")
def game_stat(req: GameReq, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = GameStat(user_id=current_user.id, game=req.game, metric=req.metric, value=req.value)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"ok": True, "id": rec.id, "at": rec.at.isoformat()}


@app.post("/progress/learning")
def learning_action(req: LearningReq, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = LearningAction(user_id=current_user.id, module=req.module, action=req.action)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"ok": True, "id": rec.id, "at": rec.at.isoformat()}