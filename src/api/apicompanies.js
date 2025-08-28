import supabaseClient, { supabaseUrl } from "@/utils/supabase";
export async function getCompanies(token){

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('companies')
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
} 

// Add a new company with logo upload
export async function addNewCompanies(token, _, companyData) {
  const supabase = await supabaseClient(token);

  if (!companyData.Logo) {
    throw new Error("Logo file is missing");
  }

  const random = Math.floor(Math.random() * 90000);
  const sanitizedName = companyData.Name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "");
  const fileName = `logo-${random}-${sanitizedName}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.Logo, {
      contentType: companyData.Logo.type,
    });

  if (storageError) {
    throw new Error(storageError.message);
  }

  const Logo_URL = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        Name: companyData.Name,
        Logo_URL: Logo_URL,
      },
    ])
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data[0]?.id,
    name: data[0]?.Name,
    logoUrl: data[0]?.Logo_URL,
  };
}
