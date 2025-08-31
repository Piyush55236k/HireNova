import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { UserProvider } from "./components/UserProvider";
import AppLayout from "./layouts/app-layout";
import ProtectedRoute from "./components/protected-route";
import { ThemeProvider } from "./components/theme-provider";
import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import PostJob from "./pages/post-job";
import JobListing from "./pages/jobListing";
import MyJobs from "./pages/my-jobs";
import SavedJobs from "./pages/saved-jobs";
import JobPage from "./pages/job";
import AuthPage from "./pages/auth";
import SimpleAuth from "./pages/auth-test";
import TestJobs from "./pages/jobs-test";
import TestPostJob from "./pages/post-job-test";
import TestOnboarding from "./pages/onboarding-test";
import TestMyJobs from "./pages/my-jobs-test";
import TestSavedJobs from "./pages/saved-jobs-test";
import UserProfile from "./pages/user-profile";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <SimpleAuth />,
      },
      {
        path: "/auth-real",
        element: <AuthPage />,
      },
      {
        path: "/onboarding",
        element: <TestOnboarding />,
      },
      {
        path: "/jobs",
        element: <TestJobs />,
      },
      {
        path: "/jobs-real",
        element: <JobListing />,
      },
      {
        path: "/post-job",
        element: <TestPostJob />,
      },
      {
        path: "/post-job-real",
        element: <PostJob />,
      },
      {
        path: "/my-jobs",
        element: <TestMyJobs />,
      },
      {
        path: "/saved-jobs",
        element: <TestSavedJobs />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/job/:id",
        element: <JobPage />,
      },
  // ...existing code...
     
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
