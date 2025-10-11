import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { supabase, supabaseUrl } from "@/utils/supabase";
import { Input } from "@/components/ui/input";
import { BarLoader } from "react-spinners";

const Account = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) navigate("/");
    setName(user?.raw?.user_metadata?.fullName || user?.raw?.user_metadata?.full_name || user?.raw?.fullName || "");
  }, [isLoaded]);

  if (!isLoaded) return null;

  const handleUploadAndSave = async () => {
    setMsg(null);
    setLoading(true);
    try {
      let avatar_url = user?.raw?.user_metadata?.avatar_url || null;

      if (avatarFile) {
        const originalName = (avatarFile.name || "avatar").replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase().slice(0, 80);
        const fileName = `avatar-${user.id}-${Date.now()}-${originalName}`;

        // Prefer buckets that already exist in your project (company-logo, resumes) to avoid missing-bucket errors.
        const candidateBuckets = ["company-logo", "resumes", "avatars"];
        let uploaded = false;
        let usedBucket = null;

        console.log("Account: starting avatar upload", { fileName, size: avatarFile.size, type: avatarFile.type, userId: user?.id });
        for (const bucket of candidateBuckets) {
          try {
            const result = await supabase.storage.from(bucket).upload(fileName, avatarFile, { upsert: true });
            console.log("Account: upload result for bucket", bucket, result);

            // supabase-js returns { data, error }
            if (!result.error) {
              uploaded = true;
              usedBucket = bucket;
              break;
            }

            const uploadError = result.error;
            const msg = String(uploadError?.message || "").toLowerCase();
            // If error indicates missing bucket, try next candidate; otherwise throw so we can see full details
            if (msg.includes("bucket") || msg.includes("not found") || msg.includes("does not exist")) {
              console.warn("Account: bucket missing or not available, trying next bucket", bucket, uploadError);
              continue;
            }

            // For other errors, throw to be caught by outer catch and displayed
            console.error("Account: upload error (non-bucket) for bucket", bucket, uploadError);
            throw uploadError;
          } catch (exc) {
            // This could be a network/HTTP exception from the client library (contains response)
            console.error("Account: upload exception for bucket", bucket, exc);
            const text = exc?.message || JSON.stringify(exc);
            // if it's clearly a bucket-not-found style message, continue to next bucket
            if (String(text).toLowerCase().includes("bucket") || String(text).toLowerCase().includes("not found") || String(text).toLowerCase().includes("does not exist")) {
              continue;
            }
            throw exc;
          }
        }

        if (!uploaded) {
          throw new Error("No suitable storage bucket available for avatar upload. Create an 'avatars' bucket (public) in Supabase or allow writes to an existing bucket.");
        }

        // build public url using the bucket we successfully uploaded to
        avatar_url = `${supabaseUrl}/storage/v1/object/public/${usedBucket}/${fileName}`;
      }

      // update user metadata
      const { error } = await supabase.auth.updateUser({ data: { fullName: name, avatar_url } });
      if (error) throw error;
      setMsg("Profile updated");
    } catch (err) {
      console.error("Account update error", err);
      setMsg(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-4">Account</h1>
      <div className="mb-4">Email: {user?.email}</div>
      <div className="mb-4">Role: {user?.unsafeMetadata?.role || "not set"}</div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Display name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Profile photo</label>
        <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0])} />
      </div>

      {msg && <div className="mb-4 text-sm text-red-600">{msg}</div>}

      {loading ? (
        <BarLoader width={200} color="#36d7b7" />
      ) : (
        <div className="flex gap-2">
          <Button onClick={handleUploadAndSave}>Save Profile</Button>
          <Button variant="outline" onClick={() => navigate("/onboarding")}>Edit role / Onboarding</Button>
        </div>
      )}
    </div>
  );
};

export default Account;
