# Fix file path handling and add proper error checking
import os
from pathlib import Path

class StorageManager:
    def __init__(self, base_path: str = "./data"):
        self.base_path = Path(base_path).resolve()
        
        # Create base directory if it doesn't exist
        try:
            self.base_path.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            raise RuntimeError(f"Cannot create storage directory {base_path}: {e}")
    
    def save_file(self, filename: str, content: bytes) -> bool:
        """Save file with proper path validation"""
        # Prevent directory traversal attacks
        if '..' in filename or filename.startswith('/'):
            raise ValueError("Invalid filename")
        
        filepath = self.base_path / filename
        
        try:
            # Ensure parent directory exists
            filepath.parent.mkdir(parents=True, exist_ok=True)
            
            # Write file
            with open(filepath, 'wb') as f:
                f.write(content)
            return True
            
        except Exception as e:
            print(f"Error saving file {filename}: {e}")
            return False
    
    def get_file_path(self, filename: str) -> Path:
        """Get safe path for a file"""
        if '..' in filename or filename.startswith('/'):
            raise ValueError("Invalid filename")
        return self.base_path / filename
