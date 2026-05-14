import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiFileText, FiUser, FiSettings } from 'react-icons/fi';
import moment from 'moment';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await api.get('/applications/mine');
        setApplications(res.data.data);
      } catch (error) {
        toast.error('Failed to load applications');
      }
      setLoading(false);
    };
    fetchMyApplications();
  }, []);

  if (loading) return <div>Loading applications...</div>;

  return (
    <div>
      <h2 className="mb-6">My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="glass-panel p-8 text-center text-muted">
          You haven't applied to any jobs yet.
          <div className="mt-4">
            <Link to="/jobs" className="btn btn-primary">Find Jobs</Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel overflow-x-auto" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Job Details</th>
                <th style={{ padding: '1rem' }}>Applied Date</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div className="font-bold">{app.job?.title}</div>
                    <div className="text-sm text-muted">{app.job?.employer?.companyName} • {app.job?.location}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{moment(app.createdAt).format('MMM Do, YYYY')}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`job-badge ${app.status === 'accepted' ? 'remote' : app.status === 'rejected' ? 'bg-red-500 text-white' : ''}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/jobs/${app.job?._id}`} className="text-[var(--primary-color)] hover:underline">
                      View Job
                    </Link>
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

const CandidateProfile = () => {
  const { user } = useAuth();
  return (
    <div className="glass-panel p-6 max-w-2xl mx-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-6">My Profile</h2>
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-[var(--primary-color)] mx-auto flex items-center justify-center text-3xl font-bold mb-4" style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
          {user?.name?.charAt(0)}
        </div>
      </div>
      
      <div className="grid gap-4">
        <div className="glass-panel p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="text-sm text-muted mb-1">Full Name</div>
          <div className="text-lg">{user?.name}</div>
        </div>
        <div className="glass-panel p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="text-sm text-muted mb-1">Email Address</div>
          <div className="text-lg">{user?.email}</div>
        </div>
        <div className="glass-panel p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="text-sm text-muted mb-1">Role</div>
          <div className="text-lg capitalize" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-muted text-sm">
        To update your profile, please contact support.
      </div>
    </div>
  );
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="dashboard-layout animate-fade-in">
      {/* Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[var(--primary-color)] mx-auto flex items-center justify-center text-2xl font-bold mb-2" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {user?.name?.charAt(0)}
          </div>
          <h3 className="text-lg m-0">{user?.name}</h3>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard/candidate" className={`sidebar-link ${location.pathname === '/dashboard/candidate' ? 'active' : ''}`}>
            <FiFileText /> My Applications
          </Link>
          <Link to="/dashboard/candidate/profile" className={`sidebar-link ${location.pathname === '/dashboard/candidate/profile' ? 'active' : ''}`}>
            <FiUser /> Profile
          </Link>
          <Link to="/dashboard/candidate/settings" className={`sidebar-link ${location.pathname === '/dashboard/candidate/settings' ? 'active' : ''}`}>
            <FiSettings /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<MyApplications />} />
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/settings" element={<div>Settings coming soon...</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default CandidateDashboard;
