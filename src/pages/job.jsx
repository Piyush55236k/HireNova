import React, { useEffect } from 'react'
import { getSingleJob,updateHiringStatus } from '@/api/apijobs';
import useFetch from "@/hooks/use-fetch";
import {useUser} from "@clerk/clerk-react";
import {useParams} from "react-router-dom";
import { BarLoader } from 'react-spinners';
import { Briefcase, DoorOpen, MapPinIcon, DoorClosed } from 'lucide-react';
import ApplyJobDrawer from '@/components/ui/apply-job';
import ApplicationCard  from '@/components/ui/application-card';
import MDEditor from '@uiw/react-md-editor';
// Import the CSS for MDEditor
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"

const JobPage = () => {
  const {isLoaded,user} = useUser();
  const {id} = useParams();

  const{
    loading:loadingHiringStatus,
    fn:fnHiringStatus,
  }=useFetch(updateHiringStatus,{job_id:id,})

  const handleStatusChange = (value)=>{
    const isOpen= value ==="open"
    fnHiringStatus(
      isOpen,
      ).then(()=>fnJob());
  }
  
  const{
    loading:loadingJob,
    data:job,
    fn:fnJob,
  }=useFetch(getSingleJob,{job_id:id,})

  useEffect(()=>{
    if(isLoaded) fnJob();
  },[isLoaded]);

  // Check if current user has already applied
  const hasApplied = job?.applications?.find((ap)=>ap.candidate_id === user?.id);
  
  // Check if user is a candidate (not the recruiter who posted the job)
  const isCandidate = user?.id && job?.recruiter_id !== user?.id;

  if(!isLoaded || loadingJob){
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div className="flex flex-col gap-8 mt-5 ">
     <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
      <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">{job?.title}</h1>
      <img src={job?.company?.Logo_URL} className="h-12" alt={job?.title}/>
      </div> 
      
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <MapPinIcon size={16} />
          <span>{job?.location}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Briefcase size={16} />
          <span>{job?.applications?.length || 0} Applicants</span>
        </div>
        <div className="flex gap-2 items-center">
          {job?.isOpen ? (
            <>
              <DoorOpen size={16} className="text-green-500" />
              <span className="text-green-500">Open</span>
            </>
          ) : (
            <>
              <DoorClosed size={16} className="text-red-500" />
              <span className="text-red-500">Closed</span>
            </>
          )}
        </div>
      </div>

      {/* hiring status - only show to recruiter */}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.recruiter_id === user?.id && (
         <Select onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${job?.isOpen? "bg-green-950 " : "bg-red-950"}`}>
            <SelectValue placeholder={
              "Hiring Status " + (job?.isOpen ? " (Open)" : " (Closed)")
            } />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Close</SelectItem>
          </SelectContent>
        </Select>
      )}

      <div>
        <h2 className="text-2xl font-bold sm:text-3xl mb-4">About the job</h2>
        <p className="sm:text-lg">{job?.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold sm:text-3xl mb-4">What we are looking for</h2>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDEditor.Markdown 
            source={job?.requirements} 
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
      </div>

      {/* Apply button - only show to candidates (not recruiters) */}
      {isCandidate && (
        <div className="mt-6">
          <ApplyJobDrawer  
            job={job}
            user={user}
            fetchJob={fnJob}
            applied={hasApplied}
          />
        </div>
      )}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id &&(
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
          {job?.applications.map((application)=>{
            return <ApplicationCard 
            key={application.id} application={application}
            />
          })}
        </div>
      )}
    </div>
  )
}

export default JobPage