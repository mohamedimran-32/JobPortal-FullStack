import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';
import './JobSearch.css';

const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    is_internship: searchParams.get('is_internship') || '',
    remote: searchParams.get('remote') || '',
    salary_min: searchParams.get('salary_min') || '',
    salary_max: searchParams.get('salary_max') || '',
  });

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/jobs/search/?${params.toString()}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    setSearchParams(params);
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      job_type: '',
      is_internship: '',
      remote: '',
      salary_min: '',
      salary_max: '',
    });
    setSearchParams({});
    fetchJobs();
  };

  const refreshJobs = () => {
    fetchJobs();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="job-search-container">
      <div className="search-header">
        <h1>Find Your Dream Job</h1>
        <p>Browse through thousands of job opportunities</p>
      </div>

      <div className="search-layout">
        <div className="filters-sidebar">
          <h3>Filters</h3>
          <form onSubmit={handleSearch} className="filters-form">
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                name="search"
                className="form-control"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Job title, keywords..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="e.g., Software, Marketing"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City, State"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                name="job_type"
                className="form-control"
                value={filters.job_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="is_internship"
                  checked={filters.is_internship === 'true'}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      is_internship: e.target.checked ? 'true' : '',
                    })
                  }
                />
                Internships Only
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="remote"
                  checked={filters.remote === 'true'}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      remote: e.target.checked ? 'true' : '',
                    })
                  }
                />
                Remote Only
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <div className="salary-range">
                <input
                  type="number"
                  name="salary_min"
                  className="form-control"
                  value={filters.salary_min}
                  onChange={handleFilterChange}
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="number"
                  name="salary_max"
                  className="form-control"
                  value={filters.salary_max}
                  onChange={handleFilterChange}
                  placeholder="Max"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Apply Filters
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-secondary btn-block"
            >
              Clear Filters
            </button>
          </form>
        </div>

        <div className="jobs-list">
          <div className="jobs-header">
            <h2>
              {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="no-jobs">
              <p>No jobs found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onSaveToggle={refreshJobs} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;

