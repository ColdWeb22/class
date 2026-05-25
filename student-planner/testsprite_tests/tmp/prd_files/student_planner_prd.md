# Student Planner — Product Requirements Document

## Overview
A full-stack academic planner web application helping university students manage semesters, track courses/grades, calculate CGPA, plan study hours, analyze grade combinations, and visualize academic performance.

## Tech Stack
- **Frontend**: React 19, Vite 7, TailwindCSS 4, React Router 7, Recharts, Lucide React, React Hot Toast
- **Backend**: Node.js, Express 5, Sequelize 6, JWT, Passport.js (Google OAuth 2.0)
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Ports**: Frontend: 5173, Backend: 5000

## Features & Requirements

### FR-1: User Authentication
- Users can register with name, email, and password
- Users can log in with email and password; receive a JWT token
- Users can log in via Google OAuth 2.0
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt

**API Endpoints**:
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/google` — Initiate Google OAuth
- `GET /api/auth/google/callback` — Google OAuth callback
- `GET /api/auth/profile` — Get authenticated user profile (requires JWT)
- `PUT /api/auth/profile` — Update profile (requires JWT)

---

### FR-2: Semester Management
- Authenticated users can create semesters with name, level (100–800), and status (planned/in-progress/completed)
- Users can list, view, update, and delete their semesters
- Each semester has a calculated GPA based on courses

**API Endpoints**:
- `GET /api/semesters` — List all semesters for user
- `POST /api/semesters` — Create a semester
- `GET /api/semesters/:id` — Get a single semester
- `PUT /api/semesters/:id` — Update a semester
- `DELETE /api/semesters/:id` — Delete a semester (and its courses)

---

### FR-3: Course Management
- Users can add courses to a semester with: name, credit units, grade
- Credit units valid range: 1–6
- Grades: A (4.0), B (3.0), C (2.0), D (1.0), F (0.0)
- Users can update/delete courses

**API Endpoints**:
- `POST /api/semesters/:semesterId/courses` — Add course to semester
- `PUT /api/semesters/courses/:courseId` — Update course
- `DELETE /api/semesters/courses/:courseId` — Delete course

---

### FR-4: CGPA Planner (Public)
- Users input current CGPA, completed credit units, target CGPA, and list of courses for upcoming semester
- System calculates required semester GPA to achieve target CGPA
- Returns feasibility (warning if required GPA > 4.0)
- Available without login

**API Endpoint**:
- `POST /api/planner/calculate-gpa`
  - Body: `{ currentCGPA, completedCredits, targetCGPA, courses: [{ name, credits }] }`
  - Response: `{ requiredGPA, feasible, breakdown }`

---

### FR-5: Study Hours Planner (Public)
- Users input courses with credit units and difficulty, plus weekly available hours
- System recommends study hours per course based on GPA goals

**API Endpoint**:
- `POST /api/planner/plan-study`
  - Body: `{ targetGPA, availableHours, courses: [{ name, credits, difficulty }] }`
  - Response: `{ schedule: [{ course, recommendedHours }], totalHours }`

---

### FR-6: Grade Analyzer (Public)
- Users input courses and target semester GPA
- System uses greedy algorithm to recommend minimum grades per course to hit target

**API Endpoint**:
- `POST /api/planner/analyze-grades`
  - Body: `{ targetGPA, courses: [{ name, credits }] }`
  - Response: `{ recommendations: [{ course, minimumGrade, gradePoints }] }`

---

### FR-7: Dashboard
- Authenticated view showing current CGPA, target CGPA, total semesters, total courses
- Recent semesters list with quick navigation

---

### FR-8: Data Visualization
- Authenticated users see GPA trend (line chart over semesters)
- Grade distribution pie chart
- Credit load bar chart per semester

---

### FR-9: Comparison Tool
- Users can compare up to 5 GPA planning scenarios side-by-side
- Each scenario is an independent GPA calculation
- Best scenario (lowest required GPA) is highlighted

---

### FR-10: Export
- Users can export study plans and comparisons to PDF, CSV, or TXT

---

### FR-11: Profile Management
- Users can update name, email, university, department, and target CGPA

---

## Non-Functional Requirements
- Rate limiting: 5 requests per 15 min on auth endpoints; 100 requests per 15 min on API
- CORS: Only allow configured frontend origin
- Security: Helmet headers, bcrypt hashing, JWT validation
- Responsive design with dark/light mode support
