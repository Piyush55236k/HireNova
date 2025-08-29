import React, { useEffect, useState } from 'react'
import { href, Link, useSearchParams } from 'react-router-dom';
import { Button } from './button';
import { SignIn, SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import {BriefcaseBusiness, Heart, PenBox} from 'lucide-react';
const Header = () => {
  const [showSignIn , setShowSignIn] = useState(false);
  const [search , setSearch] = useSearchParams();
  const { user } = useUser();
  useEffect(() => {
    if (search.get('sign-in') === 'true') {
      setShowSignIn(true);
    }
  },[search]);
  const handleoverlayClick= (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({})
    }

  }
  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link>
          <img src="logo.png" alt="logo" className='h-30' />
        </Link>
        <div className='flex gap-8'>
          <SignedOut>
            <Button variant="outline" onClick={()=>setShowSignIn(true)}>Login</Button>
          </SignedOut>
          <SignedIn>
                {user?.unsafeMetadata?.role === "recruiter" &&(

                  <Link to="/post-job">
              <Button variant="destructive" className="rounded-full">
                <PenBox size={20} className="mr-2"/>
                Post a Job</Button>
                </Link>
                  )
                }
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-2 z-50"
        onClick={handleoverlayClick}>
          <SignIn 
          signUpForceRedirectUrl='/onboarding'
          fallbackRedirectUrl='/onboarding'
          />
      </div>)}
    </ >
  )
}

export default Header
