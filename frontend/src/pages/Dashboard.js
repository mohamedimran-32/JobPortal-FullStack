import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import JobCard from '../components/JobCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.is_job_seeker) {
        // Fetch saved jobs
        const savedResponse = await api.get('/jobs/saved/');
        setSavedJobs(savedResponse.data.map((item) => item.job));

        // Fetch applications
        const appsResponse = await api.get('/applications/');
        setApplications(appsResponse.data);

        // Fetch recommended jobs
        const jobsResponse = await api.get('/jobs/');
        setRecentJobs(jobsResponse.data.results || jobsResponse.data);
      } else if (user?.is_employer) {
        // Fetch posted jobs
        const jobsResponse = await api.get('/jobs/');
        const allJobs = jobsResponse.data.results || jobsResponse.data;
        const myJobs = allJobs.filter((job) => job.posted_by?.id === user.id);
        setRecentJobs(myJobs);

        // Fetch applications for my jobs
        const appsResponse = await api.get('/applications/');
        setApplications(appsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (user?.is_job_seeker) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.username}!</h1>
          <p>Here's what's happening with your job search</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{applications.length}</h3>
            <p>Applications</p>
          </div>
          <div className="stat-card">
            <h3>{savedJobs.length}</h3>
            <p>Saved Jobs</p>
          </div>
          <div className="stat-card">
            <h3>
              {applications.filter((app) => app.status === 'pending').length}
            </h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Saved Jobs</h2>
              <Link to="/jobs" className="btn btn-outline">
                Browse More
              </Link>
            </div>
            {savedJobs.length === 0 ? (
              <p className="empty-state">No saved jobs yet</p>
            ) : (
              <div className="jobs-list">
                {savedJobs.slice(0, 5).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Applications</h2>
              <Link to="/applications" className="btn btn-outline">
                View All
              </Link>
            </div>
            {applications.length === 0 ? (
              <p className="empty-state">No applications yet</p>
            ) : (
              <div className="applications-list">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="application-item">
                    <div>
                      <h4>{app.job?.title}</h4>
                      <p>{app.job?.posted_by?.email}</p>
                    </div>
                    <span className={`status-badge status-${app.status}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recommended Jobs</h2>
              <Link to="/jobs" className="btn btn-outline">
                See All
              </Link>
            </div>
            {recentJobs.length === 0 ? (
              <p className="empty-state">No jobs available</p>
            ) : (
              <div className="jobs-list">
                {recentJobs.slice(0, 5).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (user?.is_employer) {
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(
      (app) => app.status === 'pending'
    ).length;

    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Employer Dashboard</h1>
          <p>Manage your job postings and applications</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{recentJobs.length}</h3>
            <p>Posted Jobs</p>
          </div>
          <div className="stat-card">
            <h3>{totalApplications}</h3>
            <p>Total Applications</p>
          </div>
          <div className="stat-card">
            <h3>{pendingApplications}</h3>
            <p>Pending Reviews</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>My Job Postings</h2>
              <Link to="/post-job" className="btn btn-primary">
                Post New Job
              </Link>
            </div>
            {recentJobs.length === 0 ? (
              <p className="empty-state">No jobs posted yet</p>
            ) : (
              <div className="jobs-list">
                {recentJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Applications</h2>
              <Link to="/applications" className="btn btn-outline">
                View All
              </Link>
            </div>
            {applications.length === 0 ? (
              <p className="empty-state">No applications yet</p>
            ) : (
              <div className="applications-list">
                {applications.slice(0, 10).map((app) => (
                  <div key={app.id} className="application-item">
                    <div>
                      <h4>{app.job?.title}</h4>
                      <p>Applicant: {app.applicant?.email}</p>
                    </div>
                    <span className={`status-badge status-${app.status}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;

