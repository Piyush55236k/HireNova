import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { getCompanies } from '@/api/apicompanies';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { useUser, useSession } from '@clerk/clerk-react';
import { State } from 'country-state-city';
import useFetch from '@/hooks/use-fetch';
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';
import { Navigate, useNavigate } from 'react-router-dom';
import AddCompanyDrawer from '@/components/add-companies';
// MDEditor and required CSS imports
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { Button } from '@/components/ui/button';
import { addNewJob } from '@/api/apijobs';

const schema = z.object({
  title: z.string().min(1, {message: "Title is required"}),
  description: z.string().min(1, {message: "Description is required"}),
  location: z.string().min(1, {message: "Select a location"}),
  company_id: z.string().min(1, {message: "Select or Add a new company"}),
  requirements: z.string().min(1, {message: "Requirements are required"}),
})

const PostJob = () => {
  const { isLoaded, user } = useUser();
  const { session } = useSession();
  const navigate = useNavigate();
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
      title: "",
      description: ""
    },
    resolver: zodResolver(schema),
  })

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies
  } = useFetch(getCompanies)

   useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);
  
  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob)

 

  const onSubmit = (data) => {

      fnCreateJob( {
        ...data,
        recruiter_id: user.id,
        isOpen: true,
      });
      
      // Reset form on success
      reset();
  }

  useEffect(() => {
    if (dataCreateJob && dataCreateJob.length > 0) {
      navigate('/jobs');
    }
  }, [dataCreateJob, navigate]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />
  }

  return (
    <div className="container mx-auto max-w-4xl text-foreground min-h-screen">
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>
        Post a Job
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">

        <Input {...register("title")} placeholder="Job Title" className="bg-background" />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}

        <Textarea 
          {...register("description")} 
          placeholder="Job Description" 
          rows={4} 
          className="bg-background resize-none"
        />
        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Controller 
            name="location"
            control={control}
            render={({field}) => (
              <Select 
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => {
                      return (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )} 
          />

          <Controller 
            name="company_id"
            control={control}
            render={({field}) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Company">
                    {field.value ? companies?.find((com) => com.id === Number(field.value))?.Name : "Select Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ Name, id }) => {
                      return (
                        <SelectItem key={id} value={id.toString()}>
                          {Name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        
            

        {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
        {errors.company_id && <span className="text-red-500 text-sm">{errors.company_id.message}</span>}

        {/* Dark Theme MDEditor Implementation */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-foreground">Job Requirements</label>
          <Controller 
            name="requirements"
            control={control}
            render={({field}) => (
              <div data-color-mode="dark" className="dark-theme-md-editor">
                <MDEditor 
                  value={field.value || ''} 
                  onChange={(value) => field.onChange(value || '')}
                  preview="edit"
                  hideToolbar={false}
                  visibleDragBar={false}
                  height={300}
                  data-color-mode="dark"
                  textareaProps={{
                    placeholder: 'Enter job requirements',
                    style: {
                      fontSize: '14px',
                      fontFamily: '"Inter", sans-serif',
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                    }
                  }}
                />
              </div>
            )} 
          />
          {errors.requirements && (
            <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
          )}
        </div>
        
        {errorCreateJob?.message && (
          <p className="text-red-500 text-sm mt-2 p-3 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
            {errorCreateJob.message}
          </p>
        )}
        
        {loadingCreateJob && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
        
        <Button 
          type="submit" 
          variant="blue" 
          size="lg" 
          className="mt-4 w-full sm:w-auto"
          disabled={loadingCreateJob}
        >
          {loadingCreateJob ? "Posting Job..." : "Post Job"}
        </Button>
      </form>
    </div>
  )
}

export default PostJob