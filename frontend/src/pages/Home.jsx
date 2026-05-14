import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiBriefcase, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/jobs?keyword=${keyword}`);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your Dream Job Today</h1>
        <p>Connect with top employers and discover opportunities that match your skills and passion.</p>
        
        <form onSubmit={handleSearch} className="search-container">
          <FiSearch size={20} color="var(--text-secondary)" style={{ marginLeft: '1rem' }} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Job title, keywords, or company..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="search-btn">Search Jobs</button>
        </form>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 mb-4">
        <div className="glass-panel text-center p-4">
          <FiBriefcase size={40} color="var(--primary-color)" className="mb-2 mx-auto" />
          <h2 className="text-2xl font-bold">10,000+</h2>
          <p className="text-muted">Active Jobs</p>
        </div>
        <div className="glass-panel text-center p-4">
          <FiUsers size={40} color="var(--secondary-color)" className="mb-2 mx-auto" />
          <h2 className="text-2xl font-bold">5,000+</h2>
          <p className="text-muted">Companies</p>
        </div>
        <div className="glass-panel text-center p-4">
          <FiTrendingUp size={40} color="#eab308" className="mb-2 mx-auto" />
          <h2 className="text-2xl font-bold">100k+</h2>
          <p className="text-muted">Successful Hires</p>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-4">
        <h2 className="text-center mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {['Technology', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Sales', 'Engineering'].map(category => (
            <Link to={`/jobs?category=${category}`} key={category} className="glass-panel p-4 text-center hover:border-[var(--primary-color)] transition-colors">
              <h3 className="text-lg m-0">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
