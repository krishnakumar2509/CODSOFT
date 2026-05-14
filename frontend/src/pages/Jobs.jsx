import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { FiMapPin, FiDollarSign, FiClock, FiSearch } from 'react-icons/fi';
import moment from 'moment';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get('keyword') || '';
  const initialCategory = searchParams.get('category') || '';

  const [filters, setFilters] = useState({
    keyword: initialKeyword,
    location: '',
    type: '',
    category: initialCategory
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let queryStr = '?';
      if (filters.keyword) queryStr += `keyword=${filters.keyword}&`;
      if (filters.location) queryStr += `location=${filters.location}&`;
      if (filters.type) queryStr += `type=${filters.type}&`;
      if (filters.category) queryStr += `category=${filters.category}&`;

      const res = await api.get(`/jobs${queryStr}`);
      setJobs(res.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in">
      <div className="grid md:grid-cols-[300px_1fr] gap-4">
        {/* Sidebar Filters */}
        <div className="glass-panel p-4 h-fit sticky top-24">
          <h3 className="mb-4">Filters</h3>
          
          <div className="form-group">
            <label className="form-label">Search</label>
            <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
              <FiSearch style={{ position: 'absolute', left: '10px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                name="keyword"
                className="form-control" 
                style={{ paddingLeft: '35px' }}
                placeholder="Job title..."
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              type="text" 
              name="location"
              className="form-control" 
              placeholder="City, state, or remote..."
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select 
              name="type" 
              className="form-control"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              name="category" 
              className="form-control"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          <button 
            className="btn btn-secondary w-full" 
            style={{ width: '100%' }}
            onClick={() => setFilters({ keyword: '', location: '', type: '', category: '' })}
          >
            Clear Filters
          </button>
        </div>

        {/* Job List */}
        <div>
          <h2 className="mb-4">Explore Jobs ({jobs.length})</h2>
          
          {loading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-8 text-center text-muted">
              No jobs found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="job-title">{job.title}</h3>
                      </Link>
                      <div className="job-company">
                        {job.employer?.companyName || 'Company Name'}
                      </div>
                    </div>
                    <span className={`job-badge ${job.type === 'Remote' ? 'remote' : ''}`}>
                      {job.type}
                    </span>
                  </div>

                  <div className="job-details">
                    <div className="job-detail-item">
                      <FiMapPin /> {job.location}
                    </div>
                    <div className="job-detail-item">
                      <FiDollarSign /> ${job.salary.toLocaleString()}
                    </div>
                    <div className="job-detail-item">
                      <FiClock /> {moment(job.createdAt).fromNow()}
                    </div>
                  </div>

                  <p className="text-muted mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>

                  <div className="job-footer">
                    <span className="text-sm text-muted">Category: {job.category}</span>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
