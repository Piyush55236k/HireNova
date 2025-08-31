import { supabase, createAuthenticatedSupabaseClient } from "../utils/supabase";

// Get user profile
export async function getUserProfile(token, { user_id }) {
  console.log("Getting user profile for:", user_id);
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  console.log("Profile fetched:", data);
  return data;
}

// Update user profile
export async function updateUserProfile(token, _, profileData) {
  console.log("Updating profile:", profileData);
  
  // Use authenticated client for write operations
  const authenticatedSupabase = token ? createAuthenticatedSupabaseClient(token) : supabase;
  
  const { data, error } = await authenticatedSupabase
    .from("profiles")
    .upsert(profileData)
    .select()
    .single();

  if (error) {
    console.error("Profile update error:", error);
    throw new Error("Error updating profile");
  }

  console.log("Profile updated:", data);
  return data;
}

// Check if username is available
export async function checkUsernameAvailability(username, currentUserId = null) {
  let query = supabase
    .from("profiles")
    .select("username")
    .eq("username", username);
    
  // Exclude current user when checking (for updates)
  if (currentUserId) {
    query = query.neq("id", currentUserId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error checking username:", error);
    return false;
  }
  
  return data.length === 0; // Available if no matches found
}
