# Test FastAPI Backend

import requests
import json

# Test data
test_data = {
    "data": [
        {"time": 0, "measured_value": 98.5},
        {"time": 1, "measured_value": 101.2},
        {"time": 2, "measured_value": 99.8},
        {"time": 3, "measured_value": 102.5},
        {"time": 4, "measured_value": 100.1},
        {"time": 5, "measured_value": 103.7},
        {"time": 6, "measured_value": 99.3},
        {"time": 7, "measured_value": 101.8},
        {"time": 8, "measured_value": 100.5},
        {"time": 9, "measured_value": 102.9},
    ],
    "numPredictions": 5
}

def test_backend(base_url="http://localhost:8000"):
    print(f"Testing FastAPI backend at {base_url}\n")
    
    # Test 1: Health check
    print("Test 1: Health Check")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
    except Exception as e:
        print(f"Error: {e}\n")
        return
    
    # Test 2: Root endpoint
    print("Test 2: Root Endpoint")
    try:
        response = requests.get(f"{base_url}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    # Test 3: Prediction endpoint
    print("Test 3: Prediction Endpoint")
    try:
        response = requests.post(
            f"{base_url}/api/predict",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Method: {result['method']}")
            print(f"Number of predictions: {len(result['predictions'])}")
            print("\nPredictions:")
            for pred in result['predictions']:
                print(f"  Time {pred['time']:.2f}: {pred['predicted_value']:.2f}")
        else:
            print(f"Error Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_backend()
