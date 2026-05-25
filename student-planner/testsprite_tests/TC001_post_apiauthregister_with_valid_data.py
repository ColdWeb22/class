import requests

def test_post_apiauthregister_with_valid_data():
    base_url = "http://localhost:5000"
    url = f"{base_url}/api/auth/register"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "name": "Test User",
        "email": "testuser_unique_email@example.com",
        "password": "StrongPassw0rd!"
    }

    # Attempt registration
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    try:
        # Assert status code 201 Created
        assert response.status_code == 201, f"Expected status code 201, got {response.status_code}"
        json_resp = response.json()
        # Assert created user id present and is non-empty string or int
        assert "id" in json_resp, "Response JSON does not contain 'id'"
        assert isinstance(json_resp["id"], (str, int)), "'id' is not string or int"
        assert str(json_resp["id"]).strip() != "", "'id' is empty"
    finally:
        # Clean up by deleting the created user (if delete endpoint exists)
        # The PRD does not specify user deletion API, so skip delete.
        pass

test_post_apiauthregister_with_valid_data()