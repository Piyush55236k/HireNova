import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/use-fetch';
import { getApplications } from '@/api/apiapplications';
import ApplicationCard from '@/components/ui/application-card';

const CreatedApplication = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnApplications();
    }
  }, [user]);

  if (loadingApplications) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {Array.isArray(applications) && applications.length > 0 ? (
        applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate
          />
        ))
      ) : (
        <p className="text-muted-foreground text-sm">No applications found.</p>
      )}
    </div>
  );
};

export default CreatedApplication;