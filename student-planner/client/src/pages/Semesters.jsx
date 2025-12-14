import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../config/api';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import { getGPAColor } from '../utils/calculations';

const Semesters = () => {
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await apiClient.get('/api/semesters');
      if (response.success) {
        setSemesters(response.data);
      }
    } catch {
      toast.error('Failed to load semesters');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/semesters/${id}`);
      toast.success('Semester deleted successfully');
      setSemesters(semesters.filter(s => s.id !== id));
    } catch {
      toast.error('Failed to delete semester');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Semesters</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Semesters</h1>
          <p className="text-text-muted">Manage your academic semesters and courses</p>
        </div>
        <Link to="/semesters/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Semester
        </Link>
      </div>

      {semesters.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Calendar size={64} className="mx-auto mb-4 text-text-muted opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No Semesters Yet</h2>
          <p className="text-text-muted mb-6">Start tracking your academic progress by creating your first semester</p>
          <Link to="/semesters/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Create Your First Semester
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semesters.map((semester) => (
            <div key={semester.id} className="glass-panel p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{semester.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Calendar size={14} />
                    {semester.start_date && semester.end_date ? (
                      <span>
                        {new Date(semester.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {new Date(semester.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    ) : (
                      <span>No dates set</span>
                    )}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  semester.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                  semester.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {semester.status === 'in-progress' ? 'In Progress' : 
                   semester.status === 'completed' ? 'Completed' : 'Planned'}
                </span>
              </div>

              <div className="flex-1 space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">Courses</span>
                  <span className="font-semibold">{semester.Courses?.length || 0}</span>
                </div>
                
                {semester.target_gpa && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">Target GPA</span>
                    <span className="font-semibold">{semester.target_gpa.toFixed(2)}</span>
                  </div>
                )}
                
                {semester.actual_gpa && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted flex items-center gap-1">
                      <TrendingUp size={14} />
                      Actual GPA
                    </span>
                    <span className={`text-lg font-bold ${getGPAColor(semester.actual_gpa)}`}>
                      {semester.actual_gpa.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => navigate(`/semesters/${semester.id}/edit`)}
                  className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, id: semester.id, name: semester.name })}
                  className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 text-red-400"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="Delete Semester"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This will also delete all associated courses. This action cannot be undone.`}
        variant="danger"
      />
    </div>
  );
};

export default Semesters;
