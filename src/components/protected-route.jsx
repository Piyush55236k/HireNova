/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useSupabaseUser } from "../hooks/useSupabaseUser";
import { BarLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const { user, profile, isLoaded } = useSupabaseUser();
  const location = useLocation();

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if no profile role
  if (!profile?.role) {
    return <Navigate to="/onboarding" replace />;
  }

  // If authenticated and has profile, render children
  return children;
};

export default ProtectedRoute;
