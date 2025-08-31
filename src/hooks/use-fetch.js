import { useSupabaseUser } from "./useSupabaseUser";
import { supabase } from "../utils/supabase";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useSupabaseUser();

  const fn = async (...args) => {
    console.log("useFetch - Starting fetch with callback:", cb.name);
    console.log("useFetch - Options:", options);
    console.log("useFetch - Args:", args);
    
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseAccessToken = session?.access_token;
      
      console.log("useFetch - Got session token:", supabaseAccessToken ? 'present' : 'missing');
      
      const response = await cb(supabaseAccessToken, options, ...args);
      
      console.log("useFetch - Callback response:", response);
      console.log("useFetch - Response type:", typeof response);
      console.log("useFetch - Response length:", response?.length);
      
      setData(response);
      setError(null);
    } catch (error) {
      console.error("useFetch - Error:", error);
      setError(error);
    } finally {
      setLoading(false);
      console.log("useFetch - Fetch completed");
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
