import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestJobs() {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const handleApply = (jobId) => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
    alert(`Successfully applied to job ${jobId}! 🎉`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Job Listings</h1>
          <p className="text-gray-400">Find your next opportunity</p>
        </div>
        
        {/* Job Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select className="bg-gray-800 border border-gray-600 rounded-md px-4 py-2">
            <option>All Categories</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>
          <select className="bg-gray-800 border border-gray-600 rounded-md px-4 py-2">
            <option>All Locations</option>
            <option>Remote</option>
            <option>San Francisco</option>
            <option>New York</option>
          </select>
          <select className="bg-gray-800 border border-gray-600 rounded-md px-4 py-2">
            <option>All Experience</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock job cards */}
          {[
            { id: 1, title: 'Senior React Developer', company: 'TechCorp', location: 'San Francisco, CA', salary: '$120,000 - $160,000', skills: ['React', 'TypeScript', 'Node.js'], type: 'Full-time', posted: '2 days ago' },
            { id: 2, title: 'Product Designer', company: 'DesignStudio', location: 'Remote', salary: '$90,000 - $130,000', skills: ['Figma', 'UI/UX', 'Prototyping'], type: 'Full-time', posted: '1 week ago' },
            { id: 3, title: 'DevOps Engineer', company: 'CloudTech', location: 'New York, NY', salary: '$110,000 - $150,000', skills: ['AWS', 'Docker', 'Kubernetes'], type: 'Full-time', posted: '3 days ago' },
            { id: 4, title: 'Frontend Developer', company: 'StartupXYZ', location: 'Austin, TX', salary: '$80,000 - $120,000', skills: ['Vue.js', 'JavaScript', 'CSS'], type: 'Full-time', posted: '5 days ago' },
            { id: 5, title: 'Marketing Manager', company: 'GrowthCo', location: 'Remote', salary: '$70,000 - $100,000', skills: ['SEO', 'Content', 'Analytics'], type: 'Full-time', posted: '1 day ago' },
            { id: 6, title: 'Data Scientist', company: 'DataDriven', location: 'Seattle, WA', salary: '$130,000 - $180,000', skills: ['Python', 'ML', 'SQL'], type: 'Full-time', posted: '4 days ago' }
          ].map(job => (
            <div key={job.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                  <p className="text-gray-400 mb-2">{job.company}</p>
                  <p className="text-sm text-gray-500 mb-2">📍 {job.location}</p>
                </div>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">{job.type}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="text-lg font-bold text-green-400 mb-3">{job.salary}</div>
              <div className="text-xs text-gray-500 mb-4">Posted {job.posted}</div>
              
              <div className="flex gap-2">
                {appliedJobs.has(job.id) ? (
                  <button className="flex-1 bg-green-600 py-2 rounded-md cursor-not-allowed">
                    ✅ Applied
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApply(job.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition"
                  >
                    Apply Now
                  </button>
                )}
                <button className="px-4 bg-gray-600 hover:bg-gray-500 py-2 rounded-md transition">
                  💖
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 mb-4">
            Applied to {appliedJobs.size} jobs • {6 - appliedJobs.size} jobs remaining
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md"
            >
              Back to Home
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md"
            >
              Go to Auth
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
