# Student Planner

A comprehensive academic planning and tracking application built with React and Express.

## Features

### 📊 Planning Tools
- **GPA Planner**: Calculate required GPA for target CGPA with undo/redo functionality
- **Study Hours Planner**: Generate personalized study schedules based on course load and GPA goals
- **Grade Analyzer**: Find minimum grade combinations to achieve target semester GPA
- **Comparison Tool**: Compare up to 5 different academic scenarios side-by-side
- **Data Insights**: Visualize academic performance with interactive charts

### 🎓 Semester Management
- Create and manage multiple semesters
- Track courses with target and actual grades
- Set semester-specific GPA targets
- View academic progress over time

### 📈 Data Visualization
- GPA trends over semesters (Line chart)
- Course distribution per semester (Bar chart)
- Grade distribution analysis (Pie chart)
- Statistics cards with highest/average GPA

### 🔐 User Features
- Secure authentication with JWT
- Personal profile with target CGPA settings
- Dashboard with academic overview
- Theme toggle (Dark/Light mode)

### 📤 Export Options
- PDF reports with formatted tables
- CSV exports for spreadsheet analysis
- Text file summaries

## Tech Stack

### Frontend
- **React 19.2** - UI framework
- **React Router 7** - Navigation
- **Tailwind CSS v4** - Styling
- **Recharts** - Data visualization
- **jsPDF** - PDF generation
- **Papa Parse** - CSV handling
- **Vite** - Build tool

### Backend
- **Express 5.2** - Web framework
- **Sequelize 6.37** - ORM
- **SQLite3/MySQL2** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **express-rate-limit** - API rate limiting

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd student-planner
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` file in `server/` directory:
```env
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=5000
```

Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Student Planner
VITE_MAX_COURSES=20
```

5. **Start the application**

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
student-planner/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context providers
│   │   ├── utils/         # Utility functions
│   │   └── config/        # API configuration
│   └── public/
├── server/                # Express backend
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── middleware/    # Custom middleware
│       ├── models/        # Database models
│       ├── routes/        # API routes
│       └── config/        # Database configuration
└── start_app.bat          # Windows startup script
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Semesters
- `GET /api/semesters` - Get all semesters
- `POST /api/semesters` - Create semester
- `GET /api/semesters/:id` - Get semester by ID
- `PUT /api/semesters/:id` - Update semester
- `DELETE /api/semesters/:id` - Delete semester

### Planning Tools
- `POST /api/planner/calculate-gpa` - Calculate required GPA
- `POST /api/planner/plan-study` - Generate study hours plan
- `POST /api/planner/analyze-grades` - Analyze grade combinations

## Features in Detail

### GPA Planner
- Input current CGPA and credits completed
- Set desired CGPA target
- Add semester courses with credits
- Calculate required semester GPA
- Export results to PDF/CSV/TXT

### Study Hours Planner
- Add courses with units and target grades
- Set goal CGPA for adjustment multiplier
- Get personalized weekly study hours
- Course-by-course breakdown
- Export study plan

### Grade Analyzer
- Input target semester GPA
- Add courses with credit hours
- Get recommended minimum grades per course
- Greedy algorithm optimization
- Visual grade cards

### Comparison Tool
- Create up to 5 scenarios
- Compare different academic paths
- Calculate each scenario independently
- Identify best scenario (lowest required GPA)
- Export comparison to PDF

### Data Insights
- Line chart: GPA trend over semesters
- Bar chart: Courses per semester
- Pie chart: Grade distribution
- Demo data for guest users
- Real data for authenticated users

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Input validation with express-validator
- SQL injection prevention via Sequelize ORM

## Development

### Run in Development Mode

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

### Build for Production

**Frontend:**
```bash
cd client
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Authors

- Development Team

## Acknowledgments

- Built with modern web technologies
- Inspired by student academic planning needs
- Designed for ease of use and functionality
