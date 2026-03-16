from sqlalchemy import Column, Integer, DateTime, String, Float, ForeignKey, JSON, Boolean
from .base import Base
from datetime import datetime

class TimeSystem(Base):
    __tablename__ = 'time_systems'
    
    id = Column(Integer, primary_key=True)
    scene_id = Column(Integer, ForeignKey('farm_scenes.id'), nullable=False)
    current_time = Column(DateTime, default=datetime.utcnow)
    time_scale = Column(Float, default=1.0)  # Real-time vs game-time ratio
    is_paused = Column(Boolean, default=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata = Column(JSON)
    
    __table_args__ = {'sqlite_autoincrement': True}
