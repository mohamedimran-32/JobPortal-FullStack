import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './JobCard.css';

const JobCard = ({ job, onSaveToggle }) => {
  const { isAuthenticated, user } = useAuth();

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user?.is_job_seeker) {
      return;
    }

    try {
      if (job.is_saved) {
        await api.delete(`/jobs/${job.id}/save/`);
      } else {
        await api.post(`/jobs/${job.id}/save/`);
      }
      if (onSaveToggle) {
        onSaveToggle();
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  return (
    <div className="job-card">
      <Link to={`/jobs/${job.id}`} className="job-card-link">
        <div className="job-card-header">
          <h3 className="job-title">{job.title}</h3>
          {isAuthenticated && user?.is_job_seeker && (
            <button
              onClick={handleSaveToggle}
              className={`save-btn ${job.is_saved ? 'saved' : ''}`}
              title={job.is_saved ? 'Unsave' : 'Save'}
            >
              {job.is_saved ? '★' : '☆'}
            </button>
          )}
        </div>
        
        <div className="job-card-body">
          <p className="job-company">{job.posted_by?.email}</p>
          <div className="job-meta">
            <span className="job-location">📍 {job.location}</span>
            <span className="job-type">{job.job_type}</span>
            {job.is_internship && <span className="job-badge">Internship</span>}
            {job.remote && <span className="job-badge">Remote</span>}
          </div>
          <p className="job-salary">{job.salary_range}</p>
          <p className="job-description">{job.description.substring(0, 150)}...</p>
        </div>
        
        <div className="job-card-footer">
          <span className="job-category">{job.category}</span>
          <span className="job-date">
            {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default JobCard;

