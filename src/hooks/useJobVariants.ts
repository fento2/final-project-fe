import { useState, useEffect } from 'react';
import { Job } from '../types/database';
import { apiCall } from '@/helper/apiCall';

// Hook untuk featured jobs
export const useFeaturedJobs = (limit = 6) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                setLoading(true);
                // Use /postings endpoint with limit and sort by created_at
                const { data } = await apiCall.get(`/postings?limit=${limit}&sort=created_at&order=desc`);

                // Handle backend response structure: { success, message, data: { data: [...] } }
                const jobsData = data?.data?.data || data?.data || data || [];
                const featuredJobs = Array.isArray(jobsData) ? jobsData.slice(0, limit).map((job: any) => {
                    // Normalize relation naming: Companies -> Company
                    const normalized = { ...job };
                    if (!normalized.Company && normalized.Companies) {
                        normalized.Company = normalized.Companies;
                    }
                    return normalized;
                }) : [];

                setJobs(featuredJobs);
            } catch (err: any) {
                // Silently handle backend connection issues and auth errors
                if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                    setJobs([]);
                    setError(null);
                } else {

                    setError('Failed to fetch featured jobs');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedJobs();
    }, [limit]);

    return { jobs, loading, error };
};

// Hook untuk jobs by company
export const useJobsByCompany = (companyId: string) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobsByCompany = async () => {
            try {
                setLoading(true);
                const { data } = await apiCall.get(`/postings/company/${companyId}`);
                setJobs(data);
            } catch (err) {
                setError('Failed to fetch company jobs');

            } finally {
                setLoading(false);
            }
        };

        if (companyId) {
            fetchJobsByCompany();
        }
    }, [companyId]);

    return { jobs, loading, error };
};