import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiPlusCircle, FiList, FiUsers, FiSettings, FiEdit, FiTrash2 } from 'react-icons/fi';
import moment from 'moment';

// Subcomponents
const ManageJobs = ({ jobs, setJobs }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id));
        toast.success('Job deleted successfully');
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Manage Jobs</h2>
        <Link to="/dashboard/employer/post-job" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlusCircle /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-panel p-8 text-center text-muted">
          You haven't posted any jobs yet.
        </div>
      ) : (
        <div className="glass-panel overflow-x-auto" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Posted Date</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div className="font-bold">{job.title}</div>
                    <div className="text-sm text-muted">{job.location} • {job.type}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`job-badge ${job.isActive ? 'remote' : ''}`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{moment(job.createdAt).format('MMM Do, YYYY')}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/dashboard/employer/applications/${job._id}`} className="btn btn-secondary btn-sm" title="View Applications">
                        <FiUsers />
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)} title="Delete Job">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    type: 'Full-time',
    category: 'Technology',
    deadline: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim() !== '')
      };
      await api.post('/jobs', dataToSubmit);
      toast.success('Job posted successfully!');
      navigate('/dashboard/employer');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to post job');
    }
  };

  return (
    <div className="glass-panel p-6 max-w-3xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="mb-6">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group md:col-span-2" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Job Title</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
        </div>
        
        <div className="form-group md:col-span-2" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" rows="5" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group md:col-span-2" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Requirements (One per line)</label>
          <textarea name="requirements" className="form-control" rows="4" value={formData.requirements} onChange={handleChange} required placeholder="e.g. 3+ years experience with React&#10;Strong communication skills"></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Salary</label>
          <input type="number" name="salary" className="form-control" value={formData.salary} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select name="type" className="form-control" value={formData.type} onChange={handleChange} required>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
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

        <div className="form-group">
          <label className="form-label">Application Deadline</label>
          <input type="date" name="deadline" className="form-control" value={formData.deadline} onChange={handleChange} required />
        </div>

        <div className="md:col-span-2 mt-4" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', padding: '0.75rem' }}>Post Job</button>
        </div>
      </form>
    </div>
  );
};

const ViewApplications = () => {
  const { id } = useParams(); // id is the jobId in this context due to router nesting workaround? Wait, let's use location.pathname. 
  // Actually, wait, the route is /dashboard/employer/applications/:id
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get(`/applications/job/${id}`);
        setApplications(res.data.data);
      } catch (error) {
        toast.error('Failed to load applications');
      }
      setLoading(false);
    };
    fetchApplications();
  }, [id]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      setApplications(applications.map(app => app._id === appId ? { ...app, status } : app));
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div>
      <h2 className="mb-6">Job Applications</h2>
      {applications.length === 0 ? (
        <div className="glass-panel p-8 text-center text-muted">
          No applications received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map(app => (
            <div key={app._id} className="glass-panel p-4 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="text-lg">{app.candidate.name}</h3>
                <div className="text-sm text-muted">{app.candidate.email}</div>
                <div className="mt-2 text-sm text-muted">Applied: {moment(app.createdAt).fromNow()}</div>
                <div className="mt-2">
                  <a href={`http://localhost:5000/${app.resume}`} target="_blank" rel="noreferrer" className="text-[var(--primary-color)] hover:underline">
                    View Resume
                  </a>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className={`job-badge ${app.status === 'accepted' ? 'remote' : app.status === 'rejected' ? 'bg-red-500 text-white' : ''}`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
                <select 
                  className="form-control form-control-sm"
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  style={{ width: 'auto', display: 'inline-block' }}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EmployerDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get('/jobs/employer/me');
        setJobs(res.data.data);
      } catch (error) {
        console.error('Error fetching jobs');
      }
    };
    fetchMyJobs();
  }, []);

  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[var(--primary-color)] mx-auto flex items-center justify-center text-2xl font-bold mb-2" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {user?.companyName?.charAt(0)}
          </div>
          <h3 className="text-lg m-0">{user?.companyName}</h3>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard/employer" className={`sidebar-link ${location.pathname === '/dashboard/employer' ? 'active' : ''}`}>
            <FiList /> Manage Jobs
          </Link>
          <Link to="/dashboard/employer/post-job" className={`sidebar-link ${location.pathname === '/dashboard/employer/post-job' ? 'active' : ''}`}>
            <FiPlusCircle /> Post a Job
          </Link>
          <Link to="/dashboard/employer/settings" className={`sidebar-link ${location.pathname === '/dashboard/employer/settings' ? 'active' : ''}`}>
            <FiSettings /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<ManageJobs jobs={jobs} setJobs={setJobs} />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/applications/:id" element={<ViewApplications />} />
          <Route path="/settings" element={<div>Settings coming soon...</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default EmployerDashboard;
