import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const initializeAuth = () => {
      console.info('[auth] initializing session');
      const storedUser = localStorage.getItem('user');
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
          console.info('[auth] restored persisted session');
        } catch (error) {
          console.error('Failed to parse user data:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          console.info('[auth] cleared invalid persisted session');
        }
      } else if (token && !storedUser) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        console.info('[auth] cleared token without user');
      }
      setLoading(false);
      console.info('[auth] session initialization complete');
    };
    
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData, authToken) => {
    console.info('[auth] login successful', { userId: userData?.id });
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.info('[auth] logout');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!(token && user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
