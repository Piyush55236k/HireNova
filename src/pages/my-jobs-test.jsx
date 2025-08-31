import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestMyJobs() {
  const navigate = useNavigate();
  
  // Mock jobs with applications
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      status: 'active',
      applicants: 15,
      posted: '2 days ago',
      applications: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'pending' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'reviewed' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'rejected' }
      ]
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'DesignStudio',
      location: 'Remote',
      status: 'active',
      applicants: 23,
      posted: '1 week ago',
      applications: [
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'pending' },
        { id: 5, name: 'Tom Brown', email: 'tom@example.com', status: 'interviewed' },
      ]
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'New York, NY',
      status: 'paused',
      applicants: 8,
      posted: '3 days ago',
      applications: [
        { id: 6, name: 'Alex Davis', email: 'alex@example.com', status: 'pending' }
      ]
    }
  ]);

  const [selectedJob, setSelectedJob] = useState(null);

  const handleStatusChange = (jobId, newStatus) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
    alert(`Job status updated to: ${newStatus}`);
  };

  const handleApplicationStatusChange = (jobId, applicationId, newStatus) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? {
            ...job,
            applications: job.applications.map(app =>
              app.id === applicationId ? { ...app, status: newStatus } : app
            )
          }
        : job
    ));
    alert(`Application status updated to: ${newStatus}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-600';
      case 'paused': return 'bg-yellow-600';
      case 'closed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getApplicationStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-600';
      case 'reviewed': return 'bg-blue-600';
      case 'interviewed': return 'bg-purple-600';
      case 'hired': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">My Posted Jobs</h1>
          <p className="text-gray-400">Manage your job postings and applications</p>
        </div>

        {!selectedJob ? (
          <>
            {/* Jobs Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400">{jobs.filter(j => j.status === 'active').length}</div>
                <div className="text-gray-400">Active Jobs</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-400">{jobs.reduce((sum, job) => sum + job.applicants, 0)}</div>
                <div className="text-gray-400">Total Applications</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-400">{jobs.filter(j => j.status === 'paused').length}</div>
                <div className="text-gray-400">Paused Jobs</div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6">
              {jobs.map(job => (
                <div key={job.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-1">{job.company}</p>
                      <p className="text-sm text-gray-500">📍 {job.location} • Posted {job.posted}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4 lg:mt-0">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{job.applicants}</div>
                        <div className="text-xs text-gray-500">Applications</div>
                      </div>
                      
                      <select 
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="closed">Closed</option>
                      </select>
                      
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
                      >
                        View Applications
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Application Management */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-gray-400">{selectedJob.applicants} applications</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
              >
                Back to Jobs
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedJob.applications.map(application => (
                <div key={application.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{application.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${getApplicationStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-4">{application.email}</p>
                  
                  <div className="space-y-3">
                    <select 
                      value={application.status}
                      onChange={(e) => handleApplicationStatusChange(selectedJob.id, application.id, e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-md text-sm transition">
                        📄 View Resume
                      </button>
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md text-sm transition">
                        📧 Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              onClick={() => navigate('/post-job')}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md"
            >
              Post New Job
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
