import supabaseClient from "@/utils/supabase";

// normalize company object keys to predictable JS-friendly keys
function normalizeCompany(company) {
  if (!company) return null;

  // handle different casings/column names from DB: Name, name, Logo_URL, logo_url, path
  const name = company.name || company.Name || company.NAME || company.title || null;
  const logo_url =
    company.logo_url || company.Logo_URL || company.logoUrl || company.logo || null;
  const path = company.path || company.Path || null;

  return {
    ...company,
    name,
    logo_url: logo_url || path || null,
    path,
  };
}

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    // return full company object so frontend can read company.logo_url reliably
    .select("*, saved: saved_jobs(id), company: companies(*)")
    .order("created_at", { ascending: false });

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  // normalize embedded company objects
  const normalized = data.map((job) => ({
    ...job,
    company: normalizeCompany(job.company),
  }));

  return normalized;
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(*))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  // normalize company inside job
  return data.map((saved) => ({
    ...saved,
    job: saved.job
      ? {
          ...saved.job,
          company: normalizeCompany(saved.job.company),
        }
      : saved.job,
  }));
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, company: companies(*), applications: applications(*)")
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  // normalize company
  return {
    ...data,
    company: normalizeCompany(data.company),
  };
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(*)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data.map((job) => ({
    ...job,
    company: normalizeCompany(job.company),
  }));
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

// - post job
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Insert job error:", error);
    console.error(error);
    throw new Error("Error Creating Job");
  }

  console.log("Inserted job:", data);
  return data;
}
