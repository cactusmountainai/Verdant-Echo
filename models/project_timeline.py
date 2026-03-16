# Fix timeline calculation and add validation
from datetime import datetime, timedelta
from typing import List, Optional

class ProjectTimeline:
    def __init__(self):
        self.events = []  # List of (datetime, event_type, description)
    
    def add_event(self, date: datetime, event_type: str, description: str):
        """Add event with validation"""
        if not isinstance(date, datetime):
            raise TypeError("Date must be a datetime object")
        
        if not event_type or not isinstance(event_type, str):
            raise ValueError("Event type must be a non-empty string")
            
        if not description or not isinstance(description, str):
            raise ValueError("Description must be a non-empty string")
        
        # Ensure events are added in chronological order
        if self.events and date < self.events[-1][0]:
            raise ValueError("Events must be added in chronological order")
        
        self.events.append((date, event_type, description))
    
    def get_events_in_range(self, start_date: datetime, end_date: datetime) -> List:
        """Get events within a date range"""
        return [event for event in self.events 
                if start_date <= event[0] <= end_date]
