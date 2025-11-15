import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasEnv = Boolean(supabaseUrl && supabaseKey);
const missingEnvMsg =
  "Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env.local file.";

let supabase;

if (hasEnv) {
  // Browser/client Supabase instance (no user token). Use this for auth and normal client-side calls.
  // Disable auto URL detection to avoid clashes with our manual parsing in AuthProvider.
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
} else {
  // Provide a safe stub that won't crash the app at import time
  // and returns helpful errors when auth methods are invoked.
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn(missingEnvMsg);
  }

  const stubAuth = {
    getSessionFromUrl: async () => ({ data: { session: null }, error: new Error(missingEnvMsg) }),
    exchangeCodeForSession: async () => ({ data: { session: null }, error: new Error(missingEnvMsg) }),
    setSession: async () => ({ data: { session: null }, error: new Error(missingEnvMsg) }),
    getSession: async () => ({ data: { session: null }, error: new Error(missingEnvMsg) }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: new Error(missingEnvMsg) }),
    signInWithOtp: async () => ({ data: null, error: new Error(missingEnvMsg) }),
    signInWithOAuth: async () => ({ data: null, error: new Error(missingEnvMsg) }),
    signOut: async () => ({ error: new Error(missingEnvMsg) }),
  };

  supabase = { auth: stubAuth };
}

export { supabase };

// Cache clients per token to avoid creating multiple GoTrueClient instances
const clientCache = new Map();

const supabaseClient = async (supabaseAccessToken) => {
  if (!supabaseAccessToken) return supabase;

  if (!hasEnv) return supabase; // fall back to stub when envs are missing

  if (clientCache.has(supabaseAccessToken)) {
    return clientCache.get(supabaseAccessToken);
  }

  const supabaseWithToken = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  clientCache.set(supabaseAccessToken, supabaseWithToken);
  return supabaseWithToken;
};

export default supabaseClient;
