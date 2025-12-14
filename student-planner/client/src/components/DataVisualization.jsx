import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';
import { CardSkeleton } from './Loading';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#22d3ee', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

const DataVisualization = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    semesters: [],
    gpaHistory: [],
    courseDistribution: [],
    gradeDistribution: []
  });
  const [activeChart, setActiveChart] = useState('gpa-trend');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
      setData(generateDemoData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [semestersRes, profileRes] = await Promise.all([
        apiClient.get('/api/semesters'),
        apiClient.get('/api/auth/profile')
      ]);

      if (semestersRes.success) {
        const processedData = processSemesterData(semestersRes.data, profileRes.data);
        setData(processedData);
      }
    } catch {
      toast.error('Failed to load data');
      setData(generateDemoData());
    } finally {
      setLoading(false);
    }
  };

  const processSemesterData = (semesters, profile) => {
    const gpaHistory = semesters
      .filter(s => s.actual_gpa)
      .map(s => ({
        name: s.name,
        gpa: parseFloat(s.actual_gpa),
        target: parseFloat(s.target_gpa) || profile.target_cgpa
      }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const courseDistribution = semesters.map(s => ({
      name: s.name.substring(0, 10),
      courses: s.Courses?.length || 0
    }));

    const allCourses = semesters.flatMap(s => s.Courses || []);
    const gradeCount = {};
    allCourses.forEach(course => {
      const grade = course.actual_grade || course.target_grade;
      if (grade) {
        gradeCount[grade] = (gradeCount[grade] || 0) + 1;
      }
    });

    const gradeDistribution = Object.entries(gradeCount).map(([grade, count]) => ({
      name: grade,
      value: count
    }));

    return {
      semesters,
      gpaHistory,
      courseDistribution,
      gradeDistribution
    };
  };

  const generateDemoData = () => ({
    semesters: [],
    gpaHistory: [
      { name: 'Fall 2023', gpa: 3.2, target: 3.5 },
      { name: 'Spring 2024', gpa: 3.5, target: 3.5 },
      { name: 'Fall 2024', gpa: 3.7, target: 3.8 },
      { name: 'Spring 2025', gpa: 3.8, target: 3.8 }
    ],
    courseDistribution: [
      { name: 'Fall 2023', courses: 5 },
      { name: 'Spring 2024', courses: 6 },
      { name: 'Fall 2024', courses: 5 },
      { name: 'Spring 2025', courses: 4 }
    ],
    gradeDistribution: [
      { name: 'A', value: 8 },
      { name: 'B', value: 6 },
      { name: 'C', value: 4 },
      { name: 'D', value: 2 }
    ]
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const chartTabs = [
    { id: 'gpa-trend', label: 'GPA Trend', icon: TrendingUp },
    { id: 'courses', label: 'Courses per Semester', icon: BarChart3 },
    { id: 'grades', label: 'Grade Distribution', icon: PieChartIcon }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="text-primary" />
          Data Visualization
        </h2>
        <p className="text-text-muted mt-1">
          {isAuthenticated 
            ? 'Visual analysis of your academic progress' 
            : 'Demo data - Sign in to see your actual progress'}
        </p>
      </div>

      <div className="glass-panel p-2 flex gap-2">
        {chartTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveChart(tab.id)}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeChart === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'hover:bg-white/5 text-text-muted'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6">
        {activeChart === 'gpa-trend' && (
          <div>
            <h3 className="text-xl font-bold mb-6">GPA Trend Over Time</h3>
            {data.gpaHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.gpaHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis domain={[0, 5]} stroke="#888" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    name="Actual GPA"
                    dot={{ fill: '#6366f1', r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#22d3ee" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target GPA"
                    dot={{ fill: '#22d3ee', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-text-muted">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
                <p>No GPA history available yet</p>
                <p className="text-sm mt-2">Complete semesters to see your progress</p>
              </div>
            )}
          </div>
        )}

        {activeChart === 'courses' && (
          <div>
            <h3 className="text-xl font-bold mb-6">Courses per Semester</h3>
            {data.courseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.courseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="courses" 
                    fill="#6366f1" 
                    radius={[8, 8, 0, 0]}
                    name="Number of Courses"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-text-muted">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
                <p>No course data available yet</p>
                <p className="text-sm mt-2">Add semesters with courses to see distribution</p>
              </div>
            )}
          </div>
        )}

        {activeChart === 'grades' && (
          <div>
            <h3 className="text-xl font-bold mb-6">Grade Distribution</h3>
            {data.gradeDistribution.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={data.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {data.gradeDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{item.name}</span>
                      <span className="text-text-muted">({item.value} courses)</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-text-muted">
                <PieChartIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>No grade data available yet</p>
                <p className="text-sm mt-2">Complete courses to see grade distribution</p>
              </div>
            )}
          </div>
        )}
      </div>

      {data.gpaHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6">
            <h4 className="text-sm text-text-muted mb-2">Highest GPA</h4>
            <div className="text-3xl font-bold text-green-500">
              {Math.max(...data.gpaHistory.map(d => d.gpa)).toFixed(2)}
            </div>
          </div>
          <div className="glass-panel p-6">
            <h4 className="text-sm text-text-muted mb-2">Average GPA</h4>
            <div className="text-3xl font-bold text-blue-500">
              {(data.gpaHistory.reduce((sum, d) => sum + d.gpa, 0) / data.gpaHistory.length).toFixed(2)}
            </div>
          </div>
          <div className="glass-panel p-6">
            <h4 className="text-sm text-text-muted mb-2">Total Semesters</h4>
            <div className="text-3xl font-bold text-purple-500">
              {data.gpaHistory.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataVisualization;
