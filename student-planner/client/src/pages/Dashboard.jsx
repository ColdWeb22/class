import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { CardSkeleton } from '../components/Loading';
import { getGPAColor, getGPAStatus } from '../utils/calculations';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSemesters: 0,
    totalCourses: 0,
    currentGPA: 0,
    targetGPA: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [semestersRes, profileRes] = await Promise.all([
        apiClient.get('/api/semesters'),
        apiClient.get('/api/auth/profile')
      ]);

      if (semestersRes.success) {
        setSemesters(semestersRes.data);
        
        const totalCourses = semestersRes.data.reduce((sum, sem) => 
          sum + (sem.Courses?.length || 0), 0
        );
        
        setStats({
          totalSemesters: semestersRes.data.length,
          totalCourses,
          currentGPA: profileRes.data?.current_cgpa || 0,
          targetGPA: profileRes.data?.target_cgpa || 4.0
        });
      }
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Welcome to Student Planner</h2>
        <p className="text-text-muted mb-8">Sign in to access your personalized dashboard and track your academic progress</p>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2">
          Get Started
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-text-muted">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/semesters/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Semester
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="text-primary" size={24} />
            <span className="text-sm text-text-muted">Current</span>
          </div>
          <div className={`text-3xl font-bold mb-1 ${getGPAColor(stats.currentGPA)}`}>
            {stats.currentGPA.toFixed(2)}
          </div>
          <div className="text-sm text-text-muted">{getGPAStatus(stats.currentGPA)}</div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="text-secondary" size={24} />
            <span className="text-sm text-text-muted">Target</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.targetGPA.toFixed(2)}</div>
          <div className="text-sm text-text-muted">Goal GPA</div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="text-accent" size={24} />
            <span className="text-sm text-text-muted">Semesters</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalSemesters}</div>
          <div className="text-sm text-text-muted">Total Tracked</div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="text-primary" size={24} />
            <span className="text-sm text-text-muted">Courses</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalCourses}</div>
          <div className="text-sm text-text-muted">All Time</div>
        </div>
      </div>

      {/* Recent Semesters */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Semesters</h2>
        {semesters.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <p className="text-text-muted mb-4">No semesters yet</p>
            <Link to="/semesters/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} />
              Create Your First Semester
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {semesters.slice(0, 6).map((semester) => (
              <Link
                key={semester.id}
                to={`/semesters/${semester.id}`}
                className="glass-panel p-6 hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-bold mb-2">{semester.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-text-muted">
                    {semester.Courses?.length || 0} courses
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    semester.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    semester.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {semester.status}
                  </span>
                </div>
                {semester.actual_gpa && (
                  <div className="mt-2">
                    <span className="text-sm text-text-muted">GPA: </span>
                    <span className={`text-lg font-bold ${getGPAColor(semester.actual_gpa)}`}>
                      {semester.actual_gpa.toFixed(2)}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
