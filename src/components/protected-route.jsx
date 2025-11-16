/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { BarLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoading, role } = useAuth();
  const { pathname } = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <BarLoader width={200} color="#3B82F6" />
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  // If signed in but no role yet, force onboarding (except when already there)
  if (isSignedIn && !role && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default ProtectedRoute;
