import supabaseClient, { supabaseUrl } from "@/utils/supabase";
export async function applyToJob(token,_,jobData){

    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;

    const { error:storageError } = await supabase.storage
        .from('resumes')
        .upload(fileName, jobData.resume)

    if (storageError) {
        throw new Error(storageError.message);
    }
    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;
    const { data, error } = await supabase
        .from('applications')
        .insert([{
            ...jobData,
            resume
        }]).select()

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
export async function updateApplicationStatus(token, {job_id}, status) {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('applications')
        .update({status})
        .eq("job_id",job_id)
        .select();

    if (error || data.length === 0) {
        throw new Error(error.message);
    }

    return data;
}

export async function getApplications(token, {user_id}, status) {

    const supabase = await supabaseClient(token);

    const { data, error } = await supabase
        .from('applications')
        .select('*,job:jobs(title, company:companies(Name))')
        .eq("candidate_id",user_id)

    if (error) {
        throw new Error(error.message);
    }

    return data;
}