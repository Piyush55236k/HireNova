import { useNavigate } from 'react-router-dom';

export default function SimpleAuth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Authentication</h1>
          <p className="text-gray-400">This is a test auth page</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            👤 Role Selection
          </button>
          
          <button 
            onClick={() => navigate('/jobs')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            💼 Browse Jobs (Apply Feature)
          </button>
          
          <button 
            onClick={() => navigate('/post-job')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            📝 Post Job
          </button>

          <button 
            onClick={() => navigate('/my-jobs')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            📊 Manage Jobs (Recruiter)
          </button>

          <button 
            onClick={() => navigate('/saved-jobs')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            💖 My Applications (Candidate)
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            🏠 Back to Home
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">
            This is a test page to check routing
          </p>
        </div>
      </div>
    </div>
  );
}
