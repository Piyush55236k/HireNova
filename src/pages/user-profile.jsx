import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { useSupabaseUser } from "../hooks/useSupabaseUser";
import { supabase } from "../utils/supabase";
import useFetch from "../hooks/use-fetch";
import { getUserProfile, updateUserProfile, checkUsernameAvailability } from "../api/apiProfiles";

const schema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username must be less than 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  full_name: z.string().min(1, { message: "Full name is required" }),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  location: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  experience_level: z.enum(["entry", "mid", "senior", "lead", "executive"]).optional(),
  role: z.enum(["candidate", "recruiter"]),
});

const UserProfile = () => {
  const { user, isLoaded } = useSupabaseUser();
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "candidate"
    }
  });

  // Fetch user profile
  const {
    loading: loadingProfile,
    data: profile,
    fn: fnGetProfile,
  } = useFetch(getUserProfile);

  // Update profile
  const {
    loading: loadingUpdate,
    error: updateError,
    fn: fnUpdateProfile,
  } = useFetch(updateUserProfile);

  const watchedUsername = watch("username");

  // Load profile when user is ready
  useEffect(() => {
    if (isLoaded && user?.id) {
      fnGetProfile({ user_id: user.id });
    }
  }, [isLoaded, user?.id]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      Object.keys(profile).forEach((key) => {
        if (profile[key] !== null && profile[key] !== undefined) {
          setValue(key, profile[key]);
        }
      });
    } else if (isLoaded && user) {
      // Set default values from user metadata
      setValue("full_name", user.user_metadata?.full_name || "");
      setValue("role", user.user_metadata?.role || "candidate");
    }
  }, [profile, user, isLoaded, setValue]);

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (watchedUsername && watchedUsername.length >= 3 && watchedUsername !== profile?.username) {
        setIsCheckingUsername(true);
        const isAvailable = await checkUsernameAvailability(watchedUsername, user?.id);
        if (!isAvailable) {
          setUsernameError("Username is already taken");
        } else {
          setUsernameError("");
        }
        setIsCheckingUsername(false);
      } else {
        setUsernameError("");
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedUsername, profile?.username, user?.id]);

  const onSubmit = async (data) => {
    if (usernameError) {
      return;
    }

    try {
      await fnUpdateProfile({
        id: user.id,
        ...data,
      });
      
      // Update user metadata for role if changed
      if (data.role !== user.user_metadata?.role) {
        const { error } = await supabase.auth.updateUser({
          data: { role: data.role }
        });
        if (error) throw error;
      }
      
      navigate("/jobs");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  if (!isLoaded || loadingProfile) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {profile ? "Edit Profile" : "Complete Your Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="Choose a unique username"
              />
              {isCheckingUsername && <p className="text-sm text-gray-500">Checking availability...</p>}
              {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                {...register("full_name")}
                placeholder="Your full name"
              />
              {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">I am a *</Label>
              <Select
                value={watch("role")}
                onValueChange={(value) => setValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Job Seeker</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                placeholder="Tell us about yourself..."
                rows={3}
              />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="https://yourwebsite.com"
                />
                {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
              </div>
            </div>

            {/* Location and Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="Current company"
                />
              </div>
            </div>

            {/* Job Title and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  {...register("job_title")}
                  placeholder="Your current role"
                />
              </div>
              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  value={watch("experience_level")}
                  onValueChange={(value) => setValue("experience_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Manager</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Display */}
            {updateError?.message && (
              <p className="text-red-500 text-sm">{updateError.message}</p>
            )}

            {/* Loading and Submit */}
            {loadingUpdate && <BarLoader width={"100%"} color="#36d7b7" />}
            
            <div className="flex gap-4">
              <Button 
                type="submit" 
                variant="blue" 
                disabled={loadingUpdate || isCheckingUsername || usernameError}
                className="flex-1"
              >
                {profile ? "Update Profile" : "Save Profile"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
