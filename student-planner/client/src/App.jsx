import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import GoogleCallback from './pages/GoogleCallback';
import Dashboard from './pages/Dashboard';
import CGPAPlanner from './components/CGPAPlanner';
import StudyHoursPlanner from './components/StudyHoursPlanner';
import GradeAnalyzer from './components/GradeAnalyzer';
import ComparisonTool from './components/ComparisonTool';
import DataVisualization from './components/DataVisualization';
import SemesterForm from './pages/SemesterForm';
import Semesters from './pages/Semesters';
import Profile from './pages/Profile';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Main App Routes with Layout */}
      <Route path="/" element={<Layout><CGPAPlanner /></Layout>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/semesters" element={<ProtectedRoute><Layout><Semesters /></Layout></ProtectedRoute>} />
      <Route path="/semesters/new" element={<ProtectedRoute><Layout><SemesterForm /></Layout></ProtectedRoute>} />
      <Route path="/semesters/:id/edit" element={<ProtectedRoute><Layout><SemesterForm /></Layout></ProtectedRoute>} />
      <Route path="/planner/gpa" element={<Layout><CGPAPlanner /></Layout>} />
      <Route path="/planner/study" element={<Layout><StudyHoursPlanner /></Layout>} />
      <Route path="/planner/grades" element={<Layout><GradeAnalyzer /></Layout>} />
      <Route path="/planner/comparison" element={<Layout><ComparisonTool /></Layout>} />
      <Route path="/insights" element={<Layout><DataVisualization /></Layout>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HistoryProvider>
          <Router>
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Router>
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
