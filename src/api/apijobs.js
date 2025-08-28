import supabaseClient from "@/utils/supabase";
export async function getJobs(token,{location,company_id,searchQuery}) {
   const supabase = await supabaseClient(token);

   let query = supabase.from("jobs").select("*,company:companies(Name,Logo_URL), saved: saved_jobs(id)")
   if(location) {
       query = query.eq("location",location);
   }
   if(company_id) {
       query = query.eq("company_id",company_id);
   }
   if(searchQuery) {
       query = query.ilike("title",`%${searchQuery}%`);
   }

   const {data, error} = await query
   if(error){
    console.error("Error is",error);
    return null;
   }
   return data;
}


export async function saveJob(token,{alreadySaved},saveData) {
   const supabase = await supabaseClient(token);

   if(alreadySaved){
     const {data, error:deleteError} = await supabase
     .from("saved_jobs")
     .delete()
     .eq("job_id",saveData.job_id)
     if(deleteError){
    console.error("Error deleting daved job",deleteError);
    return null;
   }
   return data;

   }else{
    const {data, error:insertError} = await supabase
     .from("saved_jobs")
     .insert([saveData])
     .select();
     if(insertError){
    console.error("Error deleting daved job",insertError);
    return null;
   }
   return data;
   }


}
export async function getSingleJob(token,{job_id}){

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('jobs')
        .select('*, company:companies(Name,Logo_URL),applications:applications(*)')
        .eq("id", job_id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateHiringStatus(token,{job_id},isOpen){

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('jobs')
        .update({ isOpen })
        .eq("id", job_id)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);
  
  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Error creating job:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getSavedJobs(token,) {
  const supabase = await supabaseClient(token);
  
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, company:companies(Name,Logo_URL))");

  if (error) {
    console.error("Error fetcing saved job:", error);
    throw new Error(error.message);
  }

  return data;
}


export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies(Name, Logo_URL),
      saved_jobs(id)
    `)
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching jobs:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id",job_id)
    .select()

  if (error) {
    console.error("Error deleting jobs:", error);
    throw new Error(error.message);
  }

  return data;
}
