import { useState, useMemo, useEffect } from "react";
import { filterCompanies, sortCompanies, getUniqueValues, type Company } from "../../../../helper/companyHelpers";

interface CompanyFilters {
    activity: string[];
    industry: string[];
    languages: string[];
    location: string[];
    tools: string[];
}

export function useCompaniesPage(companies: Company[]) {
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
        window.open(`/jobs?company=${companyId}`, '_blank');
    };

    const handleViewProfile = (companyId: number) => {
        window.open(`/companies/${companyId}`, '_blank');
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
        isLoading,
        showFilters,
        
        // Computed values
        filteredCompanies,
        currentCompanies,
        totalPages,
        uniqueIndustries,
        uniqueLocations,
        
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
