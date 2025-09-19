import { useState, useEffect } from 'react';
import { Company, CompanyFilters } from '@/types/database';
import { apiCall } from '@/helper/apiCall';

// Hook untuk manage companies
export const useCompanies = (filters?: CompanyFilters) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const fetchCompanies = async (currentFilters?: CompanyFilters) => {
        try {
            setLoading(true);
            const filterParams = currentFilters || filters || {};
            const params = new URLSearchParams();
            
            if (filterParams.search) params.append("search", filterParams.search);
            if (filterParams.industry) params.append("industry", filterParams.industry);
            if (filterParams.location) params.append("location", filterParams.location);
            if (filterParams.rating) params.append("rating", filterParams.rating.toString());
            if (filterParams.page) params.append("page", filterParams.page.toString());
            if (filterParams.limit) params.append("limit", filterParams.limit.toString());

            const { data } = await apiCall.get(`/company?${params.toString()}`);
            // Handle backend response structure: { success, message, data: { data: [...] } }
            const companiesData = data?.data?.data || data?.data || data?.companies || data || [];
            setCompanies(Array.isArray(companiesData) ? companiesData : []);
            
            // Handle pagination if available
            if (data?.data?.pagination) {
                setPagination(data.data.pagination);
            }
        } catch (err: any) {
            // Silently handle backend connection issues and auth errors
            if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                setCompanies([]);
                setError(null);
            } else {
                console.error('Companies fetch error:', err);
                setError('Failed to fetch companies');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const refetch = (newFilters?: CompanyFilters) => {
        fetchCompanies(newFilters);
    };

    return {
        companies,
        loading,
        error,
        pagination,
        refetch
    };
};

// Hook untuk single company
export const useCompany = (id: string) => {
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                setLoading(true);
                const { data } = await apiCall.get(`/company/${id}`);
                setCompany(data);
            } catch (err) {
                setError('Failed to fetch company');
                console.error('Company fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompany();
        }
    }, [id]);

    return { company, loading, error };
};

// Hook untuk top companies
export const useTopCompanies = (limit = 10) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopCompanies = async () => {
            try {
                setLoading(true);
                
                try {
                    // Use the documented endpoint with limit parameter
                    const { data } = await apiCall.get(`/company/top/with-stats?limit=${limit}`);
                    console.log('📊 /company/top/with-stats API response:', {
                        status: 'success',
                        limit: limit,
                        dataStructure: data ? Object.keys(data) : 'no data',
                        companiesCount: data?.data?.length || data?.length || 0,
                        fullResponse: data
                    });
                    
                    // Handle different response formats
                    const companiesData = data?.data || data?.companies || data || [];
                    const topCompanies = Array.isArray(companiesData) ? companiesData.slice(0, limit) : [];
                    
                    console.log('✅ Successfully fetched companies with stats:', {
                        companiesProcessed: topCompanies.length,
                        sampleCompany: topCompanies[0] ? {
                            name: topCompanies[0].name,
                            hasJobStats: !!topCompanies[0].jobStats,
                            hasTeamStats: !!topCompanies[0].teamStats,
                            hasEngagementStats: !!topCompanies[0].engagementStats
                        } : null
                    });
                    
                    setCompanies(topCompanies);
                    setError(null);
                    
                } catch (statsErr: any) {
                    console.log('❌ /company/top/with-stats failed:', {
                        status: statsErr.response?.status,
                        message: statsErr.message,
                        attempting: 'fallback endpoints'
                    });
                    
                    // Fallback to previous endpoints if the new one fails
                    try {
                        // Fallback 1: /company/top with statistics query params
                        const { data } = await apiCall.get(`/company/top?limit=${limit}&include=stats,jobs,reviews`);
                        console.log('📊 Company/top fallback response:', data);
                        const companiesData = data?.data?.data || data?.data || data?.companies || data || [];
                        setCompanies(Array.isArray(companiesData) ? companiesData.slice(0, limit) : []);
                        setError(null);
                        
                    } catch (topErr: any) {
                        console.log('❌ /company/top failed, trying basic company endpoint...');
                        
                        try {
                            // Fallback 2: Regular company endpoint
                            const { data } = await apiCall.get(`/company?limit=${limit}`);
                            console.log('📊 Basic Company API response:', data);
                            const companiesData = data?.data?.data || data?.data || data?.companies || data || [];
                            setCompanies(Array.isArray(companiesData) ? companiesData.slice(0, limit) : []);
                            setError(null);
                            
                        } catch (basicErr: any) {
                            throw basicErr; // Let the outer catch handle this
                        }
                    }
                }
                
            } catch (err: any) {
                console.error('❌ All endpoints failed:', {
                    error: err.message,
                    status: err.response?.status,
                    code: err.code
                });
                
                // Handle different types of errors
                if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                    // Network error - hide section
                    setCompanies([]);
                    setError(null);
                } else if (err.response?.status === 404) {
                    // Route not found - hide section gracefully
                    console.warn('Companies endpoints not found, hiding section');
                    setCompanies([]);
                    setError(null);
                } else {
                    // Other errors - show error message
                    setError(err.response?.data?.message || err.message || 'Failed to fetch top companies');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTopCompanies();
    }, [limit]);

    return { companies, loading, error };
};

// Hook untuk company management (create/update)
export const useCompanyManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNewCompany = async (companyData: {
        name: string;
        email: string;
        phone?: string;
        description?: string;
        website?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.post('/company', companyData);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create company';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateExistingCompany = async (id: string, companyData: any) => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await apiCall.put(`/company/${id}`, companyData);
            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update company';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        createCompany: createNewCompany,
        updateCompany: updateExistingCompany,
        loading,
        error
    };
};
