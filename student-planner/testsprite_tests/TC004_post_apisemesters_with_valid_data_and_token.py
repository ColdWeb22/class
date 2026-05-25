import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_post_apisemesters_with_valid_data_and_token():
    # Given valid user credentials to obtain JWT token
    register_url = f"{BASE_URL}/api/auth/register"
    login_url = f"{BASE_URL}/api/auth/login"

    user_payload = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "TestPassword123!"
    }
    headers = {"Content-Type": "application/json"}

    # Register the user first to ensure login can succeed
    register_resp = requests.post(register_url, json=user_payload, headers=headers, timeout=TIMEOUT)
    # Registration may fail if user already exists (400), ignore if so
    assert register_resp.status_code in (201, 400), f"Registration failed: {register_resp.text}"

    # Attempt login to get token
    login_payload = {
        "email": user_payload["email"],
        "password": user_payload["password"]
    }
    login_resp = requests.post(login_url, json=login_payload, headers=headers, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json().get("token")
    assert token, "JWT token not returned in login response"

    auth_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    semester_url = f"{BASE_URL}/api/semesters"
    semester_payload = {
        "name": "Spring 2026",
        "level": 2,
        "status": "active"
    }

    created_semester_id = None
    try:
        # Create semester with valid data and token
        create_resp = requests.post(semester_url, json=semester_payload, headers=auth_headers, timeout=TIMEOUT)
        assert create_resp.status_code == 201, f"Expected 201 Created, got {create_resp.status_code}: {create_resp.text}"

        semester_data = create_resp.json()
        created_semester_id = semester_data.get("id")
        assert created_semester_id is not None, "Created semester ID missing in response"
        assert semester_data.get("name") == semester_payload["name"], "Semester name mismatch"
        assert semester_data.get("level") == semester_payload["level"], "Semester level mismatch"
        assert semester_data.get("status") == semester_payload["status"], "Semester status mismatch"
    finally:
        # Cleanup: Delete created semester if any
        if created_semester_id:
            delete_url = f"{semester_url}/{created_semester_id}"
            delete_resp = requests.delete(delete_url, headers=auth_headers, timeout=TIMEOUT)
            assert delete_resp.status_code == 204, f"Failed to delete semester, status code {delete_resp.status_code}"

test_post_apisemesters_with_valid_data_and_token()
