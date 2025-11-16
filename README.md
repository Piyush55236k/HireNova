# HireNova - Job Portal Application

A modern job portal application built with React and Supabase, connecting job seekers with employers.

## Features

- 🔐 **Authentication**: Email/Password, Magic Links, and OAuth (Google)
- 👤 **User Roles**: Separate interfaces for Candidates and Recruiters
- 💼 **Job Management**: Create, update, and delete job postings
- 📝 **Applications**: Apply to jobs with resume upload
- ⭐ **Save Jobs**: Bookmark interesting opportunities
- 🏢 **Company Profiles**: Manage company information and branding
- 🔍 **Search & Filter**: Find jobs by location, company, or keywords

## Tech Stack

- **Frontend**: React 18, React Router, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Radix UI, Shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Piyush55236k/HireNova.git
cd HireNova
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Documentation

- **[API Documentation](./API_DOCUMENTATION.md)**: Comprehensive API endpoint documentation with request/response examples

## Project Structure

```
HireNova/
├── src/
│   ├── api/              # API functions for backend communication
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components
│   ├── lib/             # Authentication and utilities
│   ├── pages/           # Application pages
│   └── utils/           # Helper functions
├── public/              # Static assets
└── API_DOCUMENTATION.md # API reference documentation
```

## User Roles

### Candidate
- Browse and search job listings
- Save favorite jobs
- Apply to jobs with resume
- Track application status
- View application history

### Recruiter
- Post new job openings
- Manage company profile
- Review applications
- Update application status
- Open/close job listings

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is created as a college minor project.

## Support

For issues or questions, please open an issue in the GitHub repository.
