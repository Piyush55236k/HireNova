import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {BarLoader} from 'react-spinners'

const Onboarding = () => {
  const {user , isLoaded} = useUser();
  const navigate = useNavigate(); 

  // Move useEffect BEFORE the conditional return
  useEffect(() => {
    if(isLoaded && user?.unsafeMetadata?.role) {
      navigate(user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs");
    }
  }, [user, navigate, isLoaded]); // Add isLoaded to dependencies

  // Now the conditional return comes AFTER all hooks
  if(!isLoaded){
    return <BarLoader className="mb-4" width={"100%"} color='#36d7b7'/>
  }

  const handleRoleSelection = async(role) => {
    try {
      await user.update({
        unsafeMetadata: { role }
      });

      navigate(role === "recruiter" ? "/post-job" : "/jobs");
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  return (
     <div className='flex flex-col items-center justify-center'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>
         I am a .....
      </h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button 
          className="h-36 text-2xl" 
          variant="blue" 
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>

        <Button 
          className="h-36 text-2xl" 
          variant="destructive" 
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
     </div> 
  )
};

export default Onboarding