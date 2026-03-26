// src/App.js
// Root component — sets up routing for the entire app

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home         from './pages/Home';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Jobs         from './pages/Jobs';
import JobDetail    from './pages/JobDetail';
import Dashboard    from './pages/Dashboard';
import Applications from './pages/Applications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/"        element={<Home />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs"    element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute><Applications /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
