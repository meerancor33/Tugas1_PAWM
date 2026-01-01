import os
from datetime import datetime, timezone
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import SessionLocal, Base, engine, init_db

# Import routers
from auth import router as auth_router, get_current_user
from progress import router as progress_router

app = FastAPI(
    title="Virtual Lab Backend",
    version="2.0.0",
    description="API Backend untuk Virtual Lab Kimia dengan endpoint terpisah"
)

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

# ====== DB Dependency ======
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ====== Startup ======
@app.on_event("startup")
async def startup_event():
    init_db()
    print(f"🚀 Server started on {datetime.now(timezone.utc).isoformat()}")

# ====== Root/Health Endpoints ======
@app.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "message": "Virtual Learning API",
        "version": "2.0.0",
        "status": "running",
        "database": os.getenv("DATABASE_URL") or os.getenv("VL_DATABASE_URL") or "sqlite",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "endpoints": {
            "auth": "/auth",
            "progress": "/progress",
            "profile": "/profile",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/profile")
def get_profile(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile with all progress data"""
    from models import FlashcardProgress, QuizResult, GameStat, LearningAction
    
    # Get all user progress data
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
        "ok": True,
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat()
        },
        "statistics": {
            "total_flashcards": len(flashcards),
            "total_quizzes": len(quizzes),
            "total_games": len(games),
            "total_learning_actions": len(learning),
            "average_quiz_score": round(
                sum(q.score / q.total * 100 for q in quizzes if q.total > 0) / len(quizzes),
                2
            ) if quizzes else 0
        },
        "flashcards": [fc.to_dict() for fc in flashcards],
        "quizzes": [q.to_dict() for q in quizzes],
        "games": [g.to_dict() for g in games],
        "learning": [l.to_dict() for l in learning]
    }


# Auth endpoints: /auth/register, /auth/login, /auth/me, etc.
app.include_router(auth_router)


app.include_router(progress_router)

# ====== Backwards Compatibility Endpoints ======
# Keep old endpoints for backwards compatibility
@app.get("/users/me")
def users_me_compat(current_user = Depends(get_current_user)):
    """Backwards compatibility endpoint for /users/me"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "created_at": current_user.created_at.isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)