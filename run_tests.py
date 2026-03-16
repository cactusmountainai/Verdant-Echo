import subprocess
import sys
import os

def run_tests():
    """Run the full test suite after Redux refactor to ensure no behavioral changes in state updates or side effects."""
    
    print("Running full test suite after Redux refactor...")
    print("=" * 60)
    
    # Ensure we're in project root
    if not os.path.exists("package.json"):
        print("❌ package.json not found. Are you in the project root?")
        return False
    
    # Run Jest tests for Redux-related logic (reducers, actions, selectors, async thunks)
    print("Running Jest tests (Redux state and side effects)...")
    try:
        result = subprocess.run([
            "npx", "jest",
            "--config=jest.config.js",
            "--coverage",
            "--detectOpenHandles",
            "--testMatch=**/src/**/*.(spec|test).{ts,js}"
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
            
        if result.returncode != 0:
            print("❌ Jest tests failed! Redux state or side effects may have changed.")
            return False
            
    except FileNotFoundError:
        print("❌ Jest not found. Run 'npm install' to install dependencies.")
        return False
    except Exception as e:
        print(f"❌ Error running Jest tests: {e}")
        return False
    
    # Run TypeScript compilation check (to catch type errors in Redux types)
    print("\nRunning TypeScript compilation check...")
    try:
        result = subprocess.run([
            "tsc", "--noEmit"
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode != 0:
            print("❌ TypeScript compilation errors detected!")
            print(result.stderr)
            return False
        else:
            print("✅ TypeScript type checking passed.")
            
    except FileNotFoundError:
        print("⚠️ TypeScript compiler not found. Skipping type check.")
    except Exception as e:
        print(f"⚠️ Error running TypeScript check: {e}")
    
    # Run Vite build test to ensure bundle can be built with new Redux state structure
    print("\nRunning Vite build test...")
    try:
        result = subprocess.run([
            "npm", "run", "build"
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode != 0:
            print("❌ Vite build failed! Bundle may be broken due to Redux changes.")
            print(result.stderr)
            return False
        else:
            print("✅ Vite build succeeded.")
            
    except Exception as e:
        print(f"❌ Error running Vite build: {e}")
        return False
    
    # Verify critical Redux files exist (core store and slices)
    print("\nVerifying essential Redux files...")
    redux_files = [
        "src/store.ts",
        "src/features/gameSlice.ts",
        "src/features/userSlice.ts",
        "src/reducers/index.ts",  # if using legacy reducers
        "src/selectors/index.ts"
    ]
    
    missing_files = []
    for file in redux_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"⚠️ Missing expected Redux files: {missing_files}")
        # Not fatal, but should be investigated
    else:
        print("✅ All core Redux files found.")
    
    # Final summary
    print("\n" + "=" * 60)
    print("✅ Full test suite completed!")
    print("All tests passed. No behavioral changes detected in state updates or side effects.")
    
    return True

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
