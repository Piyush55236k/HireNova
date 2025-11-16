# Quick API Reference

A quick reference guide for HireNova API endpoints.

> 📖 For detailed documentation with examples, see [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

## Authentication Endpoints

| Function | Description | Auth Required |
|----------|-------------|---------------|
| `signInWithPassword()` | Email/password login | No |
| `signInWithOtp()` | Magic link login | No |
| `signInWithOAuth()` | OAuth login (Google) | No |
| `signOut()` | Sign out user | Yes |
| `updateUser()` | Update user role | Yes |

## Jobs API

| Function | Parameters | Returns | Auth | Role |
|----------|-----------|---------|------|------|
| `getJobs()` | `token, { location?, company_id?, searchQuery? }` | `Job[]` | Yes | Any |
| `getSingleJob()` | `token, { job_id }` | `Job` | Yes | Any |
| `addNewJob()` | `token, null, jobData` | `Job[]` | Yes | Recruiter |
| `getMyJobs()` | `token, { recruiter_id }` | `Job[]` | Yes | Recruiter |
| `updateHiringStatus()` | `token, { job_id }, isOpen` | `Job[]` | Yes | Recruiter |
| `deleteJob()` | `token, { job_id }` | `Job[]` | Yes | Recruiter |
| `saveJob()` | `token, { alreadySaved }, saveData` | `SavedJob[]` | Yes | Candidate |
| `getSavedJobs()` | `token` | `SavedJob[]` | Yes | Candidate |

## Companies API

| Function | Parameters | Returns | Auth | Role |
|----------|-----------|---------|------|------|
| `getCompanies()` | `token` | `Company[]` | Yes | Any |
| `addNewCompany()` | `token, null, companyData` | `Company[]` | Yes | Recruiter |

## Applications API

| Function | Parameters | Returns | Auth | Role |
|----------|-----------|---------|------|------|
| `applyToJob()` | `token, null, jobData` | `Application[]` | Yes | Candidate |
| `getApplications()` | `token, { user_id }` | `Application[]` | Yes | Candidate |
| `updateApplicationStatus()` | `token, { job_id }, status` | `Application[]` | Yes | Recruiter |

## Quick Examples

### Sign In
```javascript
import { supabase } from '@/utils/supabase';

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Get Jobs
```javascript
import { getJobs } from '@/api/apiJobs';

const jobs = await getJobs(token, {
  location: 'Remote',
  searchQuery: 'developer'
});
```

### Apply to Job
```javascript
import { applyToJob } from '@/api/apiApplication';

const application = await applyToJob(token, null, {
  candidate_id: userId,
  job_id: jobId,
  experience: 5,
  skills: 'React, Node.js',
  education: 'BS Computer Science',
  resume: fileObject,
  name: 'John Doe'
});
```

### Post Job (Recruiter)
```javascript
import { addNewJob } from '@/api/apiJobs';

const job = await addNewJob(token, null, {
  title: 'Senior Developer',
  description: 'Job description...',
  location: 'Remote',
  salary_range: '$100k - $150k',
  requirements: ['React', 'Node.js'],
  company_id: companyId,
  recruiter_id: userId,
  isOpen: true
});
```

## Status Codes

| Status | Description |
|--------|-------------|
| `applied` | Application submitted |
| `interviewing` | Under review/interview |
| `hired` | Candidate hired |
| `rejected` | Application rejected |

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Returns `null` | Query failed | Check console logs, verify token |
| `JWT expired` | Session expired | Re-authenticate user |
| `42501` | Insufficient privilege | Check RLS policies & role |
| File upload error | File too large/wrong type | Validate before upload |

## File Upload Limits

- **Resume**: Max 5MB, PDF/DOC formats
- **Company Logo**: Max 2MB, image formats

## Data Types

### Job
```typescript
{
  id: string
  title: string
  description: string
  location: string
  salary_range: string
  requirements: string[]
  isOpen: boolean
  recruiter_id: string
  company_id: string
  created_at: string
}
```

### Application
```typescript
{
  id: string
  candidate_id: string
  job_id: string
  name: string
  experience: number
  skills: string
  education: string
  resume: string  // URL
  status: 'applied' | 'interviewing' | 'hired' | 'rejected'
  created_at: string
}
```

### Company
```typescript
{
  id: string
  name: string
  logo_url: string
  created_at: string
}
```

---

For complete API documentation with detailed examples, see [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
