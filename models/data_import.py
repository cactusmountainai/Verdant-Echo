# Fix CSV import handling and encoding issues
import csv
from typing import List, Dict

class DataImporter:
    def __init__(self):
        self.encoding = 'utf-8-sig'  # Handle BOM in Excel exports
    
    def import_csv(self, file_path: str) -> List[Dict]:
        """Import CSV with proper error handling"""
        try:
            data = []
            with open(file_path, 'r', encoding=self.encoding) as csvfile:
                reader = csv.DictReader(csvfile)
                
                # Check if headers exist
                if not reader.fieldnames:
                    raise ValueError("CSV file has no headers")
                
                for row in reader:
                    # Clean up whitespace in keys and values
                    clean_row = {key.strip(): value.strip() if isinstance(value, str) else value 
                                for key, value in row.items()}
                    data.append(clean_row)
            
            return data
            
        except FileNotFoundError:
            raise FileNotFoundError(f"CSV file not found: {file_path}")
        except UnicodeDecodeError as e:
            raise ValueError(f"Invalid encoding in CSV file: {e}")
        except Exception as e:
            raise RuntimeError(f"Error importing CSV: {e}")
