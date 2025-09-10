import { useState, useEffect } from 'react';
import { User, LoginForm, RegisterForm, ProfileForm } from '@/types/database';
import { apiCall } from '@/helper/apiCall';

// Hook untuk authentication
export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await apiCall.get('/account/profile');
                setUser(data);
            } catch (err) {
                console.log('User not authenticated');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginForm) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post('/auth/login', credentials);
            setUser(data.user);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterForm) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post('/auth/register', {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: userData.role
            });

            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiCall.post('/auth/logout');
            setUser(null);
            return { success: true };
        } catch (err) {
            console.error('Logout error:', err);
            // Force logout even if API call fails
            setUser(null);
            return { success: true };
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post('/auth/forgot-password', { email });
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to send reset email';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token: string, newPassword: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post(`/auth/reset-password/${token}`, { password: newPassword });
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to reset password';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (token: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post(`/auth/verify-email/${token}`);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Email verification failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async (googleToken: string) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post('/auth/google', { token: googleToken });
            setUser(data.user);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Google login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = !!user;
    const isUser = user?.role === 'USER';
    const isCompany = user?.role === 'COMPANY';
    const isDeveloper = user?.role === 'DEVELOPER';

    return {
        user,
        loading,
        error,
        isAuthenticated,
        isUser,
        isCompany,
        isDeveloper,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        googleLogin
    };
};

// Hook untuk user profile management
export const useProfile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await apiCall.get('/account/profile');
            setProfile(data);
        } catch (err) {
            setError('Failed to fetch profile');
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData: ProfileForm) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.put('/account/profile', profileData);
            setProfile(data);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        updateProfile,
        refetch: fetchProfile
    };
};
