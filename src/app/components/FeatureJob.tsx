"use client";
import { useState, useEffect } from "react";
import FeatureJobCard from "./JobCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedJobs } from "@/hooks/useJobs";

export default function FeatureJob() {
    const [page, setPage] = useState(1);
    const { jobs: featuredJobs, loading, error } = useFeaturedJobs(18); // Get more jobs for pagination
    
    // Debug: Log featured jobs salary data
    useEffect(() => {
        if (featuredJobs && featuredJobs.length > 0) {
            const firstJob = featuredJobs[0] as any;
            console.log('Featured Jobs - First job data from backend:', firstJob);
            console.log('Featured Jobs - Salary fields:', {
                salary: firstJob.salary,
                periodSalary: firstJob.periodSalary,
                currency: firstJob.currency,
                expected_salary: firstJob.expected_salary
            });
        }
    }, [featuredJobs]);
    
    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading featured jobs...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-red-600">Failed to load featured jobs: {error}</p>
            </section>
        );
    }

    if (!featuredJobs || featuredJobs.length === 0) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-600">No featured jobs available</p>
            </section>
        );
    }

    const itemsPerPage = 6;
    const startIndex = (page - 1) * itemsPerPage;
    const currentPageJobs = featuredJobs.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(featuredJobs.length / itemsPerPage);

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Featured Jobs
                </h2>
                <p className="text-lg text-gray-600">
                    Discover exciting career opportunities from top companies in various industries
                </p>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentPageJobs.map((job: any, i: number) => (
                    <FeatureJobCard 
                        key={job.job_id || job.id || i} 
                        company={job.Companies?.name || job.Company?.name || job.company?.name || job.company || "Unknown Company"}
                        logo={job.Companies?.profile_picture || job.Company?.profile_picture || job.company?.profile_picture || "/images/logo.png"}
                        postedDate={job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
                        location={job.location || "Remote"}
                        salary={job.salary || job.expected_salary || null}
                        periodSalary={job.periodSalary || "month"}
                        currency={job.currency || "IDR"}
                        title={job.title || "Job Position"}
                        type={job.job_type?.replace('_', ' ') || "Full-time"}
                        description={job.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || "No description available"}
                        daysLeft={job.expiredAt ? Math.ceil((new Date(job.expiredAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : Math.floor(Math.random() * 30) + 1}
                        slug={job.slug}
                        jobId={job.job_id || job.id}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <button
                        className={`p-2 rounded-xl transition-all duration-200 ${
                            page <= 1 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                        }`}
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                        const num = index + 1;
                        return (
                            <button
                                key={num}
                                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    page === num 
                                        ? "bg-indigo-600 text-white shadow-md" 
                                        : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                                }`}
                                onClick={() => setPage(num)}
                            >
                                {num.toString().padStart(2, "0")}
                            </button>
                        );
                    })}
                    
                    <button
                        className={`p-2 rounded-xl transition-all duration-200 ${
                            page >= totalPages 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                        }`}
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </section>
    );
}