import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard/employer/*" 
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/candidate/*" 
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
