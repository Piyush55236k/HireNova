import { useSession } from "@/lib/auth";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      // With Supabase auth, the access token is available on the session object
      const supabaseAccessToken = session?.access_token;
      console.log("useFetch: calling cb", { hasToken: !!supabaseAccessToken, cbName: cb.name, args });
      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      console.error("useFetch: error", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
