import { useState, useEffect } from 'react';
import { Job, Application } from '../types/database';
import { apiCall } from '@/helper/apiCall';

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