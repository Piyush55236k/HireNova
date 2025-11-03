import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@/lib/auth";
import { supabase } from "@/utils/supabase";

// If you migrated from Clerk, VITE_CLERK_PUBLISHABLE_KEY may be absent; that's OK.
// Ensure Supabase env vars exist in production.
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  // Use console.warn instead of throwing so the app can surface a nicer
  // runtime error to users and allow local development without crashing.
  console.warn('Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Parse and clear OAuth redirect fragments (e.g. #access_token=...) before mounting React.
// This ensures tokens returned by providers (Google) are consumed by the Supabase SDK
// and the URL fragment is removed so tokens are not exposed in the address bar.
(async () => {
  try {
    // supabase.auth.getSessionFromUrl() will parse the fragment and store the session.
    // If there's no fragment or no session, it resolves without throwing in most cases.
    const { data, error } = await supabase.auth.getSessionFromUrl().catch((e) => ({ error: e }));
    if (error) {
      // Non-fatal: log for debugging.
      // console.debug('getSessionFromUrl error:', error);
    } else if (data?.session) {
      // Session restored from URL fragment.
      // console.debug('Session restored from URL fragment.');
    }
  } catch (err) {
    // swallow errors to avoid blocking app start
    // console.warn('Error parsing session from URL fragment', err);
  } finally {
    // Remove the URL fragment to avoid leaking tokens in the address bar
    try {
      if (window?.location?.hash) {
        const cleanUrl = window.location.href.split('#')[0] + window.location.search;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (e) {
      // ignore replaceState failures
    }
  }
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
