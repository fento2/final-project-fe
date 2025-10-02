import { useState, useEffect } from 'react';
import { apiCall } from '@/helper/apiCall';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/zustand/authStore';

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
  const { role, isLogin } = useAuthStore();
  const router = useRouter();

  // Check if job is saved when component mounts or jobId changes
  useEffect(() => {
    // Wait for auth check to finish to avoid flicker, then attempt check.
    // Server will return 401 if not logged in, which we handle gracefully.
    // Only check for USER role - companies shouldn't save jobs
    if (!authLoading && jobId && isLogin && role === 'USER') {
      checkSaveStatus();
    }
  }, [jobId, authLoading, isLogin, role]);

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

      setIsSaved(false);
    }
  };

  const toggleSave = async (): Promise<void> => {
    if (!jobId) {

      return;
    }

    // Only allow USER role to save jobs
    if (!isLogin || role !== 'USER') {

      if (!isLogin) {
        router.push('/login');
      }
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

      // You can add error handling/toast notification here
      const errorMessage = error.response?.data?.message || 'Failed to update save status';

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