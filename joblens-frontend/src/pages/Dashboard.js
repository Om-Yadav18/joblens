// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [profile, setProfile]       = useState(null);
  const [applications, setApps]     = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading]   = useState(false);
  const [msg, setMsg]               = useState('');
  const [error, setError]           = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appRes] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/applications/my-applications'),
        ]);
        setProfile(profileRes.data);
        setApps(appRes.data.applications || []);
      } catch {}
    };
    fetchData();
  }, []);

  const handleResumeUpload = async () => {
    if (!resumeFile) { setError('Please select a file first.'); return; }
    setUploading(true); setMsg(''); setError('');
    const formData = new FormData();
    formData.append('resume', resumeFile);
    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg('✓ Resume uploaded successfully!');
      setProfile(prev => ({ ...prev, resumePath: data.resumePath }));
      setResumeFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleWithdraw = async (jobId) => {
    try {
      await api.delete(`/applications/withdraw/${jobId}`);
      setApps(prev => prev.filter(a => a.job?._id !== jobId));
      setMsg('Application withdrawn.');
      setTimeout(() => setMsg(''), 3000);
    } catch { setError('Could not withdraw application.'); }
  };

  const statusColor = { Applied: 'badge-gray', 'Under Review': 'badge-orange', 'Interview Scheduled': 'badge-purple', Accepted: 'badge-green', Rejected: 'badge-gray' };

  return (
    <div className="dashboard-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="dash-header">
          <div>
            <span className="section-tag">My Space</span>
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-sub">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">Browse Jobs →</Link>
        </div>

        {msg   && <div className="success-msg" style={{marginBottom:16}}>{msg}</div>}
        {error && <div className="error-msg"   style={{marginBottom:16}}>{error}</div>}

        <div className="dash-grid">
          {/* Left column */}
          <div className="dash-left">
            {/* Profile card */}
            <div className="profile-card card">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-stats">
                <div className="pstat">
                  <span className="pstat-val">{applications.length}</span>
                  <span className="pstat-label">Applied</span>
                </div>
                <div className="pstat-div"></div>
                <div className="pstat">
                  <span className="pstat-val">{applications.filter(a => a.status === 'Interview Scheduled').length}</span>
                  <span className="pstat-label">Interviews</span>
                </div>
                <div className="pstat-div"></div>
                <div className="pstat">
                  <span className="pstat-val">{profile?.resumePath ? '1' : '0'}</span>
                  <span className="pstat-label">Resume</span>
                </div>
              </div>
            </div>

            {/* Resume upload */}
            <div className="card resume-card">
              <h3 className="card-section-title">📄 Resume</h3>
              {profile?.resumePath ? (
                <div className="resume-status">
                  <span className="badge badge-green">✓ Uploaded</span>
                  <p className="resume-path">{profile.resumePath.split('/').pop()}</p>
                </div>
              ) : (
                <p className="resume-hint">Upload your resume to apply faster</p>
              )}
              <div className="resume-upload-area" onClick={() => document.getElementById('resumeInput').click()}>
                <input id="resumeInput" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                  onChange={e => setResumeFile(e.target.files[0])} />
                {resumeFile
                  ? <p className="file-chosen">📎 {resumeFile.name}</p>
                  : <p className="file-hint">Click to choose PDF / Word file</p>
                }
              </div>
              <button className="btn btn-primary" onClick={handleResumeUpload} disabled={uploading || !resumeFile} style={{ width: '100%', justifyContent: 'center' }}>
                {uploading ? <><span className="spinner"></span> Uploading...</> : 'Upload Resume'}
              </button>
            </div>
          </div>

          {/* Right column — Applications */}
          <div className="dash-right">
            <div className="card applications-card">
              <div className="card-header-row">
                <h3 className="card-section-title">📬 My Applications</h3>
                <span className="badge badge-purple">{applications.length}</span>
              </div>

              {applications.length === 0 ? (
                <div className="no-apps">
                  <span>🗂️</span>
                  <p>No applications yet</p>
                  <Link to="/jobs" className="btn btn-outline btn-sm">Browse Jobs</Link>
                </div>
              ) : (
                <div className="app-list">
                  {applications.map(app => (
                    <div key={app._id} className="app-item">
                      <div className="app-info">
                        <p className="app-job-title">{app.job?.title || 'Job Deleted'}</p>
                        <p className="app-company">{app.job?.company} · {app.job?.location}</p>
                        <p className="app-date">Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="app-right">
                        <span className={`badge ${statusColor[app.status] || 'badge-gray'}`}>{app.status}</span>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleWithdraw(app.job?._id)}>Withdraw</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
