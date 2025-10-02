import { useState, useEffect } from 'react';
import { Job, JobFilters } from '../types/database';
import { apiCall } from '@/helper/apiCall';

// Basic hook untuk manage jobs/postings
export const useJobs = (filters?: JobFilters) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const fetchJobs = async (currentFilters?: JobFilters) => {
        try {
            setLoading(true);
            const filterParams = currentFilters || filters || {};
            const params = new URLSearchParams();

            if (filterParams.search) params.append("search", filterParams.search);
            if (filterParams.category) params.append("category", filterParams.category);
            if (filterParams.location) params.append("location", filterParams.location);
            if (filterParams.jobType) params.append("jobType", filterParams.jobType);
            if (filterParams.salaryMin) params.append("salaryMin", filterParams.salaryMin.toString());
            if (filterParams.salaryMax) params.append("salaryMax", filterParams.salaryMax.toString());
            if (filterParams.page) params.append("page", filterParams.page.toString());
            if (filterParams.limit) params.append("limit", filterParams.limit.toString());

            // Use /postings endpoint only
            const response = await apiCall.get(`/postings?${params.toString()}`);
            const data = response.data;

            // Handle backend response structure: { success, message, data: { data: [...] } }
            const jobsData = data?.data?.data || data?.data || data || [];
            const normalizedJobs = Array.isArray(jobsData) ? jobsData.map((job: any) => {
                // Normalize relation naming: Companies -> Company
                const normalized = { ...job };
                if (!normalized.Company && normalized.Companies) {
                    normalized.Company = normalized.Companies;
                }
                return normalized;
            }) : [];

            setJobs(normalizedJobs);

            // Handle pagination if available
            if (data?.data?.pagination) {
                setPagination(data.data.pagination);
            }
        } catch (err: any) {
            // Silently handle backend connection issues and auth errors
            if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                setJobs([]);
                setError(null);
            } else {

                setError('Failed to fetch jobs');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const refetch = (newFilters?: JobFilters) => {
        fetchJobs(newFilters);
    };

    return {
        jobs,
        loading,
        error,
        pagination,
        refetch
    };
};