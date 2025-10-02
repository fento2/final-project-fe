import { useState, useEffect } from 'react';
import { Job as BackendJob } from "@/types/database";
import { apiCall } from "@/helper/apiCall";
import { Filters } from "../components/JobsFilterSection";

export const useFilteredJobs = (filters: Filters) => {
    const [rawJobs, setRawJobs] = useState<BackendJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Custom fetch function similar to useFeaturedJobs
    const fetchFilteredJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Build query parameters like in useFeaturedJobs
            const params = new URLSearchParams();
            params.append('limit', '100'); // Get more for better client-side filtering
            params.append('sort', 'created_at');
            params.append('order', 'desc');

            // Map filters to API parameters (similar to feature jobs approach)
            if (filters.categories && filters.categories.length > 0) {
                params.append('category', filters.categories[0]);
            }
            if (filters.location && filters.location.length > 0) {
                params.append('location', filters.location[0]);
            }
            if (filters.types && filters.types.length > 0) {
                params.append('jobType', filters.types[0]);
            }
            if (filters.salaryMin > 0) {
                params.append('salaryMin', filters.salaryMin.toString());
            }
            if (filters.salaryMax < 200000000) {
                params.append('salaryMax', filters.salaryMax.toString());
            }

            // Use same endpoint as featured jobs: /postings
            const { data } = await apiCall.get(`/postings?${params.toString()}`);
            
            // Handle backend response structure same as useFeaturedJobs
            const jobsData = data?.data?.data || data?.data || data || [];
            const jobs = Array.isArray(jobsData) ? jobsData : [];
            
            setRawJobs(jobs);
        } catch (err: any) {
            // Handle errors same way as useFeaturedJobs
            if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                setRawJobs([]);
                setError(null);
            } else {

                setError('Failed to fetch jobs');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch when component mounts or filters change (like useEffect in useFeaturedJobs)
    useEffect(() => {
        fetchFilteredJobs();
    }, [filters]);

    return {
        rawJobs,
        loading,
        error,
        refetch: fetchFilteredJobs
    };
};