// src/components/JobCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

const typeColor = { 'Full-time': 'badge-green', 'Internship': 'badge-orange', 'Part-time': 'badge-purple', 'Remote': 'badge-purple' };

const JobCard = ({ job, onApply, applied }) => {
  const navigate = useNavigate();

  // Company initials avatar
  const initials = job.company?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#6c63ff','#22c55e','#f59e0b','#3b82f6','#ec4899','#14b8a6'];
  const color  = colors[job.company?.length % colors.length] || colors[0];

  return (
    <div className="job-card card">
      <div className="job-card-top">
        {/* Company logo placeholder */}
        <div className="company-logo" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
          <span style={{ color }}>{initials}</span>
        </div>
        <div className="job-card-meta">
          <span className={`badge ${typeColor[job.jobType] || 'badge-gray'}`}>{job.jobType}</span>
          <span className="badge badge-gray">📍 {job.location}</span>
        </div>
      </div>

      <h3 className="job-title">{job.title}</h3>
      <p className="job-company">{job.company}</p>

      {job.salary && (
        <p className="job-salary">💰 {job.salary}</p>
      )}

      <p className="job-desc">{job.description}</p>

      {/* Skills chips */}
      <div className="skill-chips">
        {job.skills?.map(skill => (
          <span key={skill} className="skill-chip">{skill}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="job-card-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/jobs/${job._id}`)}>
          View Details
        </button>
        {applied ? (
          <span className="applied-tag">✓ Applied</span>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => onApply && onApply(job._id)}>
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
