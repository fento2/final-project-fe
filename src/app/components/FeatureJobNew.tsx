"use client";
import { useState } from "react";
import FeatureJobCard from "./JobCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFeaturedJobs } from "../../hooks/useJobs";

// Simplified fallback data (only used as backup)
const fallbackJobs = [
    {
        id: 1,
        company: "UXLabs Company",
        logo: "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        postedDate: "Feb 18, 2023",
        location: "Chicago, IL",
        salary: "80,000 - 100,000 per year",
        title: "Software Developer",
        type: "Full Time",
        description: "Develop and maintain software applications and programs for our clients using various programming languages and platforms.",
        daysLeft: 25,
    },
    {
        id: 2,
        company: "SkyView Enterprises", 
        logo: "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        postedDate: "Feb 20, 2023",
        location: "Los Angeles, CA",
        salary: "50,000 - 60,000 per year",
        title: "Graphic Designer",
        type: "Full Time",
        description: "Create visually appealing graphics, designs, layouts for clients to use in various media, including websites, social media, and prints.",
        daysLeft: 16,
    },
    {
        id: 3,
        company: "TechCorp Solutions",
        logo: "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        postedDate: "Feb 22, 2023",
        location: "New York, NY",
        salary: "90,000 - 120,000 per year",
        title: "Data Scientist",
        type: "Full Time",
        description: "Analyze complex data sets to derive business insights and build predictive models for strategic decision making.",
        daysLeft: 12,
    },
];

const FeatureJob = () => {
    const [page, setPage] = useState(1);
    const { jobs: featuredJobs, loading, error } = useFeaturedJobs(9); // Get more jobs for pagination
    const itemsPerPage = 3;
    
    // Use backend data if available, fallback to dummy data
    const jobsToUse = featuredJobs && featuredJobs.length > 0 ? featuredJobs : fallbackJobs;
    const startIndex = (page - 1) * itemsPerPage;
    const currentPageJobs = jobsToUse.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(jobsToUse.length / itemsPerPage);

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading featured jobs...</p>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-16 text-black">
            {/* Header */}
            <div className="mb-12">
                <h2 className="text-center text-3xl font-bold text-black mb-2">
                    Featured Jobs
                </h2>
                <p className="text-center text-black max-w-2xl mx-auto">
                    Discover exciting career opportunities from top companies in various industries
                </p>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {currentPageJobs.map((job: any, i: number) => (
                    <FeatureJobCard 
                        key={job.job_id || job.id || i} 
                        company={job.Companies?.name || job.company?.name || job.company || "Unknown Company"}
                        logo={job.Companies?.profile_picture || job.company?.profile_picture || job.logo || "/images/logo.png"}
                        postedDate={job.createdAt ? new Date(job.createdAt).toLocaleDateString() : job.postedDate || "Recently"}
                        location={job.location || "Remote"}
                        salary={job.salary || job.expected_salary || null}
                        periodSalary={job.periodSalary || "month"}
                        currency={job.currency || "IDR"}
                        title={job.title || "Job Position"}
                        type={job.job_type?.replace('_', ' ') || job.type || "Full-time"}
                        description={job.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...' || "No description available"}
                        daysLeft={job.expiredAt ? Math.ceil((new Date(job.expiredAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : job.daysLeft || Math.floor(Math.random() * 30) + 1}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
                <button
                    className={`px-3 py-2 rounded-md ${page <= 1 ? "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                >
                    <ChevronLeft />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                    const num = index + 1;
                    return (
                        <button
                            key={num}
                            className={`px-3 py-2 rounded-md ${page === num ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            onClick={() => setPage(num)}
                        >
                            {num.toString().padStart(2, "0")}
                        </button>
                    );
                })}
                
                <button
                    className={`px-3 py-2 rounded-md ${page >= totalPages ? "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    <ChevronRight />
                </button>
            </div>
        </section>
    );
};

export default FeatureJob;
