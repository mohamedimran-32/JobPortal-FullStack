import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      let response;
      if (user?.is_job_seeker) {
        response = await api.get('/profiles/jobseeker/');
      } else if (user?.is_employer) {
        response = await api.get('/profiles/employer/');
      }
      if (response) {
        setProfile(response.data);
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [e.target.name]: file,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      let response;
      if (user?.is_job_seeker) {
        response = await api.patch('/profiles/jobseeker/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (user?.is_employer) {
        response = await api.patch('/profiles/employer/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response) {
        setProfile(response.data);
        setMessage('Profile updated successfully!');
      }
    } catch (error) {
      setMessage('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (user?.is_job_seeker) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Job Seeker Profile</h2>
          {message && (
            <div
              className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Resume (PDF, DOC, DOCX)</label>
              <input
                type="file"
                name="resume"
                className="form-control"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              {profile?.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                >
                  View Current Resume
                </a>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                value={formData.skills || ''}
                onChange={handleChange}
                placeholder="e.g., Python, JavaScript, React"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Education</label>
              <textarea
                name="education"
                className="form-control"
                rows="4"
                value={formData.education || ''}
                onChange={handleChange}
                placeholder="Your educational background"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience</label>
              <textarea
                name="experience"
                className="form-control"
                rows="4"
                value={formData.experience || ''}
                onChange={handleChange}
                placeholder="Your work experience"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                className="form-control"
                rows="3"
                value={formData.bio || ''}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                className="form-control"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                className="form-control"
                value={formData.github_url || ''}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio URL</label>
              <input
                type="url"
                name="portfolio_url"
                className="form-control"
                value={formData.portfolio_url || ''}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (user?.is_employer) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Employer Profile</h2>
          {message && (
            <div
              className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="company_name"
                className="form-control"
                value={formData.company_name || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Description</label>
              <textarea
                name="company_description"
                className="form-control"
                rows="5"
                value={formData.company_description || ''}
                onChange={handleChange}
                placeholder="Tell us about your company"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Logo</label>
              <input
                type="file"
                name="company_logo"
                className="form-control"
                onChange={handleFileChange}
                accept="image/*"
              />
              {profile?.company_logo && (
                <img
                  src={profile.company_logo}
                  alt="Company Logo"
                  className="company-logo-preview"
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input
                type="url"
                name="company_website"
                className="form-control"
                value={formData.company_website || ''}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Size</label>
              <select
                name="company_size"
                className="form-control"
                value={formData.company_size || ''}
                onChange={handleChange}
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Industry</label>
              <input
                type="text"
                name="industry"
                className="form-control"
                value={formData.industry || ''}
                onChange={handleChange}
                placeholder="e.g., Technology, Healthcare"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Founded Year</label>
              <input
                type="number"
                name="founded_year"
                className="form-control"
                value={formData.founded_year || ''}
                onChange={handleChange}
                placeholder="e.g., 2020"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default Profile;

