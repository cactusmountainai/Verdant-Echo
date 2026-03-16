from .project_timeline import ProjectTimeline
from .time_system import TimeSystem
import logging

# Define global variables at module level before function definition
_timeline = None
_time_system = None

def initialize_timeline():
    """Initialize the project timeline system"""
    try:
        # Initialize time system first
        global _time_system, _timeline  # Declare as global to modify
        
        _time_system = TimeSystem()
        
        # Create and populate timeline
        _timeline = ProjectTimeline()
        
        # Add default milestones (example)
        from datetime import datetime, timedelta
        today = datetime.now()
        
        _timeline.add_event(today + timedelta(days=1), "PLANNING", "Project kickoff")
        _timeline.add_event(today + timedelta(days=7), "DEVELOPMENT", "First prototype ready")
        _timeline.add_event(today + timedelta(days=30), "TESTING", "System testing phase")
        _timeline.add_event(today + timedelta(days=60), "LAUNCH", "System launch")
        
        logging.info("Project timeline initialized successfully")
        return _timeline
        
    except Exception as e:
        logging.error(f"Failed to initialize timeline: {e}")
        raise RuntimeError(f"Timeline initialization failed: {e}")
