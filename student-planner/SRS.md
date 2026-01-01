# Software Requirements Specification (SRS)
## Student Planner Application

**Version:** 1.0  
**Date:** December 31, 2025  
**Status:** Current Release

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification defines the functional and non-functional requirements for the Student Planner web application. The system helps students plan their academic semesters, track GPA progress, analyze grade requirements, and visualize their academic performance over time.

### 1.2 Scope
Student Planner is a full-stack web application consisting of:
- **Frontend**: React 19.2 with Vite, Tailwind CSS, and Recharts
- **Backend**: Express 5.2 with Sequelize ORM
- **Database**: PostgreSQL (production), SQLite/MySQL (development)
- **Authentication**: JWT-based with optional Google OAuth
- **Deployment**: Render platform with automatic HTTPS

Core modules include:
- User Authentication and Profile Management
- Semester and Course Management
- Planning Tools (GPA Planner, Study Hours Planner, Grade Analyzer, Comparison Tool)
- Data Visualization and Insights
- Export Functionality (PDF, CSV, Text)

### 1.3 Intended Audience
- **Students**: Undergraduate and graduate students tracking CGPA and planning semesters
- **Transfer Students**: Students comparing different academic scenarios
- **Working Students**: Students optimizing study time alongside employment
- **Academic Advisors**: Reviewing student plans during advising sessions

### 1.4 Definitions and Acronyms
- **CGPA**: Cumulative Grade Point Average
- **GPA**: Grade Point Average
- **JWT**: JSON Web Token
- **CRUD**: Create, Read, Update, Delete
- **SPA**: Single Page Application
- **REST**: Representational State Transfer
- **ORM**: Object-Relational Mapping

---

## 2. System Overview

### 2.1 System Context
The Student Planner is a client-server web application:
- **Client**: Single-page React application served as static files
- **API Server**: RESTful Express backend with JWT authentication
- **Database**: SQL database (PostgreSQL/MySQL/SQLite) accessed via Sequelize ORM
- **External Services**: Google OAuth for authentication (optional)

### 2.2 User Characteristics
Users are expected to:
- Have basic computer literacy and web browser knowledge
- Understand their institution's grading scale and credit system
- Have stable internet connectivity
- Use modern browsers (Chrome, Firefox, Edge, Safari)

### 2.3 Assumptions and Dependencies
- Users know their current CGPA and completed credits
- Course credit values are accurate
- Network connectivity is stable during operations
- Browsers support ES6+ JavaScript and modern CSS
- Node.js 16+ is available for deployment

---

## 3. Functional Requirements

### 3.1 User Authentication

#### 3.1.1 User Registration
**FR-AUTH-001**: The system shall allow users to register with email and password.
- Input: Name, email address, password (minimum 6 characters)
- Validation: Email format, unique email, password strength
- Output: User account creation and automatic login

#### 3.1.2 User Login
**FR-AUTH-002**: The system shall allow users to login with credentials.
- Input: Email and password
- Output: JWT token with 7-day expiration
- Error: Invalid credentials message

#### 3.1.3 Google OAuth
**FR-AUTH-003**: The system shall support Google OAuth login.
- Flow: Redirect to Google → Callback → JWT token generation
- Fallback: Email/password if OAuth fails

#### 3.1.4 Session Management
**FR-AUTH-004**: The system shall maintain user sessions via JWT.
- Token stored in localStorage
- Automatic logout on token expiration
- Token validation on protected routes

### 3.2 Profile Management

#### 3.2.1 View Profile
**FR-PROF-001**: Users shall be able to view their profile information.
- Display: Name, email, current CGPA, target CGPA
- Access: Protected route requiring authentication

#### 3.2.2 Update Profile
**FR-PROF-002**: Users shall be able to update profile settings.
- Editable: Name, current CGPA, target CGPA
- Validation: CGPA between 0.0 and 4.0
- Persistence: Immediate save to database

### 3.3 Semester Management

#### 3.3.1 Create Semester
**FR-SEM-001**: Users shall be able to create new semesters.
- Input: Semester name, status (planned/in-progress/completed)
- Output: Semester record with unique ID
- Association: Linked to authenticated user

#### 3.3.2 View Semesters
**FR-SEM-002**: Users shall be able to view all their semesters.
- Display: List with name, status, course count, GPA
- Sorting: Chronological order
- Access: Dashboard and dedicated semesters page

#### 3.3.3 Edit Semester
**FR-SEM-003**: Users shall be able to modify semester details.
- Editable: Name, status, actual GPA, courses
- Validation: GPA range 0.0-4.0

#### 3.3.4 Delete Semester
**FR-SEM-004**: Users shall be able to delete semesters.
- Confirmation: Required before deletion
- Cascade: Delete all associated courses
- Irreversible: No undo after confirmation

### 3.4 Course Management

#### 3.4.1 Add Course
**FR-CRS-001**: Users shall be able to add courses to semesters.
- Input: Course name, credit hours/units, target grade, actual grade (optional)
- Validation: Credits greater than 0
- Limit: Maximum 20 courses per semester (configurable)

#### 3.4.2 Edit Course
**FR-CRS-002**: Users shall be able to modify course details.
- Editable: Name, credits, target grade, actual grade
- Real-time: Updates reflected immediately

#### 3.4.3 Delete Course
**FR-CRS-003**: Users shall be able to remove courses.
- Confirmation: Optional based on context
- Update: Recalculate semester GPA if actual grades exist

### 3.5 GPA Planner

#### 3.5.1 Calculate Required GPA
**FR-GPA-001**: The system shall calculate required semester GPA for target CGPA.
- Input: Current CGPA, credits completed, target CGPA, planned courses with credits
- Calculation: `Required GPA = (Target CGPA × Total Credits - Current GPA × Completed Credits) / Semester Credits`
- Output: Required semester GPA with feasibility indicator
- Undo/Redo: Support for input history

#### 3.5.2 Export GPA Plan
**FR-GPA-002**: Users shall be able to export GPA calculations.
- Formats: PDF, CSV, TXT
- Content: Input parameters, calculated GPA, course breakdown
- Download: Immediate browser download

### 3.6 Study Hours Planner

#### 3.6.1 Calculate Study Hours
**FR-STUDY-001**: The system shall recommend weekly study hours per course.
- Input: Courses (name, units, target grade), goal CGPA for multiplier
- Algorithm: Base hours × unit weight × difficulty weight × GPA multiplier
- Output: Hours per course and total weekly hours

#### 3.6.2 Export Study Plan
**FR-STUDY-002**: Users shall be able to export study plans.
- Formats: PDF, CSV, TXT
- Content: Course-by-course breakdown, total hours, recommendations

### 3.7 Grade Analyzer

#### 3.7.1 Recommend Minimum Grades
**FR-GRADE-001**: The system shall suggest minimum grades to achieve target GPA.
- Input: Target semester GPA, courses with credit hours
- Algorithm: Greedy optimization distributing grade points across credits
- Output: Recommended grade per course with grade letter/percentage

#### 3.7.2 Export Grade Analysis
**FR-GRADE-002**: Users shall be able to export grade recommendations.
- Formats: PDF, CSV, TXT
- Content: Target GPA, course grades, feasibility notes

### 3.8 Comparison Tool

#### 3.8.1 Create Scenarios
**FR-COMP-001**: Users shall be able to create up to 5 academic scenarios.
- Input per scenario: Name, current CGPA, credits, target CGPA, course list
- Independent: Each scenario calculates separately
- Limit: Maximum 5 concurrent scenarios

#### 3.8.2 Compare Scenarios
**FR-COMP-002**: The system shall identify the best scenario.
- Metric: Lowest required semester GPA
- Display: Side-by-side comparison with highlighting
- Feasibility: Flag unrealistic scenarios (required GPA > 4.0)

#### 3.8.3 Export Comparison
**FR-COMP-003**: Users shall be able to export scenario comparisons.
- Format: PDF with tabular layout
- Content: All scenarios with required GPAs and best recommendation

### 3.9 Data Visualization

#### 3.9.1 GPA Trend Chart
**FR-VIZ-001**: The system shall display GPA trends over semesters.
- Type: Line chart
- Data: Semester name (x-axis) vs. GPA (y-axis)
- Source: User's completed semesters with actual GPA

#### 3.9.2 Course Distribution Chart
**FR-VIZ-002**: The system shall show courses per semester.
- Type: Bar chart
- Data: Semester (x-axis) vs. course count (y-axis)
- Color: Themed to match application

#### 3.9.3 Grade Distribution Chart
**FR-VIZ-003**: The system shall visualize grade distribution.
- Type: Pie chart
- Data: Grade categories (A, B, C, etc.) with percentages
- Filtering: Based on all completed courses with actual grades

#### 3.9.4 Summary Statistics
**FR-VIZ-004**: The system shall display key academic statistics.
- Metrics: Highest GPA, average GPA, total semesters, total courses
- Cards: Visual cards with icons and color coding
- Demo: Sample data for unauthenticated users

### 3.10 Dashboard

#### 3.10.1 Overview Cards
**FR-DASH-001**: The dashboard shall display key metrics.
- Current CGPA with color-coded status
- Target CGPA
- Total semesters count
- Total courses count

#### 3.10.2 Recent Semesters
**FR-DASH-002**: The dashboard shall show recent semesters.
- Display: Up to 6 most recent semesters
- Information: Name, status, course count, GPA
- Action: Click to view/edit semester details

#### 3.10.3 Quick Actions
**FR-DASH-003**: The dashboard shall provide quick navigation.
- Create new semester button
- Links to planning tools
- Profile access

### 3.11 Theme Management

#### 3.11.1 Theme Toggle
**FR-THEME-001**: Users shall be able to switch between light and dark themes.
- Toggle: Header button or settings
- Persistence: localStorage for session retention
- Default: System preference detection

---

## 4. Non-Functional Requirements

### 4.1 Security

#### 4.1.1 Password Security
**NFR-SEC-001**: Passwords shall be hashed using bcrypt with salt rounds ≥ 10.

#### 4.1.2 Authentication
**NFR-SEC-002**: JWT tokens shall expire after 7 days and include user ID claim.

#### 4.1.3 CORS Protection
**NFR-SEC-003**: API shall enforce CORS with allowed origins from environment configuration.

#### 4.1.4 Rate Limiting
**NFR-SEC-004**: API shall limit requests to 100 per 15 minutes per IP address.

#### 4.1.5 HTTP Headers
**NFR-SEC-005**: API shall use Helmet middleware for security headers.

#### 4.1.6 Input Validation
**NFR-SEC-006**: All API inputs shall be validated server-side using express-validator.

#### 4.1.7 SQL Injection Prevention
**NFR-SEC-007**: Database queries shall use Sequelize ORM parameterized queries.

### 4.2 Performance

#### 4.2.1 Load Time
**NFR-PERF-001**: First meaningful paint shall occur within 3 seconds on broadband (10 Mbps+).

#### 4.2.2 API Response Time
**NFR-PERF-002**: 95th percentile API response time shall be under 500ms for standard payloads.

#### 4.2.3 Bundle Size
**NFR-PERF-003**: Client JavaScript bundle shall be optimized and code-split for faster initial load.

### 4.3 Reliability

#### 4.3.1 Error Handling
**NFR-REL-001**: API failures shall display user-friendly toast notifications.

#### 4.3.2 Data Persistence
**NFR-REL-002**: No client data loss shall occur on page refresh.

#### 4.3.3 Idempotency
**NFR-REL-003**: GET requests shall be idempotent and safe to retry.

### 4.4 Compatibility

#### 4.4.1 Browser Support
**NFR-COMPAT-001**: Application shall support latest versions of Chrome, Firefox, Edge, and Safari.

#### 4.4.2 Responsive Design
**NFR-COMPAT-002**: UI shall be responsive for viewport widths from 320px to 2560px.

#### 4.4.3 Mobile Support
**NFR-COMPAT-003**: Core functionality shall be accessible on mobile devices.

### 4.5 Maintainability

#### 4.5.1 Code Organization
**NFR-MAINT-001**: Frontend shall use modular React components with single responsibility.

#### 4.5.2 State Management
**NFR-MAINT-002**: Global state shall use React Context (Auth, Theme, History).

#### 4.5.3 API Structure
**NFR-MAINT-003**: Backend routes shall be organized by resource (auth, semesters, planner).

#### 4.5.4 Database Models
**NFR-MAINT-004**: Data models shall use Sequelize ORM with clear associations.

### 4.6 Observability

#### 4.6.1 Error Logging
**NFR-OBS-001**: Server shall log authentication failures and planner calculation errors.

#### 4.6.2 Client Feedback
**NFR-OBS-002**: Client shall display toast notifications for all API failures.

---

## 5. Data Model

### 5.1 User Entity
- **id** (Integer, Primary Key, Auto-increment)
- **name** (String, Required)
- **email** (String, Unique, Required)
- **password_hash** (String, Required for email auth)
- **current_cgpa** (Decimal, Default: 0.0)
- **target_cgpa** (Decimal, Default: 4.0)
- **created_at** (Timestamp)
- **updated_at** (Timestamp)

### 5.2 Semester Entity
- **id** (Integer, Primary Key, Auto-increment)
- **user_id** (Integer, Foreign Key → User)
- **name** (String, Required)
- **status** (Enum: 'planned', 'in-progress', 'completed')
- **actual_gpa** (Decimal, Optional)
- **created_at** (Timestamp)
- **updated_at** (Timestamp)

### 5.3 Course Entity
- **id** (Integer, Primary Key, Auto-increment)
- **semester_id** (Integer, Foreign Key → Semester)
- **name** (String, Required)
- **credits** (Decimal, Required)
- **target_grade** (String, Optional)
- **actual_grade** (String, Optional)
- **created_at** (Timestamp)
- **updated_at** (Timestamp)

### 5.4 Relationships
- User **has many** Semesters (1:N)
- Semester **has many** Courses (1:N)
- Semester **belongs to** User (N:1)
- Course **belongs to** Semester (N:1)

### 5.5 Client-Only Data
- **Scenario** (not persisted): Computed comparison scenarios
- **StudyPlan** (not persisted): Derived study hour calculations
- **HistoryEntry** (localStorage): Undo/redo stack for planners

---

## 6. External Interfaces

### 6.1 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get authenticated user profile (requires JWT)
- `PUT /api/auth/profile` - Update user profile (requires JWT)
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Handle Google OAuth callback

#### Semesters
- `GET /api/semesters` - Get all user semesters (requires JWT)
- `POST /api/semesters` - Create new semester (requires JWT)
- `GET /api/semesters/:id` - Get semester by ID (requires JWT)
- `PUT /api/semesters/:id` - Update semester (requires JWT)
- `DELETE /api/semesters/:id` - Delete semester (requires JWT)

#### Planning Tools
- `POST /api/planner/calculate-gpa` - Calculate required semester GPA
- `POST /api/planner/plan-study` - Generate study hours plan
- `POST /api/planner/analyze-grades` - Analyze grade combinations

### 6.2 Environment Variables

#### Client (.env)
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Student Planner
VITE_MAX_COURSES=20
```

#### Server (.env)
```
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://... (production)
```

---

## 7. System Constraints

### 7.1 Technical Constraints
- Node.js version 16 or higher required
- Modern browser with ES6+ support
- Database supports Sequelize ORM (PostgreSQL, MySQL, SQLite)

### 7.2 Deployment Constraints
- Uses Render platform blueprint for deployment
- PostgreSQL database on Render (free tier limitations apply)
- Environment variables must be configured per environment

### 7.3 Business Constraints
- Maximum 20 courses per semester (configurable via VITE_MAX_COURSES)
- Maximum 5 scenarios in comparison tool
- JWT token lifetime fixed at 7 days
- Rate limit of 100 requests per 15 minutes

---

## 8. Error Handling

### 8.1 Client-Side Errors
- Network failures: Display toast with retry option
- Validation errors: Inline field validation messages
- Authentication errors: Redirect to login with message

### 8.2 Server-Side Errors
- 400 Bad Request: Validation errors with details
- 401 Unauthorized: Invalid or expired JWT
- 404 Not Found: Resource doesn't exist or unauthorized access
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Unexpected errors (logged server-side)

### 8.3 Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": {} // Optional validation details
}
```

---

## 9. Acceptance Criteria

### 9.1 Authentication
- ✅ User can register with valid email and password
- ✅ User can log in and receive JWT token
- ✅ User can access protected routes with valid token
- ✅ User is redirected to login when token expires

### 9.2 Profile Management
- ✅ User can view profile with current and target CGPA
- ✅ User can update profile and changes persist
- ✅ CGPA validation prevents invalid values

### 9.3 Semester Management
- ✅ User can create semester with courses
- ✅ User can edit semester details and courses
- ✅ User can delete semester with confirmation
- ✅ Dashboard displays semester summary correctly

### 9.4 Planning Tools
- ✅ GPA Planner returns accurate required GPA
- ✅ Study Hours Planner calculates hours per course
- ✅ Grade Analyzer recommends feasible grades
- ✅ Comparison Tool handles 5 scenarios and marks best
- ✅ All tools support export to PDF/CSV/TXT

### 9.5 Data Visualization
- ✅ Charts render with user data when authenticated
- ✅ Demo data displayed for guest users
- ✅ Statistics cards show accurate metrics
- ✅ Charts are responsive on mobile devices

### 9.6 User Experience
- ✅ Theme toggle persists across sessions
- ✅ Undo/redo works in GPA Planner
- ✅ Toast notifications appear for errors and successes
- ✅ Loading states shown during API calls

---

## 10. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 31, 2025 | Development Team | Initial SRS creation |

---

**End of Document**
