import { supabase } from '../utils/supabase';
import { useSupabaseUser } from '../hooks/useSupabaseUser';

const DebugAuth = () => {
  const { user, profile, isSignedIn } = useSupabaseUser();

  const forceSignOut = async () => {
    console.log("🔥 FORCE SIGN OUT TRIGGERED");
    try {
      // Clear all Supabase auth data
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies if possible
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Force reload
      window.location.replace('/');
    } catch (error) {
      console.error("Force sign out error:", error);
      window.location.replace('/');
    }
  };

  if (!isSignedIn) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div>User: {user?.email}</div>
      <div>Profile: {profile ? 'Loaded' : 'Null'}</div>
      <button 
        onClick={forceSignOut}
        style={{ 
          background: 'darkred', 
          color: 'white', 
          border: 'none', 
          padding: '5px 10px', 
          marginTop: '5px',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        🔥 FORCE SIGN OUT
      </button>
    </div>
  );
};

export default DebugAuth;
