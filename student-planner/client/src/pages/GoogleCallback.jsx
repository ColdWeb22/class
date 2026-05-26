import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { apiClient } from '../config/api';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const handledRef = useRef(false);
  const [status, setStatus] = useState('Completing sign in...');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      if (handledRef.current) {
        return;
      }

      const token = searchParams.get('token') || searchParams.get('googleToken');
      const error = searchParams.get('error');
      console.info('[auth] callback loaded', { hasToken: !!token, hasError: !!error, isAuthenticated });

      if (error) {
        handledRef.current = true;
        console.info('[auth] callback rejected by provider error');
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token) {
        handledRef.current = true;
        try {
          console.info('[auth] callback received token, fetching profile');
          setStatus('Verifying your account...');
          localStorage.setItem('token', token);
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Authentication timed out. Please try again.')), 15000);
          });

          const response = await Promise.race([
            apiClient.get('/api/auth/profile'),
            timeoutPromise,
          ]);
          
          if (response.success) {
            login(response.data, token);
            console.info('[auth] callback profile loaded, redirecting to dashboard');
            toast.success('Welcome! You\'re now signed in.');
            setRedirectTo('/dashboard');
          } else {
            throw new Error('Failed to fetch profile');
          }
        } catch (error) {
          console.error('Callback error:', error);
          console.info('[auth] callback failed', { message: error?.message });
          setErrorMessage(error.message || 'Authentication failed. Please try again.');
          setStatus('Sign in could not be completed.');
          toast.error('Authentication failed. Please try again.');
          localStorage.removeItem('token');
        }
      } else if (isAuthenticated) {
        handledRef.current = true;
        // Already authenticated, go to dashboard
        setRedirectTo('/dashboard');
      } else {
        handledRef.current = true;
        // No token and not authenticated, show home page (CGPA Planner)
        setRedirectTo('/planner/gpa');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login, isAuthenticated]);

  useEffect(() => {
    if (!redirectTo) {
      return;
    }

    if (redirectTo === '/dashboard' && !isAuthenticated) {
      return;
    }

    console.info('[auth] callback redirecting', { redirectTo, isAuthenticated });
    navigate(redirectTo, { replace: true });
  }, [redirectTo, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">{status}</p>
        {errorMessage ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-red-400">{errorMessage}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="btn-primary inline-flex items-center justify-center"
            >
              Back to login
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GoogleCallback;
