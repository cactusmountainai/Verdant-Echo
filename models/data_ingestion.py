# Fix data ingestion error handling and memory management
import logging
from typing import Generator

class DataIngestor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def ingest_data(self, source: str) -> Generator[dict, None, None]:
        """Ingest data with proper resource cleanup"""
        try:
            # Simulate data ingestion
            for i, record in enumerate(self._read_source(source)):
                if i % 1000 == 0:  # Log progress every 1000 records
                    self.logger.info(f"Ingested {i} records from {source}")
                
                yield record
                
        except Exception as e:
            self.logger.error(f"Error ingesting data from {source}: {e}")
            raise
    
    def _read_source(self, source: str) -> Generator[dict, None, None]:
        """Simulated data reader - replace with actual implementation"""
        # This is a placeholder - implement actual data reading logic
        # For now, just yield dummy data to prevent infinite loops
        for i in range(10):  # Limit to avoid infinite loop during testing
            yield {"id": i, "source": source}
