import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FiBriefcase size={28} color="var(--primary-color)" />
        <span>Job</span>Portal
      </Link>
      
      <div className="navbar-nav">
        <Link to="/jobs" className="nav-link">Jobs</Link>
        
        {user ? (
          <>
            <Link 
              to={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate'} 
              className="nav-link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FiUser /> Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
