import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        api.get('/admin/stats/'),
        api.get('/admin/users/'),
        api.get('/admin/jobs/'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobModeration = async (jobId, action) => {
    try {
      await api.put(`/admin/jobs/${jobId}/moderate/`, { action });
      fetchDashboardData();
    } catch (error) {
      console.error('Error moderating job:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>{stats.users?.total || 0}</h3>
          <p>Total Users</p>
          <small>
            {stats.users?.job_seekers || 0} Job Seekers, {stats.users?.employers || 0} Employers
          </small>
        </div>
        <div className="stat-card">
          <h3>{stats.jobs?.total || 0}</h3>
          <p>Total Jobs</p>
          <small>{stats.jobs?.active || 0} Active, {stats.jobs?.internships || 0} Internships</small>
        </div>
        <div className="stat-card">
          <h3>{stats.applications?.total || 0}</h3>
          <p>Total Applications</p>
          <small>{stats.applications?.pending || 0} Pending</small>
        </div>
        <div className="stat-card">
          <h3>{stats.users?.recent || 0}</h3>
          <p>New Users (7 days)</p>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <h2>User Management</h2>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <span className="role-badge">{user.role}</span>
                    </td>
                    <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <h2>Job Moderation</h2>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Posted By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 10).map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.posted_by?.email}</td>
                    <td>
                      <span className={`status-badge status-${job.status}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      {job.status === 'draft' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleJobModeration(job.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleJobModeration(job.id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

