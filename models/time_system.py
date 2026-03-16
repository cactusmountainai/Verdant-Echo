from typing import Dict, Any, Optional
from datetime import datetime

class TimeSystem:
    """Manages simulated time in the application"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = {
            'speed': 1.0,           # Real-time speed multiplier
            'start_time': 0,        # Start time in seconds
            'time_unit': 'seconds', # Time unit for calculations
            **(config or {})
        }
        
        self.current_time = self.config['start_time']
        self.last_update = datetime.now()
    
    def update(self, delta_seconds: float) -> None:
        """Update the current time based on elapsed real-time"""
        now = datetime.now()
        elapsed_real_time = (now - self.last_update).total_seconds()
        
        # Apply speed multiplier to get simulated time progression
        self.current_time += elapsed_real_time * self.config['speed']
        self.last_update = now
    
    def get_current_time(self) -> float:
        """Get the current simulated time"""
        return self.current_time
    
    def set_time(self, new_time: float) -> None:
        """Set the current time directly"""
        self.current_time = max(0, new_time)
    
    def get_formatted_time(self) -> str:
        """Return formatted time string (HH:MM:SS)"""
        total_seconds = int(self.current_time)
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
