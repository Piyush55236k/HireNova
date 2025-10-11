import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@/lib/auth";

// If you migrated from Clerk, VITE_CLERK_PUBLISHABLE_KEY may be absent; that's OK.
// Ensure Supabase env vars exist in production.
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  // Use console.warn instead of throwing so the app can surface a nicer
  // runtime error to users and allow local development without crashing.
  console.warn('Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
