import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { SignIn, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (search.get('sign-in') === 'true') {
      setShowSignIn(true);
    }
  }, [search]);

  useEffect(() => {
    if (isLoaded && user && showSignIn) {
      setShowSignIn(false);
      setSearch({});
      navigate('/onboarding');
    }
  }, [user, isLoaded, showSignIn, setSearch, navigate]);

  const handleCloseModal = () => {
    setShowSignIn(false);
    setSearch({});
  }

  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link to="/">
          <img src="logo.png" alt="logo" className='h-30' />
        </Link>
        <div className='flex gap-8'>
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>Login</Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-20 w-20',
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label='My Jobs'
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label='Saved Jobs'
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 text-xl font-bold"
              >
                ✕
              </button>
              <SignIn 
                routing="virtual"
                fallbackRedirectUrl="/onboarding"
                appearance={{
                  elements: {
                    card: "shadow-none border-0",
                    rootBox: "w-full"
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header