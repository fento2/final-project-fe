import { useState, useEffect } from 'react';
import { Job, JobFilters, Application } from '@/types/database';
import { apiCall } from '@/helper/apiCall';

// Hook untuk manage jobs/postings
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

            // Try both /jobs and /postings endpoints
            let data;
            try {
                const response = await apiCall.get(`/jobs?${params.toString()}`);
                data = response.data;
            } catch (jobsError) {
                // Fallback to postings endpoint
                const response = await apiCall.get(`/postings?${params.toString()}`);
                data = response.data;
            }

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
                console.error('Jobs fetch error:', err);
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

// Hook untuk single job
export const useJob = (id: string) => {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const { data } = await apiCall.get(`/postings/${id}`);
                setJob(data);
            } catch (err) {
                setError('Failed to fetch job');
                console.error('Job fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id]);

    return { job, loading, error };
};

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
                console.log('🔍 Fetching job with slug:', slug);
                
                // If backend requires auth for individual jobs, try to find the job from the general listing first
                let job = null;
                
                try {
                    console.log('🌐 Fetching all jobs to find job by slug');
                    const { data: allJobsData } = await apiCall.get('/postings');
                    console.log('✅ Got jobs list:', allJobsData);
                    
                    // Handle backend response structure: { success, message, data: { data: [...] } }
                    const jobsArray = allJobsData?.data?.data || allJobsData?.data || allJobsData || [];
                    console.log('📦 Jobs array:', jobsArray);
                    
                    if (Array.isArray(jobsArray)) {
                        // Find job by slug in the array
                        job = jobsArray.find((j: any) => j.slug === slug || j.job_id?.toString() === slug);
                        console.log('🔍 Found job in listing:', job);
                    }
                } catch (listError: any) {
                    console.log('❌ Failed to get jobs list:', listError.response?.status, listError.message);
                }
                
                // If not found in listing, try direct endpoints (they might work with cookies/session)
                if (!job) {
                    try {
                        console.log('🌐 Trying /postings/slug/${slug}');
                        const response = await apiCall.get(`/postings/slug/${slug}`);
                        const data = response.data;
                        console.log('✅ Success with /postings/slug:', data);
                        job = data?.data?.data ?? data?.data ?? data;
                    } catch (slugError: any) {
                        console.log('❌ /postings/slug failed:', slugError.response?.status, slugError.message);
                        
                        try {
                            console.log('🌐 Trying /postings/${slug} (as ID)');
                            const response = await apiCall.get(`/postings/${slug}`);
                            const data = response.data;
                            console.log('✅ Success with /postings as ID:', data);
                            job = data?.data?.data ?? data?.data ?? data;
                        } catch (idError: any) {
                            console.log('❌ All direct endpoints failed');
                            // Don't throw here, we'll check if we found job from listing below
                        }
                    }
                }
                
                if (!job) {
                    console.log('❌ No job data found');
                    setJob(null);
                    setError('Job not found. You may need to be logged in to view job details.');
                    return;
                }
                
                // Normalize relation naming: Companies -> Company
                const normalized: any = { ...job };
                if (!normalized.Company && normalized.Companies) {
                    normalized.Company = normalized.Companies;
                    console.log('🔄 Normalized Companies -> Company');
                }
                console.log('✅ Final normalized job:', normalized);
                setJob(normalized as Job);
            } catch (err: any) {
                console.error('💥 Final error:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch job';
                setError(errorMessage);
                console.error('Job by slug fetch error:', errorMessage);
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

// Hook untuk featured jobs
export const useFeaturedJobs = (limit = 6) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                setLoading(true);
                // Use regular postings endpoint with limit and sort by created_at
                const { data } = await apiCall.get(`/postings?limit=${limit}&sort=created_at&order=desc`);
                
                // Handle backend response structure: { success, message, data: { data: [...] } }
                const jobsData = data?.data?.data || data?.data || data || [];
                const featuredJobs = Array.isArray(jobsData) ? jobsData.slice(0, limit) : [];
                
                setJobs(featuredJobs);
            } catch (err: any) {
                // Silently handle backend connection issues and auth errors
                if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                    setJobs([]);
                    setError(null);
                } else {
                    console.error('Featured jobs fetch error:', err);
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
                console.error('Company jobs fetch error:', err);
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

// Hook untuk job management (create/update/delete)
export const useJobManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNewJob = async (jobData: {
        title: string;
        description: string;
        category: string;
        location: string;
        latitude: string;
        longitude: string;
        salary: number;
        periodSalary: string;
        currency: string;
        job_type: string;
        expiredAt: string;
        skills: string[];
        preselection_test?: boolean;
    }) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post('/postings', jobData);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create job';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateExistingJob = async (id: string, jobData: any) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.put(`/postings/${id}`, jobData);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update job';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingJob = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.delete(`/postings/${id}`);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete job';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        createJob: createNewJob,
        updateJob: updateExistingJob,
        deleteJob: deleteExistingJob,
        loading,
        error
    };
};

// Hook untuk job saves
export const useSavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const { data } = await apiCall.get('/job-saves');
            setSavedJobs(data);
        } catch (err) {
            setError('Failed to fetch saved jobs');
            console.error('Saved jobs fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveJob = async (jobId: number) => {
        try {
            const { data } = await apiCall.post('/job-saves', { job_id: jobId });
            await fetchSavedJobs(); // Refresh saved jobs list
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to save job';
            return { success: false, error: errorMessage };
        }
    };

    const unsaveJob = async (jobId: number) => {
        try {
            const { data } = await apiCall.delete(`/job-saves/${jobId}`);
            await fetchSavedJobs(); // Refresh saved jobs list
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to unsave job';
            return { success: false, error: errorMessage };
        }
    };

    const checkJobSaved = async (jobId: number) => {
        try {
            const { data } = await apiCall.get(`/job-saves/check/${jobId}`);
            return data.isSaved;
        } catch (err) {
            console.error('Check job saved error:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    return {
        savedJobs,
        loading,
        error,
        saveJob,
        unsaveJob,
        checkJobSaved,
        refetch: fetchSavedJobs
    };
};

// Hook untuk job applications
export const useJobApplications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMyApplications = async () => {
        try {
            setLoading(true);
            const { data } = await apiCall.get('/applications/my');
            setApplications(data);
        } catch (err) {
            setError('Failed to fetch applications');
            console.error('Applications fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyForJob = async (applicationData: {
        job_id: number;
        expected_salary: number;
        cv: string;
    }) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post('/applications', applicationData);
            await fetchMyApplications(); // Refresh applications list
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to apply for job';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const getApplicationDetail = async (id: string) => {
        try {
            const { data } = await apiCall.get(`/applications/${id}`);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to get application detail';
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchMyApplications();
    }, []);

    return {
        applications,
        loading,
        error,
        applyForJob,
        getApplicationDetail,
        refetch: fetchMyApplications
    };
};

// Hook untuk company applications (for companies to manage applications)
export const useCompanyApplications = (jobId?: string) => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanyApplications = async (currentJobId?: string) => {
        try {
            setLoading(true);
            const url = currentJobId ? `/applications/company?jobId=${currentJobId}` : "/applications/company";
            const { data } = await apiCall.get(url);
            setApplications(data);
        } catch (err) {
            setError('Failed to fetch company applications');
            console.error('Company applications fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (id: string, status: string) => {
        try {
            const { data } = await apiCall.put(`/applications/${id}/status`, { status });
            await fetchCompanyApplications(jobId); // Refresh applications list
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update application status';
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchCompanyApplications(jobId);
    }, [jobId]);

    return {
        applications,
        loading,
        error,
        updateApplicationStatus,
        refetch: () => fetchCompanyApplications(jobId)
    };
};