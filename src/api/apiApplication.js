import supabaseClient, { supabaseUrl } from "@/utils/supabase";

function normalizeCompany(company) {
  if (!company) return null;
  const name = company.name || company.Name || null;
  const logo_url = company.logo_url || company.Logo_URL || company.path || null;
  return { ...company, name, logo_url };
}

// - Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  console.log("applyToJob: start", { hasToken: !!token, jobDataKeys: Object.keys(jobData || {}) });

  const originalName = jobData?.resume?.name || "resume";
  const random = Math.floor(Math.random() * 90000);
  // preserve extension to ensure proper content-type handling
  const fileName = `resume-${random}-${jobData.candidate_id}-${originalName}`;

  try {
    console.log("applyToJob: uploading resume", fileName, jobData?.resume?.type || jobData?.resume?.name);
    const { error: storageError, data: storageData } = await supabase.storage
      .from("resumes")
      .upload(fileName, jobData.resume, { upsert: false });

    if (storageError) {
      console.error("applyToJob: storageError", storageError);
      throw new Error("Error uploading Resume: " + (storageError.message || storageError));
    }

    console.log("applyToJob: uploaded resume", storageData);

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    console.log("applyToJob: inserting application record", { resume });
    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          ...jobData,
          resume,
        },
      ])
      .select();

    if (error) {
      console.error("applyToJob: insert error", error);
      throw new Error("Error submitting Application: " + (error.message || JSON.stringify(error)));
    }

    console.log("applyToJob: success", data);
    return data;
  } catch (err) {
    console.error("applyToJob: caught error", err);
    throw err;
  }
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    // return the full company object to avoid column name casing/alias issues
    .select("*, job:jobs(title, company:companies(*))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data.map((app) => ({
    ...app,
    job: app.job ? { ...app.job, company: normalizeCompany(app.job.company) } : app.job,
  }));
}
