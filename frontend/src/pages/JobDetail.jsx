import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMapPin, FiDollarSign, FiClock, FiBriefcase, FiCalendar, FiUpload } from 'react-icons/fi';
import moment from 'moment';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (error) {
        toast.error('Error fetching job details');
        navigate('/jobs');
      }
      setLoading(false);
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      return toast.error('Please upload a resume');
    }

    setApplying(true);
    const formData = new FormData();
    formData.append('resume', resume);
    if (coverLetter) formData.append('coverLetter', coverLetter);

    try {
      await api.post(`/applications/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    }
    setApplying(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!job) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 mb-6">
        <div className="flex justify-between items-start mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 className="text-3xl mb-2">{job.title}</h1>
            <div className="text-xl text-muted mb-4">{job.employer?.companyName}</div>
          </div>
          {user?.role === 'candidate' && (
            <button 
              className="btn btn-primary text-lg px-8 py-3"
              onClick={() => setShowApplyModal(true)}
            >
              Apply Now
            </button>
          )}
          {!user && (
            <button 
              className="btn btn-primary text-lg px-8 py-3"
              onClick={() => navigate('/login')}
            >
              Login to Apply
            </button>
          )}
        </div>

        <div className="job-details grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="job-detail-item text-lg">
            <FiMapPin /> {job.location}
          </div>
          <div className="job-detail-item text-lg">
            <FiDollarSign /> ${job.salary.toLocaleString()}
          </div>
          <div className="job-detail-item text-lg">
            <FiBriefcase /> {job.type}
          </div>
          <div className="job-detail-item text-lg">
            <FiCalendar /> Deadline: {moment(job.deadline).format('MMM Do, YYYY')}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="glass-panel p-6">
          <h2 className="mb-4">Job Description</h2>
          <div className="mb-6 whitespace-pre-wrap text-muted" style={{ whiteSpace: 'pre-wrap' }}>
            {job.description}
          </div>

          <h2 className="mb-4">Requirements</h2>
          <ul className="list-disc pl-6 mb-6 text-muted" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            {job.requirements.map((req, index) => (
              <li key={index} className="mb-2">{req}</li>
            ))}
          </ul>
        </div>

        {/* Sidebar */}
        <div className="glass-panel p-6 h-fit">
          <h3 className="mb-4">About the Company</h3>
          <div className="text-xl font-bold mb-2">{job.employer?.companyName}</div>
          <p className="text-muted mb-4">{job.employer?.bio || 'No company bio available.'}</p>
          
          <hr className="border-[var(--border-color)] my-4" style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
          
          <div className="text-sm text-muted">
            <div>Posted: {moment(job.createdAt).fromNow()}</div>
            <div>Category: {job.category}</div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50 }}>
          <div className="glass-panel p-6 w-full max-w-md mx-4 animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="mb-4">Apply for {job.title}</h2>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Resume (PDF, DOC, DOCX)</label>
                <div 
                  className="border-2 border-dashed border-[var(--border-color)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--primary-color)] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer' }}
                >
                  <FiUpload size={32} className="mx-auto mb-2 text-muted" style={{ margin: '0 auto 0.5rem', color: 'var(--text-secondary)' }} />
                  <div>{resume ? resume.name : 'Click to upload resume'}</div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter (Optional)</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit..."
                ></textarea>
              </div>

              <div className="flex gap-4" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary flex-1" 
                  style={{ flex: 1 }}
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1" 
                  style={{ flex: 1 }}
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
