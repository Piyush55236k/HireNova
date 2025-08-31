# HireNova - Job Portal Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Your Supabase credentials

### Step 1: Prepare Repository
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel
1. **Visit [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your repository**: `HireNova`
4. **Configure environment variables**:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
5. **Click "Deploy"**

### Step 3: Environment Variables Setup
In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Custom Domain (Optional)
1. **In Vercel dashboard**: Go to **Settings** → **Domains**
2. **Add your custom domain**: `yourjobportal.com`
3. **Configure DNS** as instructed by Vercel

---

## 🛠️ Alternative: Deploy to Netlify

### Step 1: Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 2: Environment Variables
Add the same Supabase variables in Netlify dashboard.

---

## 📋 Pre-Deployment Checklist

✅ **Database Setup**: Run `production-setup.sql` in Supabase  
✅ **Environment Variables**: Added to deployment platform  
✅ **Build Test**: Run `npm run build` locally to test  
✅ **Repository**: All code committed and pushed  
✅ **Domain**: Configure custom domain if needed  

---

## 🔧 Post-Deployment Steps

### 1. Update Supabase Auth URLs
In your Supabase dashboard:
1. Go to **Authentication** → **Settings**
2. **Add production URLs**:
   - Site URL: `https://your-deployed-app.vercel.app`
   - Redirect URLs: `https://your-deployed-app.vercel.app/**`

### 2. Test Production App
- ✅ Landing page loads
- ✅ Navigation works
- ✅ Job listings display
- ✅ Forms submit properly
- ✅ All test features work

### 3. Performance Optimization
- Enable Vercel Analytics
- Configure caching headers
- Monitor Core Web Vitals

---

## 🌍 Production URLs

After deployment, your job portal will be available at:
- **Vercel**: `https://hire-nova-xyz.vercel.app`
- **Custom Domain**: `https://yourjobportal.com`

---

## 📞 Support

If you encounter any deployment issues:
1. Check Vercel/Netlify build logs
2. Verify environment variables are set
3. Ensure Supabase auth URLs are updated
4. Test locally with `npm run build && npm run preview`

Your job portal is now ready for the world! 🎉
