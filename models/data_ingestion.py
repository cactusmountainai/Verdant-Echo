from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Boolean
from .base import Base
from datetime import datetime

class DataIngestion(Base):
    __tablename__ = 'data_ingestions'
    
    id = Column(Integer, primary_key=True)
    source_id = Column(Integer, ForeignKey('data_imports.id'), nullable=False)
    target_entity = Column(String(100), nullable=False)  # e.g., farm_scene, timeline
    entity_id = Column(Integer)
    ingestion_data = Column(JSON)
    status = Column(String(50), default='pending')
    processed_count = Column(Integer, default=0)
    total_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
