import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Banknote, Bookmark, BookmarkCheck, MapPin, Building2 } from "lucide-react";
import { useJobSave } from "@/hooks/useJobSave";
import { useAuthStore } from "@/lib/zustand/authStore";
import { generateJobSlug } from "@/helper/slugHelper";
import { getCompanyDetailUrl } from "@/helper/companySlugHelper";
import formatCurrency from "@/lib/formatCurrency";

// Helper function untuk absolute URL
function toAbsoluteUrl(url?: string): string {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const base = process.env.NEXT_PUBLIC_URL_BE?.replace(/\/$/, "") || "";
    const u = url.startsWith("/") ? url : `/${url}`;
    return `${base}${u}`;
}

const SimilarJobCard = ({ job }: { job: any }) => {
    const { role, isLogin } = useAuthStore();
    const { isSaved, isLoading, toggleSave } = useJobSave(job.job_id);

    const canSaveJobs = isLogin && role === 'USER';
    const canApplyJobs = isLogin && role === 'USER';
    const isCompanyOrNoLogin = role === 'COMPANY' || !isLogin;
    
    // Get company data with fallbacks
    const companyData = job.Company || job.company || {};
    const companyName = companyData.name || 'Unknown Company';
    const companyLogo = toAbsoluteUrl(companyData.profile_picture);
    
    const jobSlug = job.slug || generateJobSlug({
        title: job.title,
        company: companyName,
        jobType: job.job_type || job.type,
        category: job.category
    });

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

    const handleCompanyClick = () => {
        const companyUrlData = { name: companyName };
        const companyUrl = getCompanyDetailUrl(companyUrlData);
        window.open(companyUrl, '_blank');
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border overflow-hidden group flex flex-col h-full">
            <div className="p-5 flex flex-col flex-1">
                {/* Company Info Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        {companyLogo && (
                            <Image
                                src={companyLogo}
                                alt={companyName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover absolute inset-0 z-20"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        )}
                        <span className="text-white font-bold text-lg flex items-center justify-center w-full h-full absolute inset-0 z-10">
                            {companyName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm truncate" title={companyName}>
                            {companyName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{getTimeSincePosted(job.createdAt)}</p>
                    </div>
                </div>

                {/* Job Type and Category Badges */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        {job.job_type && (
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                {job.job_type}
                            </span>
                        )}
                        {job.category && (
                            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                                {job.category}
                            </span>
                        )}
                    </div>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {job.title}
                </h3>

                {/* Location and Salary */}
                <div className="space-y-3 mb-6 flex-1">
                    {job.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                        </div>
                    )}
                    
                    {job.salary && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Banknote className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                                {formatCurrency(job.salary, { currency: job.currency || "IDR" })} / month
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        {canApplyJobs ? (
                            <Link
                                href={`/jobs/${jobSlug}/apply`}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg h-10 text-sm transition-colors flex items-center justify-center"
                            >
                                Apply This Job
                            </Link>
                        ) : isCompanyOrNoLogin ? (
                            <Link
                                href={`/jobs/${jobSlug}`}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg h-10 text-sm transition-colors flex items-center justify-center"
                            >
                                View Detail Job
                            </Link>
                        ) : (
                            <button
                                onClick={handleCompanyClick}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg h-10 text-sm transition-colors"
                            >
                                View Company
                            </button>
                        )}
                        
                        {canSaveJobs && (
                            <button
                                onClick={toggleSave}
                                disabled={isLoading}
                                className={`rounded-lg w-10 h-10 flex-shrink-0 border-2 transition-all duration-200 flex items-center justify-center ${
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
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimilarJobCard;
