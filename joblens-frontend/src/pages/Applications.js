// src/pages/Applications.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Applications.css';

const statusColor = {
  'Applied':              'badge-gray',
  'Under Review':         'badge-orange',
  'Interview Scheduled':  'badge-purple',
  'Accepted':             'badge-green',
  'Rejected':             'badge-gray',
};

const Applications = () => {
  const [apps, setApps]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get('/applications/my-applications');
        setApps(data.applications || []);
      } catch { setError('Failed to load applications.'); }
      finally { setLoading(false); }
    };
    fetchApps();
  }, []);

  const handleWithdraw = async (jobId) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await api.delete(`/applications/withdraw/${jobId}`);
      setApps(prev => prev.filter(a => a.job?._id !== jobId));
      setMsg('Application withdrawn.');
      setTimeout(() => setMsg(''), 3000);
    } catch { setError('Could not withdraw.'); }
  };

  const counts = {
    total:     apps.length,
    active:    apps.filter(a => !['Rejected'].includes(a.status)).length,
    interview: apps.filter(a => a.status === 'Interview Scheduled').length,
    accepted:  apps.filter(a => a.status === 'Accepted').length,
  };

  return (
    <div className="apps-page page-enter">
      <div className="container">
        <div className="apps-header">
          <div>
            <span className="section-tag">Tracking</span>
            <h1 className="apps-title">My Applications</h1>
            <p className="apps-sub">Track all your job applications in one place</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">Browse More Jobs →</Link>
        </div>

        {/* Stats */}
        <div className="apps-stats">
          {[
            { label: 'Total Applied', value: counts.total,     color: 'var(--accent2)' },
            { label: 'Active',        value: counts.active,    color: 'var(--green)'   },
            { label: 'Interviews',    value: counts.interview, color: 'var(--orange)'  },
            { label: 'Accepted',      value: counts.accepted,  color: 'var(--green)'   },
          ].map(s => (
            <div key={s.label} className="app-stat-card card">
              <span className="app-stat-val" style={{ color: s.color }}>{s.value}</span>
              <span className="app-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {msg   && <div className="success-msg" style={{ marginBottom: 16 }}>{msg}</div>}
        {error && <div className="error-msg"   style={{ marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <span className="spinner" style={{ width: 32, height: 32 }}></span>
          </div>
        ) : apps.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>No applications yet</h3>
            <p style={{ color: 'var(--text2)', marginBottom: 20 }}>Start applying to jobs to track them here</p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs →</Link>
          </div>
        ) : (
          <div className="apps-table card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-header">
              <span>Job Title</span>
              <span>Company</span>
              <span>Location</span>
              <span>Date Applied</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {apps.map(app => (
              <div key={app._id} className="table-row">
                <span className="col-title">{app.job?.title || 'N/A'}</span>
                <span className="col-sub">{app.job?.company || '—'}</span>
                <span className="col-sub">📍 {app.job?.location || '—'}</span>
                <span className="col-sub">{new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                <span><span className={`badge ${statusColor[app.status]}`}>{app.status}</span></span>
                <span>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => handleWithdraw(app.job?._id)}>Withdraw</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
