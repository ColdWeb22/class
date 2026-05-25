import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_put_apisemestersid_with_updated_data_and_token():
    # First, register and login to get a valid JWT token
    register_payload = {
        "name": "Test User",
        "email": "testuser_tc005@example.com",
        "password": "StrongPass!123"
    }
    try:
        register_resp = requests.post(f"{BASE_URL}/api/auth/register", json=register_payload, timeout=TIMEOUT)
        if register_resp.status_code == 400:
            # Check if email already in use error, then proceed to login
            error_json = register_resp.json()
            if "email already in use" not in str(error_json).lower():
                assert False, f"Registration failed with 400 but not due to existing email: {error_json}"
        else:
            assert register_resp.status_code == 201
    except requests.RequestException as e:
        raise AssertionError(f"Registration failed: {e}")

    login_payload = {
        "email": register_payload["email"],
        "password": register_payload["password"]
    }
    try:
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload, timeout=TIMEOUT)
        assert login_resp.status_code == 200
        login_json = login_resp.json()
        token = login_json.get("token")
        assert token, "JWT token not found in login response"
    except requests.RequestException as e:
        raise AssertionError(f"Login failed: {e}")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Create a semester to update
    create_semester_payload = {
        "name": "Spring 2026",
        "level": 200,
        "status": "planned"
    }
    semester_id = None
    try:
        create_resp = requests.post(f"{BASE_URL}/api/semesters", json=create_semester_payload, headers=headers, timeout=TIMEOUT)
        assert create_resp.status_code == 201
        semester = create_resp.json()
        semester_id = semester.get("id")
        assert semester_id is not None, "Created semester ID not returned"

        # Update payload
        update_payload = {
            "name": "Spring 2026 Updated",
            "level": 300,
            "status": "active"
        }
        # Perform the PUT update
        update_resp = requests.put(f"{BASE_URL}/api/semesters/{semester_id}", json=update_payload, headers=headers, timeout=TIMEOUT)
        assert update_resp.status_code == 200
        updated_semester = update_resp.json()
        assert updated_semester.get("id") == semester_id
        assert updated_semester.get("name") == update_payload["name"]
        assert updated_semester.get("level") == update_payload["level"]
        assert updated_semester.get("status") == update_payload["status"]

        # Confirm the updated data with a GET request
        get_resp = requests.get(f"{BASE_URL}/api/semesters/{semester_id}", headers=headers, timeout=TIMEOUT)
        assert get_resp.status_code == 200
        semester_data = get_resp.json()
        assert semester_data.get("id") == semester_id
        assert semester_data.get("name") == update_payload["name"]
        assert semester_data.get("level") == update_payload["level"]
        assert semester_data.get("status") == update_payload["status"]
    except requests.RequestException as e:
        raise AssertionError(f"Request failed: {e}")
    finally:
        # Cleanup: delete the created semester
        if semester_id:
            try:
                del_resp = requests.delete(f"{BASE_URL}/api/semesters/{semester_id}", headers=headers, timeout=TIMEOUT)
                assert del_resp.status_code == 204
            except Exception:
                pass

test_put_apisemestersid_with_updated_data_and_token()