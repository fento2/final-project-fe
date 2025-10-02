"use client";
import React, { useMemo, useState, useEffect } from "react";
import { apiCall } from "@/helper/apiCall";
import { useJobs } from "@/hooks/useJobs";
import BrowseJobCard from "./BrowseJobCard";
import { Filters } from "./JobsFilterSection";
import { toTitleCase } from "@/helper/toTitleCase";

interface Job {
    id: string;
    title: string;
    company: string;
    type: "Full Time" | "Part-time" | "Internship" | "Contract" | "Freelance" | "Temporary" | "Remote" | "Hybrid";
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryDisplay?: string;
    category?: string;
    description?: string | string[];
    tags?: string[];
    slug?: string;
    companyLogo?: string | null;
    createdAt?: string;
    expiredAt?: string;
}

interface JobsGridSectionProps {
    filters: Filters;
}

// Enhanced hook to fetch jobs with filters from backend
const useJobsWithFilters = (filters: Filters, page: number, perPage: number = 12) => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: perPage,
        total: 0,
        totalPages: 0
    });

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            // Add pagination
            params.append("page", page.toString());
            params.append("limit", perPage.toString());

            // Add filter parameters
            if (filters.categories.length > 0) {
                params.append("category", filters.categories.join(','));
            }
            if (filters.location.length > 0) {
                params.append("location", filters.location.join(','));
            }
            if (filters.types.length > 0) {
                params.append("jobType", filters.types.join(','));
            }
            if (filters.salaryMin > 0) {
                params.append("salaryMin", filters.salaryMin.toString());
            }
            if (filters.salaryMax < 50000000) {
                params.append("salaryMax", filters.salaryMax.toString());
            }



            // Try both endpoints
            let data;
            try {
                const response = await apiCall.get(`/postings?${params.toString()}`);
                data = response.data;
            } catch (postingsError) {
                // Fallback to jobs endpoint
                const response = await apiCall.get(`/jobs?${params.toString()}`);
                data = response.data;
            }



            // Handle backend response structure
            const jobsData = data?.data?.data || data?.data || data || [];
            const paginationData = data?.data?.pagination || data?.pagination;

            setJobs(Array.isArray(jobsData) ? jobsData : []);

            if (paginationData) {
                setPagination({
                    page: paginationData.page || page,
                    limit: paginationData.limit || perPage,
                    total: paginationData.total || jobsData.length,
                    totalPages: paginationData.totalPages || Math.ceil((paginationData.total || jobsData.length) / perPage)
                });
            } else {
                // Fallback pagination calculation
                setPagination({
                    page: page,
                    limit: perPage,
                    total: jobsData.length,
                    totalPages: Math.ceil(jobsData.length / perPage)
                });
            }

            setError(null);
        } catch (err: any) {

            setError('Failed to fetch jobs');
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [filters, page]);

    return { jobs, loading, error, pagination, refetch: fetchJobs };
};

interface JobsGridSectionProps {
    filters: Filters;
}

// Pagination Component
const Pagination: React.FC<{
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}> = ({ page, totalPages, onChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;

        let start = Math.max(1, page - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start < showPages - 1) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ←
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-lg ${pageNum === page
                        ? "bg-indigo-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    {pageNum}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                →
            </button>
        </div>
    );
};

const JobsGridSection: React.FC<JobsGridSectionProps> = ({ filters }) => {
    const { jobs, loading, error } = useJobs();
    const [page, setPage] = useState(1);
    const perPage = 9;

    // Helper functions
    const formatSalary = (salary?: number, currency?: string, period?: string) => {
        if (!salary) return '';
        const formattedSalary = salary.toLocaleString();
        const curr = currency;
        const per = toTitleCase(period || "");
        return `${curr} ${formattedSalary} / ${per}`;
    };

    const getCategoryDisplay = (category?: string) => {
        if (!category) return '';
        return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    };

    const normalize = (s: unknown) =>
        (s ?? "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/-/g, "");

    const normalizeType = (t: unknown): Job["type"] => {
        const n = normalize(t);
        if (n.includes("fulltime")) return "Full Time";
        if (n.includes("parttime")) return "Part-time";
        if (n.includes("intern")) return "Internship";
        if (n.includes("contract")) return "Contract";
        if (n.includes("freelance")) return "Freelance";
        if (n.includes("temporary")) return "Temporary";
        if (n.includes("remote")) return "Remote";
        if (n.includes("hybrid")) return "Hybrid";
        return "Full Time";
    };

    // Transform backend data to match our Job interface
    const transformedJobs: Job[] = useMemo(() => {
        const list = Array.isArray(jobs) ? jobs : [];
        const baseURL = apiCall?.defaults?.baseURL || "";
        return list
            .map((job: any, idx: number) => {
                if (!job) return null;
                const idRaw = job.id ?? job.job_id ?? job._id ?? job.slug ?? `job-${idx}`;
                const id = typeof idRaw === 'string' ? idRaw : String(idRaw);
                const companyName =
                    job.Company?.name ??
                    job.company?.name ??
                    job.company_name ??
                    job.name ??
                    'Unknown Company';
                let logo =
                    job.Company?.profile_picture ??
                    job.company?.profile_picture ??
                    job.company?.logo ??
                    job.profile_picture ??
                    job.companyLogo ??
                    null;
                if (logo && typeof logo === 'string' && !/^https?:\/\//i.test(logo) && baseURL) {
                    logo = `${baseURL}${logo.startsWith('/') ? '' : '/'}${logo}`;
                }
                const type = normalizeType(job.job_type ?? job.type);
                const location = job.location ?? job.city ?? 'Remote';
                const salaryNum = typeof job.salary === 'number' ? job.salary : Number(job.salary) || 0;
                const salaryDisplay = salaryNum ? formatSalary(salaryNum, job.currency, job.periodSalary) : undefined;

                const tags = Array.isArray(job.skills)
                    ? job.skills
                        .map((skill: any) => (typeof skill === 'string' ? skill : skill?.name))
                        .filter(Boolean)
                    : [];

                return {
                    id,
                    title: job.title || 'Untitled Position',
                    company: job.Companies?.name,
                    type,
                    location,
                    salaryMin: salaryNum || 0,
                    salaryMax: salaryNum ? Math.round(salaryNum * 1.2) : 0,
                    salaryDisplay,
                    category: getCategoryDisplay(job.category || job.Category || job.category_name),
                    description: job.requirements || '',
                    tags,
                    slug: job.slug,
                    companyLogo: job.Companies?.profile_picture,
                    createdAt: job.createdAt || job.created_at,
                    expiredAt: job.expiredAt || job.expired_at,
                } as Job;
            })
            .filter(Boolean) as Job[];
    }, [jobs]);

    // Filter jobs based on selected filters
    const filteredJobs = useMemo(() => {
        return transformedJobs.filter((job) => {
            // Filter by job types
            if (filters.types.length) {
                const matchesType = filters.types.some((t) => normalizeType(t) === normalizeType(job.type));
                if (!matchesType) return false;
            }

            // Filter by tools/skills
            if (filters.tools?.length && !filters.tools.some(tool =>
                job.tags?.some(tag => tag.toLowerCase().includes(tool.toLowerCase()))
            )) {
                return false;
            }

            // Filter by categories
            if (filters.categories.length && job.category) {
                const jobCat = job.category.toLowerCase();
                const match = filters.categories.some((c) => c.toLowerCase() === jobCat);
                if (!match) return false;
            } else if (filters.categories.length && !job.category) {
                return false;
            }

            // Filter by location
            if (filters.location.length && !filters.location.some(loc =>
                job.location.toLowerCase().includes(loc.toLowerCase())
            )) {
                return false;
            }

            // Filter by salary minimum threshold
            if (filters.salaryMin && job.salaryMin && job.salaryMin < filters.salaryMin) {
                return false;
            }

            // Filter by date (simplified - in real app you'd parse the date properly)
            if (filters.date && filters.date !== "Anytime") {
                // For demo purposes, we'll show all jobs for any date filter
                // In a real app, you'd filter based on job.createdAt
            }

            return true;
        });
    }, [transformedJobs, filters]);

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / perPage));
    const paginatedJobs = filteredJobs.slice((page - 1) * perPage, page * perPage);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">Error loading jobs</p>
                    <p className="text-gray-500">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (filteredJobs.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900">No jobs found</p>
                    <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Reset Filters
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                    Showing {((page - 1) * perPage) + 1}-{Math.min(page * perPage, filteredJobs.length)} of {filteredJobs.length} jobs
                </div>
                <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedJobs.map((job) => (
                    <BrowseJobCard key={job.id} job={job} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                />
            )}
        </div>
    );
};

export default JobsGridSection;
