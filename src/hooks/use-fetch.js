import { useSupabaseUser } from "./useSupabaseUser";
import { supabase } from "../utils/supabase";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useSupabaseUser();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseAccessToken = session?.access_token;
      
      const response = await cb(supabaseAccessToken, options, ...args);
      
      setData(response);
      setError(null);
    } catch (error) {
      console.error("useFetch - Error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
