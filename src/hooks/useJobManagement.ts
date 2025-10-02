import { useState } from 'react';
import { apiCall } from '@/helper/apiCall';

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