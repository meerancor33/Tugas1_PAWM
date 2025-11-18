from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from pydantic import BaseModel, field_validator

from database import SessionLocal
from models import User, FlashcardProgress, QuizResult, GameStat, LearningAction

router = APIRouter(prefix="/progress", tags=["Progress"])

# ====== DB Dependency ======
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ====== Schemas ======
class FlashcardReq(BaseModel):
    module: str
    current: int
    total: int

    @field_validator('module')
    @classmethod
    def validate_module(cls, v):
        if not v.strip():
            raise ValueError("Module name cannot be empty")
        return v

    @field_validator('current', 'total')
    @classmethod
    def validate_positive(cls, v):
        if v < 0:
            raise ValueError("Values must be positive")
        return v


class QuizReq(BaseModel):
    module: str
    score: int
    total: int

    @field_validator('module')
    @classmethod
    def validate_module(cls, v):
        if not v.strip():
            raise ValueError("Module name cannot be empty")
        return v

    @field_validator('score', 'total')
    @classmethod
    def validate_positive(cls, v):
        if v < 0:
            raise ValueError("Values must be positive")
        return v


class GameReq(BaseModel):
    game: str
    metric: str
    value: int

    @field_validator('game', 'metric')
    @classmethod
    def validate_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v

    @field_validator('value')
    @classmethod
    def validate_value(cls, v):
        if v < 0:
            raise ValueError("Value must be positive")
        return v


class LearningReq(BaseModel):
    module: str
    action: str

    @field_validator('module', 'action')
    @classmethod
    def validate_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v


class ProgressSummary(BaseModel):
    total_flashcards_completed: int
    total_quizzes_taken: int
    average_quiz_score: float
    total_games_played: int
    total_learning_actions: int
    modules_studied: list[str]
    recent_activity: list[dict]


# ====== Endpoints ======
@router.post("/flashcard")
def save_flashcard_progress(
    req: FlashcardReq,
    current_user: User = Depends(lambda: None),  # Will be replaced by auth dependency
    db: Session = Depends(get_db)
):
    """Save or update flashcard progress for a module"""
    if req.total <= 0:
        raise HTTPException(status_code=400, detail="Total must be greater than 0")
    if req.current > req.total:
        raise HTTPException(status_code=400, detail="Current cannot exceed total")

    # Check if there's a recent identical entry (avoid duplicates within 1 minute)
    existing = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current_user.id,
        FlashcardProgress.module == req.module
    ).order_by(desc(FlashcardProgress.at)).first()

    if not existing or existing.current != req.current or existing.total != req.total:
        new_progress = FlashcardProgress(
            user_id=current_user.id,
            module=req.module,
            current=req.current,
            total=req.total
        )
        db.add(new_progress)
        db.commit()
        db.refresh(new_progress)
        return {
            "ok": True,
            "id": new_progress.id,
            "at": new_progress.at.isoformat(),
            "progress": f"{new_progress.current}/{new_progress.total}",
            "percentage": round((new_progress.current / new_progress.total * 100), 2) if new_progress.total > 0 else 0,
            "cached": False
        }

    return {
        "ok": True,
        "id": existing.id,
        "at": existing.at.isoformat(),
        "progress": f"{existing.current}/{existing.total}",
        "percentage": round((existing.current / existing.total * 100), 2) if existing.total > 0 else 0,
        "cached": True
    }


@router.get("/flashcard")
def get_flashcard_progress(
    module: Optional[str] = None,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Get flashcard progress, optionally filtered by module"""
    query = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current_user.id
    )
    
    if module:
        query = query.filter(FlashcardProgress.module == module)
    
    records = query.order_by(FlashcardProgress.at.desc()).all()
    
    return {
        "ok": True,
        "count": len(records),
        "data": [rec.to_dict() for rec in records]
    }


@router.post("/quiz")
def save_quiz_result(
    req: QuizReq,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Save quiz result"""
    if req.total <= 0:
        raise HTTPException(status_code=400, detail="Total must be greater than 0")
    if req.score > req.total:
        raise HTTPException(status_code=400, detail="Score cannot exceed total")

    rec = QuizResult(
        user_id=current_user.id,
        module=req.module,
        score=req.score,
        total=req.total
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return {
        "ok": True,
        "id": rec.id,
        "module": rec.module,
        "score": rec.score,
        "total": rec.total,
        "percentage": round((rec.score / rec.total * 100), 2) if rec.total > 0 else 0,
        "at": rec.at.isoformat()
    }


@router.get("/quiz")
def get_quiz_results(
    module: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Get quiz results, optionally filtered by module"""
    query = db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id
    )
    
    if module:
        query = query.filter(QuizResult.module == module)
    
    records = query.order_by(QuizResult.at.desc()).limit(limit).all()
    
    return {
        "ok": True,
        "count": len(records),
        "data": [rec.to_dict() for rec in records]
    }


@router.post("/game")
def save_game_stat(
    req: GameReq,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Save game statistics"""
    rec = GameStat(
        user_id=current_user.id,
        game=req.game,
        metric=req.metric,
        value=req.value
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return {
        "ok": True,
        "id": rec.id,
        "game": rec.game,
        "metric": rec.metric,
        "value": rec.value,
        "at": rec.at.isoformat()
    }


@router.get("/game")
def get_game_stats(
    game: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Get game statistics, optionally filtered by game name"""
    query = db.query(GameStat).filter(
        GameStat.user_id == current_user.id
    )
    
    if game:
        query = query.filter(GameStat.game == game)
    
    records = query.order_by(GameStat.at.desc()).limit(limit).all()
    
    return {
        "ok": True,
        "count": len(records),
        "data": [rec.to_dict() for rec in records]
    }


@router.post("/learning")
def save_learning_action(
    req: LearningReq,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Save learning action"""
    rec = LearningAction(
        user_id=current_user.id,
        module=req.module,
        action=req.action
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    return {
        "ok": True,
        "id": rec.id,
        "module": rec.module,
        "action": rec.action,
        "at": rec.at.isoformat()
    }


@router.get("/learning")
def get_learning_actions(
    module: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Get learning actions, optionally filtered by module"""
    query = db.query(LearningAction).filter(
        LearningAction.user_id == current_user.id
    )
    
    if module:
        query = query.filter(LearningAction.module == module)
    
    records = query.order_by(LearningAction.at.desc()).limit(limit).all()
    
    return {
        "ok": True,
        "count": len(records),
        "data": [rec.to_dict() for rec in records]
    }


@router.get("/summary")
def get_progress_summary(
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Get comprehensive progress summary for the user"""
    
    # Flashcard stats
    flashcards = db.query(FlashcardProgress).filter(
        FlashcardProgress.user_id == current_user.id
    ).all()
    
    total_flashcards = sum(fc.current for fc in flashcards)
    
    # Quiz stats
    quizzes = db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id
    ).all()
    
    total_quizzes = len(quizzes)
    avg_score = sum(q.score / q.total * 100 for q in quizzes if q.total > 0) / total_quizzes if total_quizzes > 0 else 0
    
    # Game stats
    games = db.query(GameStat).filter(
        GameStat.user_id == current_user.id
    ).all()
    
    total_games = len(games)
    
    # Learning actions
    learning = db.query(LearningAction).filter(
        LearningAction.user_id == current_user.id
    ).all()
    
    total_learning = len(learning)
    
    # Modules studied (unique)
    modules = set()
    for fc in flashcards:
        modules.add(fc.module)
    for q in quizzes:
        modules.add(q.module)
    for l in learning:
        modules.add(l.module)
    
    # Recent activity (last 20 items from all types)
    recent = []
    
    for fc in flashcards[:20]:
        recent.append({
            "type": "flashcard",
            "module": fc.module,
            "details": f"{fc.current}/{fc.total}",
            "at": fc.at.isoformat()
        })
    
    for q in quizzes[:20]:
        recent.append({
            "type": "quiz",
            "module": q.module,
            "details": f"Score: {q.score}/{q.total}",
            "at": q.at.isoformat()
        })
    
    for g in games[:20]:
        recent.append({
            "type": "game",
            "game": g.game,
            "details": f"{g.metric}: {g.value}",
            "at": g.at.isoformat()
        })
    
    for l in learning[:20]:
        recent.append({
            "type": "learning",
            "module": l.module,
            "action": l.action,
            "at": l.at.isoformat()
        })
    
    # Sort by timestamp
    recent.sort(key=lambda x: x["at"], reverse=True)
    recent = recent[:20]
    
    return {
        "ok": True,
        "summary": {
            "total_flashcards_completed": total_flashcards,
            "total_quizzes_taken": total_quizzes,
            "average_quiz_score": round(avg_score, 2),
            "total_games_played": total_games,
            "total_learning_actions": total_learning,
            "modules_studied": sorted(list(modules)),
            "modules_count": len(modules)
        },
        "recent_activity": recent
    }


@router.delete("/flashcard/{progress_id}")
def delete_flashcard_progress(
    progress_id: int,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Delete a specific flashcard progress record"""
    rec = db.query(FlashcardProgress).filter(
        FlashcardProgress.id == progress_id,
        FlashcardProgress.user_id == current_user.id
    ).first()
    
    if not rec:
        raise HTTPException(status_code=404, detail="Progress record not found")
    
    db.delete(rec)
    db.commit()
    
    return {"ok": True, "message": "Progress deleted successfully"}


@router.delete("/quiz/{quiz_id}")
def delete_quiz_result(
    quiz_id: int,
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Delete a specific quiz result"""
    rec = db.query(QuizResult).filter(
        QuizResult.id == quiz_id,
        QuizResult.user_id == current_user.id
    ).first()
    
    if not rec:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    
    db.delete(rec)
    db.commit()
    
    return {"ok": True, "message": "Quiz result deleted successfully"}


@router.delete("/all")
def delete_all_progress(
    current_user: User = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    """Delete all progress data for the current user"""
    
    # Delete all records
    db.query(FlashcardProgress).filter(FlashcardProgress.user_id == current_user.id).delete()
    db.query(QuizResult).filter(QuizResult.user_id == current_user.id).delete()
    db.query(GameStat).filter(GameStat.user_id == current_user.id).delete()
    db.query(LearningAction).filter(LearningAction.user_id == current_user.id).delete()
    
    db.commit()
    
    return {"ok": True, "message": "All progress data deleted successfully"}