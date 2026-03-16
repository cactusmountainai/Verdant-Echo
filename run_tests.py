import unittest
import sys
import os

def run_full_test_suite():
    """Run the full test suite to confirm app behavior is unchanged after refactors"""
    
    # Discover and run all tests recursively in the project root directory
    # Use the parent directory of this script as start_dir to ensure we cover entire project
    start_dir = os.path.dirname(__file__)
    # Traverse up if needed, but default to project root; adjust based on your structure if necessary
    # For maximum coverage: discover recursively from project root (assuming run_tests.py is in a tools/ or scripts/ dir)
    
    # If this script is inside a 'scripts/' or 'tools/' folder, go up one level
    if os.path.basename(start_dir) in ('scripts', 'tools'):
        start_dir = os.path.dirname(start_dir)
    
    loader = unittest.TestLoader()
    suite = loader.discover(start_dir, pattern='*_test.py', top_level_dir=start_dir)
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return exit code based on test results
    if result.wasSuccessful():
        print("\n✅ All tests passed! No regressions detected in state management or scene flow.")
        return 0
    else:
        print("\n❌ Some tests failed! Regressions detected in state management or scene flow.")
        return 1

if __name__ == "__main__":
    sys.exit(run_full_test_suite())
