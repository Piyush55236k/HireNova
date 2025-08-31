import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useSupabaseUser } from "../hooks/useSupabaseUser";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";
import { useEffect } from "react";

const CreatedJobs = () => {
  const { user, profile, isLoaded } = useSupabaseUser();

  console.log("CreatedJobs - User:", user?.id);
  console.log("CreatedJobs - Profile:", profile);
  console.log("CreatedJobs - Profile role:", profile?.role);

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs);

  useEffect(() => {
    if (isLoaded && user?.id && profile?.role === "recruiter") {
      console.log("CreatedJobs - Fetching jobs for recruiter:", user.id);
      fnCreatedJobs({ recruiter_id: user.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id, profile?.role]);

  return (
    <div>
      {(!isLoaded || loadingCreatedJobs) ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={() => fnCreatedJobs({ recruiter_id: user.id })}
                  isMyJob
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
