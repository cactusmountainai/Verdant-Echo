from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class Meeting:
    id: int
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    participants: List[str]
    location: str
    status: str = "scheduled"
    
    def duration_minutes(self) -> int:
        return int((self.end_time - self.start_time).total_seconds() / 60)
