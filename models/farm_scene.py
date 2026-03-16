from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean
from .base import Base
from datetime import datetime

class FarmScene(Base):
    __tablename__ = 'farm_scenes'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    config_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
