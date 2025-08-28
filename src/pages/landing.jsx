import React from 'react'
import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import companies from '@/data/companies.json';
import faq from '@/data/faq.json';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
const LandingPage = () => {
  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-5'>
      <section className='text-center'>
        <h1 className='gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4'>
          Find Your Dream Job
        </h1>
        <div className='flex items-center justify-center gap-2 sm:gap-6 mt-4'>
          <span className='gradient-title text-2xl sm:text-4xl lg:text-6xl font-extrabold'>
            and get Hired
          </span>
          <img src='/logo.png' alt='logo' className='h-12 sm:h-16 lg:h-20' />
        </div>
        <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>

      <div className='flex gap-6 justify-center'>
        <Link to='/jobs'>
          <Button variant='blue' size='xl'>Find Jobs</Button>
        </Link>
        <Link to='/post-job'>
          <Button size='xl' variant='destructive'>Post a Job</Button>
        </Link>
      </div>

      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10">
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain mx-auto"
                />
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* banner */}
      <img src='/jobportal.jpg' className='w-full' />
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* cards */}
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the right candidates.
          </CardContent>
        </Card>
      </section>

      {/* accordion */}
      <Accordion type="single" collapsible>
        {faq.map((faq,index)=>{
          return(
  <AccordionItem value={`item-${index + 1}`} key={index}>
    <AccordionTrigger>{faq.question}</AccordionTrigger>
    <AccordionContent>
     {faq.answer}
    </AccordionContent>
  </AccordionItem>
  );
        })}
</Accordion>
    </main>
  )
}

export default LandingPage
