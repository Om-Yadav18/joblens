// src/components/ProtectedRoute.js
// Wraps private pages — redirects to /login if not authenticated
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}><span className="spinner" style={{ width:36, height:36 }}></span></div>;
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
