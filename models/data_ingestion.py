from typing import Dict, Any, List, Optional
import csv
import json
from datetime import datetime

class DataIngestion:
    """Handle data ingestion from various sources"""
    
    @staticmethod
    def ingest_csv(file_path: str) -> List[Dict[str, Any]]:
        """Ingest data from CSV file"""
        data = []
        with open(file_path, 'r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Convert string dates to datetime objects if applicable
                for key, value in row.items():
                    if 'date' in key.lower() or 'time' in key.lower():
                        try:
                            row[key] = datetime.fromisoformat(value)
                        except (ValueError, TypeError):
                            pass  # Keep as string if not a valid date
                data.append(row)
        return data
    
    @staticmethod
    def ingest_json(file_path: str) -> Any:
        """Ingest data from JSON file"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    
    @staticmethod
    def validate_data(data: List[Dict[str, Any]], schema: Dict[str, Any]) -> bool:
        """
        Validate data against a schema
        
        Args:
            data: List of records to validate
            schema: Dictionary defining required fields and types
            
        Returns:
            Boolean indicating if validation passed
        """
        for record in data:
            for field, field_type in schema.items():
                if field not in record:
                    return False
                if not isinstance(record[field], field_type):
                    return False
        return True
