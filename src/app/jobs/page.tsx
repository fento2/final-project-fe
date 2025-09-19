"use client";

import { Banknote, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useJobs } from "@/hooks/useJobs";

type Job = {
    id: string;
    title: string;
    company: string;
    type: "Full Time" | "Part-time" | "Internship" | "Contract";
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    tags?: string[];
    slug?: string;
};

function slugify(title: string) {
    // ganti slash dan karakter bermasalah lalu encode
    return encodeURIComponent(title.replace(/\//g, "-"));
}

export default function JobsListPage() {
    const router = useRouter();
    const [filters, setFilters] = useState({
        date: "Anytime",
        types: [] as string[],
        tools: [] as string[],
        salaryMin: 0,
        salaryMax: 100000,
    });

    const [page, setPage] = useState(1);
    const perPage = 9;

    // Fetch jobs from backend
    const { jobs: backendJobs, loading, error } = useJobs({ limit: 50 });

    // Extract featured companies from jobs data (companies that have job postings)
    const featuredCompanies = useMemo(() => {
        const companiesMap = new Map();
        
        backendJobs.forEach((job: any) => {
            const company = job.Companies;
            if (company && company.company_id && !companiesMap.has(company.company_id)) {
                companiesMap.set(company.company_id, {
                    company_id: company.company_id,
                    name: company.name,
                    profile_picture: company.profile_picture,
                    website: company.website,
                    // Count jobs for this company
                    jobCount: backendJobs.filter((j: any) => j.Companies?.company_id === company.company_id).length
                });
            }
        });
        
        // Convert to array and sort by job count (companies with more jobs first)
        return Array.from(companiesMap.values())
            .sort((a, b) => b.jobCount - a.jobCount)
            .slice(0, 6); // Get top 6 companies
    }, [backendJobs]);

    // Transform backend data to match frontend Job type
    const transformedJobs: Job[] = useMemo(() => {
        return backendJobs.map((job: any) => ({
            id: job.job_id?.toString() || job.id?.toString() || '',
            title: job.title || 'Job Position',
            company: job.Companies?.name || job.company?.name || 'Unknown Company',
            type: (job.job_type?.replace('_', ' ') || 'Full Time') as Job["type"],
            location: job.location || 'Remote',
            salaryMin: job.salary || 0,
            salaryMax: job.salary ? job.salary * 1.5 : 0,
            tags: job.skills?.map((skill: any) => skill.name) || [],
            slug: job.slug || job.job_id?.toString() || job.id?.toString() || '',
        }));
    }, [backendJobs]);

    const filtered = useMemo(() => {
        return transformedJobs.filter((j: Job) => {
            if (filters.types.length && !filters.types.includes(j.type)) return false;
            if (filters.salaryMax && j.salaryMin && j.salaryMin > filters.salaryMax) return false;
            if (filters.tools.length && !filters.tools.every((t) => j.tags?.includes(t))) return false;
            return true;
        });
    }, [filters, transformedJobs]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const shown = filtered.slice((page - 1) * perPage, page * perPage);

    // Handle job card click
    const handleJobClick = (job: Job) => {
        if (job.slug) {
            router.push(`/jobs/${job.slug}`);
        } else {
            router.push(`/jobs/${job.id}`);
        }
    };

    // Handle company card click
    const handleCompanyClick = (company: any) => {
        // Priority: company slug > generated slug from name > company_id
        let slug = company.slug;
        
        if (!slug && company.name) {
            // Generate slug from company name
            slug = company.name.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
        }
        
        // Fallback to company_id if no slug can be generated
        const finalSlug = slug || company.company_id;
        router.push(`/jobs/companies/${finalSlug}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-6">
                {/* Hero header similar to the provided design */}
                <div className="relative overflow-hidden rounded-xl mb-8">
                    <div className="absolute inset-0">
                        <Image src="/images/bg_hero.jpg" alt="hero" fill className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
                        <nav className="text-sm text-indigo-600 mb-4">
                            <a href="/" className="hover:underline">Home</a>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="text-gray-700">Jobs</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">Browse Through Variety of Jobs and Company</h1>
                        <p className="text-gray-600 max-w-2xl">Find the Job and companies you like.</p>
                    </div>
                </div>

                {/* Featured Jobs & Companies (no filters) */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Featured Jobs</h2>
                        <a href="/jobs/browse" className="text-sm text-indigo-600 hover:underline">See all jobs →</a>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-xl shadow p-8 mb-10 text-center">
                            <p className="text-gray-600">Failed to load jobs. Please try again later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            {transformedJobs.slice(0, 6).map((job: Job) => (
                                <div 
                                    key={job.id} 
                                    className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                                    onClick={() => handleJobClick(job)}
                                >
                                    <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-600 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="text-sm text-gray-500 mb-2">{job.company}</div>
                                    <div className="text-sm text-gray-600 mb-3">
                                        {job.location} • <span className="font-medium">{job.type}</span>
                                    </div>
                                    {job.salaryMin && job.salaryMin > 0 && (
                                        <div className="text-sm text-green-600 font-medium">
                                            Rp{job.salaryMin.toLocaleString('id-ID')}
                                            {job.salaryMax && job.salaryMax > job.salaryMin && 
                                                ` - Rp${job.salaryMax.toLocaleString('id-ID')}`
                                            }
                                        </div>
                                    )}
                                    {job.tags && job.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {job.tags.slice(0, 3).map((tag, index) => (
                                                <span 
                                                    key={index} 
                                                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {job.tags.length > 3 && (
                                                <span className="text-xs text-gray-400">
                                                    +{job.tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Featured Companies</h2>
                        <a href="/jobs/companies" className="text-sm text-indigo-600 hover:underline">See all companies →</a>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow p-4 flex items-center gap-4 animate-pulse">
                                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-8 h-4 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Failed to load companies</p>
                        </div>
                    ) : featuredCompanies.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No companies with job postings available</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {featuredCompanies.map((company: any) => (
                                <div 
                                    key={company.company_id} 
                                    className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                                    onClick={() => handleCompanyClick(company)}
                                >
                                    {/* Header with Logo and Company Info */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden flex-shrink-0">
                                            {company.profile_picture ? (
                                                <Image
                                                    src={company.profile_picture}
                                                    alt={company.name}
                                                    width={56}
                                                    height={56}
                                                    className="rounded-xl object-cover"
                                                />
                                            ) : (
                                                <span className="font-bold text-xl">
                                                    {company.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                                {company.name}
                                            </h3>
                                            <div className="text-sm text-gray-500 mb-2">
                                                {company.jobCount} job{company.jobCount !== 1 ? 's' : ''} available
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company Stats */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{company.location || 'Multiple Locations'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2M16 6v6a6 6 0 01-12 0V6" />
                                            </svg>
                                            <span className="font-medium text-indigo-600">
                                                {company.jobCount} Open Position{company.jobCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">View Company</span>
                                            <div className="text-sm text-indigo-600 group-hover:text-indigo-700 transition-colors font-medium flex items-center gap-1">
                                                <span>View Jobs</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}