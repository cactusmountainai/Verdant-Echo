from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Boolean
from .base import Base
from datetime import datetime

class Meeting(Base):
    __tablename__ = 'meetings'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000))
    scheduled_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=60)
    participants = Column(JSON)  # List of user IDs or names
    agenda = Column(JSON)
    minutes = Column(JSON)
    status = Column(String(50), default='scheduled')  # scheduled, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
