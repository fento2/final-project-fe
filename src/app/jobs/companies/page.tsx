"use client";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiCall } from "@/helper/apiCall";
import { Company } from "@/types/userCompany";
import { useDebounce } from "@/hooks/useDebounce";
import CompaniesHeroSection from "./components/CompaniesHeroSection";
import CompaniesFilterSection, { CompanyFilters } from "./components/CompaniesFilterSection";
import CompaniesGridSection from "./components/CompaniesGridSection";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import BrowseTestimonialSection from "../browse/components/BrowseTestimonialSection";
import BrowseCTASection from "../browse/components/BrowseCTASection";

function CompaniesPageContent() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<CompanyFilters>({
        name: "",
        location: "",
    });

    // Debounce filters to avoid too many API calls
    const debouncedFilters = useDebounce(filters, 300);

    const itemsPerPage = 9;
    
    // Calculate pagination
    const totalItems = companies.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCompanies = companies.slice(startIndex, endIndex);

    const searchController = useRef<AbortController | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const initialLoad = useRef(true);

    const fetchData = async (params?: URLSearchParams | null) => {
        if (searchController.current) {
            try { 
                searchController.current.abort(); 
            } catch { /* ignore */ }
        }
        
        const controller = new AbortController();
        searchController.current = controller;

        try {
            setLoading(true);
            const url = `/company/find?${params?.toString() || ''}`;
            const res = await apiCall.get(url, { signal: controller.signal });
            const items = res.data?.data?.data || [];
            setCompanies(items);
            setCurrentPage(1); // Reset to first page when new data loads
        } catch (err: any) {
            const name = err?.name;
            if (name !== "CanceledError" && name !== "AbortError") {

                setCompanies([]);
            }
        } finally {
            setLoading(false);
            if (searchController.current === controller) {
                searchController.current = null;
            }
        }
    };

    // Create URL parameters from filters
    const createUrlParams = useCallback((filterValues: CompanyFilters) => {
        const params = new URLSearchParams();
        if (filterValues.name.trim()) params.set('name', filterValues.name.trim());
        if (filterValues.location.trim()) params.set('location', filterValues.location.trim());
        return params;
    }, []);

    // Update URL without triggering navigation
    const updateURL = useCallback((filterValues: CompanyFilters) => {
        const params = createUrlParams(filterValues);
        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        if (newUrl !== currentUrl) {
            router.replace(newUrl, { scroll: false });
        }
    }, [pathname, searchParams, router, createUrlParams]);

    // Set initial filters from URL parameters
    useEffect(() => {
        const name = searchParams?.get("name") ?? "";
        const location = searchParams?.get("location") ?? "";
        
        const urlFilters = { name, location };
        setFilters(urlFilters);

        // Only fetch data on initial load or when URL params change externally
        if (initialLoad.current) {
            const params = createUrlParams(urlFilters);
            fetchData(params.toString() ? params : null);
            initialLoad.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Handle debounced filter changes (auto-search)
    useEffect(() => {
        if (!initialLoad.current) {
            const params = createUrlParams(debouncedFilters);
            updateURL(debouncedFilters);
            fetchData(params.toString() ? params : null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilters]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const handleSearch = async () => {
        const params = createUrlParams(filters);
        updateURL(filters);
        await fetchData(params.toString() ? params : null);
    };

    const handleFilterChange = (newFilters: CompanyFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilter = (filterType: 'name' | 'location') => {
        const newFilters = {
            ...filters,
            [filterType]: ""
        };
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters are cleared
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (searchController.current) {
                try {
                    searchController.current.abort();
                } catch { /* ignore */ }
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <CompaniesHeroSection filters={filters} onClearFilter={handleClearFilter} />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <CompaniesFilterSection 
                            filters={filters}
                            onChange={handleFilterChange}
                            onSearch={handleSearch}
                            loading={loading}
                            resultCount={companies.length}
                        />
                    </div>

                    {/* Companies Grid */}
                    <div className="lg:col-span-3">
                        <CompaniesGridSection 
                            companies={paginatedCompanies}
                            loading={loading}
                            totalCompanies={companies.length}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                </div>
            </div>

            {/* Extra Sections */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <HowItWorksSection />
                </div>
            </div>

            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <BrowseTestimonialSection />
                </div>
            </div>

            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <BrowseCTASection />
                </div>
            </div>
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompaniesPageContent />
        </Suspense>
    );
}