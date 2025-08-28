import React from 'react'
import {useEffect} from "react";
import { BarLoader } from 'react-spinners';
import { useUser,  } from '@clerk/clerk-react';
import useFetch from '@/hooks/use-fetch';
import CreatedApplication from "@/components/created-application";
import CreatedJobs from "@/components/created-jobs";
const MyJobs = () => {
  const{user , isLoaded} = useUser();

    if (!isLoaded) {
      return <BarLoader className="mb-4" width={"100%"} color='#36d7b7' />
    }
  
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate" ? "My Application" : "My Jobs"}
  </h1>

    {user?.unsafeMetadata?.role === "candidate" ? (
      <CreatedApplication />)
       : <CreatedJobs /> }
    </div>
  )
}

export default MyJobs
