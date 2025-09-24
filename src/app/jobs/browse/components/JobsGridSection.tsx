"use client";
import React, { useMemo, useState, useEffect } from "react";
import { apiCall } from "@/helper/apiCall";
import { Job as BackendJob } from "@/types/database";
import BrowseJobCard from "./BrowseJobCard";
import { Filters } from "./JobsFilterSection";

// Mock data generator for demonstration when backend is unavailable
const generateMockJobs = (): BackendJob[] => {
    const companies = [
        { name: "TechCorp Indonesia", logo: "/images/logo.png" },
        { name: "DataScience Solutions", logo: "/images/logo.png" },
        { name: "DevStudio Jakarta", logo: "/images/logo.png" },
        { name: "CloudTech Asia", logo: "/images/logo.png" },
        { name: "AI Innovation Labs", logo: "/images/logo.png" },
        { name: "WebFlow Indonesia", logo: "/images/logo.png" },
        { name: "Mobile Apps Nusantara", logo: "/images/logo.png" },
        { name: "StartupHub Jakarta", logo: "/images/logo.png" },
        { name: "BigData Corporation", logo: "/images/logo.png" },
        { name: "Digital Innovation", logo: "/images/logo.png" },
        { name: "Tech Startup Indo", logo: "/images/logo.png" },
        { name: "Software House JKT", logo: "/images/logo.png" },
        { name: "Fintech Indonesia", logo: "/images/logo.png" },
        { name: "E-commerce Tech", logo: "/images/logo.png" },
        { name: "Gaming Studio ID", logo: "/images/logo.png" },
    ];

    const jobTitles = [
        "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "Data Scientist", "Product Manager", "UI/UX Designer",
        "DevOps Engineer", "Mobile Developer", "QA Engineer",
        "Marketing Manager", "Business Analyst", "Project Manager",
        "Machine Learning Engineer", "Software Architect", "Database Administrator",
        "React Developer", "Node.js Developer", "Python Developer",
        "Java Developer", "iOS Developer", "Android Developer",
        "Digital Marketing Specialist", "Content Creator", "SEO Specialist",
        "Graphic Designer", "Motion Graphics Designer", "3D Artist"
    ];

    const locations = [
        "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Jakarta Utara", "Jakarta Timur",
        "Bandung", "Surabaya", "Yogyakarta", "Medan", "Semarang", 
        "Malang", "Denpasar", "Tangerang", "Depok", "Bekasi",
        "Bogor", "Makassar", "Palembang", "Batam", "Balikpapan"
    ];

    const jobTypes: Job["type"][] = ["Full Time", "Part-time", "Contract", "Remote", "Hybrid"];
    const categories = ["Technology", "Marketing", "Design", "Data Science", "Management", "Finance", "Sales", "Operations"];

    return Array.from({ length: 45 }, (_, index) => {
        const company = companies[index % companies.length];
        const title = jobTitles[index % jobTitles.length];
        const location = locations[index % locations.length];
        const jobType = jobTypes[index % jobTypes.length];
        const category = categories[index % categories.length];
        const salaryMin = 8000000 + (index % 20) * 5000000; // 8-108 juta (varied range)
        const salaryMax = salaryMin + 10000000 + (index % 15) * 5000000; // +10-80 juta additional
        
        // Generate proper slug from title and company
        const baseSlug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const slug = `${baseSlug}-${index + 1}`;

        return {
            job_id: index + 1,
            title: title,
            slug: slug,
            description: `Join ${company.name} as a ${title}. We're looking for talented individuals to work on exciting projects in ${category.toLowerCase()}. 

Key Responsibilities:
• Develop and maintain high-quality software solutions
• Collaborate with cross-functional teams
• Participate in code reviews and technical discussions
• Stay up-to-date with industry best practices

Requirements:
• Bachelor's degree in Computer Science or related field
• 2+ years of relevant experience
• Strong problem-solving skills
• Excellent communication abilities`,
            category: category,
            location: location,
            salary: salaryMin,
            periodSalary: "month",
            currency: "IDR",
            job_type: jobType,
            createdAt: new Date(Date.now() - (index * 2 * 24 * 60 * 60 * 1000)).toISOString(),
            expiredAt: new Date(Date.now() + (30 - index % 30) * 24 * 60 * 60 * 1000).toISOString(),
            Companies: {
                name: company.name,
                profile_picture: company.logo
            }
        };
    });
};

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
    const [page, setPage] = useState(1);
    const [rawJobs, setRawJobs] = useState<BackendJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const perPage = 9;

    // Custom fetch function similar to useFeaturedJobs
    const fetchFilteredJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Build query parameters like in useFeaturedJobs
            const params = new URLSearchParams();
            params.append('limit', '100'); // Get more for better client-side filtering
            params.append('sort', 'created_at');
            params.append('order', 'desc');

            // Map filters to API parameters (similar to feature jobs approach)
            if (filters.categories && filters.categories.length > 0) {
                params.append('category', filters.categories[0]);
            }
            if (filters.location && filters.location.length > 0) {
                params.append('location', filters.location[0]);
            }
            if (filters.types && filters.types.length > 0) {
                params.append('jobType', filters.types[0]);
            }
            if (filters.salaryMin > 0) {
                params.append('salaryMin', filters.salaryMin.toString());
            }
            if (filters.salaryMax < 200000000) {
                params.append('salaryMax', filters.salaryMax.toString());
            }

            // Use same endpoint as featured jobs: /postings
            const { data } = await apiCall.get(`/postings?${params.toString()}`);
            
            // Handle backend response structure same as useFeaturedJobs
            const jobsData = data?.data?.data || data?.data || data || [];
            const jobs = Array.isArray(jobsData) ? jobsData : [];
            
            setRawJobs(jobs);
        } catch (err: any) {
            // Handle errors same way as useFeaturedJobs
            if (err.response?.status === 404 || err.response?.status === 402 || err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                setRawJobs([]);
                setError(null);
            } else {
                console.error('Browse jobs fetch error:', err);
                setError('Failed to fetch jobs');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch when component mounts or filters change (like useEffect in useFeaturedJobs)
    useEffect(() => {
        fetchFilteredJobs();
    }, [filters]);

    // Transform backend data to match our Job interface and apply client-side filtering
    const filteredJobs: Job[] = useMemo(() => {
        let jobsList: BackendJob[] = Array.isArray(rawJobs) ? rawJobs : [];
        
        // If backend returns no data, use mock data for demonstration
        if (jobsList.length === 0) {
            jobsList = generateMockJobs();
        }

        // Transform to consistent format
        const transformedJobs: Job[] = jobsList.map((job: BackendJob) => ({
            id: job.job_id?.toString() || String(job.job_id) || 'unknown',
            title: job.title || 'Untitled Job',
            company: job.Companies?.name || job.Company?.name || 'Unknown Company',
            type: (job.job_type as Job["type"]) || "Full Time",
            location: job.location || 'Remote',
            salaryMin: job.salary,
            salaryMax: job.salary,
            salaryDisplay: job.salary ? `IDR ${job.salary.toLocaleString('id-ID')} per ${job.periodSalary || 'month'}` : undefined,
            category: job.category,
            description: job.description?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || "",
            tags: [], // Will be populated if skills data is available
            slug: job.slug,
            companyLogo: job.Companies?.profile_picture || job.Company?.profile_picture || "/images/logo.png",
            createdAt: job.createdAt,
            expiredAt: job.expiredAt,
        }));

        // Apply additional client-side filtering for multi-select filters
        return transformedJobs.filter(job => {
            // Filter by categories (client-side for multi-select)
            if (filters.categories.length > 0) {
                const jobCategory = job.category || '';
                const matches = filters.categories.some(cat => 
                    jobCategory.toLowerCase().includes(cat.toLowerCase())
                );
                if (!matches) return false;
            }

            // Filter by locations (client-side for multi-select)
            if (filters.location.length > 0) {
                const jobLocation = job.location || '';
                const matches = filters.location.some(loc => 
                    jobLocation.toLowerCase().includes(loc.toLowerCase())
                );
                if (!matches) return false;
            }

            // Filter by job types (client-side for multi-select)
            if (filters.types.length > 0) {
                const jobType = job.type || '';
                const matches = filters.types.some(type => 
                    jobType.toLowerCase() === type.toLowerCase()
                );
                if (!matches) return false;
            }

            // Filter by salary range
            if (filters.salaryMin > 0 || filters.salaryMax < 200000000) {
                const jobSalaryMin = job.salaryMin || 0;
                const jobSalaryMax = job.salaryMax || jobSalaryMin;
                
                // Job should overlap with filter range
                if (filters.salaryMax > 0 && jobSalaryMin > filters.salaryMax) return false;
                if (filters.salaryMin > 0 && jobSalaryMax < filters.salaryMin) return false;
            }

            // Filter by date posted
            if (filters.date && filters.date !== "Anytime") {
                const now = new Date();
                let threshold = 0; // milliseconds
                if (filters.date === 'Last 24 hours') threshold = 24 * 60 * 60 * 1000;
                else if (filters.date === 'Last 3 days') threshold = 3 * 24 * 60 * 60 * 1000;
                else if (filters.date === 'Last 7 days') threshold = 7 * 24 * 60 * 60 * 1000;

                if (threshold > 0) {
                    const created = job.createdAt ? new Date(job.createdAt) : null;
                    if (!created) return false;
                    const age = now.getTime() - created.getTime();
                    if (age > threshold) return false;
                }
            }

            return true;
        });
    }, [rawJobs, filters]);

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / perPage));
    
    // Auto-enable pagination if more than 9 jobs, otherwise show all
    const shouldPaginate = filteredJobs.length > perPage;
    const paginatedJobs = shouldPaginate ? filteredJobs.slice((page - 1) * perPage, page * perPage) : filteredJobs;

    // Ensure page stays in range when filters change
    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [filters, totalPages, page]);

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
                    onClick={() => fetchFilteredJobs()}
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
                    onClick={() => fetchFilteredJobs()}
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
                    {shouldPaginate 
                        ? `Showing ${((page - 1) * perPage) + 1}-${Math.min(page * perPage, filteredJobs.length)} of ${filteredJobs.length} jobs`
                        : `Showing all ${filteredJobs.length} jobs`
                    }
                </div>
                {shouldPaginate && (
                    <div className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </div>
                )}
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedJobs.map((job) => (
                    <div key={job.id} className="h-full">
                        <BrowseJobCard job={job} />
                    </div>
                ))}
            </div>

            {/* Pagination - Auto shows when more than 9 jobs */}
            {shouldPaginate && totalPages > 1 && (
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