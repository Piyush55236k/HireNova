import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useSupabaseUser } from "../hooks/useSupabaseUser";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, profile, isLoaded } = useSupabaseUser();

  console.log("MyJobs - User:", user?.id);
  console.log("MyJobs - Profile:", profile);
  console.log("MyJobs - Profile role:", profile?.role);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {profile?.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>
      {profile?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;
