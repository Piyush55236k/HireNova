import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

// Complete auth context using Supabase patterns
const AuthContext = createContext({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  isSignedIn: false,
  signIn: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
  updateRole: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Handle different auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Extract role from user metadata
  const role = user?.user_metadata?.role || null;

  // Sign in with email/password or magic link
  const signIn = async ({ email, password, options = {} }) => {
    try {
      setIsLoading(true);
      
      if (password) {
        // Email/password sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { data, error };
      } else {
        // Magic link sign in
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            ...options,
          },
        });
        return { data, error };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with OAuth providers
  const signInWithOAuth = async (provider, options = {}) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...options,
        },
      });
      
      return { data, error };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user role
  const updateRole = async (newRole) => {
    try {
      if (!user || !session) {
        return { error: new Error('No authenticated user') };
      }

      const { data, error } = await supabase.auth.updateUser({
        data: { role: newRole }
      });

      if (!error) {
        // Update local user state immediately
        setUser(prev => prev ? {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            role: newRole
          }
        } : null);
      }

      return { data, error };
    } catch (error) {
      console.error('Update role error:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    role,
    isLoading,
    isSignedIn: !!session && !!user,
    signIn,
    signInWithOAuth,
    signOut,
    updateRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Legacy compatibility hooks
export const useUser = () => {
  const { user, role, isLoading, isSignedIn } = useAuth();
  return { user, role, isLoaded: !isLoading, isSignedIn };
};

export const useSession = () => {
  const { session, updateRole } = useAuth();
  return { session, updateRole };
};

// Conditional rendering components
export const SignedIn = ({ children }) => {
  const { isSignedIn, isLoading } = useAuth();
  if (isLoading) return null;
  return isSignedIn ? children : null;
};

export const SignedOut = ({ children }) => {
  const { isSignedIn, isLoading } = useAuth();
  if (isLoading) return null;
  return !isSignedIn ? children : null;
};

// Complete SignIn component using Supabase auth
export const SignIn = ({ onClose, redirectTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { signIn, signInWithOAuth } = useAuth();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { data, error } = await signIn({ 
        email, 
        password: isSignUp ? undefined : password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : {}
      });

      if (error) {
        setMessage(error.message);
      } else if (!password) {
        setMessage("Check your email for the magic link!");
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await signInWithOAuth(provider, 
        redirectTo ? { redirectTo } : {}
      );
      
      if (error) {
        setMessage(error.message);
        setIsLoading(false);
      }
      // If successful, user will be redirected, so don't set loading to false
    } catch (error) {
      setMessage("OAuth sign in failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        {!isSignUp && (
          <div>
            <input
              type="password"
              placeholder="Enter your password (leave empty for magic link)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Loading..." : isSignUp ? "Sign Up" : (password ? "Sign In" : "Send Magic Link")}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>

      <button
        onClick={() => handleOAuthSignIn("google")}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          disabled={isLoading}
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('Check your email') 
            ? 'bg-green-100 dark:bg-green-800/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`}>
          {message}
        </div>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Close
        </button>
      )}
    </div>
  );
};

// UserButton component with dropdown menu
const UserButtonContext = createContext({ open: false, toggle: () => {}, close: () => {} });

export const UserButton = ({ children, avatarUrl, label }) => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const ref = React.useRef(null);

  const toggle = () => setOpen(v => !v);
  const close = () => setOpen(false);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = label || user?.email || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <UserButtonContext.Provider value={{ open, toggle, close }}>
      <div className="relative inline-block" ref={ref}>
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden hover:bg-gray-200 transition-colors"
          aria-haspopup="true"
          aria-expanded={open}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 object-cover" />
          ) : (
            <span className="text-sm font-medium text-gray-700">{initials}</span>
          )}
        </button>
        {children}
      </div>
    </UserButtonContext.Provider>
  );
};

UserButton.MenuItems = ({ children }) => {
  const { open } = useContext(UserButtonContext);
  if (!open) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

UserButton.Link = ({ label, labelIcon, href }) => {
  const { close } = useContext(UserButtonContext);
  
  return (
    <a
      href={href}
      onClick={close}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {labelIcon && <span className="mr-3 text-gray-400">{labelIcon}</span>}
      {label}
    </a>
  );
};

UserButton.Action = ({ label, onClick, labelIcon }) => {
  const { close } = useContext(UserButtonContext);
  const { signOut: authSignOut } = useAuth();

  const handleClick = async (e) => {
    e.preventDefault();
    
    if (onClick) {
      await onClick(e);
    } else if (label?.toLowerCase().includes('sign')) {
      // Default sign out action
      try {
        await authSignOut();
        window.location.href = '/';
      } catch (error) {
        console.error('Sign out error:', error);
      }
    } else if (label?.toLowerCase().includes('manage')) {
      window.location.href = '/account';
    }
    
    close();
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {labelIcon && <span className="mr-3 text-gray-400">{labelIcon}</span>}
      {label}
    </button>
  );
};

export default {
  AuthProvider,
  useAuth,
  useUser,
  useSession,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
};
