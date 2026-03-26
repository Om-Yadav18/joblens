// src/pages/JobDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './JobDetail.css';

const typeColor = { 'Full-time': 'badge-green', 'Internship': 'badge-orange', 'Part-time': 'badge-purple', 'Remote': 'badge-purple' };

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob]         = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
        if (user) {
          const appRes = await api.get('/applications/my-applications');
          const ids = appRes.data.applications.map(a => a.job?._id);
          setApplied(ids.includes(id));
        }
      } catch { setError('Job not found.'); }
      finally { setLoading(false); }
    };
    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await api.post(`/applications/apply/${id}`);
      setApplied(true);
      setMsg('✓ Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply.');
    }
  };

  const colors = ['#6c63ff','#22c55e','#f59e0b','#3b82f6','#ec4899','#14b8a6'];

  if (loading) return (
    <div className="detail-loading">
      <span className="spinner" style={{ width: 36, height: 36 }}></span>
    </div>
  );

  if (error || !job) return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <p className="error-msg">{error || 'Job not found'}</p>
      <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => navigate('/jobs')}>← Back to Jobs</button>
    </div>
  );

  const initials = job.company?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color    = colors[job.company?.length % colors.length];

  return (
    <div className="detail-page page-enter">
      <div className="container">
        <button className="btn btn-ghost" onClick={() => navigate('/jobs')} style={{ marginBottom: 24, paddingLeft: 0 }}>
          ← Back to Jobs
        </button>

        <div className="detail-grid">
          {/* Main content */}
          <div className="detail-main">
            <div className="detail-card card">
              {/* Company + title */}
              <div className="detail-top">
                <div className="detail-logo" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                  <span style={{ color }}>{initials}</span>
                </div>
                <div>
                  <h1 className="detail-title">{job.title}</h1>
                  <p className="detail-company">{job.company}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="detail-badges">
                <span className={`badge ${typeColor[job.jobType] || 'badge-gray'}`}>{job.jobType}</span>
                <span className="badge badge-gray">📍 {job.location}</span>
                {job.salary && <span className="badge badge-green">💰 {job.salary}</span>}
              </div>

              {/* Description */}
              <div className="detail-section">
                <h3 className="detail-section-title">About the Role</h3>
                <p className="detail-desc">{job.description}</p>
              </div>

              {/* Skills */}
              <div className="detail-section">
                <h3 className="detail-section-title">Required Skills</h3>
                <div className="skill-chips" style={{ gap: 8 }}>
                  {job.skills?.map(skill => (
                    <span key={skill} className="skill-chip" style={{ fontSize: 13, padding: '5px 14px' }}>{skill}</span>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {msg   && <div className="success-msg">{msg}</div>}
              {error && <div className="error-msg">{error}</div>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="apply-card card">
              <h3 className="apply-card-title">Ready to apply?</h3>
              <p className="apply-card-sub">Submit your application for <strong>{job.title}</strong> at {job.company}.</p>

              {applied ? (
                <div className="applied-tag" style={{ justifyContent: 'center', fontSize: 15 }}>✓ Already Applied</div>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}
                  onClick={handleApply}>
                  {user ? 'Apply Now →' : 'Login to Apply →'}
                </button>
              )}

              <div className="apply-meta">
                <div className="apply-meta-row"><span>📍 Location</span><strong>{job.location}</strong></div>
                <div className="apply-meta-row"><span>💼 Type</span><strong>{job.jobType}</strong></div>
                {job.salary && <div className="apply-meta-row"><span>💰 Salary</span><strong>{job.salary}</strong></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
