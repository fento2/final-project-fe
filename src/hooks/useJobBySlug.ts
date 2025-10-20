import { useState, useEffect } from "react";
import { Job } from "../types/database";
import { apiCall } from "@/helper/apiCall";
import { fetchJobPublic } from "@/helper/publicApiCall";

// Hook untuk job by slug
export const useJobBySlug = (slug: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobBySlug = async () => {
      try {
        setLoading(true);
        setError(null);

        let foundJob = null;

        // First try authenticated endpoint for logged-in users
        try {
          const { data } = await apiCall.get(`/postings/get-detail/${slug}`);
          const jobsData = data?.data?.data || data?.data || data || [];
          foundJob = jobsData;
        } catch (authErr: any) {
          // If authenticated fails, try public endpoint
          try {
            const result = await fetchJobPublic(slug);
            foundJob = result?.data || result;
          } catch (publicErr: any) {
            throw publicErr;
          }
        }

        if (foundJob) {
          // Normalize the job data structure
          const normalizedJob = { ...foundJob };
          if (!normalizedJob.Company && normalizedJob.Companies) {
            normalizedJob.Company = normalizedJob.Companies;
          }
          setJob(normalizedJob);
        } else {
          setError("Job not found");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Job not found");
        } else if (err.response?.status === 401) {
          setError("Authentication required");
        } else {
          setError("Failed to fetch job");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchJobBySlug();
    }
  }, [slug]);

  return { job, loading, error };
};
