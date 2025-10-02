import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiCall } from '@/helper/apiCall';
import { useAuthStore } from '@/lib/zustand/authStore';
import { SavedJob } from '../types/savedJobTypes';

export const useSavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { role, checkLogin, isLogin } = useAuthStore();
    const router = useRouter();

    const normalizeSavedJobs = (raw: any): SavedJob[] => {
        const arr = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        return arr.map((item: any) => ({
            id: item.job_save_id || item.id,
            job_id: item.job_id || item.Job?.job_id,
            createdAt: item.createdAt || item.created_at,
            Job: {
                job_id: item.Job?.job_id || item.Jobs?.job_id,
                title: item.Job?.title || item.Jobs?.title,
                slug: item.Job?.slug || item.Jobs?.slug,
                description: item.Job?.description || item.Jobs?.description,
                category: item.Job?.category || item.Jobs?.category,
                location: item.Job?.location || item.Jobs?.location,
                salary: item.Job?.salary || item.Jobs?.salary,
                periodSalary: item.Job?.periodSalary || item.Jobs?.periodSalary || 'month',
                currency: item.Job?.currency || item.Jobs?.currency || 'IDR',
                job_type: item.Job?.job_type || item.Jobs?.job_type,
                createdAt: item.Job?.createdAt || item.Jobs?.createdAt,
                expiredAt: item.Job?.expiredAt || item.Jobs?.expiredAt,
                Company: {
                    name: item.Job?.Company?.name || item.Jobs?.Companies?.name || item.Job?.Companies?.name,
                    profile_picture: item.Job?.Company?.profile_picture || item.Jobs?.Companies?.profile_picture || item.Job?.Companies?.profile_picture,
                },
            },
        }));
    };

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await apiCall.get('/job-saves', {
                params: { page: 1, limit: 10 },
            });
            
            const normalized = normalizeSavedJobs(data);
            setSavedJobs(normalized);
        } catch (err: any) {
            console.error('Error fetching saved jobs:', err);
            setError(err?.response?.data?.message || 'Failed to load saved jobs');
        } finally {
            setLoading(false);
        }
    };

    const unsaveJob = async (jobId: number) => {
        try {
            await apiCall.delete(`/job-saves/${jobId}`);
            setSavedJobs(prev => prev.filter(job => job.Job.job_id !== jobId));
        } catch (err: any) {
            console.error('Error unsaving job:', err);
            setError(err?.response?.data?.message || 'Failed to unsave job');
        }
    };

    useEffect(() => {
        if (checkLogin) return;

        if (!isLogin) {
            router.push('/login');
            return;
        }

        if (role !== 'USER') {
            setError('Access denied. This page is only available for job seekers.');
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
        refetch: fetchSavedJobs
    };
};