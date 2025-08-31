import { useSupabaseUser } from "../hooks/useSupabaseUser";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const CreatedApplications = () => {
  const { user, profile, isLoaded } = useSupabaseUser();

  console.log("CreatedApplications - User:", user?.id);
  console.log("CreatedApplications - Profile:", profile);
  console.log("CreatedApplications - Profile role:", profile?.role);

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications);

  useEffect(() => {
    if (isLoaded && user?.id && profile?.role === "candidate") {
      console.log("CreatedApplications - Fetching applications for candidate:", user.id);
      fnApplications({ user_id: user.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id, profile?.role]);

  if (!isLoaded || loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;
