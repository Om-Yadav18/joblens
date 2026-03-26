// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">Job<span className="logo-accent">Lens</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>Browse Jobs</Link>
          {user && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/applications" className={`nav-link ${isActive('/applications') ? 'active' : ''}`}>Applications</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-user">
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                {user.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/jobs" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {user && <>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/applications" onClick={() => setMenuOpen(false)}>Applications</Link>
          </>}
          {user
            ? <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            : <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
          }
        </div>
      )}
    </nav>
  );
};

export default Navbar;
