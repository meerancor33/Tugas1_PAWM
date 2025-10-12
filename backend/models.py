from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    flashcard_progress = relationship("FlashcardProgress", back_populates="user")
    quiz_results = relationship("QuizResult", back_populates="user")
    game_stats = relationship("GameStat", back_populates="user")
    learning_actions = relationship("LearningAction", back_populates="user")


class FlashcardProgress(Base):
    __tablename__ = "flashcard_progress"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    module = Column(String, nullable=False, index=True)
    current = Column(Integer, default=0)
    total = Column(Integer, default=0)
    at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Relationship
    user = relationship("User", back_populates="flashcard_progress")

    def to_dict(self):
        return {
            "id": self.id,
            "module": self.module,
            "current": self.current,
            "total": self.total,
            "at": self.at.isoformat()
        }


class QuizResult(Base):
    __tablename__ = "quiz_results"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    module = Column(String, nullable=False, index=True)
    score = Column(Integer, default=0)
    total = Column(Integer, default=0)
    at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Relationship
    user = relationship("User", back_populates="quiz_results")

    def to_dict(self):
        return {
            "id": self.id,
            "module": self.module,
            "score": self.score,
            "total": self.total,
            "percentage": round((self.score / self.total * 100), 2) if self.total > 0 else 0,
            "at": self.at.isoformat()
        }


class GameStat(Base):
    __tablename__ = "game_stats"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    game = Column(String, nullable=False, index=True)
    metric = Column(String, nullable=False)
    value = Column(Integer, default=0)
    at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Relationship
    user = relationship("User", back_populates="game_stats")

    def to_dict(self):
        return {
            "id": self.id,
            "game": self.game,
            "metric": self.metric,
            "value": self.value,
            "at": self.at.isoformat()
        }


class LearningAction(Base):
    __tablename__ = "learning_actions"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    module = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False)
    at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    
    # Relationship
    user = relationship("User", back_populates="learning_actions")

    def to_dict(self):
        return {
            "id": self.id,
            "module": self.module,
            "action": self.action,
            "at": self.at.isoformat()
        }