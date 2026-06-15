import unittest
import sys
import os

def run_all_tests():
    print("==========================================================")
    print("          VAYUSETU CLIMATE DIGITAL TWIN TEST HARNESS")
    print("==========================================================")
    print("Discovered Test Modules:")
    print(" - backend/tests/test_main.py (API Gateway Health)")
    print(" - backend/tests/test_security.py (JWT & Cryptography)")
    print(" - backend/tests/test_ai_model.py (PyTorch ConvLSTM Shapes)")
    print(" - backend/tests/test_simulation.py (Hydrological runoff formulas)")
    print("----------------------------------------------------------")
    print("Running test suite...")
    
    loader = unittest.TestLoader()
    # Discover tests inside backend/tests
    tests_dir = os.path.join(os.path.dirname(__file__), "backend", "tests")
    suite = loader.discover(start_dir=tests_dir, pattern="test_*.py")
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("==========================================================")
    if result.wasSuccessful():
        print("SUCCESS: All VAYUSETU test modules passed successfully!")
        sys.exit(0)
    else:
        print("FAILED: Some VAYUSETU test modules failed. Check logs above.")
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()
