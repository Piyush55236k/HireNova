import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './button';
import {
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/clerk-react';
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get('sign-in') === 'true') {
      setShowSignIn(true);
    }
  }, [search]);

  // Clean up URL and close modal when user signs in
  useEffect(() => {
    if (user && search.get('sign-in') === 'true') {
      setShowSignIn(false);
      setSearch({});
    }
  }, [user, search, setSearch]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center px-6">
        <Link to="/">
          <img src="logo.png" alt="logo" className="h-10" />
        </Link>

        <div className="flex gap-8 items-center">
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2"/>
                  Post a Job
                </Button>
              </Link>
            )}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10',
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>

      {/* Sign-in modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
            afterSignInUrl="/onboarding"
            afterSignUpUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;