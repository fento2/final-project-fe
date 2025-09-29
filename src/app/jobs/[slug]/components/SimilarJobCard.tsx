import React from "react";
import Link from "next/link";
import { Banknote, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { useJobSave } from "@/hooks/useJobSave";
import { useAuthStore } from "@/lib/zustand/authStore";
import { generateJobSlug } from "@/helper/slugHelper";
import { getCompanyDetailUrl } from "@/helper/companySlugHelper";
import formatCurrency from "@/lib/formatCurrency";

const SimilarJobCard = ({ job }: { job: any }) => {
    const { role, isLogin } = useAuthStore();
    const { isSaved, isLoading, toggleSave } = useJobSave(job.job_id);

    const canSaveJobs = isLogin && role === 'USER';
    const canApplyJobs = isLogin && role === 'USER';
    const isCompanyOrNoLogin = role === 'COMPANY' || !isLogin;
    const jobSlug = job.slug || generateJobSlug({
        title: job.title,
        company: job.Company?.name || job.company?.name || 'Unknown',
        jobType: job.job_type || job.type,
        category: job.category
    });

    const handleCompanyClick = () => {
        const companyData = { name: job.Company?.name || job.company?.name || 'Unknown' };
        const companyUrl = getCompanyDetailUrl(companyData);
        window.open(companyUrl, '_blank');
    };

    return (
        <div key={job.job_id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{job.title}</h4>
            <div className="flex flex-wrap gap-2 mb-4">
                {job.job_type && (
                    <span className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded font-medium">{job.job_type}</span>
                )}
                {job.category && (
                    <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded font-medium">{job.category}</span>
                )}
            </div>
            <div className="text-gray-700 text-sm mb-4 flex items-center gap-1">
                <Banknote className="w-4 h-4" />
                <span>{formatCurrency(job.salary, { currency: job.currency || "IDR" })}</span>
            </div>
            <div className="flex items-center justify-between">
                {canApplyJobs ? (
                    <Link href={`/jobs/${jobSlug}/apply`} className={`bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${canSaveJobs ? '' : 'flex-1 text-center'}`}>
                        Apply This Job
                    </Link>
                ) : isCompanyOrNoLogin ? (
                    <Link href={`/jobs/${jobSlug}`} className={`bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${canSaveJobs ? '' : 'flex-1 text-center'}`}>
                        View Detail Job
                    </Link>
                ) : (
                    <button onClick={handleCompanyClick} className={`bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${canSaveJobs ? '' : 'flex-1'}`}>
                        View Company
                    </button>
                )}
                {canSaveJobs && (
                    <div className="flex items-center gap-2">
                        <button onClick={toggleSave} disabled={isLoading} className={`p-2 transition-colors ${isSaved ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-blue-600'}`} title={isSaved ? 'Remove from saved jobs' : 'Save this job'}>
                            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimilarJobCard;
