from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FlashcardProgress(Base):
    __tablename__ = "flashcard_progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    module = Column(String, nullable=False)
    current = Column(Integer, default=0)
    total = Column(Integer, default=0)
    at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "module": self.module, 
            "current": self.current, 
            "total": self.total, 
            "at": self.at.isoformat()
        }

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    module = Column(String, nullable=False)
    score = Column(Integer, default=0)
    total = Column(Integer, default=0)
    at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "module": self.module, 
            "score": self.score, 
            "total": self.total, 
            "at": self.at.isoformat()
        }

class GameStat(Base):
    __tablename__ = "game_stats"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    game = Column(String, nullable=False)
    metric = Column(String, nullable=False)
    value = Column(Integer, default=0)
    at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "game": self.game, 
            "metric": self.metric, 
            "value": self.value, 
            "at": self.at.isoformat()
        }

class LearningAction(Base):
    __tablename__ = "learning_actions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    module = Column(String, nullable=False)
    action = Column(String, nullable=False)
    at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "module": self.module, 
            "action": self.action, 
            "at": self.at.isoformat()
        }