from sqlalchemy import Column, Integer, String, DateTime, JSON, LargeBinary, Boolean
from .base import Base
from datetime import datetime

class SaveFile(Base):
    __tablename__ = 'save_files'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    file_path = Column(String(1000))
    data = Column(JSON)
    binary_data = Column(LargeBinary)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    version = Column(String(50))
    is_active = Column(Boolean, default=True)
