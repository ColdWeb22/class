import requests

def test_post_apiplanneranalyzegrades_with_valid_inputs():
    url = "http://localhost:5000/api/planner/analyze-grades"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "targetGPA": 3.5,
        "courses": [
            {"name": "Calculus", "credits": 3},
            {"name": "Physics", "credits": 4},
            {"name": "Chemistry", "credits": 3}
        ]
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
    try:
        data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "recommendations" in data, "Response JSON missing 'recommendations'"
    assert "feasible" in data, "Response JSON missing 'feasible'"
    assert isinstance(data["recommendations"], list), "'recommendations' should be a list"
    # Validate each recommendation has required keys
    for rec in data["recommendations"]:
        assert "course" in rec, "Recommendation missing 'course'"
        assert "minimumGrade" in rec, "Recommendation missing 'minimumGrade'"
        assert "gradePoints" in rec, "Recommendation missing 'gradePoints'"
    assert isinstance(data["feasible"], bool), "'feasible' should be a boolean"

test_post_apiplanneranalyzegrades_with_valid_inputs()
