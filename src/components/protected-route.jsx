/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/lib/auth";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, user, role } = useUser();
  const { pathname } = useLocation();

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to="/?sign-in=true" />;
  }

  // If signed in but no role yet, force onboarding (except when already there)
  if (isSignedIn && isLoaded && !role && pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default ProtectedRoute;
