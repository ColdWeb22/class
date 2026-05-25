import requests

def test_get_apiauthprofile_without_token():
    url = "http://localhost:5000/api/auth/profile"
    try:
        response = requests.get(url, timeout=30)
        assert response.status_code == 401, f"Expected status code 401, got {response.status_code}"
        # Optionally check response content for unauthorized message if provided
        # Example: assert "unauthorized" in response.text.lower()
    except requests.RequestException as e:
        assert False, f"Request to {url} failed with exception: {e}"

test_get_apiauthprofile_without_token()