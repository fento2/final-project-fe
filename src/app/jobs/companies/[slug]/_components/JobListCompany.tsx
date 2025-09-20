import { User } from "@/types/database";
import { Job } from "@/types/job";
import { UserCompanyItem } from "@/types/userCompany";
import { Bookmark, BookmarkCheck, Building2, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";
import { useJobSave } from "@/hooks/useJobSave";
import { useAuthStore } from "@/lib/zustand/authStore";

type Company = {
    company_id: number;
    name: string;
    email: string;
    phone: string;
    description: string;
    website: string;
    profile_picture: string;

    user_company: UserCompanyItem[];
    job: Job[];
    Users: User;
};

type Props = {
    company: Company;
}
// Individual Job Item Component
const JobItem = ({ job, companyName }: { job: Job; companyName: string }) => {
    const { role, isLogin } = useAuthStore();
    const { isSaved, isLoading, toggleSave } = useJobSave(job.job_id);
    
    // Only show save and apply functionality for USER role
    const canSaveJobs = isLogin && role === 'USER';
    const canApplyJobs = isLogin && role === 'USER';

    return (
        <article className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {job.title}
                </h3>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {job.category}
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Building2 className="w-4 h-4" /> {companyName}
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
                {/* {job.bullets.map((it) => (
                                    <li key={it} className="flex items-start gap-2">
                                        <Star className="w-4 h-4 text-indigo-500 mt-0.5" />
                                        <span>{it}</span>
                                    </li>
                                ))} */}
            </ul>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {job.location}
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> {job.salary}
                </div>
            </div>
            <div className="flex items-center gap-3">
                {canApplyJobs ? (
                    <Link
                        href={`/jobs/${job.slug}`}
                        className={`bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition ${canSaveJobs ? '' : 'flex-1 text-center'}`}
                    >
                        Apply This Job
                    </Link>
                ) : (
                    <div className={`bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-sm font-semibold ${canSaveJobs ? '' : 'flex-1 text-center'}`}>
                        Application not available
                    </div>
                )}
                {canSaveJobs && (
                    <button 
                        onClick={toggleSave}
                        disabled={isLoading}
                        className={`p-2 rounded-xl transition-colors ${
                            isSaved 
                                ? 'bg-indigo-50 border border-indigo-300 text-indigo-600 hover:bg-indigo-100' 
                                : 'border hover:bg-gray-50'
                        }`}
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
        </article>
    );
};

export default function JobListCompany({ company }: Props) {
    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Openings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.job.map((job) => (
                    <JobItem key={job.job_id} job={job} companyName={company.name} />
                ))}
            </div>
        </section>
    )
}