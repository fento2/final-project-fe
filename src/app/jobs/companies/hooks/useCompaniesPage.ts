import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { filterCompanies, sortCompanies, getUniqueValues, type Company } from "../../../../helper/companyHelpers";
import { useCompanies } from "../../../../hooks/useCompanies";
import { Company as DatabaseCompany } from "../../../../types/database";

interface CompanyFilters {
    activity: string[];
    industry: string[];
    languages: string[];
    location: string[];
    tools: string[];
}

export function useCompaniesPage() {
    const router = useRouter();
    
    // Fetch companies from backend
    const { companies: backendCompanies, loading: backendLoading, error: backendError } = useCompanies();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedFilters, setSelectedFilters] = useState<CompanyFilters>({
        activity: [],
        industry: [],
        languages: [],
        location: [],
        tools: []
    });
    const [salaryRange, setSalaryRange] = useState([1000, 10000]);
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('name');
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    const itemsPerPage = 9;

    // Transform backend companies to frontend format
    const companies = useMemo((): Company[] => {
        if (!Array.isArray(backendCompanies)) {
            return [];
        }
        return backendCompanies.map((company: DatabaseCompany) => ({
            id: company.company_id,
            name: company.name,
            logo: company.profile_picture || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center",
            employees: Math.floor(Math.random() * 2000) + 50, // Mock data since not in DB
            salary: "50,000 - 120,000 per year", // Mock data
            location: "Remote", // Mock data since not detailed in DB
            jobsOpen: Math.floor(Math.random() * 30) + 1, // Mock data
            rating: Math.floor(Math.random() * 2) + 4, // Mock 4-5 stars
            industry: "Technology", // Mock data
            founded: 2010 + Math.floor(Math.random() * 13), // Mock 2010-2023
            description: company.description || "A leading company in their industry",
            benefits: ["Health Insurance", "Remote Work", "Professional Development"], // Mock data
            growth: Math.floor(Math.random() * 30) + 5, // Mock 5-35%
            verified: true
        }));
    }, [backendCompanies]);

    // Filter and search functionality using helper functions
    const filteredCompanies = useMemo(() => {
        return sortCompanies(
            filterCompanies(companies, searchTerm, selectedIndustry, selectedLocation, "", 0),
            sortBy
        );
    }, [companies, searchTerm, selectedIndustry, selectedLocation, sortBy]);

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const currentCompanies = filteredCompanies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const uniqueIndustries = getUniqueValues(companies, 'industry');
    const uniqueLocations = getUniqueValues(companies, 'location');

    const handleSearch = () => {
        setIsLoading(true);
        setPage(1);
        setTimeout(() => setIsLoading(false), 800);
    };

    const handleFilterChange = (category: keyof CompanyFilters, value: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter((item: string) => item !== value)
                : [...prev[category], value]
        }));
        setPage(1);
    };

    const clearFilters = () => {
        setSelectedFilters({
            activity: [], industry: [], languages: [], location: [], tools: []
        });
        setSearchTerm("");
        setSelectedIndustry("");
        setSelectedLocation("");
        setSalaryRange([1000, 10000]);
    };

    const handleViewJobs = (companyId: number) => {
        // Navigate to jobs page filtered by company
        router.push(`/jobs?company=${companyId}`);
    };

    const handleViewProfile = (companyId: number) => {
        // This function is now unused since we use Link directly in components
        // But keeping it for backward compatibility
        const company = companies.find(c => c.id === companyId);
        if (company) {
            const slug = company.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            router.push(`/jobs/companies/${slug}`);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [selectedIndustry, selectedLocation]);

    return {
        // State
        searchTerm,
        selectedIndustry,
        selectedLocation,
        selectedFilters,
        salaryRange,
        page,
        viewMode,
        sortBy,
        isLoading: isLoading || backendLoading,
        showFilters,
        
        // Computed values
        filteredCompanies,
        currentCompanies,
        totalPages,
        uniqueIndustries,
        uniqueLocations,
        
        // Backend data
        backendError,
        
        // Actions
        setSearchTerm,
        setSelectedIndustry,
        setSelectedLocation,
        setPage,
        setViewMode,
        setSortBy,
        setShowFilters,
        handleSearch,
        handleFilterChange,
        clearFilters,
        handleViewJobs,
        handleViewProfile,
    };
}
