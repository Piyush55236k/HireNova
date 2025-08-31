import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export function useSupabaseUser() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      console.log("🚀 Starting auth initialization...");
      
      // Failsafe: Always stop loading after 2 seconds
      const failsafe = setTimeout(() => {
        if (mounted) {
          console.log("⏰ Failsafe triggered - stopping loading");
          setLoading(false);
        }
      }, 2000);

      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        clearTimeout(failsafe);
        
        if (!mounted) return;

        console.log("👤 User check result:", authUser ? "User found" : "No user");
        
        if (error) {
          console.error("❌ Auth error:", error.message);
        }

        setUser(authUser);
        
        // Try to get profile but don't block on it
        if (authUser) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()
            .then(({ data, error: profileError }) => {
              if (mounted) {
                if (profileError) {
                  console.log("📋 Profile error (expected if DB not set up):", profileError.message);
                } else {
                  console.log("📋 Profile loaded");
                }
                setProfile(data || null);
              }
            })
            .catch(err => {
              console.log("📋 Profile fetch failed:", err.message);
              if (mounted) setProfile(null);
            });
        }

        setLoading(false);
        console.log("✅ Auth initialization complete");
        
      } catch (error) {
        clearTimeout(failsafe);
        console.error("💥 Auth initialization failed:", error.message);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth event:", event);
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    initAuth();

    return () => {
      console.log("🧹 Cleaning up auth");
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

export const useUser = useSupabaseUser;
