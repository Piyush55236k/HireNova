import React, { useEffect, useState } from 'react';
import { getJobs } from '../api/apijobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import JobCard from '@/components/jobs-card';
import { getCompanies } from '@/api/apicompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "@/components/ui/select"
import { State } from 'country-state-city';

const JobListing = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompanyId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const {
    fn: fnCompanies,
    data: companies,
  } = useFetch(getCompanies)

  useEffect(() => {
    if (isLoaded)
      fnCompanies();
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  }

  const clearFilters = () => {
    setSearchQuery("");
    setCompanyId("");
    setLocation("");
  }

  useEffect(() => {
    if (isLoaded)
      fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color='#36d7b7' />
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Latest Jobs
      </h1>

      <form onSubmit={handleSearch} className="h-14 flex w-full gap-2 items-center mb-3">
        <Input
          type="text"
          placeholder="Search Jobs by Title"
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button type="submit" className="h-full sm:w-28" variant="blue">
          Search
        </Button>
      </form>

      <div className="flex gap-2 mb-4">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Location" />
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

        <Select value={company_id} onValueChange={(value) => setCompanyId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ Name, id }) => {
                return (
                  <SelectItem key={id} value={id}>
                    {Name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={clearFilters} variant="destructive" className="px-4">
          Clear Filters
        </Button>
      </div>

      {loadingJobs && <BarLoader className="mb-4" width={"100%"} color='#36d7b7' />}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Jobs?.length ? (
            Jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              )
            })
          ) : (
            <span>No jobs found</span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;