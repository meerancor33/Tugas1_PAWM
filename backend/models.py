from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    flashcard_progress = relationship("FlashcardProgress", back_populates="user", cascade="all, delete-orphan")
    quiz_results = relationship("QuizResult", back_populates="user", cascade="all, delete-orphan")
    game_stats = relationship("GameStat", back_populates="user", cascade="all, delete-orphan")
    learning_actions = relationship("LearningAction", back_populates="user", cascade="all, delete-orphan")


class FlashcardProgress(Base):
    __tablename__ = "flashcard_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module = Column(String(255), nullable=False, index=True)
    current = Column(Integer, default=0)
    total = Column(Integer, default=0)
    at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    user = relationship("User", back_populates="flashcard_progress")
    def to_dict(self):
        return {"id": self.id, "module": self.module, "current": self.current, "total": self.total, "at": self.at.isoformat()}


class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module = Column(String(255), nullable=False, index=True)
    score = Column(Integer, default=0)
    total = Column(Integer, default=0)
    at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    user = relationship("User", back_populates="quiz_results")
    def to_dict(self):
        pct = round((self.score / self.total * 100), 2) if self.total > 0 else 0
        return {"id": self.id, "module": self.module, "score": self.score, "total": self.total, "percentage": pct, "at": self.at.isoformat()}


class GameStat(Base):
    __tablename__ = "game_stats"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    game = Column(String(255), nullable=False, index=True)
    metric = Column(String(255), nullable=False)
    value = Column(Integer, default=0)
    at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    user = relationship("User", back_populates="game_stats")
    def to_dict(self):
        return {"id": self.id, "game": self.game, "metric": self.metric, "value": self.value, "at": self.at.isoformat()}


class LearningAction(Base):
    __tablename__ = "learning_actions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module = Column(String(255), nullable=False, index=True)
    action = Column(String(255), nullable=False)
    at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    user = relationship("User", back_populates="learning_actions")
    def to_dict(self):
        return {"id": self.id, "module": self.module, "action": self.action, "at": self.at.isoformat()}
