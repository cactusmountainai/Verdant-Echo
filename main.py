import sys
from models.init_timeline import initialize_timeline, _timeline, _time_system  # Import globals
from models.data_ingestion import DataIngestor
from multi_agent import AgentManager

def main():
    try:
        # Initialize systems in correct dependency order
        print("Initializing farm management system...")
        
        # 1. Initialize database and timelines first
        timeline = initialize_timeline()
        
        # 2. Set up data ingestion
        ingestor = DataIngestor()
        ingestor.start_ingestion()
        
        # 3. Initialize agent manager
        agent_manager = AgentManager()
        
        print("System initialized successfully")
        
    except Exception as e:
        print(f"Fatal error during system initialization: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
