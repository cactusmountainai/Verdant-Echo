from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Boolean
from .base import Base
from datetime import datetime

class InitTimeline(Base):
    __tablename__ = 'init_timelines'
    
    id = Column(Integer, primary_key=True)
    timeline_id = Column(Integer, ForeignKey('project_timelines.id'), nullable=False)
    step_name = Column(String(255), nullable=False)
    description = Column(String(1000))
    order_index = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    due_date = Column(DateTime)
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
