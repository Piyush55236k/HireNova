import React from 'react'
import { CardTitle, CardHeader, Card, CardContent, CardFooter } from './card'
import { BriefcaseBusiness, Download, School, Boxes } from 'lucide-react'
import { updateApplicationStatus } from '@/api/apiapplications'; 
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from 'react-spinners';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"
const ApplicationCard = ({application,isCandidate=false}) => {
    const handleDownload =()=>{
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    };
    const {
        loading:loadingHiringStatus,
        fn: fnHiringStatus
    }= useFetch(updateApplicationStatus,{
        job_id: application.job_id,
    })
    const handleStatusChange = (status)=>{
        fnHiringStatus(status)
    }
  return (
    <div>
      <Card>
        {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
        <CardHeader>
            <CardTitle className="flex justify-between font-bold">
                {isCandidate?  `${application?.job?.title} at ${application?.job?.company?.name}`
                :application?.name}
                <Download 
                size={18}
                className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
                onClick={handleDownload}
                />
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1 ">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex gap-2 items-center">
                    <BriefcaseBusiness size={15}/>{application?.experience} years of experience
                </div>

                <div className="flex gap-2 items-center">
                    <School size={15}/>
                    Education : {application?.education}
                </div>

                <div className="flex gap-2 items-center">
                    <Boxes size={15}/>
                    Skills : {application?.skills}
                </div>
            </div>
            <hr />
        </CardContent>
        <CardFooter className="flex justify-between">
    <span>
        {(() => {
            if (!application?.createdAt) return 'Date not available';
            
            const date = new Date(application.createdAt);
            return isNaN(date.getTime()) 
                ? 'Invalid date' 
                : date.toLocaleDateString();
        })()}
    </span>
    {isCandidate ? <span className='capitalize font-bold'>Status: {application?.status}</span> : (
        <Select 
        onValueChange={handleStatusChange}
        defaultValue={application.status}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder= "Application Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
    )}
</CardFooter>

      </Card> 
    </div>
  )
}

export default ApplicationCard
