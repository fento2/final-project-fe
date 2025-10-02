import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/lib/zustand/authStore";

export const useUserRole = () => {
    const { user, loading } = useAuth();
    const { role: storeRole, isLogin: storeIsLogin } = useAuthStore();

    const isCompanyUser = (): boolean => {
        // Prefer immediate feedback from client store when available
        if (storeIsLogin && (storeRole || '').toUpperCase() === 'COMPANY') return true;
        // Fallback to API-backed auth hook
        if (loading) return false;
        if (!user) return false;
        return user.role === 'COMPANY';
    };

    return { isCompanyUser, loading };
};