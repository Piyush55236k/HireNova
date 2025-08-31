import { supabase, createAuthenticatedSupabaseClient } from "../utils/supabase";

// Fetch Jobs
export async function getJobs(token = null, params = {}, ...args) {
  const { location, company_id, searchQuery } = params;
  
  console.log("Getting jobs, token:", token ? 'present' : 'missing');
  console.log("Filters:", { location, company_id, searchQuery });
  
  let query = supabase
    .from("jobs")
    .select("*, company: companies(*)")
    .eq("isOpen", true); // Only show open jobs

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

  console.log("Raw jobs data from DB:", data);

  // Transform company data in the jobs
  const transformedData = data?.map(job => ({
    ...job,
    company: job.company ? {
      id: job.company.id,
      name: job.company.Name || job.company.name,
      logo_url: job.company.Logo_URL || job.company.logo_url,
      created_at: job.company.created_at
    } : null
  }));

  console.log("Transformed jobs data:", transformedData);
  return transformedData;
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(*))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  // Transform company data in saved jobs
  const transformedData = data?.map(savedJob => ({
    ...savedJob,
    job: savedJob.job ? {
      ...savedJob.job,
      company: savedJob.job.company ? {
        id: savedJob.job.company.id,
        name: savedJob.job.company.Name || savedJob.job.company.name,
        logo_url: savedJob.job.company.Logo_URL || savedJob.job.company.logo_url,
        created_at: savedJob.job.company.created_at
      } : null
    } : null
  }));

  return transformedData;
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(*), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  // Transform company data
  if (data && data.company) {
    data.company = {
      id: data.company.id,
      name: data.company.Name || data.company.name,
      logo_url: data.company.Logo_URL || data.company.logo_url,
      created_at: data.company.created_at
    };
  }

  return data;
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
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
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(*)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  // Transform company data
  const transformedData = data?.map(job => ({
    ...job,
    company: job.company ? {
      id: job.company.id,
      name: job.company.Name || job.company.name,
      logo_url: job.company.Logo_URL || job.company.logo_url,
      created_at: job.company.created_at
    } : null
  }));

  return transformedData;
}

// Delete job
export async function deleteJob(token, { job_id }) {
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
  console.log("Adding new job, token:", token ? 'present' : 'missing');
  console.log("Job data:", jobData);
  
  // Use authenticated client for write operations
  const authenticatedSupabase = token ? createAuthenticatedSupabaseClient(token) : supabase;
  
  const { data, error } = await authenticatedSupabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Job insert error:", error);
    throw new Error("Error Creating Job");
  }

  console.log("Job added:", data);
  return data;
}
