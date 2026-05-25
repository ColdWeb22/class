
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** student-planner
- **Date:** 2026-03-13
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 post apiauthregister with valid data
- **Test Code:** [TC001_post_apiauthregister_with_valid_data.py](./TC001_post_apiauthregister_with_valid_data.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 30, in <module>
  File "<string>", line 22, in test_post_apiauthregister_with_valid_data
AssertionError: Response JSON does not contain 'id'

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/97867335-5804-4628-9039-b4133321f964
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 post apiauthlogin with correct credentials
- **Test Code:** [TC002_post_apiauthlogin_with_correct_credentials.py](./TC002_post_apiauthlogin_with_correct_credentials.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 23, in <module>
  File "<string>", line 17, in test_post_apiauthlogin_with_correct_credentials
AssertionError: Expected status code 200, got 401

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/b0e9a39d-1cc4-491a-b11d-ed5786cb741e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 get apiauthprofile with valid token
- **Test Code:** [TC003_get_apiauthprofile_with_valid_token.py](./TC003_get_apiauthprofile_with_valid_token.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 57, in <module>
  File "<string>", line 26, in test_get_apiauthprofile_with_valid_token
AssertionError: Registration failed with status 429, response: {"success":false,"error":"Too many authentication attempts, please try again later."}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/f4d4bd0c-707c-4edb-910a-8e5b0ef12e94
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 post apisemesters with valid data and token
- **Test Code:** [TC004_post_apisemesters_with_valid_data_and_token.py](./TC004_post_apisemesters_with_valid_data_and_token.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 64, in <module>
  File "<string>", line 21, in test_post_apisemesters_with_valid_data_and_token
AssertionError: Registration failed: {"success":false,"error":"Too many authentication attempts, please try again later."}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/1d866f36-c521-4187-9d4f-791e1811edb3
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 put apisemestersid with updated data and token
- **Test Code:** [TC005_put_apisemestersid_with_updated_data_and_token.py](./TC005_put_apisemestersid_with_updated_data_and_token.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 90, in <module>
  File "<string>", line 21, in test_put_apisemestersid_with_updated_data_and_token
AssertionError

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/71d31c51-4f8c-4ac4-80fc-0a5fbc27256d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 post apisemesterssemesteridcourses with valid data and token
- **Test Code:** [TC006_post_apisemesterssemesteridcourses_with_valid_data_and_token.py](./TC006_post_apisemesterssemesteridcourses_with_valid_data_and_token.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 97, in <module>
  File "<string>", line 24, in test_post_apisemesterssemesteridcourses_with_valid_data_and_token
AssertionError: Registration failed: {"success":false,"error":"Too many authentication attempts, please try again later."}

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/a2f6e180-c8c4-46c6-b600-628c5fa9f493
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 post apiplannercalculategpa with valid inputs
- **Test Code:** [TC007_post_apiplannercalculategpa_with_valid_inputs.py](./TC007_post_apiplannercalculategpa_with_valid_inputs.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 48, in <module>
  File "<string>", line 25, in test_post_apiplannercalculategpa_with_valid_inputs
AssertionError: Expected status 200, got 400

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/14f9b5f3-9c1c-4079-a829-b6fd1107d504
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 post apiplannerplanstudy with valid inputs
- **Test Code:** [TC008_post_apiplannerplanstudy_with_valid_inputs.py](./TC008_post_apiplannerplanstudy_with_valid_inputs.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 43, in <module>
  File "<string>", line 24, in test_post_apiplannerplanstudy_with_valid_inputs
AssertionError: Expected 200, got 400

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/33bef836-3425-4b5a-a64d-94d6b91073d8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 post apiplanneranalyzegrades with valid inputs
- **Test Code:** [TC009_post_apiplanneranalyzegrades_with_valid_inputs.py](./TC009_post_apiplanneranalyzegrades_with_valid_inputs.py)
- **Test Error:** Traceback (most recent call last):
  File "/var/task/handler.py", line 258, in run_with_retry
    exec(code, exec_env)
  File "<string>", line 38, in <module>
  File "<string>", line 22, in test_post_apiplanneranalyzegrades_with_valid_inputs
AssertionError: Expected status 200 but got 400

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/e300f0ed-aa64-4233-b9b4-b439ac6ee13c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 get apiauthprofile without token
- **Test Code:** [TC010_get_apiauthprofile_without_token.py](./TC010_get_apiauthprofile_without_token.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f81e6927-b01f-4a93-a0d1-0aa8b9d822f9/fb51b9b0-f18f-4442-b539-453fa0741721
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **10.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---