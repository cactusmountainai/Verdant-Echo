# Fix datetime handling and validation issues
from datetime import datetime, timedelta
from typing import Optional

class Meeting:
    def __init__(self, title: str, start_time: datetime, duration_minutes: int):
        self.title = title.strip() if title else ""
        self.start_time = start_time
        self.duration_minutes = max(1, duration_minutes)  # Minimum 1 minute
        
        # Validate start time is not in the past (allow 5min buffer for clock drift)
        now = datetime.now()
        if start_time < now - timedelta(minutes=5):
            raise ValueError("Meeting cannot be scheduled in the past")
        
        self.end_time = start_time + timedelta(minutes=duration_minutes)
    
    def is_conflict(self, other_meeting: 'Meeting') -> bool:
        """Check if this meeting conflicts with another"""
        return (self.start_time < other_meeting.end_time and 
                self.end_time > other_meeting.start_time)
