import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    companyName: ''
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="glass-panel p-4">
        <h2 className="text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="candidate" 
                checked={formData.role === 'candidate'}
                onChange={handleChange}
              />
              I'm a Candidate
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="employer" 
                checked={formData.role === 'employer'}
                onChange={handleChange}
              />
              I'm an Employer
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="form-control" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {formData.role === 'employer' && (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input 
                type="text" 
                name="companyName"
                className="form-control" 
                value={formData.companyName}
                onChange={handleChange}
                required={formData.role === 'employer'}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-control" 
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Register
          </button>
        </form>
        <p className="text-center mt-3 text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
