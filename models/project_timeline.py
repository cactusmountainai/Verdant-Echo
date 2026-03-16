from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any

@dataclass
class TimelineEvent:
    id: str
    title: str
    description: str
    date: datetime
    category: str
    related_items: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat(),
            'category': self.category,
            'related_items': self.related_items
        }

@dataclass
class ProjectTimeline:
    events: List[TimelineEvent]
    
    def add_event(self, event: TimelineEvent) -> None:
        """Add an event to the timeline"""
        self.events.append(event)
        
    def get_events_by_date(self, date: datetime) -> List[TimelineEvent]:
        """Get all events for a specific date"""
        return [event for event in self.events if event.date.date() == date.date()]
    
    def get_upcoming_events(self, days_ahead: int = 7) -> List[TimelineEvent]:
        """Get events within the next N days"""
        from datetime import timedelta
        today = datetime.now().date()
        end_date = today + timedelta(days=days_ahead)
        
        return [event for event in self.events 
                if today <= event.date.date() <= end_date]
