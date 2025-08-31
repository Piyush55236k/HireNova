import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const DatabaseStatus = () => {
  const [status, setStatus] = useState('Checking...');
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error) {
          if (error.message?.includes('relation "public.profiles" does not exist')) {
            setStatus('Database needs setup');
            setNeedsSetup(true);
          } else {
            setStatus(`Database error: ${error.message}`);
          }
        } else {
          setStatus('Database ready ✅');
          setNeedsSetup(false);
        }
      } catch (err) {
        setStatus(`Connection error: ${err.message}`);
      }
    };

    checkDatabase();
  }, []);

  if (!needsSetup && status.includes('ready')) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-900/90 text-white p-4 rounded-lg border border-red-500 max-w-sm">
      <div className="font-bold">Database Status</div>
      <div className="text-sm">{status}</div>
      {needsSetup && (
        <div className="mt-2 text-xs">
          <div className="font-semibold">Action needed:</div>
          <div>Run the production-setup.sql script in your Supabase dashboard</div>
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;
