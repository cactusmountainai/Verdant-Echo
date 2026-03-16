from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Boolean
from .base import Base
from datetime import datetime

class ProjectTimeline(Base):
    __tablename__ = 'project_timelines'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(String(50), default='planned')  # planned, active, completed, paused
    project_data = Column(JSON)
    scene_id = Column(Integer, ForeignKey('farm_scenes.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
