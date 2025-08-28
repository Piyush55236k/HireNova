import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/use-fetch';
import JobCard from '@/components/jobs-card';
import { getMyJobs } from '@/api/apijobs';

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user?.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnCreatedJobs();
    }
  }, [user]);

  if (loadingCreatedJobs) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(createdJobs) && createdJobs.length > 0 ? (
          createdJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onJobSaved={fnCreatedJobs}
              isMyJob
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;