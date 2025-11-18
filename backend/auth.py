from fastapi import APIRouter, HTTPException, Depends, status, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
import bcrypt
import os

from database import SessionLocal
from models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ====== Config ======
SECRET_KEY = os.getenv("VL_SECRET_KEY") or os.getenv("SECRET_KEY", "dev-secret-change-me-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("VL_TOKEN_TTL_MIN", os.getenv("TOKEN_TTL_MIN", "43200")))

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ====== DB Dependency ======
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ====== Password Utils ======
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

# ====== Token Utils ======
def create_token(user_id: int, email: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "email": email, "user_id": user_id, "exp": exp}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

# ====== Current User Dependency ======
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Support both user_id and sub fields
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
    user: dict


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: str


class ChangePasswordReq(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def password_strength(cls, v):
        if not v.strip():
            raise ValueError('Password cannot be empty')
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        if len(v) > 72:
            raise ValueError('Password is too long (max 72 characters)')
        return v


# ====== Endpoints ======
@router.post("/register")
def register(
    email: str = Form(...),
    password: str = Form(...),
    full_name: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    """Register a new user"""
    # Validate email
    email = email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email cannot be empty")
    
    # Check if user exists
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password
    if not password.strip():
        raise HTTPException(status_code=400, detail="Password cannot be empty")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if len(password) > 72:
        raise HTTPException(status_code=400, detail="Password is too long (max 72 characters)")
    
    # Create user
    try:
        user = User(
            email=email,
            password_hash=hash_password(password),
            full_name=full_name.strip() if full_name else None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return {
            "ok": True,
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "created_at": user.created_at.isoformat()
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login", response_model=TokenResp)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login with email and password (OAuth2 flow)"""
    # Find user by email (username field contains email)
    user = db.query(User).filter(User.email == form.username.strip().lower()).first()
    
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Create token
    token = create_token(user.id, user.email)
    
    return TokenResp(
        access_token=token,
        user={
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat()
        }
    )


@router.post("/login/json", response_model=TokenResp)
def login_json(body: dict, db: Session = Depends(get_db)):
    """Login with JSON body (backwards compatibility)"""
    email = (body or {}).get("email", "").strip().lower()
    password = (body or {}).get("password", "")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user.id, user.email)
    
    return TokenResp(
        access_token=token,
        user={
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": user.created_at.isoformat()
        }
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        created_at=current_user.created_at.isoformat()
    )


@router.post("/change-password")
def change_password(
    req: ChangePasswordReq,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    # Verify current password
    if not verify_password(req.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Update password
    try:
        current_user.password_hash = hash_password(req.new_password)
        db.commit()
        
        return {
            "ok": True,
            "message": "Password changed successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to change password: {str(e)}")


@router.put("/profile")
def update_profile(
    full_name: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    try:
        if full_name is not None:
            current_user.full_name = full_name.strip() if full_name.strip() else None
        
        db.commit()
        db.refresh(current_user)
        
        return {
            "ok": True,
            "message": "Profile updated successfully",
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "full_name": current_user.full_name,
                "created_at": current_user.created_at.isoformat()
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


@router.delete("/account")
def delete_account(
    password: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account (requires password confirmation)"""
    # Verify password
    if not verify_password(password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Password is incorrect")
    
    try:
        # Delete user (cascade will delete all related records)
        db.delete(current_user)
        db.commit()
        
        return {
            "ok": True,
            "message": "Account deleted successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {str(e)}")


@router.post("/verify-token")
def verify_token(token: str = Depends(oauth2_scheme)):
    """Verify if a token is valid"""
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {
        "ok": True,
        "valid": True,
        "user_id": payload.get("user_id"),
        "email": payload.get("email"),
        "expires_at": datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc).isoformat()
    }