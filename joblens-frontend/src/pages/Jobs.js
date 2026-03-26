// src/pages/Jobs.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import './Jobs.css';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs]             = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [skill, setSkill]           = useState('');
  const [location, setLocation]     = useState('');
  const [msg, setMsg]               = useState('');
  const [error, setError]           = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (skill)    params.skill    = skill;
      if (location) params.location = location;
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs || []);
    } catch { setError('Failed to load jobs.'); }
    finally { setLoading(false); }
  };

  const fetchApplied = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/applications/my-applications');
      setAppliedIds(data.applications.map(a => a.job?._id));
    } catch {}
  };

  useEffect(() => { fetchJobs(); fetchApplied(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchJobs(); };

  const handleApply = async (jobId) => {
    if (!user) { setError('Please login to apply for jobs.'); return; }
    setMsg(''); setError('');
    try {
      await api.post(`/applications/apply/${jobId}`);
      setAppliedIds(prev => [...prev, jobId]);
      setMsg('✓ Application submitted successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const locations = ['Bangalore', 'Hyderabad', 'Delhi', 'Mumbai', 'Pune', 'Remote'];
  const skills    = ['React', 'Node.js', 'Python', 'JavaScript', 'MongoDB', 'SQL'];

  return (
    <div className="jobs-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="jobs-header">
          <div>
            <span className="section-tag">Opportunities</span>
            <h1 className="jobs-title">Browse All Jobs</h1>
            <p className="jobs-sub">Find roles that match your skills and location</p>
          </div>
        </div>

        {/* Search bar */}
        <form className="search-bar card" onSubmit={handleSearch}>
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search by skill (e.g. react, python)"
              value={skill} onChange={e => setSkill(e.target.value)} />
          </div>
          <div className="search-divider"></div>
          <div className="search-field">
            <span className="search-icon">📍</span>
            <input className="search-input" placeholder="Location (e.g. Bangalore)"
              value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary search-btn">Search</button>
        </form>

        {/* Quick filters */}
        <div className="quick-filters">
          <span className="filter-label">Quick:</span>
          {skills.map(s => (
            <button key={s} className={`filter-chip ${skill.toLowerCase() === s.toLowerCase() ? 'active' : ''}`}
              onClick={() => { setSkill(s); setTimeout(fetchJobs, 50); }}>{s}</button>
          ))}
          <span className="filter-divider">|</span>
          {locations.map(l => (
            <button key={l} className={`filter-chip ${location.toLowerCase() === l.toLowerCase() ? 'active' : ''}`}
              onClick={() => { setLocation(l); setTimeout(fetchJobs, 50); }}>{l}</button>
          ))}
          {(skill || location) && (
            <button className="filter-chip clear" onClick={() => { setSkill(''); setLocation(''); setTimeout(() => { setSkill(''); setLocation(''); fetchJobs(); }, 50); }}>✕ Clear</button>
          )}
        </div>

        {/* Feedback messages */}
        {msg   && <div className="success-msg">{msg}</div>}
        {error && <div className="error-msg">{error}</div>}

        {/* Results */}
        {loading ? (
          <div className="jobs-loading">
            <span className="spinner" style={{ width: 32, height: 32 }}></span>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="jobs-empty card">
            <span className="empty-icon">🔎</span>
            <h3>No jobs found</h3>
            <p>Try different keywords or clear the filters</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSkill(''); setLocation(''); fetchJobs(); }}>Show all jobs</button>
          </div>
        ) : (
          <>
            <p className="results-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job._id} job={job}
                  onApply={handleApply}
                  applied={appliedIds.includes(job._id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
