import { useSupabaseUser } from "../hooks/useSupabaseUser";
import { supabase } from "../utils/supabase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, profile, isLoaded } = useSupabaseUser();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const navigateUser = (currRole) => {
    const targetPath = currRole === "recruiter" ? "/post-job" : "/jobs";
    navigate(targetPath, { replace: true });
  };

  // Auto-redirect if user already has a role
  useEffect(() => {
    if (isLoaded && user && profile?.role) {
      navigateUser(profile.role);
    }
  }, [isLoaded, user, profile]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/auth', { replace: true });
    }
  }, [isLoaded, user, navigate]);

  const handleRoleSelection = async (role) => {
    if (isUpdating || !user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: role,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Navigate immediately
      navigateUser(role);
      
    } catch (error) {
      console.error("Role selection error:", error);
      alert(`Error setting role: ${error.message}`);
      setIsUpdating(false);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        <p className="text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  // Don't show onboarding if user has role or is not authenticated
  if (!user || profile?.role) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="gradient-title font-extrabold text-6xl sm:text-7xl md:text-8xl tracking-tighter text-center mb-8">
        I am a...
      </h2>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Button
          variant="blue"
          className="h-32 sm:h-36 text-xl sm:text-2xl font-semibold"
          onClick={() => handleRoleSelection("candidate")}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <BarLoader color="#ffffff" width={50} height={4} />
              <span>Setting up...</span>
            </div>
          ) : (
            "Candidate"
          )}
        </Button>
        
        <Button
          variant="destructive"
          className="h-32 sm:h-36 text-xl sm:text-2xl font-semibold"
          onClick={() => handleRoleSelection("recruiter")}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <BarLoader color="#ffffff" width={50} height={4} />
              <span>Setting up...</span>
            </div>
          ) : (
            "Recruiter"
          )}
        </Button>
      </div>
      
      <p className="text-sm text-gray-500 mt-6 text-center max-w-md">
        Choose your role to get started. This cannot be changed later.
      </p>
    </div>
  );
};

export default Onboarding;