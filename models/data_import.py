from sqlalchemy import Column, Integer, String, DateTime, JSON, Enum
from .base import Base
from datetime import datetime
import enum

class ImportStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class DataImport(Base):
    __tablename__ = 'data_imports'
    
    id = Column(Integer, primary_key=True)
    source_type = Column(String(100), nullable=False)  # e.g., csv, json, api
    file_name = Column(String(255))
    import_data = Column(JSON)
    status = Column(Enum(ImportStatus), default=ImportStatus.PENDING)
    progress = Column(Float, default=0.0)
    error_message = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
