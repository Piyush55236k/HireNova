import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Browser/client Supabase instance (no user token). Use this for auth and normal client-side calls.
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cache clients per token to avoid creating multiple GoTrueClient instances
const clientCache = new Map();

const supabaseClient = async (supabaseAccessToken) => {
  if (!supabaseAccessToken) return supabase;

  if (clientCache.has(supabaseAccessToken)) {
    return clientCache.get(supabaseAccessToken);
  }

  const supabaseWithToken = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
  });

  clientCache.set(supabaseAccessToken, supabaseWithToken);
  return supabaseWithToken;
};

export default supabaseClient;
