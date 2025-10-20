import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/apiCall";
import { useAuthStore } from "@/lib/zustand/authStore";
import { SavedJob } from "../types/savedJobTypes";

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role, checkLogin, isLogin } = useAuthStore();
  const router = useRouter();

  // Normalize response from backend
  const normalize = (raw: any): SavedJob[] => {
    const arr = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
      ? raw
      : [];
    return arr.map((item: any) => ({
      id: item.job_save_id || item.id,
      job_id: item.job_id || item.Jobs?.job_id,
      createdAt: item.createdAt,
      Job: {
        job_id: item.Jobs?.job_id || item.job_id,
        title: item.Jobs?.title || item.title,
        slug: item.Jobs?.slug || item.slug,
        description: item.Jobs?.description || item.description,
        category: item.Jobs?.category || item.category,
        location: item.Jobs?.location || item.location,
        salary: item.Jobs?.salary || item.salary,
        periodSalary: item.Jobs?.periodSalary || item.periodSalary || "month",
        currency: item.Jobs?.currency || item.currency || "IDR",
        job_type: item.Jobs?.job_type || item.job_type,
        createdAt: item.Jobs?.createdAt || item.createdAt,
        expiredAt: item.Jobs?.expiredAt || item.expiredAt,
        Company: {
          name:
            item.Jobs?.Companies?.name ||
            item.Companies?.name ||
            item.companyName ||
            "Unknown Company",
          profile_picture:
            item.Jobs?.Companies?.profile_picture ||
            item.Companies?.profile_picture ||
            item.companyLogo,
        },
      },
    }));
  };

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      const { data } = await apiCall.get("/job-saves", {
        params: { page: 1, limit: 10 },
      });

      const normalizedJobs = normalize(data);
      setSavedJobs(normalizedJobs);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (jobId: number) => {
    try {
      await apiCall.delete(`/job-saves/${jobId}`);
      setSavedJobs((prev) =>
        prev.filter((savedJob) => savedJob.Job.job_id !== jobId)
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to remove job from saved list"
      );
    }
  };

  useEffect(() => {
    // Wait for keep-login to finish
    if (checkLogin) return;

    if (!isLogin) {
      router.push("/login");
      return;
    }

    if (role !== "USER") {
      setError("Access denied. This page is only available for job seekers.");
      setLoading(false);
      return;
    }

    fetchSavedJobs();
  }, [isLogin, checkLogin, role, router]);

  return {
    savedJobs,
    loading,
    error,
    unsaveJob,
    refetch: fetchSavedJobs,
  };
};
