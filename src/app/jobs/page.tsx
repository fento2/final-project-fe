"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "./components/JobCard";
import { CompanyCard } from "./components/CompanyCard";
import { useFeaturedCompanies } from "./hooks/useFeaturedCompanies";
import { useTransformedJobs } from "./hooks/useTransformedJobs";
import { Job } from "./types/jobsPageTypes";
import { slugify } from "./utils/jobsPageHelpers";

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

    // Transform data using custom hooks
    const featuredCompanies = useFeaturedCompanies(backendJobs);
    const transformedJobs = useTransformedJobs(backendJobs);

    const handleJobClick = (job: Job) => {
        const jobSlug = job.slug || slugify(job.title);
        router.push(`/jobs/${jobSlug}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover amazing opportunities from top companies. Your next career move starts here.
                    </p>
                    <div className="mt-6">
                        <Link href="/jobs/browse" className="inline-flex items-center bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                            Browse All Jobs
                        </Link>
                    </div>
                </div>

                {/* Latest Jobs Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Latest Job Openings</h2>
                        <Link href="/jobs/browse" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            View All Jobs →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-xl shadow p-8 mb-10 text-center">
                            <p className="text-gray-600">Failed to load jobs. Please try again later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {transformedJobs.slice(0, 6).map((job: Job) => (
                                <JobCard 
                                    key={job.id} 
                                    job={job} 
                                    onClick={handleJobClick}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Featured Companies Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Companies</h2>
                            <p className="text-gray-600">Discover great companies actively hiring</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredCompanies.slice(0, 8).map((company) => (
                                <CompanyCard 
                                    key={company.company_id} 
                                    company={company}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}