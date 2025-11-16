# HireNova API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Jobs API](#jobs-api)
4. [Companies API](#companies-api)
5. [Applications API](#applications-api)
6. [Error Handling](#error-handling)

---

## Overview

HireNova is a job portal application built with React and Supabase. This document provides comprehensive documentation for all API endpoints used in the application.

### Base Configuration
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth (Email/Password, Magic Links, OAuth)
- **Storage**: Supabase Storage (for resumes and company logos)

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Authentication

### Sign In with Email/Password

**Endpoint**: `supabase.auth.signInWithPassword()`

**Description**: Authenticates a user with email and password credentials.

**Request Parameters**:
```javascript
{
  email: string,      // User's email address
  password: string    // User's password
}
```

**Example Request**:
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
});
```

**Success Response**:
```javascript
{
  data: {
    user: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      user_metadata: {
        role: "candidate" // or "recruiter"
      },
      created_at: "2024-01-15T10:30:00.000Z",
      updated_at: "2024-01-15T10:30:00.000Z"
    },
    session: {
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      refresh_token: "v1.MK...",
      expires_in: 3600,
      token_type: "bearer"
    }
  },
  error: null
}
```

**Error Response**:
```javascript
{
  data: null,
  error: {
    message: "Invalid login credentials",
    status: 400
  }
}
```

---

### Sign In with Magic Link (OTP)

**Endpoint**: `supabase.auth.signInWithOtp()`

**Description**: Sends a magic link to the user's email for passwordless authentication.

**Request Parameters**:
```javascript
{
  email: string,
  options: {
    emailRedirectTo: string  // URL to redirect after email verification
  }
}
```

**Example Request**:
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://yourapp.com/auth/callback'
  }
});
```

**Success Response**:
```javascript
{
  data: {},
  error: null
}
```

---

### Sign In with OAuth

**Endpoint**: `supabase.auth.signInWithOAuth()`

**Description**: Authenticates a user using OAuth providers (Google, GitHub, etc.).

**Request Parameters**:
```javascript
{
  provider: string,  // 'google', 'github', etc.
  options: {
    redirectTo: string  // URL to redirect after OAuth authentication
  }
}
```

**Example Request**:
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/auth/callback'
  }
});
```

**Success Response**:
```javascript
{
  data: {
    url: "https://accounts.google.com/o/oauth2/v2/auth?..."
  },
  error: null
}
```

---

### Sign Out

**Endpoint**: `supabase.auth.signOut()`

**Description**: Signs out the current user and invalidates the session.

**Authentication**: Required (Bearer token)

**Example Request**:
```javascript
const { error } = await supabase.auth.signOut();
```

**Success Response**:
```javascript
{
  error: null
}
```

---

### Update User Role

**Endpoint**: `supabase.auth.updateUser()`

**Description**: Updates the user's role in their metadata (candidate or recruiter).

**Authentication**: Required (Bearer token)

**Request Parameters**:
```javascript
{
  data: {
    role: string  // "candidate" or "recruiter"
  }
}
```

**Example Request**:
```javascript
const { data, error } = await supabase.auth.updateUser({
  data: { role: 'recruiter' }
});
```

**Success Response**:
```javascript
{
  data: {
    user: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      user_metadata: {
        role: "recruiter"
      }
    }
  },
  error: null
}
```

---

## Jobs API

### Get All Jobs

**Function**: `getJobs(token, { location, company_id, searchQuery })`

**Endpoint**: `supabase.from("jobs").select()`

**Description**: Fetches a list of jobs with optional filters.

**Authentication**: Required (Bearer token)

**Query Parameters**:
- `location` (string, optional): Filter jobs by location
- `company_id` (string, optional): Filter jobs by company ID
- `searchQuery` (string, optional): Search jobs by title (case-insensitive)

**Example Request**:
```javascript
const jobs = await getJobs(token, {
  location: 'Remote',
  searchQuery: 'developer'
});
```

**Success Response**:
```javascript
[
  {
    id: "job-123",
    title: "Senior Frontend Developer",
    description: "We are looking for an experienced Frontend Developer...",
    location: "Remote",
    salary_range: "$80,000 - $120,000",
    requirements: ["React", "TypeScript", "3+ years experience"],
    isOpen: true,
    created_at: "2024-01-15T10:30:00.000Z",
    recruiter_id: "recruiter-456",
    company_id: "company-789",
    company: {
      id: "company-789",
      name: "TechCorp Inc.",
      logo_url: "https://storage.supabase.co/company-logo/logo-12345-TechCorp.png",
      path: "https://storage.supabase.co/company-logo/logo-12345-TechCorp.png"
    },
    saved: []  // Array of saved_jobs if user has saved this job
  }
]
```

**Error Response**:
```javascript
null  // Returns null on error (error logged to console)
```

---

### Get Single Job

**Function**: `getSingleJob(token, { job_id })`

**Endpoint**: `supabase.from("jobs").select().eq("id", job_id).single()`

**Description**: Fetches detailed information about a specific job.

**Authentication**: Required (Bearer token)

**Path Parameters**:
- `job_id` (string, required): Unique identifier of the job

**Example Request**:
```javascript
const job = await getSingleJob(token, { job_id: 'job-123' });
```

**Success Response**:
```javascript
{
  id: "job-123",
  title: "Senior Frontend Developer",
  description: "## About the Role\n\nWe are looking for an experienced Frontend Developer...",
  location: "Remote",
  salary_range: "$80,000 - $120,000",
  requirements: ["React", "TypeScript", "3+ years experience"],
  isOpen: true,
  created_at: "2024-01-15T10:30:00.000Z",
  recruiter_id: "recruiter-456",
  company_id: "company-789",
  company: {
    id: "company-789",
    name: "TechCorp Inc.",
    logo_url: "https://storage.supabase.co/company-logo/logo-12345-TechCorp.png"
  },
  applications: [
    {
      id: "app-001",
      candidate_id: "candidate-111",
      job_id: "job-123",
      status: "applied",
      created_at: "2024-01-16T08:00:00.000Z"
    }
  ]
}
```

---

### Create Job

**Function**: `addNewJob(token, _, jobData)`

**Endpoint**: `supabase.from("jobs").insert([jobData]).select()`

**Description**: Creates a new job posting.

**Authentication**: Required (Bearer token - Recruiter only)

**Request Body**:
```javascript
{
  title: string,           // Job title
  description: string,     // Job description (supports Markdown)
  location: string,        // Job location
  salary_range: string,    // Salary range or "Not specified"
  requirements: string[],  // Array of job requirements
  company_id: string,      // Company ID
  recruiter_id: string,    // Recruiter's user ID
  isOpen: boolean         // Whether the job is currently accepting applications
}
```

**Example Request**:
```javascript
const jobData = {
  title: "Senior Backend Developer",
  description: "## About the Position\n\nWe need a skilled Backend Developer...",
  location: "San Francisco, CA",
  salary_range: "$100,000 - $150,000",
  requirements: ["Node.js", "PostgreSQL", "5+ years experience"],
  company_id: "company-789",
  recruiter_id: "user-456",
  isOpen: true
};

const newJob = await addNewJob(token, null, jobData);
```

**Success Response**:
```javascript
[
  {
    id: "job-124",
    title: "Senior Backend Developer",
    description: "## About the Position\n\nWe need a skilled Backend Developer...",
    location: "San Francisco, CA",
    salary_range: "$100,000 - $150,000",
    requirements: ["Node.js", "PostgreSQL", "5+ years experience"],
    company_id: "company-789",
    recruiter_id: "user-456",
    isOpen: true,
    created_at: "2024-01-17T10:30:00.000Z"
  }
]
```

**Error Response**:
```javascript
// Throws Error with message "Error Creating Job"
```

---

### Get My Jobs (Recruiter)

**Function**: `getMyJobs(token, { recruiter_id })`

**Endpoint**: `supabase.from("jobs").select().eq("recruiter_id", recruiter_id)`

**Description**: Fetches all jobs created by the authenticated recruiter.

**Authentication**: Required (Bearer token - Recruiter only)

**Query Parameters**:
- `recruiter_id` (string, required): ID of the recruiter

**Example Request**:
```javascript
const myJobs = await getMyJobs(token, { recruiter_id: 'user-456' });
```

**Success Response**:
```javascript
[
  {
    id: "job-123",
    title: "Senior Frontend Developer",
    location: "Remote",
    isOpen: true,
    created_at: "2024-01-15T10:30:00.000Z",
    company: {
      id: "company-789",
      name: "TechCorp Inc.",
      logo_url: "https://storage.supabase.co/company-logo/logo-12345-TechCorp.png"
    }
  }
]
```

---

### Update Job Hiring Status

**Function**: `updateHiringStatus(token, { job_id }, isOpen)`

**Endpoint**: `supabase.from("jobs").update({ isOpen }).eq("id", job_id).select()`

**Description**: Toggles whether a job is accepting applications.

**Authentication**: Required (Bearer token - Recruiter only)

**Path Parameters**:
- `job_id` (string, required): Job ID

**Request Body**:
- `isOpen` (boolean, required): Whether job is open for applications

**Example Request**:
```javascript
const updated = await updateHiringStatus(token, { job_id: 'job-123' }, false);
```

**Success Response**:
```javascript
[
  {
    id: "job-123",
    isOpen: false,
    // ... other job fields
  }
]
```

---

### Delete Job

**Function**: `deleteJob(token, { job_id })`

**Endpoint**: `supabase.from("jobs").delete().eq("id", job_id).select()`

**Description**: Deletes a job posting.

**Authentication**: Required (Bearer token - Recruiter only)

**Path Parameters**:
- `job_id` (string, required): Job ID to delete

**Example Request**:
```javascript
const deleted = await deleteJob(token, { job_id: 'job-123' });
```

**Success Response**:
```javascript
[
  {
    id: "job-123",
    // ... deleted job data
  }
]
```

---

### Save/Unsave Job

**Function**: `saveJob(token, { alreadySaved }, saveData)`

**Endpoint**: `supabase.from("saved_jobs").insert()` or `.delete()`

**Description**: Saves or unsaves a job for the current user.

**Authentication**: Required (Bearer token - Candidate only)

**Request Parameters**:
- `alreadySaved` (boolean, required): Whether job is already saved
- `saveData` (object, required):
  ```javascript
  {
    user_id: string,
    job_id: string
  }
  ```

**Example Request (Save)**:
```javascript
const saved = await saveJob(
  token,
  { alreadySaved: false },
  { user_id: 'user-123', job_id: 'job-456' }
);
```

**Example Request (Unsave)**:
```javascript
const unsaved = await saveJob(
  token,
  { alreadySaved: true },
  { job_id: 'job-456' }
);
```

**Success Response**:
```javascript
[
  {
    id: "saved-001",
    user_id: "user-123",
    job_id: "job-456",
    created_at: "2024-01-17T10:30:00.000Z"
  }
]
```

---

### Get Saved Jobs

**Function**: `getSavedJobs(token)`

**Endpoint**: `supabase.from("saved_jobs").select()`

**Description**: Fetches all jobs saved by the current user.

**Authentication**: Required (Bearer token - Candidate only)

**Example Request**:
```javascript
const savedJobs = await getSavedJobs(token);
```

**Success Response**:
```javascript
[
  {
    id: "saved-001",
    user_id: "user-123",
    job_id: "job-456",
    created_at: "2024-01-17T10:30:00.000Z",
    job: {
      id: "job-456",
      title: "Senior Frontend Developer",
      location: "Remote",
      company: {
        id: "company-789",
        name: "TechCorp Inc.",
        logo_url: "https://storage.supabase.co/company-logo/logo-12345-TechCorp.png"
      }
    }
  }
]
```

---

## Companies API

### Get All Companies

**Function**: `getCompanies(token)`

**Endpoint**: `supabase.from("companies").select("*")`

**Description**: Fetches a list of all registered companies.

**Authentication**: Required (Bearer token)

**Example Request**:
```javascript
const companies = await getCompanies(token);
```

**Success Response**:
```javascript
[
  {
    id: "company-789",
    name: "TechCorp Inc.",
    logo_url: "https://storage.supabase.co/company-logo/logo-12345-TechCorp.png",
    created_at: "2024-01-10T10:00:00.000Z"
  },
  {
    id: "company-790",
    name: "StartupXYZ",
    logo_url: "https://storage.supabase.co/company-logo/logo-67890-StartupXYZ.png",
    created_at: "2024-01-11T14:30:00.000Z"
  }
]
```

---

### Add New Company

**Function**: `addNewCompany(token, _, companyData)`

**Endpoint**: `supabase.storage.from("company-logo").upload()` + `supabase.from("companies").insert()`

**Description**: Creates a new company profile with logo upload.

**Authentication**: Required (Bearer token - Recruiter only)

**Request Body**:
```javascript
{
  name: string,    // Company name
  logo: File       // Logo image file (File object)
}
```

**Example Request**:
```javascript
const companyData = {
  name: "NewTech Solutions",
  logo: fileObject  // File from input type="file"
};

const company = await addNewCompany(token, null, companyData);
```

**Success Response**:
```javascript
[
  {
    id: "company-791",
    name: "NewTech Solutions",
    logo_url: "https://storage.supabase.co/company-logo/logo-45678-NewTech Solutions.png",
    created_at: "2024-01-17T10:30:00.000Z"
  }
]
```

**Error Response**:
```javascript
// Throws Error: "Error uploading Company Logo" or "Error submitting Companys"
```

---

## Applications API

### Apply to Job

**Function**: `applyToJob(token, _, jobData)`

**Endpoint**: `supabase.storage.from("resumes").upload()` + `supabase.from("applications").insert()`

**Description**: Submits a job application with resume upload.

**Authentication**: Required (Bearer token - Candidate only)

**Request Body**:
```javascript
{
  candidate_id: string,    // User ID of the candidate
  job_id: string,          // Job ID to apply for
  experience: number,      // Years of experience
  skills: string,          // Comma-separated skills
  education: string,       // Education level
  resume: File,            // Resume file (PDF, DOC, etc.)
  name: string,            // Candidate's full name
  status: string           // Application status (default: "applied")
}
```

**Example Request**:
```javascript
const applicationData = {
  candidate_id: "user-123",
  job_id: "job-456",
  experience: 5,
  skills: "React, Node.js, PostgreSQL",
  education: "Bachelor's in Computer Science",
  resume: resumeFile,  // File from input type="file"
  name: "John Doe",
  status: "applied"
};

const application = await applyToJob(token, null, applicationData);
```

**Success Response**:
```javascript
[
  {
    id: "app-002",
    candidate_id: "user-123",
    job_id: "job-456",
    experience: 5,
    skills: "React, Node.js, PostgreSQL",
    education: "Bachelor's in Computer Science",
    resume: "https://storage.supabase.co/resumes/resume-12345-user-123-resume.pdf",
    name: "John Doe",
    status: "applied",
    created_at: "2024-01-17T10:30:00.000Z"
  }
]
```

**Error Response**:
```javascript
// Throws Error: "Error uploading Resume: <reason>" or "Error submitting Application: <reason>"
```

---

### Get User Applications

**Function**: `getApplications(token, { user_id })`

**Endpoint**: `supabase.from("applications").select().eq("candidate_id", user_id)`

**Description**: Fetches all applications submitted by the user.

**Authentication**: Required (Bearer token - Candidate only)

**Query Parameters**:
- `user_id` (string, required): Candidate's user ID

**Example Request**:
```javascript
const applications = await getApplications(token, { user_id: 'user-123' });
```

**Success Response**:
```javascript
[
  {
    id: "app-002",
    candidate_id: "user-123",
    job_id: "job-456",
    experience: 5,
    skills: "React, Node.js, PostgreSQL",
    resume: "https://storage.supabase.co/resumes/resume-12345-user-123-resume.pdf",
    status: "applied",
    created_at: "2024-01-17T10:30:00.000Z",
    job: {
      title: "Senior Frontend Developer",
      company: {
        id: "company-789",
        name: "TechCorp Inc.",
        logo_url: "https://storage.supabase.co/company-logo/logo-12345-TechCorp.png"
      }
    }
  }
]
```

---

### Update Application Status

**Function**: `updateApplicationStatus(token, { job_id }, status)`

**Endpoint**: `supabase.from("applications").update({ status }).eq("job_id", job_id).select()`

**Description**: Updates the status of an application (for recruiters).

**Authentication**: Required (Bearer token - Recruiter only)

**Path Parameters**:
- `job_id` (string, required): Job ID

**Request Body**:
- `status` (string, required): New status value
  - Possible values: `"applied"`, `"interviewing"`, `"hired"`, `"rejected"`

**Example Request**:
```javascript
const updated = await updateApplicationStatus(
  token,
  { job_id: 'job-456' },
  'interviewing'
);
```

**Success Response**:
```javascript
[
  {
    id: "app-002",
    candidate_id: "user-123",
    job_id: "job-456",
    status: "interviewing",
    // ... other application fields
  }
]
```

**Error Response**:
```javascript
null  // Returns null if error or no records updated
```

---

## Error Handling

### Common Error Patterns

All API functions follow these error handling patterns:

1. **Supabase Query Errors**: Most functions return `null` on error and log to console
2. **Storage Errors**: Throw Error with descriptive message
3. **Authentication Errors**: Return `{ data: null, error: { message, status } }`

### Error Response Structure

**Supabase Error Object**:
```javascript
{
  message: string,      // Human-readable error message
  details: string,      // Technical details (optional)
  hint: string,         // Suggestion to fix (optional)
  code: string,         // Error code
  status: number        // HTTP status code
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `PGRST116` | Row not found | Verify the ID exists |
| `23505` | Unique violation | Record already exists |
| `42501` | Insufficient privilege | Check RLS policies and authentication |
| `401` | Unauthorized | Provide valid authentication token |
| `400` | Bad request | Validate request parameters |
| `500` | Internal server error | Check server logs |

### Authentication Errors

**Invalid Credentials**:
```javascript
{
  error: {
    message: "Invalid login credentials",
    status: 400
  }
}
```

**User Not Found**:
```javascript
{
  error: {
    message: "User not found",
    status: 404
  }
}
```

**Session Expired**:
```javascript
{
  error: {
    message: "JWT expired",
    status: 401
  }
}
```

### File Upload Errors

**File Too Large**:
```javascript
// Thrown Error
"Error uploading Resume: File size exceeds maximum allowed"
```

**Invalid File Type**:
```javascript
// Thrown Error
"Error uploading Company Logo: Invalid file type"
```

---

## Best Practices

### 1. Token Management
Always pass the authentication token to API functions:
```javascript
const token = session?.access_token;
const jobs = await getJobs(token, filters);
```

### 2. Error Handling
Implement proper error handling for all API calls:
```javascript
try {
  const job = await getSingleJob(token, { job_id });
  if (!job) {
    console.error('Job not found');
    return;
  }
  // Process job data
} catch (error) {
  console.error('Error fetching job:', error);
  // Show user-friendly error message
}
```

### 3. File Upload Validation
Validate files before uploading:
```javascript
const validateResume = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'application/msword'];
  
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF and DOC files are allowed');
  }
  
  return true;
};
```

### 4. Role-Based Access
Check user role before performing restricted operations:
```javascript
const { role } = useAuth();

if (role === 'recruiter') {
  // Show recruiter-specific features
  const myJobs = await getMyJobs(token, { recruiter_id: user.id });
} else {
  // Show candidate-specific features
  const savedJobs = await getSavedJobs(token);
}
```

### 5. Data Normalization
The API automatically normalizes company objects to handle different column name casings:
```javascript
// All these field variations are normalized to consistent names
{
  name: company.name || company.Name || company.NAME,
  logo_url: company.logo_url || company.Logo_URL || company.path
}
```

---

## Database Schema Overview

### Tables

**users** (managed by Supabase Auth)
- `id` (uuid, primary key)
- `email` (text)
- `user_metadata` (jsonb) - Contains `role` field

**jobs**
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `location` (text)
- `salary_range` (text)
- `requirements` (text[])
- `isOpen` (boolean)
- `recruiter_id` (uuid, foreign key → users.id)
- `company_id` (uuid, foreign key → companies.id)
- `created_at` (timestamp)

**companies**
- `id` (uuid, primary key)
- `name` (text)
- `logo_url` (text)
- `created_at` (timestamp)

**applications**
- `id` (uuid, primary key)
- `candidate_id` (uuid, foreign key → users.id)
- `job_id` (uuid, foreign key → jobs.id)
- `name` (text)
- `experience` (integer)
- `skills` (text)
- `education` (text)
- `resume` (text) - URL to uploaded file
- `status` (text) - 'applied', 'interviewing', 'hired', 'rejected'
- `created_at` (timestamp)

**saved_jobs**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key → users.id)
- `job_id` (uuid, foreign key → jobs.id)
- `created_at` (timestamp)

---

## Rate Limiting

Supabase has default rate limits:
- **Anonymous requests**: 100 requests per hour per IP
- **Authenticated requests**: Higher limits based on plan
- **Storage operations**: 100 uploads per hour

---

## Support

For issues or questions:
1. Check the error message and console logs
2. Verify authentication token is valid
3. Ensure user has the correct role for the operation
4. Review Supabase dashboard for RLS policy issues

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-17
