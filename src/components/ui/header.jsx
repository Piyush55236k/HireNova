import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './button';
import {
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  useClerk,
} from '@clerk/clerk-react';
import { PenBox } from 'lucide-react';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const { clerk } = useClerk();

  useEffect(() => {
    if (search.get('sign-in') === 'true') {
      setShowSignIn(true);
    }
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSignIn(false);
        setSearch({});
      }
    };
    if (showSignIn) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSignIn]);

  useEffect(() => {
    const unsubscribe = clerk.addListener('user', () => {
      setShowSignIn(false);
      setSearch({});
      window.location.href = '/onboarding';
    });
    return () => unsubscribe();
  }, [clerk]);

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
          <img src="logo.png" alt="JobBoard logo" className="h-10" />
        </Link>

        <div className="flex gap-6 items-center">
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              {user?.unsafeMetadata?.role === 'recruiter' && (
                <Link to="/post-job">
                  <Button variant="destructive" className="rounded-full flex items-center">
                    <PenBox size={20} className="mr-2" />
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
            </div>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={handleOverlayClick}
          tabIndex={-1}
          aria-modal="true"
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;