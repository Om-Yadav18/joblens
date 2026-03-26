// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Auth.css';

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
    try {
      const { data } = await api.post('/auth/register', form);
      login({ _id: data._id, name: data.name, email: data.email }, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-glow"></div>
      <div className="auth-card card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span>⬡</span> Job<span className="logo-accent">Lens</span>
          </Link>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Start your job search journey today</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-input" placeholder="Your full name"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span> Creating account...</> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
