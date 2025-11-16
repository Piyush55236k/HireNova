import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

// Minimal auth context to mimic the parts of Clerk the app uses.
const AuthContext = createContext({ user: undefined, session: undefined, isLoaded: false, isSignedIn: false });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [session, setSession] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    // If the user was redirected back from an OAuth provider, Supabase encodes
    // the session in the URL fragment (hash). Parse it and store the session
    // so the app can read it. Then remove the fragment to avoid leaking tokens.
    const init = async () => {
      try {
        const href = typeof window !== 'undefined' ? window.location.href : '';
        const hash = typeof window !== 'undefined' ? window.location.hash || '' : '';

        let parsedSession = undefined;
        let parseError = undefined;

        // 1) PKCE flow (?code=...) – preferred in supabase-js v2
        if (href.includes('code=') && typeof supabase.auth.exchangeCodeForSession === 'function') {
          const { data, error } = await supabase.auth.exchangeCodeForSession(href);
          parseError = error;
          parsedSession = data?.session;
        }
        // 2) Implicit flow (#access_token=...) – some providers return tokens in hash
        else if (hash.includes('access_token=')) {
          if (typeof supabase.auth.getSessionFromUrl === 'function') {
            const { data, error } = await supabase.auth.getSessionFromUrl();
            parseError = error;
            parsedSession = data?.session;
          } else {
            // Fallback: manually parse and set session
            try {
              const params = new URLSearchParams(hash.replace(/^#/, ''));
              const access_token = params.get('access_token');
              const refresh_token = params.get('refresh_token');
              if (access_token && refresh_token && typeof supabase.auth.setSession === 'function') {
                const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
                parseError = error;
                parsedSession = data?.session;
              }
            } catch (e) {
              parseError = e;
            }
          }
        }

        if (parseError) {
          // Non-fatal: continue to normal getSession
          console.warn('supabase: auth redirect parse returned error:', parseError?.message || parseError);
        }

        if (parsedSession) {
          if (mounted) {
            setSession(parsedSession);
            setUser(mapSupabaseUserToClerkUser(parsedSession.user));
            setIsLoaded(true);
          }

          // Remove URL fragment for security/cleanliness
          try {
            if (window?.location?.hash) {
              const cleanUrl = window.location.href.split('#')[0] + window.location.search;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          } catch (err) {
            console.warn('Could not clear auth fragment from URL', err);
          }
        }
      } catch (err) {
        console.warn('Error while parsing session from URL', err);
      }

      // Always ensure we read the current stored session (if any)
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session ?? undefined);
        setUser(mapSupabaseUserToClerkUser(data.session?.user));
        setIsLoaded(true);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ?? undefined);
      setUser(mapSupabaseUserToClerkUser(currentSession?.user));
      setIsLoaded(true);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe && listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoaded, isSignedIn: !!session }}>
      {children}
    </AuthContext.Provider>
  );
};

// Map a Supabase user object to a shape similar to Clerk's user for compatibility.
function mapSupabaseUserToClerkUser(suUser) {
  if (!suUser) return undefined;

  // Supabase stores metadata in user.user_metadata (client-writable) and app_metadata (server-managed)
  const unsafeMetadata = suUser.user_metadata?.unsafeMetadata || suUser.user_metadata || {};
  // If role is stored under app_metadata as well, merge it
  if (suUser.app_metadata?.role && !unsafeMetadata.role) {
    unsafeMetadata.role = suUser.app_metadata.role;
  }

  return {
    id: suUser.id,
    email: suUser.email,
    unsafeMetadata,
    raw: suUser,
  };
}

// Hooks and small components mimic Clerk API used in the project
export const useUser = () => {
  const ctx = useContext(AuthContext);
  // for compatibility return { user, isLoaded, isSignedIn }
  return { user: ctx.user, isLoaded: ctx.isLoaded, isSignedIn: ctx.isSignedIn };
};

export const useSession = () => {
  const ctx = useContext(AuthContext);
  return { session: ctx.session };
};

export const SignedIn = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return isSignedIn ? children : null;
};

export const SignedOut = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return !isSignedIn ? children : null;
};

// Minimal SignIn UI: open Supabase Hosted UI
export const SignIn = ({ signUpForceRedirectUrl, fallbackRedirectUrl, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Default redirect path after sign-in: prefer explicit props, otherwise send users
  // to the onboarding route so they land inside the app after successful auth.
  // Using window.location.origin alone sometimes results in an unexpected host/port
  // (developer environments can vary), so include an explicit path to keep behavior
  // consistent across environments.
  const redirectTo =
    signUpForceRedirectUrl ||
    fallbackRedirectUrl ||
    `${window.location.origin}/onboarding`;

  const signInWithEmail = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setLoading(false);
    if (error) setMsg(error.message);
    else setMsg("Check your email for the sign-in link.");
  };

  const signInWithProvider = async (provider) => {
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    setLoading(false);
    if (error) setMsg(error.message);
  };

  return (
    <div className="auth-modal p-6 bg-white rounded shadow w-96">
      <h3 className="mb-4 text-lg font-semibold">Sign in</h3>

      <form onSubmit={signInWithEmail} className="mb-4">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <button disabled={loading} className="w-full p-2 bg-purple-600 text-white rounded">
          {loading ? "Sending…" : "Send magic link"}
        </button>
      </form>

      <div className="mb-3 text-center text-sm text-gray-500">or</div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => signInWithProvider("google")}
          className="w-full p-2 border rounded flex items-center justify-center bg-transparent text-white hover:bg-gray-800"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.3 1.2 8.2 2.3l6-6C35.6 3.6 30.2 1.5 24 1.5 14.7 1.5 6.9 6.6 3 14l7.4 5.7C11.1 15 16.1 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.6H24v9h12.7c-.5 2.8-2 5.1-4.3 6.7l6.8 5.3c4-3.7 6.3-9.2 6.3-16.4z"/>
            <path fill="#FBBC05" d="M10.4 28.3C9.6 26.4 9.1 24.3 9.1 22s.5-4.4 1.3-6.3L3 10c-2.8 4.9-2.8 11 0 15.9l7.4 5.4z"/>
            <path fill="#34A853" d="M24 46.5c6.2 0 11.6-2 15.9-5.6l-7.6-6c-2.1 1.5-5 2.4-8.3 2.4-7.9 0-13-5.5-13.6-12.8L3 33.9C6.9 41.3 14.7 46.5 24 46.5z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}

      <div className="mt-4 flex justify-end">
        <button onClick={onClose} className="text-sm text-gray-600">Close</button>
      </div>
    </div>
  );
};

// UserButton with real dropdown menu using context
const UserButtonContext = createContext({ open: false, toggle: () => {}, close: () => {} });

export const UserButton = ({ children, appearance, avatarUrl, label }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = label ? label.charAt(0).toUpperCase() : "U";

  return (
    <UserButtonContext.Provider value={{ open, toggle, close }}>
      <div className="relative inline-block" ref={ref}>
        <button
          onClick={toggle}
          className="user-button-trigger w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border overflow-hidden"
          aria-haspopup="true"
          aria-expanded={open}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-10 h-10 object-cover" />
          ) : (
            <span className="text-sm font-medium">{initials}</span>
          )}
        </button>

        {children}
      </div>
    </UserButtonContext.Provider>
  );
};

// MenuItems wrapper: shows/hides based on context
UserButton.MenuItems = ({ children }) => {
  const { open } = useContext(UserButtonContext);
  if (!open) return null;
  return (
    <div className="userbutton-menuitems absolute right-0 mt-2 w-56 bg-white border rounded shadow z-50">
      {children}
    </div>
  );
};

// Link item inside menu
UserButton.Link = ({ label, labelIcon, href }) => {
  return (
    <a href={href} className="userbutton-link flex items-center gap-2 p-3 hover:bg-gray-50 text-sm text-gray-700">
      {labelIcon}
      <span>{label}</span>
    </a>
  );
};

// Action item inside menu (button). Supports default actions like sign-out/manage account.
UserButton.Action = ({ label, onClick, labelIcon }) => {
  const { close } = useContext(UserButtonContext);

  const handle = async (e) => {
    if (onClick) {
      onClick(e);
    } else if (label && label.toLowerCase().includes("sign")) {
      // default sign out
      try {
        await supabase.auth.signOut();
        window.location.href = "/";
      } catch (err) {
        console.error("Sign out error", err);
      }
    } else if (label && label.toLowerCase().includes("manage")) {
      window.location.href = "/account";
    }
    close();
  };

  return (
    <button onClick={handle} className="userbutton-action w-full text-left p-3 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-3">
      {labelIcon && <span className="text-gray-500">{labelIcon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default {
  AuthProvider,
  useUser,
  useSession,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
};
