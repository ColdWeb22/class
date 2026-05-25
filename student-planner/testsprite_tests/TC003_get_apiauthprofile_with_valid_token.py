import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_get_apiauthprofile_with_valid_token():
    register_url = f"{BASE_URL}/api/auth/register"
    login_url = f"{BASE_URL}/api/auth/login"
    profile_url = f"{BASE_URL}/api/auth/profile"
    
    user_data = {
        "name": "Test User",
        "email": "testuser_tc003@example.com",
        "password": "StrongPass123!"
    }
    
    token = None
    
    try:
        # Register user
        reg_resp = requests.post(register_url, json=user_data, timeout=TIMEOUT)
        if reg_resp.status_code == 400:
            reg_json = reg_resp.json()
            assert reg_json.get("error") == "User already exists", f"Unexpected registration error: {reg_resp.text}"
        else:
            assert reg_resp.status_code == 201, f"Registration failed with status {reg_resp.status_code}, response: {reg_resp.text}"
            reg_json = reg_resp.json()
            assert "id" in reg_json or "userId" in reg_json, "Registration response missing user id"
            user_id = reg_json.get("id") or reg_json.get("userId")
        
        # Login user
        login_payload = {"email": user_data["email"], "password": user_data["password"]}
        login_resp = requests.post(login_url, json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}, response: {login_resp.text}"
        login_json = login_resp.json()
        assert "token" in login_json, "Login response missing token"
        token = login_json["token"]
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get profile
        profile_resp = requests.get(profile_url, headers=headers, timeout=TIMEOUT)
        assert profile_resp.status_code == 200, f"Profile fetch failed with status {profile_resp.status_code}, response: {profile_resp.text}"
        profile_json = profile_resp.json()
        # Check expected fields in profile
        expected_fields = {"name", "email", "university", "department", "targetCGPA"}
        assert expected_fields.issubset(set(profile_json.keys())), f"Profile response missing fields, got keys: {profile_json.keys()}"
        assert profile_json["email"].lower() == user_data["email"].lower(), "Profile email does not match registered email"

    finally:
        # Cleanup user
        if token:
            # The PRD and test info do not provide a DELETE user API.
            # Without API to delete user, skipping cleanup.
            pass

test_get_apiauthprofile_with_valid_token()
