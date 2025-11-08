import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import './PostJob.css';

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    job_type: 'full_time',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    requirements: '',
    deadline: '',
    is_internship: false,
    remote: false,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}/`);
      const job = response.data;
      setFormData({
        title: job.title || '',
        description: job.description || '',
        category: job.category || '',
        location: job.location || '',
        job_type: job.job_type || 'full_time',
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        salary_currency: job.salary_currency || 'USD',
        requirements: job.requirements || '',
        deadline: job.deadline || '',
        is_internship: job.is_internship || false,
        remote: job.remote || false,
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      setMessage('Failed to load job');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (id) {
        await api.put(`/jobs/${id}/`, formData);
        setMessage('Job updated successfully!');
      } else {
        await api.post('/jobs/', formData);
        setMessage('Job posted successfully!');
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'Failed to post job'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="post-job-card">
        <h2>{id ? 'Edit Job' : 'Post a New Job'}</h2>
        {message && (
          <div
            className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Software Development"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Type *</label>
              <select
                name="job_type"
                className="form-control"
                value={formData.job_type}
                onChange={handleChange}
                required
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the job position, responsibilities, and what you're looking for..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements *</label>
            <textarea
              name="requirements"
              className="form-control"
              rows="5"
              value={formData.requirements}
              onChange={handleChange}
              required
              placeholder="List the required qualifications, skills, and experience..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Minimum Salary</label>
              <input
                type="number"
                name="salary_min"
                className="form-control"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="e.g., 50000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Salary</label>
              <input
                type="number"
                name="salary_max"
                className="form-control"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="e.g., 100000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                name="salary_currency"
                className="form-control"
                value={formData.salary_currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="form-label">
              <input
                type="checkbox"
                name="is_internship"
                checked={formData.is_internship}
                onChange={handleChange}
              />
              This is an internship position
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="form-label">
              <input
                type="checkbox"
                name="remote"
                checked={formData.remote}
                onChange={handleChange}
              />
              Remote work available
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : id ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

