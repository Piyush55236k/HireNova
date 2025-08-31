# HireNova 🚀

A modern, professional job portal built with React, Vite, and Supabase. Connect job seekers with recruiters through an intuitive, beautiful interface.

![HireNova](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=400&fit=crop&auto=format)

## ✨ Features

### For Job Seekers
- 🔍 **Browse Jobs** - Explore thousands of job opportunities
- 📝 **Easy Applications** - Apply with one click
- 💾 **Save Jobs** - Bookmark interesting positions
- 📊 **Track Applications** - Monitor your application status
- 👤 **Profile Management** - Create and manage your professional profile

### For Recruiters  
- 📢 **Post Jobs** - Create detailed job postings
- 👥 **Manage Applications** - Review and manage candidates
- 🏢 **Company Profiles** - Showcase your company
- 📈 **Job Analytics** - Track job performance and applications
- ⚙️ **Job Management** - Update job status (Open/Closed/Filled)

### Platform Features
- 🎨 **Modern UI** - Clean, professional design with dark theme
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Loading** - Optimized for performance
- 🌐 **SEO Friendly** - Better search engine visibility

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Supabase (Database, Auth, Storage)
- **UI Components**: Radix UI, Lucide Icons
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git installed

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Piyush55236k/HireNova.git
   cd HireNova
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up database**
   - Go to your Supabase dashboard
   - Run the SQL script from `production-setup.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5176` to see your job portal in action! 🎉

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPiyush55236k%2FHireNova&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY)

1. Click the deploy button above
2. Connect your GitHub account
3. Add your Supabase environment variables
4. Deploy! 🚀

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎨 Screenshots

### Landing Page
Clean, professional landing page with clear call-to-actions.

### Job Listings
Browse jobs with advanced search and filtering options.

### Application Management
Track and manage job applications with ease.

### Recruiter Dashboard
Comprehensive tools for managing job posts and applications.

## 📋 Project Structure

```
HireNova/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── api/                # API functions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── public/                 # Static assets
├── production-setup.sql    # Database setup script
└── README.md              # You are here!
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need support:

- 📧 Email: support@hirenova.com
- 💬 GitHub Issues: [Create an issue](https://github.com/Piyush55236k/HireNova/issues)
- 📖 Documentation: [Visit our docs](https://hirenova.vercel.app/docs)

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with ❤️ by [Piyush Pandey](https://github.com/Piyush55236k)**

*Making job searching and recruiting easier, one connection at a time.*
