import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

let globalUser = null;
let globalProfile = null;
let globalIsLoaded = false;
let listeners = [];

export function useSupabaseUser() {
  const [user, setUser] = useState(globalUser);
  const [profile, setProfile] = useState(globalProfile);
  const [isLoaded, setIsLoaded] = useState(globalIsLoaded);

  const updateGlobalState = (newUser, newProfile, loaded) => {
    globalUser = newUser;
    globalProfile = newProfile;
    globalIsLoaded = loaded;
    
    listeners.forEach(listener => {
      listener.setUser(newUser);
      listener.setProfile(newProfile);
      listener.setIsLoaded(loaded);
    });
  };

  useEffect(() => {
    const currentListener = { setUser, setProfile, setIsLoaded };
    listeners.push(currentListener);

    if (globalIsLoaded) {
      return () => {
        listeners = listeners.filter(l => l !== currentListener);
      };
    }

    const initializeAuth = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (error) throw error;

        if (authUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          updateGlobalState(authUser, profileData || null, true);
        } else {
          updateGlobalState(null, null, true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        updateGlobalState(null, null, true);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_OUT') {
            updateGlobalState(null, null, true);
            return;
          }

          if (session?.user) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              throw profileError;
            }

            updateGlobalState(session.user, profileData || null, true);
          } else {
            updateGlobalState(null, null, true);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          updateGlobalState(session?.user || null, null, true);
        }
      }
    );

    if (!globalIsLoaded) {
      initializeAuth();
    }

    return () => {
      listeners = listeners.filter(l => l !== currentListener);
      if (listeners.length === 0) {
        subscription?.unsubscribe();
        globalUser = null;
        globalProfile = null;
        globalIsLoaded = false;
      }
    };
  }, []);

  return { 
    user, 
    profile, 
    loading: !isLoaded,
    isLoaded, 
    isSignedIn: !!user 
  };
}

// Export with multiple names for convenience
export const useUser = useSupabaseUser;
