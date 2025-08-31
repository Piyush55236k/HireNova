import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { getCompanies } from '../api/apiCompanies';
import { getJobs } from '../api/apiJobs';
import { useSupabaseUser } from '../hooks/useSupabaseUser';

const DatabaseTest = () => {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useSupabaseUser();

  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        console.log("Testing database connection...");
        console.log("User:", user);
        console.log("Is loaded:", isLoaded);

        // Test direct supabase connection
        const { data: directData, error: directError } = await supabase
          .from("companies")
          .select("*");

        console.log("Direct query result:", { directData, directError });

        if (directError) {
          console.error("Direct query error:", directError);
          setError(directError.message);
        } else {
          console.log("Direct companies data:", directData);
        }

        // Test with column aliases
        const { data: aliasData, error: aliasError } = await supabase
          .from("companies")
          .select("id, Name as name, Logo_URL as logo_url, created_at");

        console.log("Alias query result:", { aliasData, aliasError });

        // Test API function
        if (isLoaded) {
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;
          console.log("Token:", token ? 'present' : 'missing');

          const apiData = await getCompanies(token);
          console.log("API companies data:", apiData);
          setCompanies(apiData || []);

          // Test jobs API
          const jobsData = await getJobs(token, {});
          console.log("Jobs data:", jobsData);
          setJobs(jobsData || []);
        }

      } catch (err) {
        console.error("Database test error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testDatabaseConnection();
  }, [user, isLoaded]);

  if (loading) return <div>Testing database connection...</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Database Connection Test</h3>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      <div style={{ marginBottom: '10px' }}>
        <strong>User Status:</strong> {user ? 'Authenticated' : 'Not authenticated'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Companies Count:</strong> {companies.length}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Jobs Count:</strong> {jobs.length}
      </div>

      {companies.length > 0 && (
        <div>
          <strong>Companies:</strong>
          <ul>
            {companies.map((company, index) => (
              <li key={index}>
                ID: {company.id} | Name: "{company.name}" | Logo: "{company.logo_url}"
              </li>
            ))}
          </ul>
          
          <div style={{ marginTop: '10px' }}>
            <strong>Raw data:</strong>
            <pre style={{ background: '#f0f0f0', padding: '10px', fontSize: '12px' }}>
              {JSON.stringify(companies, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;
