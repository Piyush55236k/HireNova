import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const Onboarding = () => {
  const { user, role, isLoading, updateRole } = useAuth();
  const navigate = useNavigate();
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const navigateUser = (userRole) => {
    navigate(userRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (selectedRole) => {
    try {
      setIsUpdatingRole(true);
      const { error } = await updateRole(selectedRole);
      
      if (error) {
        console.error("Error updating role:", error);
        alert("Failed to update role. Please try again.");
        return;
      }
      
      console.log(`Role updated to: ${selectedRole}`);
      navigateUser(selectedRole);
    } catch (err) {
      console.error("Unexpected error updating role:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  useEffect(() => {
    if (role) {
      navigateUser(role);
    }
  }, [role]);

  if (isLoading || isUpdatingRole) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        <p className="text-gray-600">
          {isUpdatingRole ? "Setting up your account..." : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h2 className="gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
          disabled={isUpdatingRole}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
          disabled={isUpdatingRole}
        >
          Recruiter
        </Button>
      </div>
      
      {user?.email && (
        <p className="mt-8 text-gray-600 text-center">
          Welcome, {user.email}! Please select your role to continue.
        </p>
      )}
    </div>
  );
};

export default Onboarding;
