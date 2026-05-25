import requests

def test_post_apiplannercalculategpa_with_valid_inputs():
    base_url = "http://localhost:5000"
    endpoint = "/api/planner/calculate-gpa"
    url = base_url + endpoint
    payload = {
        "currentCGPA": 3.2,
        "completedCredits": 90,
        "targetCGPA": 3.5,
        "courses": [
            {"name": "Course 1", "credits": 3},
            {"name": "Course 2", "credits": 4},
            {"name": "Course 3", "credits": 3}
        ]
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"

    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON."

    # Validate keys presence
    assert "requiredGPA" in data, "Response JSON missing requiredGPA"
    assert "feasible" in data, "Response JSON missing feasible"
    assert "breakdown" in data, "Response JSON missing breakdown"

    # Validate types
    assert isinstance(data["requiredGPA"], (int, float)), "requiredGPA is not a number"
    assert isinstance(data["feasible"], bool), "feasible is not a boolean"
    assert isinstance(data["breakdown"], list), "breakdown is not a list"

    # Optional: Validate breakdown content is list of dicts with expected keys
    for item in data["breakdown"]:
        assert isinstance(item, dict), "breakdown item is not an object"
        assert "course" in item, "breakdown item missing course name"
        assert "requiredGrade" in item or "expectedGrade" in item, "breakdown item missing grade info"

test_post_apiplannercalculategpa_with_valid_inputs()