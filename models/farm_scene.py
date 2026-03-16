# Fix rendering and state management issues
import pygame  # Assuming this is used based on context

class FarmScene:
    def __init__(self):
        self.objects = []
        self.camera_x = 0
        self.camera_y = 0
    
    def update(self, delta_time: float):
        """Update scene state"""
        for obj in self.objects:
            obj.update(delta_time)
    
    def render(self, screen):
        """Render scene with proper bounds checking"""
        if not screen:
            return
            
        # Clear screen first
        screen.fill((0, 128, 0))  # Green background for farm
        
        # Render objects relative to camera position
        for obj in self.objects:
            try:
                obj.render(screen, self.camera_x, self.camera_y)
            except Exception as e:
                print(f"Error rendering object: {e}")
                continue
    
    def add_object(self, obj):
        """Add object with validation"""
        if hasattr(obj, 'update') and hasattr(obj, 'render'):
            self.objects.append(obj)
        else:
            raise ValueError("Object must have update() and render() methods")
