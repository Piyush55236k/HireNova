# Job Portal - Complete Workflow Guide

## 🚀 Production Setup Instructions

### 1. Database Setup (Required)
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the complete `production-setup.sql` script
4. Run the script to set up all tables, policies, and triggers

### 2. Environment Variables
1. Copy `.env.example` to `.env.local`
2. Update with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-actual-supabase-url
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```

### 3. Install & Run
```bash
npm install
npm run dev
```

## 📋 Complete User Workflow

### **Phase 1: Landing Page**
- **URL**: `/` (Landing page)
- **Features**: 
  - Beautiful ShadesOfPurple glassmorphism theme
  - Hero section with gradient title
  - Two CTA buttons: "Find Jobs" and "Post a Job"
  - Both buttons redirect to `/auth`
  - Company carousel with auto-play
  - Feature cards and FAQ section

### **Phase 2: Authentication**
- **URL**: `/auth` (Auth modal)
- **Features**:
  - Glassmorphism modal with ShadesOfPurple theme
  - Toggle between Login and Sign Up
  - Supabase authentication
  - Clean, modern UI with purple gradient backgrounds
  - Auto-redirect after successful login

### **Phase 3: Onboarding (Role Selection)**
- **URL**: `/onboarding` (Protected route)
- **Features**:
  - **IMMUTABLE ROLE SELECTION** - Once chosen, cannot be changed
  - Two role options: "Candidate" and "Recruiter"
  - Auto-redirect if user already has a role
  - Clean selection interface
  - Role gets permanently saved to user profile

### **Phase 4: Role-Based Redirects**
After onboarding completion:

#### **For Candidates:**
- **Primary**: `/jobs` - Job listings page
- **Access to**:
  - Browse and search jobs
  - Apply to jobs
  - View saved jobs (`/saved-jobs`)
  - View applications

#### **For Recruiters:**
- **Primary**: `/post-job` - Job posting page  
- **Access to**:
  - Post new jobs
  - Manage posted jobs (`/my-jobs`)
  - View applications for their jobs

## 🔒 Security Features

### Authentication Flow:
1. **Unauthenticated users**: Can only access landing page and auth
2. **Authenticated without role**: Redirected to onboarding
3. **Authenticated with role**: Access to role-specific pages

### Role-Based Access Control:
- **Candidates**: Cannot access job posting features
- **Recruiters**: Cannot apply to jobs
- **All users**: Profile management, settings

### Database Security:
- Row Level Security (RLS) enabled
- Automatic profile creation triggers
- Secure role-based data access

## 🎨 Design System

### Theme: ShadesOfPurple Glassmorphism
- **Primary Colors**: Purple gradients (#6B46C1 to #3B82F6)
- **Background**: Dark with purple-blue gradients
- **Components**: Glassmorphism effects with backdrop-blur
- **Typography**: Modern, clean fonts with proper contrast

### UI Components:
- Custom buttons with variants (blue, destructive)
- Glassmorphic cards and modals
- Smooth animations and transitions
- Responsive design for all screen sizes

## ⚡ Performance Features

### Optimizations:
- **Global State Management**: Eliminates infinite re-renders
- **Lazy Loading**: Components loaded on demand
- **Cached Authentication**: Reduces API calls
- **Optimized Queries**: Fast database operations

### Loading States:
- Beautiful loading screens with theme consistency
- Progressive loading for better UX
- Skeleton loaders where appropriate

## 🚀 Deployment Ready

### Vercel Configuration:
- Optimized `vercel.json` for SPA routing
- Build settings configured
- Environment variables ready

### Production Features:
- Clean console (no development logs)
- Optimized bundle size
- Fast initial load
- SEO-friendly structure

## 🔧 Troubleshooting

### Common Issues:
1. **Profile not creating**: Run `production-setup.sql` script
2. **Infinite loading**: Check environment variables
3. **Auth not working**: Verify Supabase configuration
4. **Role issues**: Check database triggers are working

### Support:
- All SQL files cleaned up as requested
- Console logs removed from production
- Clean, maintainable codebase ready for deployment
