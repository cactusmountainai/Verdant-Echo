from typing import Dict, Any, List, Optional
import pandas as pd

class DataImport:
    """Handle data import operations"""
    
    @staticmethod
    def import_from_excel(file_path: str, sheet_name: str = None) -> List[Dict[str, Any]]:
        """
        Import data from Excel file
        
        Args:
            file_path: Path to the Excel file
            sheet_name: Specific sheet name to import (if None, first sheet)
            
        Returns:
            List of dictionaries representing rows
        """
        try:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            # Convert NaN values to None and return as list of dicts
            return df.where(pd.notnull(df), None).to_dict('records')
        except Exception as e:
            raise RuntimeError(f"Failed to import from Excel: {str(e)}")
    
    @staticmethod
    def import_from_api(url: str, headers: Optional[Dict[str, str]] = None) -> List[Dict[str, Any]]:
        """
        Import data from API endpoint
        
        Args:
            url: API endpoint URL
            headers: HTTP headers for the request
            
        Returns:
            List of dictionaries representing response data
        """
        import requests
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            # Assuming JSON response - adjust if needed
            data = response.json()
            
            # Handle both list and dict responses
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'results' in data:
                return data['results']
            else:
                return [data]
                
        except Exception as e:
            raise RuntimeError(f"Failed to import from API: {str(e)}")
