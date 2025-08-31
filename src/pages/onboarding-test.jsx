import { useNavigate } from 'react-router-dom';

export default function TestOnboarding() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    alert(`Selected role: ${role}`);
    if (role === 'candidate') {
      navigate('/jobs');
    } else {
      navigate('/post-job');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to HireNova!</h1>
          <p className="text-gray-400">Choose your role to get started</p>
        </div>
        
        <div className="space-y-4">
          <div 
            onClick={() => handleRoleSelect('candidate')}
            className="border-2 border-gray-600 hover:border-blue-500 rounded-lg p-6 cursor-pointer transition group"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400">Job Seeker</h3>
              <p className="text-gray-400 text-sm">Looking for your next opportunity</p>
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div>• Browse job listings</div>
                <div>• Apply to positions</div>
                <div>• Save favorite jobs</div>
                <div>• Track applications</div>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => handleRoleSelect('recruiter')}
            className="border-2 border-gray-600 hover:border-green-500 rounded-lg p-6 cursor-pointer transition group"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-green-400">Recruiter</h3>
              <p className="text-gray-400 text-sm">Hiring for your company</p>
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div>• Post job openings</div>
                <div>• Review applications</div>
                <div>• Manage job listings</div>
                <div>• Find candidates</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 mb-4">
            This is a test version of the onboarding page
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
