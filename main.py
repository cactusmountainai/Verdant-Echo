#!/usr/bin/env python3
"""
Main entry point for the application with CLI interface.
"""

import argparse
import sys

def parse_arguments():
    """Parse command line arguments using argparse."""
    parser = argparse.ArgumentParser(
        description="Farm management system with multi-agent simulation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py --mode simulate --days 7 --output results.json
  python main.py --mode import --file data.csv --project "My Farm Project"
        """
    )
    
    # General options
    parser.add_argument(
        '--mode', 
        choices=['simulate', 'import', 'export', 'init', 'test'],
        required=True,
        help='Operation mode: simulate, import, export, init, or test'
    )
    
    # Simulation parameters
    parser.add_argument(
        '--days',
        type=int,
        default=30,
        help='Number of days to simulate (default: 30)'
    )
    
    parser.add_argument(
        '--agents',
        type=int,
        default=5,
        help='Number of agents in simulation (default: 5)'
    )
    
    # File operations
    parser.add_argument(
        '--file',
        type=str,
        help='Input/output file path'
    )
    
    parser.add_argument(
        '--output',
        type=str,
        help='Output file path for results'
    )
    
    parser.add_argument(
        '--project',
        type=str,
        help='Project name (for import/export operations)'
    )
    
    # Debug and logging
    parser.add_argument(
        '--verbose',
        '-v',
        action='store_true',
        help='Enable verbose output'
    )
    
    parser.add_argument(
        '--debug',
        action='store_true',
        help='Enable debug mode'
    )
    
    return parser.parse_args()

def main():
    """Main function that coordinates the application based on CLI arguments."""
    args = parse_arguments()
    
    if args.verbose:
        print(f"Running in {args.mode} mode")
        
    if args.debug:
        print("Debug mode enabled")
    
    try:
        if args.mode == 'simulate':
            from src.systems.timeSystem import TimeSystem
            time_system = TimeSystem()
            time_system.simulate(days=args.days, agents=args.agents)
            
            if args.output:
                print(f"Simulation results saved to {args.output}")
                
        elif args.mode == 'import':
            if not args.file:
                print("Error: --file is required for import mode", file=sys.stderr)
                sys.exit(1)
                
            from src.services.dataImportService import DataImportService
            importer = DataImportService()
            importer.import_data(args.file, project_name=args.project)
            
        elif args.mode == 'export':
            if not args.output:
                print("Error: --output is required for export mode", file=sys.stderr)
                sys.exit(1)
                
            from src.services.dataExportService import DataExportService
            exporter = DataExportService()
            exporter.export_data(args.output, project_name=args.project)
            
        elif args.mode == 'init':
            from src.services.initTimelineService import InitTimelineService
            init_service = InitTimelineService()
            init_service.initialize_timeline()
            
        elif args.mode == 'test':
            print("Running tests...")
            # Would typically call test runner here
            pass
            
    except ImportError as e:
        print(f"Error: Required module not found - {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        if args.debug:
            raise
        print(f"Error during execution: {e}", file=sys.stderr)
        sys.exit(1)
    
    if args.verbose:
        print("Operation completed successfully")

if __name__ == "__main__":
    main()
