#!/usr/bin/env python3
"""
Run all existing unit and E2E tests after refactors to verify app behavior remains unchanged.
"""

import subprocess
import sys
import os
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def run_python_unit_tests():
    """Run Python unit tests with pytest"""
    logger.info("Running Python unit tests...")
    test_dir = Path("tests")
    if not test_dir.exists() or not any(test_dir.iterdir()):
        logger.warning("No Python unit test directory ('tests/') found. Skipping.")
        return True

    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest",
            "tests/",
            "--tb=short",
            "--disable-warnings",
            "-v"
        ], capture_output=True, text=True)

        if result.returncode == 0:
            logger.info("✅ Python unit tests passed!")
            return True
        else:
            logger.error("❌ Python unit tests failed!")
            print(result.stdout)
            if result.stderr:
                print(result.stderr)
            return False

    except FileNotFoundError:
        logger.error("pytest not found. Install with: pip install pytest")
        return False
    except Exception as e:
        logger.error(f"Error running Python unit tests: {e}")
        return False


def run_python_e2e_tests():
    """Run Python E2E tests (assuming they're in 'e2e/' directory)"""
    logger.info("Running Python E2E tests...")
    test_dir = Path("e2e")
    if not test_dir.exists() or not any(test_dir.iterdir()):
        logger.warning("No Python E2E test directory ('e2e/') found. Skipping.")
        return True

    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest",
            "e2e/",
            "--tb=short",
            "--disable-warnings",
            "-v"
        ], capture_output=True, text=True)

        if result.returncode == 0:
            logger.info("✅ Python E2E tests passed!")
            return True
        else:
            logger.error("❌ Python E2E tests failed!")
            print(result.stdout)
            if result.stderr:
                print(result.stderr)
            return False

    except FileNotFoundError:
        logger.error("pytest not found. Install with: pip install pytest")
        return False
    except Exception as e:
        logger.error(f"Error running Python E2E tests: {e}")
        return False


def run_javascript_unit_tests():
    """Run JavaScript/TypeScript unit tests using Jest"""
    logger.info("Running JavaScript/TypeScript unit tests...")
    
    package_json = Path("package.json")
    if not package_json.exists():
        logger.warning("package.json not found. Skipping JS tests.")
        return True

    # Try npx first (preferred for local installs)
    try:
        result = subprocess.run(["npx", "jest"], capture_output=True, text=True)
        if result.returncode == 0:
            logger.info("✅ JavaScript unit tests passed!")
            return True
        else:
            logger.error("❌ JavaScript unit tests failed!")
            print(result.stdout)
            if result.stderr:
                print(result.stderr)
            return False

    except FileNotFoundError:
        # Fallback to npm test
        try:
            result = subprocess.run(["npm", "test"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info("✅ JavaScript unit tests passed!")
                return True
            else:
                logger.error("❌ JavaScript unit tests failed!")
                print(result.stdout)
                if result.stderr:
                    print(result.stderr)
                return False
        except Exception as e:
            logger.warning(f"Could not run JS unit tests with npm: {e}")
            return False  # Fail if we can't even invoke npm

    except Exception as e:
        logger.error(f"Error running JavaScript unit tests: {e}")
        return False


def run_javascript_e2e_tests():
    """Run JavaScript E2E tests (Cypress or Playwright)"""
    logger.info("Running JavaScript E2E tests...")

    # Check for Cypress
    cypress_config = Path("cypress.config.js")
    cypress_json = Path("cypress.json")
    if cypress_config.exists() or cypress_json.exists():
        logger.info("Detected Cypress E2E tests. Running...")
        try:
            result = subprocess.run(["npx", "cypress", "run"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info("✅ JavaScript E2E tests (Cypress) passed!")
                return True
            else:
                logger.error("❌ JavaScript E2E tests (Cypress) failed!")
                print(result.stdout)
                if result.stderr:
                    print(result.stderr)
                return False
        except FileNotFoundError:
            logger.warning("cypress not found. Install with: npm install cypress")
            return False

    # Check for Playwright
    playwright_config = Path("playwright.config.ts")
    playwright_config_js = Path("playwright.config.js")
    if playwright_config.exists() or playwright_config_js.exists():
        logger.info("Detected Playwright E2E tests. Running...")
        try:
            result = subprocess.run(["npx", "playwright", "test"], capture_output=True, text=True)
            if result.returncode == 0:
                logger.info("✅ JavaScript E2E tests (Playwright) passed!")
                return True
            else:
                logger.error("❌ JavaScript E2E tests (Playwright) failed!")
                print(result.stdout)
                if result.stderr:
                    print(result.stderr)
                return False
        except FileNotFoundError:
            logger.warning("playwright not found. Install with: npm install -D @playwright/test")
            return False

    # No E2E framework detected
    logger.warning("No JavaScript E2E test configuration (Cypress/Playwright) found. Skipping.")
    return True


def main():
    """Main function to run all tests"""
    logger.info("=== Running All Tests After Refactors ===")

    # Run each test suite and collect results
    python_unit_ok = run_python_unit_tests()
    python_e2e_ok = run_python_e2e_tests()
    js_unit_ok = run_javascript_unit_tests()
    js_e2e_ok = run_javascript_e2e_tests()

    # Overall result: all must pass
    all_passed = python_unit_ok and python_e2e_ok and js_unit_ok and js_e2e_ok

    if all_passed:
        logger.info("🎉 ALL TESTS PASSED! No regressions detected.")
        sys.exit(0)
    else:
        logger.error("❌ Some tests failed. Regressions may be present.")
        sys.exit(1)


if __name__ == "__main__":
    main()
