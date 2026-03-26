// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: '🎯', title: 'Skill-Based Matching', desc: 'Find jobs that match your exact tech stack. Filter by React, Node.js, Python and more.' },
    { icon: '🤖', title: 'AI Interview Prep', desc: 'Practice mock interviews with AI-powered questions and get instant performance feedback.' },
    { icon: '📄', title: 'Resume Upload', desc: 'Upload your resume once and apply to multiple jobs with a single click.' },
    { icon: '📍', title: 'Location Filter', desc: 'Browse opportunities in Bangalore, Delhi, Mumbai, Remote and more cities.' },
    { icon: '📊', title: 'Track Applications', desc: 'Keep all your job applications organised in a personalised dashboard.' },
    { icon: '💬', title: 'AI Chatbot', desc: 'Get instant answers and job search guidance from our built-in assistant.' },
  ];

  const stats = [
    { value: '800+', label: 'Job Listings' },
    { value: '50+', label: 'Companies' },
    { value: '10K+', label: 'Students Helped' },
    { value: '95%', label: 'Placement Rate' },
  ];

  return (
    <div className="home page-enter">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="container hero-content">
          <div className="hero-tag">
            <span className="hero-dot"></span>
            AI Powered Job Platform for Students
          </div>
          <h1 className="hero-title">
            Find Your Dream Job<br />
            <span className="hero-gradient">With the Power of AI</span>
          </h1>
          <p className="hero-sub">
            JobLens helps tier-2 and tier-3 college students discover relevant jobs, 
            practice interviews with AI, and land their first tech role — all in one platform.
          </p>
          <div className="hero-cta">
            {user ? (
              <>
                <Link to="/jobs" className="btn btn-primary">Browse Jobs →</Link>
                <Link to="/dashboard" className="btn btn-outline">My Dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Get Started Free →</Link>
                <Link to="/jobs" className="btn btn-outline">Browse Jobs</Link>
              </>
            )}
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why JobLens</span>
            <h2 className="section-title">Everything you need to get hired</h2>
            <p className="section-sub">Built specifically for fresh graduates and students entering the tech industry.</p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-box">
            <div className="cta-glow"></div>
            <h2>Ready to start your journey?</h2>
            <p>Join thousands of students who found their dream job through JobLens.</p>
            <div className="cta-buttons">
              {user
                ? <Link to="/jobs" className="btn btn-primary">Browse Jobs →</Link>
                : <Link to="/register" className="btn btn-primary">Create Free Account →</Link>
              }
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">Job<span className="logo-accent">Lens</span></span>
          </div>
          <p className="footer-copy">© 2024 JobLens. Built as a student project.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
