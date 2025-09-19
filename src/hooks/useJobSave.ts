import { useState, useEffect } from 'react';
import { apiCall } from '@/helper/apiCall';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

interface UseJobSaveReturn {
  isSaved: boolean;
  isLoading: boolean;
  toggleSave: () => Promise<void>;
  checkSaveStatus: () => Promise<void>;
}

export const useJobSave = (jobId: string | number): UseJobSaveReturn => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Check if job is saved when component mounts or jobId changes
  useEffect(() => {
    // Wait for auth check to finish to avoid flicker, then attempt check.
    // Server will return 401 if not logged in, which we handle gracefully.
    if (!authLoading && jobId) {
      checkSaveStatus();
    }
  }, [jobId, authLoading]);

  const checkSaveStatus = async (): Promise<void> => {
    if (!jobId) return;

    try {
      const { data } = await apiCall.get(`/job-saves/check/${jobId}`);
      // Backend returns { success, message, data: { isSaved: boolean } }
      const saved = (data && (data.data?.isSaved ?? data.isSaved)) ?? false;
      setIsSaved(!!saved);
    } catch (error: any) {
      // If unauthorized, just leave isSaved as false without spamming console
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setIsSaved(false);
        return;
      }
      console.error('Error checking save status:', error);
      setIsSaved(false);
    }
  };

  const toggleSave = async (): Promise<void> => {
    if (!jobId) {
      console.error('Job ID is required');
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        // Unsave the job
        await apiCall.delete(`/job-saves/${jobId}`);
        setIsSaved(false);
      } else {
        // Save the job
        await apiCall.post('/job-saves', { job_id: Number(jobId) });
        setIsSaved(true);
      }
      // Optionally re-check to sync with server state
      // await checkSaveStatus();
    } catch (error: any) {
      console.error('Error toggling save status:', error);
      // You can add error handling/toast notification here
      const errorMessage = error.response?.data?.message || 'Failed to update save status';
      console.error(errorMessage);
      // If unauthorized, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        try {
          router.push('/login');
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSaved,
    isLoading,
    toggleSave,
    checkSaveStatus,
  };
};

export default useJobSave;