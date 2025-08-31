import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestSavedJobs() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('applied');
  
  // Mock applied jobs
  const [appliedJobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      status: 'under_review',
      appliedDate: '2024-01-15',
      salary: '$120,000 - $160,000',
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'DesignStudio',
      location: 'Remote',
      status: 'interviewed',
      appliedDate: '2024-01-12',
      salary: '$90,000 - $130,000',
      skills: ['Figma', 'UI/UX', 'Prototyping']
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'New York, NY',
      status: 'rejected',
      appliedDate: '2024-01-10',
      salary: '$110,000 - $150,000',
      skills: ['AWS', 'Docker', 'Kubernetes']
    }
  ]);

  // Mock saved jobs
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      savedDate: '2024-01-14',
      salary: '$80,000 - $120,000',
      skills: ['Vue.js', 'JavaScript', 'CSS']
    },
    {
      id: 5,
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'Remote',
      savedDate: '2024-01-13',
      salary: '$70,000 - $100,000',
      skills: ['SEO', 'Content', 'Analytics']
    }
  ]);

  const handleRemoveSaved = (jobId) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    alert('Job removed from saved list!');
  };

  const handleApplyFromSaved = (job) => {
    alert(`Applied to ${job.title} at ${job.company}! 🎉`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-600';
      case 'under_review': return 'bg-blue-600';
      case 'interviewed': return 'bg-purple-600';
      case 'hired': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'under_review': return 'Under Review';
      case 'interviewed': return 'Interviewed';
      case 'rejected': return 'Rejected';
      case 'hired': return 'Hired';
      default: return 'Pending';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">My Jobs</h1>
          <p className="text-gray-400">Track your applications and saved jobs</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('applied')}
              className={`px-6 py-2 rounded-md transition ${
                activeTab === 'applied'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Applied Jobs ({appliedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-2 rounded-md transition ${
                activeTab === 'saved'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Saved Jobs ({savedJobs.length})
            </button>
          </div>
        </div>

        {/* Applied Jobs Tab */}
        {activeTab === 'applied' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Applied Jobs</h2>
              <p className="text-gray-400">Track the status of your job applications</p>
            </div>

            {appliedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">You haven't applied to any jobs yet</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appliedJobs.map(job => (
                  <div key={job.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <p className="text-gray-400 mb-2">{job.company}</p>
                        <p className="text-sm text-gray-500">📍 {job.location}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(job.status)}`}>
                        {getStatusText(job.status)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-lg font-bold text-green-400 mb-3">{job.salary}</div>
                    <div className="text-xs text-gray-500 mb-4">Applied on {job.appliedDate}</div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-md transition text-sm">
                        View Details
                      </button>
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition text-sm">
                        Contact HR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Jobs Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Saved Jobs</h2>
              <p className="text-gray-400">Jobs you've saved for later</p>
            </div>

            {savedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No saved jobs yet</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md"
                >
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map(job => (
                  <div key={job.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <p className="text-gray-400 mb-2">{job.company}</p>
                        <p className="text-sm text-gray-500">📍 {job.location}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSaved(job.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                        title="Remove from saved"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, idx) => (
                        <span key={idx} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-lg font-bold text-green-400 mb-3">{job.salary}</div>
                    <div className="text-xs text-gray-500 mb-4">Saved on {job.savedDate}</div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplyFromSaved(job)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition"
                      >
                        Apply Now
                      </button>
                      <button className="px-4 bg-gray-600 hover:bg-gray-500 py-2 rounded-md transition">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-8">
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md"
            >
              Browse Jobs
            </button>
            <button 
              onClick={() => navigate('/onboarding')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md"
            >
              Change Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
