import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { apiClient } from '../config/api';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Store the token temporarily
          localStorage.setItem('token', token);
          
          // Fetch user profile
          const response = await apiClient.get('/api/auth/profile');
          
          if (response.success) {
            login(response.data, token);
            toast.success('Welcome! You\'re now signed in.');
            navigate('/dashboard');
          } else {
            throw new Error('Failed to fetch profile');
          }
        } catch (error) {
          console.error('Callback error:', error);
          toast.error('Authentication failed. Please try again.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        toast.error('No authentication token received');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
