# Fix time synchronization and drift issues
import time
from datetime import datetime, timedelta

class TimeSystem:
    def __init__(self):
        self.start_time = datetime.now()
        self.time_scale = 1.0  # Real-time scale (1.0 = real time)
        self.last_update = time.time()
    
    def get_current_time(self) -> datetime:
        """Get current simulated time with drift compensation"""
        now = time.time()
        elapsed_seconds = (now - self.last_update) * self.time_scale
        self.last_update = now
        
        return self.start_time + timedelta(seconds=elapsed_seconds)
    
    def set_time_scale(self, scale: float):
        """Set time scale with validation"""
        if scale < 0:
            raise ValueError("Time scale cannot be negative")
        self.time_scale = scale
    
    def reset(self):
        """Reset time system"""
        self.start_time = datetime.now()
        self.last_update = time.time()
