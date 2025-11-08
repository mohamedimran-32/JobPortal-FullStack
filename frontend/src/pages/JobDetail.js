import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
  });
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}/`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      setMessage('Job not found');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user?.is_job_seeker) {
      setMessage('Only job seekers can apply for jobs');
      return;
    }

    setApplying(true);
    setMessage('');

    try {
      await api.post('/applications/create/', {
        job: id,
        cover_letter: applicationData.cover_letter,
      });
      setMessage('Application submitted successfully!');
      setShowApplyForm(false);
      setApplicationData({ cover_letter: '' });
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'Failed to submit application'
      );
    } finally {
      setApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated || !user?.is_job_seeker) {
      return;
    }

    try {
      if (job.is_saved) {
        await api.delete(`/jobs/${id}/save/`);
      } else {
        await api.post(`/jobs/${id}/save/`);
      }
      fetchJob();
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!job) {
    return (
      <div className="job-detail-container">
        <div className="alert alert-error">{message || 'Job not found'}</div>
      </div>
    );
  }

  return (
    <div className="job-detail-container">
      <div className="job-detail">
        <div className="job-detail-header">
          <div>
            <h1>{job.title}</h1>
            <p className="job-company">{job.posted_by?.email}</p>
            <div className="job-meta">
              <span>📍 {job.location}</span>
              <span>{job.job_type}</span>
              {job.is_internship && <span className="job-badge">Internship</span>}
              {job.remote && <span className="job-badge">Remote</span>}
            </div>
          </div>
          {isAuthenticated && user?.is_job_seeker && (
            <div className="job-actions">
              <button
                onClick={handleSaveToggle}
                className={`btn ${job.is_saved ? 'btn-secondary' : 'btn-outline'}`}
              >
                {job.is_saved ? '★ Saved' : '☆ Save'}
              </button>
              {!showApplyForm && (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="btn btn-primary"
                >
                  Apply Now
                </button>
              )}
            </div>
          )}
        </div>

        {message && (
          <div
            className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}
          >
            {message}
          </div>
        )}

        {showApplyForm && (
          <div className="apply-form-card">
            <h3>Apply for this Position</h3>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea
                  className="form-control"
                  rows="6"
                  value={applicationData.cover_letter}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      cover_letter: e.target.value,
                    })
                  }
                  placeholder="Tell us why you're a great fit for this position..."
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyForm(false);
                    setApplicationData({ cover_letter: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="job-detail-content">
          <div className="job-info-card">
            <h3>Job Details</h3>
            <div className="job-info-grid">
              <div>
                <strong>Category:</strong> {job.category}
              </div>
              <div>
                <strong>Salary:</strong> {job.salary_range}
              </div>
              <div>
                <strong>Posted:</strong>{' '}
                {new Date(job.created_at).toLocaleDateString()}
              </div>
              {job.deadline && (
                <div>
                  <strong>Deadline:</strong>{' '}
                  {new Date(job.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="job-description-card">
            <h3>Description</h3>
            <p>{job.description}</p>
          </div>

          <div className="job-requirements-card">
            <h3>Requirements</h3>
            <p>{job.requirements}</p>
          </div>
        </div>

        <div className="job-detail-footer">
          <Link to="/jobs" className="btn btn-secondary">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

