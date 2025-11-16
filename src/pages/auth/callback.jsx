import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import { BarLoader } from 'react-spinners';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/?error=auth-error');
          return;
        }

        if (data.session) {
          // User is authenticated, check if they have a role
          const user = data.session.user;
          const role = user.user_metadata?.role;
          
          if (role) {
            // User has a role, redirect to appropriate dashboard
            navigate(role === 'recruiter' ? '/post-job' : '/jobs');
          } else {
            // User needs to select a role
            navigate('/onboarding');
          }
        } else {
          // No session found, redirect to login
          navigate('/?sign-in=true');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/?error=auth-error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
        <BarLoader width={200} color="#3B82F6" />
        <p className="mt-4 text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;