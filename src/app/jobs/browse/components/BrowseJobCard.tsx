"use client";
import React from "react";
import Image from "next/image";
import { MapPin, Banknote, Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useJobSave } from "@/hooks/useJobSave";
import { useAuthStore } from "@/lib/zustand/authStore";
import { getCompanyDetailUrl } from "@/helper/companySlugHelper";
import { generateJobSlug } from "@/helper/slugHelper";

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

interface BrowseJobCardProps {
    job: Job;
}

const BrowseJobCard: React.FC<BrowseJobCardProps> = ({ job }) => {
    const router = useRouter();
    const { role, isLogin } = useAuthStore();
    const { isSaved, isLoading, toggleSave } = useJobSave(job.id);

    // Only show save and apply functionality for USER role
    const canSaveJobs = isLogin && role === 'USER';
    const canApplyJobs = isLogin && role === 'USER';

    // Helper function to shorten category names
    const getShortenedCategory = (category?: string) => {
        if (!category) return '';
        
        // Common abbreviations for long categories
        const categoryMap: { [key: string]: string } = {
            'Information Technology': 'IT',
            'Software Development': 'Software Dev',
            'Digital Marketing': 'Digital Mktg',
            'Human Resources': 'HR',
            'Customer Service': 'Customer Svc',
            'Business Development': 'Biz Dev',
            'Project Management': 'Project Mgmt',
            'Quality Assurance': 'QA',
            'Machine Learning': 'ML',
            'Data Science': 'Data Sci',
            'Artificial Intelligence': 'AI',
            'User Experience': 'UX',
            'User Interface': 'UI'
        };

        // Check if there's a short form available
        if (categoryMap[category]) {
            return categoryMap[category];
        }

        // If category is longer than 15 characters, truncate it
        if (category.length > 15) {
            return category.substring(0, 15) + '...';
        }

        return category;
    };

    const handleCardClick = () => {
        const jobSlug = job.slug || generateJobSlug({
            title: job.title,
            company: job.company,
            jobType: job.type,
            category: job.category,
        });
        router.push(`/jobs/${jobSlug}`);
    };

    const handleApplyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canApplyJobs) {
            // Could show a toast/alert here explaining why they can't apply
            console.warn('Job applications are only available for job seekers (USER role)');
            return;
        }
        
        // Navigate to application form
        const jobSlug = job.slug || generateJobSlug({
            title: job.title,
            company: job.company,
            jobType: job.type,
            category: job.category
        });
        router.push(`/jobs/${jobSlug}/apply`);
    };

    const handleCompanyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Navigate to company detail page
        const companyData = { name: job.company };
        const companyUrl = getCompanyDetailUrl(companyData);
        router.push(companyUrl);
    };

    const getTimeSincePosted = (dateString?: string) => {
        if (!dateString) return 'Recently posted';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group flex flex-col h-full"
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
        >
            <div className="p-6 flex flex-col flex-1">
                {/* Company Info Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {job.companyLogo ? (
                            <Image
                                src={job.companyLogo}
                                alt={job.company}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold text-lg">
                                {job.company.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-700 text-sm">{job.company}</h4>
                        <p className="text-xs text-gray-500">{getTimeSincePosted(job.createdAt)}</p>
                    </div>
                </div>

                {/* Job Type and Category Badges */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                            {job.type}
                        </span>
                        {job.category && (
                            <span 
                                className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap" 
                                title={job.category}
                            >
                                {getShortenedCategory(job.category)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {job.title}
                </h3>

                {/* Description - Fixed height */}
                <div className="mb-4 h-16 overflow-hidden">
                    <p className="text-sm text-gray-600 line-clamp-3">
                        {job.description || "No description available"}
                    </p>
                </div>

                {/* Location and Salary */}
                <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                    </div>

                    {(job.salaryDisplay || job.salaryMin) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Banknote className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                                {job.salaryDisplay ||
                                    `IDR ${job.salaryMin?.toLocaleString('id-ID')}${job.salaryMax ? ` - IDR ${job.salaryMax.toLocaleString('id-ID')}` : ''} per month`
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        {canApplyJobs ? (
                            <Button
                                onClick={handleApplyClick}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg h-10 text-sm transition-colors"
                            >
                                Apply This Job
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCompanyClick}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg h-10 text-sm transition-colors"
                            >
                                View Company
                            </Button>
                        )}
                        
                        {canSaveJobs && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSave();
                                }}
                                disabled={isLoading}
                                className={`rounded-lg w-10 h-10 flex-shrink-0 border-2 transition-all duration-200 ${
                                    isSaved 
                                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-600' 
                                        : 'border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-gray-400'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={isSaved ? 'Remove from saved jobs' : 'Save this job'}
                            >
                                {isSaved ? (
                                    <BookmarkCheck className="w-4 h-4" />
                                ) : (
                                    <Bookmark className="w-4 h-4" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseJobCard;
