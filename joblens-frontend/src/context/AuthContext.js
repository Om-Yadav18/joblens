// src/context/AuthContext.js
// Global state management for authentication
// Any component can access user info and login/logout functions

import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user was previously logged in (stored in localStorage)
  useEffect(() => {
    const savedUser  = localStorage.getItem('joblens_user');
    const savedToken = localStorage.getItem('joblens_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('joblens_user', JSON.stringify(userData));
    localStorage.setItem('joblens_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('joblens_user');
    localStorage.removeItem('joblens_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
