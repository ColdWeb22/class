import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { apiClient } from '../config/api';
import toast from 'react-hot-toast';

const SemesterForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [semester, setSemester] = useState({
    name: '',
    target_gpa: '',
    start_date: '',
    end_date: '',
    status: 'planned'
  });
  const [courses, setCourses] = useState([
    { name: '', credits: '', target_grade: 'A', actual_grade: '', notes: '' }
  ]);

  useEffect(() => {
    if (isEdit) {
      fetchSemester();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSemester = async () => {
    try {
      const response = await apiClient.get(`/api/semesters/${id}`);
      if (response.success) {
        setSemester(response.data);
        if (response.data.Courses && response.data.Courses.length > 0) {
          setCourses(response.data.Courses);
        }
      }
    } catch {
      toast.error('Failed to load semester');
      navigate('/dashboard');
    }
  };

  const addCourse = () => {
    setCourses([...courses, { name: '', credits: '', target_grade: 'A', actual_grade: '', notes: '' }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const updateCourse = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...semester,
        target_gpa: parseFloat(semester.target_gpa) || 0,
        courses: courses.map(c => ({
          ...c,
          credits: parseFloat(c.credits) || 0
        }))
      };

      if (isEdit) {
        await apiClient.put(`/api/semesters/${id}`, payload);
        toast.success('Semester updated successfully');
      } else {
        await apiClient.post('/api/semesters', payload);
        toast.success('Semester created successfully');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to save semester');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/dashboard')} className="text-text-muted hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Semester' : 'New Semester'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Semester Info */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4">Semester Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Semester Name *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g., Fall 2024"
                value={semester.name}
                onChange={(e) => setSemester({ ...semester, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target GPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                className="input-field"
                placeholder="e.g., 4.0"
                value={semester.target_gpa}
                onChange={(e) => setSemester({ ...semester, target_gpa: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={semester.start_date}
                onChange={(e) => setSemester({ ...semester, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                className="input-field"
                value={semester.end_date}
                onChange={(e) => setSemester({ ...semester, end_date: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="input-field"
                value={semester.status}
                onChange={(e) => setSemester({ ...semester, status: e.target.value })}
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Courses</h2>
            <button type="button" onClick={addCourse} className="btn-primary flex items-center gap-2">
              <Plus size={18} />
              Add Course
            </button>
          </div>

          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-muted">Course {index + 1}</span>
                  {courses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Course Name"
                    value={course.name}
                    onChange={(e) => updateCourse(index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    className="input-field"
                    placeholder="Credits"
                    value={course.credits}
                    onChange={(e) => updateCourse(index, 'credits', e.target.value)}
                  />
                  <select
                    className="input-field"
                    value={course.target_grade}
                    onChange={(e) => updateCourse(index, 'target_grade', e.target.value)}
                  >
                    <option value="A">Target: A</option>
                    <option value="B">Target: B</option>
                    <option value="C">Target: C</option>
                    <option value="D">Target: D</option>
                  </select>
                  <select
                    className="input-field"
                    value={course.actual_grade}
                    onChange={(e) => updateCourse(index, 'actual_grade', e.target.value)}
                  >
                    <option value="">Actual: Not yet</option>
                    <option value="A">Actual: A</option>
                    <option value="B">Actual: B</option>
                    <option value="C">Actual: C</option>
                    <option value="D">Actual: D</option>
                    <option value="F">Actual: F</option>
                  </select>
                  <input
                    type="text"
                    className="input-field md:col-span-2"
                    placeholder="Notes (optional)"
                    value={course.notes}
                    onChange={(e) => updateCourse(index, 'notes', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Saving...' : (isEdit ? 'Update Semester' : 'Create Semester')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SemesterForm;
