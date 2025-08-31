import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSupabaseUser } from "../hooks/useSupabaseUser";
import { supabase } from "../utils/supabase";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox, LogOut, User } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user, profile, isSignedIn } = useSupabaseUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const handleSignOut = () => {
    console.log("� Simple sign out initiated");
    setIsSigningOut(true);
    setShowUserMenu(false);
    
    // Immediate redirect approach - bypass async issues
    // This forces a complete page reload which clears all state
    window.location.href = '/auth?signed-out=true';
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" className="h-20" alt="HireNova Logo" />
        </Link>

        <div className="flex gap-8">
          {isSignedIn && (
            <div className="flex items-center gap-4">
              {profile?.role === "recruiter" && (
                <Link to="/post-job">
                  <Button variant="destructive" className="rounded-full">
                    <PenBox size={20} className="mr-2" />
                    Post a Job
                  </Button>
                </Link>
              )}
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User size={16} className="mr-2" />
                  {profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/my-jobs"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <BriefcaseBusiness size={16} className="mr-2" />
                      My Jobs
                    </Link>
                    <Link
                      to="/saved-jobs"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Heart size={16} className="mr-2" />
                      Saved Jobs
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {!isSignedIn && (
            <Button variant="outline" onClick={handleAuthClick}>
              Login
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
