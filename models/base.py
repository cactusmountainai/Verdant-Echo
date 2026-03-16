from typing import Any, Dict, Optional
from abc import ABC, abstractmethod
from datetime import datetime

class BaseModel(ABC):
    """Abstract base class for all data models"""
    
    def __init__(self, id: Optional[str] = None):
        self.id = id
        self.created_at: Optional[datetime] = None
        self.updated_at: Optional[datetime] = None
    
    @abstractmethod
    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary representation"""
        pass
    
    @classmethod
    @abstractmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BaseModel':
        """Create model instance from dictionary"""
        pass
    
    def update_timestamps(self) -> None:
        """Update created_at and updated_at timestamps"""
        if not self.created_at:
            self.created_at = datetime.now()
        self.updated_at = datetime.now()

class ModelManager:
    """Base manager for handling model collections"""
    
    def __init__(self, model_class: Any):
        self.model_class = model_class
        self._items: Dict[str, Any] = {}
    
    def add(self, item: Any) -> None:
        """Add an item to the collection"""
        if hasattr(item, 'id') and item.id:
            self._items[item.id] = item
    
    def get(self, id: str) -> Optional[Any]:
        """Get an item by ID"""
        return self._items.get(id)
    
    def remove(self, id: str) -> bool:
        """Remove an item by ID"""
        if id in self._items:
            del self._items[id]
            return True
        return False
    
    def all(self) -> List[Any]:
        """Get all items"""
        return list(self._items.values())
