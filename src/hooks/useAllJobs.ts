import { useState, useEffect } from 'react';
import { Job, JobFilters } from '../types/database';
import { apiCall } from '@/helper/apiCall';

// Hook to fetch and aggregate all jobs across pages
export const useAllJobs = (baseFilters?: JobFilters, maxPages?: number) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: baseFilters?.limit || 10,
        total: 0,
        totalPages: 0
    });

    // Helper to fetch one page with fallback and normalization
    const fetchJobsPage = async (filters: JobFilters) => {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.location) params.append("location", filters.location);
        if (filters.jobType) params.append("jobType", filters.jobType);
        if (filters.salaryMin) params.append("salaryMin", filters.salaryMin.toString());
        if (filters.salaryMax) params.append("salaryMax", filters.salaryMax.toString());
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());

        const response = await apiCall.get(`/postings?${params.toString()}`);
        const data = response.data;

        const jobsData = data?.data?.data || data?.data || data || [];
        const normalizedJobs = Array.isArray(jobsData)
            ? jobsData.map((job: any) => {
                const normalized = { ...job };
                if (!normalized.Company && normalized.Companies) {
                    normalized.Company = normalized.Companies;
                }
                return normalized;
            })
            : [];

        const pg = data?.data?.pagination || null;
        return { jobs: normalizedJobs as Job[], pagination: pg };
    };

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const firstFilters: JobFilters = {
                    ...(baseFilters || {}),
                    page: baseFilters?.page || 1,
                };
                const limit = baseFilters?.limit || 10;
                firstFilters.limit = limit;

                const first = await fetchJobsPage(firstFilters);
                const all: Job[] = [...first.jobs];

                const totalPages = first.pagination?.totalPages || 1;
                const pagesToFetch = Math.min(maxPages || totalPages, totalPages);

                if (pagesToFetch > 1) {
                    const promises: Promise<{ jobs: Job[] }>[] = [];
                    for (let p = 2; p <= pagesToFetch; p++) {
                        promises.push(fetchJobsPage({ ...(baseFilters || {}), page: p, limit }));
                    }

                    const results = await Promise.all(promises);
                    results.forEach(res => {
                        all.push(...res.jobs);
                    });
                }

                // Deduplicate by slug/job_id/id
                const seen = new Set<string>();
                const deduped = all.filter((j: any) => {
                    const key = String(j.slug || j.job_id || j.id);
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });

                setJobs(deduped);
                if (first.pagination) {
                    setPagination({ ...first.pagination, limit });
                } else {
                    setPagination({ page: 1, limit, total: deduped.length, totalPages: 1 });
                }
            } catch (err: any) {
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

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(baseFilters), maxPages]);

    return { jobs, loading, error, pagination };
};