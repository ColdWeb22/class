import requests

def test_post_apiplannerplanstudy_with_valid_inputs():
    base_url = "http://localhost:5000"
    endpoint = "/api/planner/plan-study"
    url = base_url + endpoint
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "targetGPA": 3.5,
        "availableHours": 20,
        "courses": [
            {"name": "Calculus", "credits": 3, "difficulty": 4},
            {"name": "Physics", "credits": 4, "difficulty": 3},
            {"name": "Literature", "credits": 2, "difficulty": 2}
        ]
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    json_response = None
    try:
        json_response = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "schedule" in json_response, "Response JSON missing 'schedule' key"
    assert isinstance(json_response["schedule"], list), "'schedule' should be a list"
    assert len(json_response["schedule"]) > 0, "'schedule' list should not be empty"
    for item in json_response["schedule"]:
        assert "course" in item, "Each schedule item missing 'course'"
        assert "recommendedHours" in item, "Each schedule item missing 'recommendedHours'"
        assert isinstance(item["recommendedHours"], (int, float)), "'recommendedHours' should be numeric"

    assert "totalHours" in json_response, "Response JSON missing 'totalHours' key"
    assert isinstance(json_response["totalHours"], (int, float)), "'totalHours' should be numeric"

test_post_apiplannerplanstudy_with_valid_inputs()