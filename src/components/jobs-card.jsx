import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import useFetch from '@/hooks/use-fetch';
import { saveJob, deleteJob } from '@/api/apijobs';
import { BarLoader } from 'react-spinners';

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobSaved = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const {
    fn: fnSavedJob,
    data: SavedJob,
    loading: loadingSavedJob,
  } = useFetch(saveJob, { alreadySaved: saved });

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobSaved(); // optional callback
  };

const {loading: loadingDeleteJob,
  fn: fnDeleteJob
}=
useFetch(deleteJob,{
  job_id:job.id,
})
const handleDeleteJob = async()=>{
  await fnDeleteJob()
  onJobSaved()
}
  useEffect(() => {
    if (SavedJob !== undefined) {
      setSaved(prev => !prev); // toggle saved state
    }
  }, [SavedJob]);

  return (
    <div>
      <Card className="flex flex-col h-full transition-transform hover:scale-[1.02] hover:shadow-md">
        {loadingDeleteJob && (
          <BarLoader className="mb-4" width={"100%"} color='#36d7b7' />
        )}
        <CardHeader>
          <CardTitle className="flex justify-between font-bold">
            {job.title}
            {isMyJob && (
              <Trash2Icon
                fill="red"
                size={18}
                className="text-red-300 cursor-pointer"
                onClick={handleDeleteJob}
              />
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="flex justify-between items-center">
            {job.company && (
              <img src={job.company.Logo_URL} alt="Company Logo" className="h-6" />
            )}
            <div className="flex gap-2 items-center text-sm text-muted-foreground">
              <MapPinIcon size={15} />
              {job.location}
            </div>
          </div>
          <hr />
          <p className="text-sm text-muted-foreground">
            {job.description?.split('.')[0]}
          </p>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Link to={`/job/${job.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              More Details
            </Button>
          </Link>

          {!isMyJob && (
            <Button
              variant="outline"
              className="w-15"
              onClick={handleSaveJob}
              disabled={loadingSavedJob || !user}
            >
              {saved ? (
                <Heart size={20} stroke="red" fill="red" />
              ) : (
                <Heart size={20} />
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobCard;