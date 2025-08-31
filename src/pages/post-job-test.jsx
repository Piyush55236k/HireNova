import { useNavigate } from 'react-router-dom';

export default function TestPostJob() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Post a Job</h1>
          <p className="text-gray-400">Create a new job posting for your company</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input 
                  type="text" 
                  placeholder="e.g., Tech Corp"
                  className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input 
                  type="text" 
                  placeholder="e.g., San Francisco, CA"
                  className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Salary Range</label>
                <input 
                  type="text" 
                  placeholder="e.g., $80,000 - $120,000"
                  className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <textarea 
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-400 resize-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">React</span>
              <span className="bg-green-600 px-3 py-1 rounded-full text-sm">Node.js</span>
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">TypeScript</span>
              <span className="bg-red-600 px-3 py-1 rounded-full text-sm">+ Add Skills</span>
            </div>
            
            <div className="flex gap-4">
              <button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-medium transition"
              >
                Post Job
              </button>
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="px-8 bg-gray-600 hover:bg-gray-700 py-3 rounded-md font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 mb-4">
            This is a test version of the post job page
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md"
            >
              Back to Home
            </button>
            <button 
              onClick={() => navigate('/jobs')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md"
            >
              View Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
