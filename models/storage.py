from dataclasses import dataclass
from typing import Dict, Any, Optional

@dataclass
class StorageItem:
    id: str
    name: str
    category: str
    quantity: int
    unit: str
    location: str
    last_updated: Optional[str] = None
    
    def update_quantity(self, change: int) -> bool:
        """Update quantity and return True if successful"""
        new_quantity = self.quantity + change
        if new_quantity >= 0:
            self.quantity = new_quantity
            return True
        return False

@dataclass
class Storage:
    items: Dict[str, StorageItem]
    
    def add_item(self, item: StorageItem) -> None:
        """Add a storage item"""
        self.items[item.id] = item
    
    def get_item(self, item_id: str) -> Optional[StorageItem]:
        """Get a storage item by ID"""
        return self.items.get(item_id)
