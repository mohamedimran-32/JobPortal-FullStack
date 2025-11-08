import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import './Applications.css';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId) => {
    if (!statusUpdate) return;

    try {
      await api.put(`/applications/${applicationId}/update-status/`, {
        status: statusUpdate,
      });
      fetchApplications();
      setSelectedApp(null);
      setStatusUpdate('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (user?.is_job_seeker) {
    return (
      <div className="applications-container">
        <h1>My Applications</h1>
        {applications.length === 0 ? (
          <div className="empty-state">
            <p>You haven't applied for any jobs yet.</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <div>
                    <h3>
                      <Link to={`/jobs/${app.job?.id}`}>{app.job?.title}</Link>
                    </h3>
                    <p>{app.job?.posted_by?.email}</p>
                  </div>
                  <span className={`status-badge status-${app.status}`}>
                    {app.status}
                  </span>
                </div>
                <div className="application-details">
                  <p>
                    <strong>Applied:</strong>{' '}
                    {new Date(app.applied_date).toLocaleDateString()}
                  </p>
                  {app.cover_letter && (
                    <div className="cover-letter">
                      <strong>Cover Letter:</strong>
                      <p>{app.cover_letter}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (user?.is_employer) {
    return (
      <div className="applications-container">
        <h1>Job Applications</h1>
        {applications.length === 0 ? (
          <div className="empty-state">
            <p>No applications received yet.</p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <div>
                    <h3>
                      <Link to={`/jobs/${app.job?.id}`}>{app.job?.title}</Link>
                    </h3>
                    <p>Applicant: {app.applicant?.email}</p>
                  </div>
                  <span className={`status-badge status-${app.status}`}>
                    {app.status}
                  </span>
                </div>
                <div className="application-details">
                  <p>
                    <strong>Applied:</strong>{' '}
                    {new Date(app.applied_date).toLocaleDateString()}
                  </p>
                  {app.applicant_profile?.resume && (
                    <a
                      href={app.applicant_profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      Download Resume
                    </a>
                  )}
                  {app.cover_letter && (
                    <div className="cover-letter">
                      <strong>Cover Letter:</strong>
                      <p>{app.cover_letter}</p>
                    </div>
                  )}
                  <div className="application-actions">
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="form-control"
                      style={{ width: '200px', display: 'inline-block' }}
                    >
                      <option value="">Update Status</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleStatusUpdate(app.id)}
                      className="btn btn-primary"
                      disabled={!statusUpdate}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Applications;

