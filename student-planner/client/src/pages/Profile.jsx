import React, { useState } from 'react';
import { User, Mail, Target, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    target_cgpa: user?.target_cgpa || 4.0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.put('/api/auth/profile', {
        name: formData.name,
        target_cgpa: parseFloat(formData.target_cgpa)
      });

      if (response.success) {
        updateUser(response.data);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <User size={16} />
            Name
          </label>
          <input
            type="text"
            required
            className="input-field"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Mail size={16} />
            Email
          </label>
          <input
            type="email"
            disabled
            className="input-field opacity-50 cursor-not-allowed"
            value={formData.email}
          />
          <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Target size={16} />
            Target CGPA
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="5"
            required
            className="input-field"
            placeholder="e.g., 4.0"
            value={formData.target_cgpa}
            onChange={(e) => setFormData({ ...formData, target_cgpa: e.target.value })}
          />
          <p className="text-xs text-text-muted mt-1">Your overall target GPA for your degree</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Current CGPA</span>
            <span className="font-medium">{user?.current_cgpa?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Credits Completed</span>
            <span className="font-medium">{user?.credits_completed || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
