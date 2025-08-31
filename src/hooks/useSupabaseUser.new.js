import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export function useSupabaseUser() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn("Auth initialization timeout - setting loading to false");
            setLoading(false);
          }
        }, 3000);

        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        
        clearTimeout(timeoutId);

        if (!mounted) return;

        if (userError) {
          console.error("Auth error:", userError);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(authUser);

        if (authUser) {
          // Try to fetch profile, but don't block loading if it fails
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();

            if (mounted) {
              if (profileError && profileError.code !== 'PGRST116') {
                console.warn("Profile fetch error (this is okay if database isn't set up yet):", profileError.message);
              }
              setProfile(profileData || null);
            }
          } catch (profileError) {
            console.warn("Profiles table might not exist yet:", profileError.message);
            if (mounted) setProfile(null);
          }
        }

        if (mounted) setLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
            return;
          }

          setUser(session?.user || null);

          if (session?.user) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (mounted) {
                if (profileError && profileError.code !== 'PGRST116') {
                  console.warn("Profile fetch error:", profileError.message);
                }
                setProfile(profileData || null);
              }
            } catch (profileError) {
              console.warn("Profile fetch failed:", profileError.message);
              if (mounted) setProfile(null);
            }
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    isLoaded: !loading,
    isSignedIn: !!user,
  };
}

// Export with multiple names for convenience
export const useUser = useSupabaseUser;
