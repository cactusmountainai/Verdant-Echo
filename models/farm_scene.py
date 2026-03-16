from dataclasses import dataclass
from typing import Dict, List, Optional
from datetime import datetime

@dataclass
class Crop:
    id: str
    type: str
    growth_stage: int  # 0-4 (planted, sprout, growing, mature, harvested)
    planted_at: datetime
    harvest_time_days: int
    
    def is_ready_for_harvest(self) -> bool:
        """Check if crop is ready for harvest"""
        days_since_planted = (datetime.now() - self.planted_at).days
        return days_since_planted >= self.harvest_time_days

@dataclass
class Animal:
    id: str
    type: str
    age_months: int
    health_status: str  # healthy, sick, quarantined
    
    def can_produce(self) -> bool:
        """Check if animal can produce (e.g., milk, eggs)"""
        return self.health_status == "healthy" and self.age_months > 3

@dataclass
class FarmSceneData:
    crops: Dict[str, Crop]
    animals: Dict[str, Animal]
    storage: Dict[str, int]  # item_id -> quantity
    weather_conditions: str  # sunny, rainy, stormy, etc.
    
    def add_crop(self, crop: Crop) -> None:
        """Add a crop to the farm scene"""
        self.crops[crop.id] = crop
    
    def add_animal(self, animal: Animal) -> None:
        """Add an animal to the farm scene"""
        self.animals[animal.id] = animal
