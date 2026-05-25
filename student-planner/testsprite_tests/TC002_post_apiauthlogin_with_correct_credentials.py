import requests

def test_post_apiauthlogin_with_correct_credentials():
    base_url = "http://localhost:5000"
    login_url = f"{base_url}/api/auth/login"
    # Use test credentials known to be correct.
    # For demonstration, using a placeholder email and password.
    payload = {
        "email": "testuser@example.com",
        "password": "TestPassword123!"
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(login_url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        json_data = response.json()
        assert "token" in json_data and isinstance(json_data["token"], str) and len(json_data["token"]) > 0, "JWT token missing or invalid in response"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_post_apiauthlogin_with_correct_credentials()