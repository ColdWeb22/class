import requests

BASE_URL = "http://localhost:5000"
TIMEOUT = 30

def test_post_apisemesterssemesteridcourses_with_valid_data_and_token():
    # First, register and login to get a valid JWT token
    user_data = {
        "name": "Test User",
        "email": "testuser_tc006@example.com",
        "password": "TestPassword123!"
    }
    token = None
    semester_id = None
    course_id = None

    try:
        # Register user
        reg_resp = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=user_data,
            timeout=TIMEOUT
        )
        assert reg_resp.status_code == 201, f"Registration failed: {reg_resp.text}"
        # Login user to get token
        login_resp = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": user_data["email"], "password": user_data["password"]},
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        token = login_resp.json().get("token")
        assert token, "JWT token not found in login response"

        headers = {"Authorization": f"Bearer {token}"}

        # Create a semester to add a course to
        semester_payload = {
            "name": "Spring 2026",
            "level": 1,
            "status": "planned"
        }
        sem_resp = requests.post(
            f"{BASE_URL}/api/semesters",
            headers=headers,
            json=semester_payload,
            timeout=TIMEOUT
        )
        assert sem_resp.status_code == 201, f"Create semester failed: {sem_resp.text}"
        semester = sem_resp.json()
        semester_id = semester.get("id")
        assert semester_id, "Semester ID missing in response"

        # Add course to semester
        course_payload = {
            "name": "Introduction to Testing",
            "credits": 3,
            "grade": "A"
        }
        course_resp = requests.post(
            f"{BASE_URL}/api/semesters/{semester_id}/courses",
            headers=headers,
            json=course_payload,
            timeout=TIMEOUT
        )
        assert course_resp.status_code == 201, f"Add course failed: {course_resp.text}"
        course = course_resp.json()
        course_id = course.get("id")
        assert course_id, "Course ID missing in response"
        # Validate returned course object contents
        assert course.get("name") == course_payload["name"]
        assert course.get("credits") == course_payload["credits"]
        assert course.get("grade") == course_payload["grade"]

    finally:
        # Cleanup: delete created course and semester if they exist
        if token and course_id:
            try:
                requests.delete(
                    f"{BASE_URL}/api/semesters/courses/{course_id}",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=TIMEOUT,
                )
            except Exception:
                pass
        if token and semester_id:
            try:
                requests.delete(
                    f"{BASE_URL}/api/semesters/{semester_id}",
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=TIMEOUT,
                )
            except Exception:
                pass
        # Optionally, delete the created user - but no API provided in PRD for user deletion

test_post_apisemesterssemesteridcourses_with_valid_data_and_token()
