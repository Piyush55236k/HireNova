import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useSupabaseUser } from '../hooks/useSupabaseUser';

const ProfileTest = () => {
  const { user, profile } = useSupabaseUser();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = [];
    
    try {
      // Test 1: Check database connection
      results.push("🔍 Testing database connection...");
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (testError) {
        results.push(`❌ Database connection failed: ${testError.message}`);
      } else {
        results.push("✅ Database connection successful");
      }

      // Test 2: Check current user
      results.push(`🔍 Current user ID: ${user?.id || 'Not logged in'}`);
      results.push(`🔍 Current profile: ${profile ? JSON.stringify(profile) : 'No profile'}`);

      // Test 3: Check if profile exists
      if (user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        
        if (profileError) {
          results.push(`❌ Profile check failed: ${profileError.message}`);
        } else {
          results.push(`✅ Profile query successful: ${JSON.stringify(profileData)}`);
        }
      }

      // Test 4: Test manual profile creation
      if (user?.id) {
        results.push("🔍 Testing manual profile creation...");
        const { data: upsertData, error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: `test_${user.id.substring(0, 8)}`,
            full_name: user.email || 'Test User',
            role: 'candidate'
          })
          .select('*');
        
        if (upsertError) {
          results.push(`❌ Manual profile creation failed: ${upsertError.message}`);
        } else {
          results.push(`✅ Manual profile creation successful: ${JSON.stringify(upsertData)}`);
        }
      }

    } catch (error) {
      results.push(`❌ Unexpected error: ${error.message}`);
    }
    
    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-2xl">
      <h3 className="text-xl font-bold mb-4">Profile System Test</h3>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? "Running Tests..." : "Run Profile Tests"}
      </button>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="text-sm font-mono bg-gray-800 p-2 rounded">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileTest;
