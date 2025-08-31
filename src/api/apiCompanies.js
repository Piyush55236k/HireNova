import { supabase, supabaseUrl, createAuthenticatedSupabaseClient } from "@/utils/supabase";

// Get all companies
export async function getCompanies(token) {
  const supabase = await createClient(token);

  const { data, error } = await supabase
    .from("companies")
    .select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  // Transform the data to match expected format
  const transformedData = data?.map(company => ({
    id: company.id,
    name: company.Name || company.name,
    logo_url: company.Logo_URL || company.logo_url,
    created_at: company.created_at,
    // Keep original field names as fallback
    Name: company.Name,
    Logo_URL: company.Logo_URL
  }));

  return transformedData;
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  // Use authenticated client for write operations
  const authenticatedSupabase = token ? createAuthenticatedSupabaseClient(token) : supabase;
  
  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await authenticatedSupabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {
    console.error("Storage error:", storageError);
    throw new Error("Error uploading Company Logo");
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await authenticatedSupabase
    .from("companies")
    .insert([
      {
        Name: companyData.name,
        Logo_URL: logo_url,
      },
    ])
    .select("*");

  if (error) {
    console.error("Insert error:", error);
    throw new Error("Error submitting Company");
  }

  // Transform data to match frontend expectations
  const transformedData = data?.map(company => ({
    id: company.id,
    name: company.Name || company.name,
    logo_url: company.Logo_URL || company.logo_url,
    created_at: company.created_at
  }));

  console.log("Company added:", transformedData);
  return transformedData;
}
