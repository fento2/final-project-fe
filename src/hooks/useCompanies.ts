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
                // Use regular company endpoint with limit and sort by rating or created_at
                const { data } = await apiCall.get(`/company?limit=${limit}&sort=created_at&order=desc`);
                
                // Handle different response formats
                const companiesData = data.companies || data.data || data;
                const topCompanies = Array.isArray(companiesData) ? companiesData.slice(0, limit) : [];
                
                setCompanies(topCompanies);
            } catch (err: any) {
                // Silently handle backend connection issues and auth errors
                if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                    setCompanies([]);
                    setError(null);
                } else {
                    console.error('Top companies fetch error:', err);
                    setError('Failed to fetch top companies');
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
