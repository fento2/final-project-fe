import { useState, useEffect } from 'react';
import { Job } from '../types/database';
import { apiCall } from '@/helper/apiCall';

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