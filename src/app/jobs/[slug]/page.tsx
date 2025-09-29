"use client";

import { Bookmark, BookmarkCheck, Banknote } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { useEffect, useMemo, useState } from "react";
import { useJobBySlug, useFeaturedJobs } from "@/hooks/useJobs";
import { useJobSave } from "@/hooks/useJobSave";
import { useAuthStore } from "@/lib/zustand/authStore";
import formatCurrency from "@/lib/formatCurrency";
import { formatDateIDDateOnly } from "@/lib/formatDate";
import { generateJobSlug } from "@/helper/slugHelper";
import { getCompanyDetailUrl } from "@/helper/companySlugHelper";
import BrowseCTASection from "@/app/jobs/browse/components/BrowseCTASection";
import { useToast } from "@/components/basic-toast";
import HeroHeader from "./components/HeroHeader";
import JobDescription from "./components/JobDescription";
import JobRequirements from "./components/JobRequirements";
import CompanyOverview from "./components/CompanyOverview";
import JobSidebar from "./components/JobSidebar";
import RelatedJobsSection from "./components/RelatedJobsSection";
import { toTitleCase } from "@/helper/toTitleCase";


function toAbsoluteUrl(url?: string): string {
    if (!url) return "/images/logo.png";
    if (/^https?:\/\//i.test(url)) return url;
    const base = process.env.NEXT_PUBLIC_URL_BE?.replace(/\/$/, "") || "";
    const u = url.startsWith("/") ? url : `/${url}`;
    return `${base}${u}`;
}

// Safe HTML component that only runs on client
function SafeHtml({ html, className }: { html: string; className?: string }) {
    const [sanitizedHtml, setSanitizedHtml] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== "undefined") {
            import("dompurify").then((DOMPurify) => {
                setSanitizedHtml(DOMPurify.default.sanitize(html));
            });
        }
    }, [html]);

    if (!isClient) {
        return <div className={className}>{html.replace(/<[^>]*>/g, "")}</div>;
    }

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
}

// Similar Job Card Component
const SimilarJobCard = ({ job }: { job: any }) => {
    const { role, isLogin } = useAuthStore();
    const { isSaved, isLoading, toggleSave } = useJobSave(job.job_id);
    const toast = useToast();

    // Only show save and apply functionality for USER role
    const canSaveJobs = isLogin && role === 'USER';
    const canApplyJobs = isLogin && role === 'USER';

    // Generate proper slug for navigation
    const jobSlug = job.slug || generateJobSlug({
        title: job.title,
        company: job.Company?.name || job.company?.name || 'Unknown',
        jobType: job.job_type || job.type,
        category: job.category
    });

    const handleCompanyClick = () => {
        // Navigate to company detail page
        const companyData = { name: job.Company?.name || job.company?.name || 'Unknown' };
        const companyUrl = getCompanyDetailUrl(companyData);
        window.open(companyUrl, '_blank');
    };

    return (
        <div key={job.job_id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300">
            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {job.title}
            </h4>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.job_type && (
                    <span className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded font-medium">
                        {job.job_type}
                    </span>
                )}
                {job.category && (
                    <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded font-medium">
                        {job.category}
                    </span>
                )}
            </div>

            <div className="text-gray-700 text-sm mb-4 flex items-center gap-1">
                <Banknote className="w-4 h-4" />
                <span>{formatCurrency(job.salary, { currency: job.currency || "IDR" })}</span>
            </div>

            <div className="flex items-center justify-between">
                {canApplyJobs ? (
                    <Link
                        href={`/jobs/${jobSlug}/apply`}
                        className={`bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${canSaveJobs ? '' : 'flex-1 text-center'}`}
                    >
                        Apply This Job
                    </Link>
                ) : (
                    <button
                        onClick={handleCompanyClick}
                        className={`bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${canSaveJobs ? '' : 'flex-1'}`}
                    >
                        View Company
                    </button>
                )}
                {canSaveJobs && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleSave}
                            disabled={isLoading}
                            className={`p-2 transition-colors ${isSaved
                                ? 'text-blue-600 hover:text-blue-700'
                                : 'text-gray-400 hover:text-blue-600'
                                }`}
                            title={isSaved ? 'Remove from saved jobs' : 'Save this job'}
                        >
                            {isSaved ? (
                                <BookmarkCheck className="w-4 h-4" />
                            ) : (
                                <Bookmark className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function JobDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { role, isLogin } = useAuthStore();
    const toast = useToast();
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareBtnRef = useRef<HTMLButtonElement>(null);

    // Fetch single job by slug from backend (now uses same approach as jobs/browse)
    const { job: displayJob, loading, error } = useJobBySlug(slug);

    // Related jobs using same approach as featured jobs
    const { jobs: relatedJobs, loading: relatedLoading } = useFeaturedJobs(8);

    // Only show save and apply functionality for USER role
    const canSaveJobs = isLogin && role === 'USER';
    const canApplyJobs = isLogin && role === 'USER';

    // Job save functionality
    const { isSaved, isLoading: isSaveLoading, toggleSave } = useJobSave(displayJob?.job_id || (displayJob as any)?.id || '');

    const jobTitle = useMemo(() => displayJob?.title || decodeURIComponent(slug).replace(/-/g, " "), [displayJob?.title, slug]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-64 w-full bg-gray-100 rounded-xl animate-pulse" />
            </div>
        );
    }

    if (error && !displayJob) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Job not found</h1>
                <p className="text-gray-500 mb-6">
                    {error?.includes('logged in')
                        ? "You may need to be logged in to view detailed job information."
                        : "We couldn't load this job. It may have been removed or the link is invalid."
                    }
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/jobs/browse" className="text-indigo-600 font-medium hover:underline">
                        Back to Jobs
                    </Link>
                    {error?.includes('logged in') && (
                        <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    const companyName = displayJob?.Company?.name || "Unknown Company";
    const companyLogo = toAbsoluteUrl(displayJob?.Company?.profile_picture);
    const location = displayJob?.location || "-";
    const currency = displayJob?.currency || "IDR";
    const salaryStr = formatCurrency(displayJob?.salary, { currency });
    const period = displayJob?.periodSalary ? displayJob.periodSalary.toLowerCase().replace(/_/g, " ") : "month";
    const postedAt = displayJob?.createdAt ? formatDateIDDateOnly(displayJob.createdAt) : "";
    const lastActivity = displayJob?.updatedAt ? formatDateIDDateOnly(displayJob.updatedAt) : postedAt;
    const closesAt = displayJob?.expiredAt ? formatDateIDDateOnly(displayJob.expiredAt) : "-";

    // Web Share
    const handleShare = async () => {
        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const url = `${origin}/jobs/${slug}`;
            const title = `${jobTitle} at ${companyName}`;
            const text = `Check out this job: ${title}`;
            if (navigator.share) {
                await navigator.share({ title, text, url });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                toast.success?.("Link copied", "Job link copied to your clipboard.");
            } else {
                window.open(url, '_blank');
            }
        } catch (err: any) {
            if (err?.name !== 'AbortError') {
                toast.error?.("Share failed", err?.message || "Unable to share this job.");
            }
        }
        setShowShareMenu(false);
    };

    // Copy link only
    const handleCopyLink = async () => {
        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const url = `${origin}/jobs/${slug}`;
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                toast.success?.("Link copied", "Job link copied to your clipboard.");
            } else {
                window.open(url, '_blank');
            }
        } catch (err: any) {
            toast.error?.("Copy failed", err?.message || "Unable to copy link.");
        }
        setShowShareMenu(false);
    };

    // WhatsApp share
    const handleShareWhatsApp = () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${origin}/jobs/${slug}`;
        const title = jobTitle;
        const text = encodeURIComponent(`Cek lowongan ${title} di ${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        setShowShareMenu(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <HeroHeader
                jobTitle={jobTitle}
                companyName={companyName}
                companyLogo={companyLogo}
                location={location}
                salaryStr={salaryStr}
                period={period}
                category={displayJob?.category}
                jobType={displayJob?.job_type}
                canApplyJobs={canApplyJobs}
                canSaveJobs={canSaveJobs}
                isSaved={isSaved}
                isSaveLoading={isSaveLoading}
                toggleSave={toggleSave}
                showShareMenu={showShareMenu}
                setShowShareMenu={setShowShareMenu}
                handleCopyLink={handleCopyLink}
                handleShareWhatsApp={handleShareWhatsApp}
                handleShare={handleShare}
                slug={slug}
            >
                {/* Breadcrumb */}
                <nav className="text-sm text-white/80 mb-6">
                    <ol className="flex space-x-2 flex-wrap">
                        <li><Link href="/" className="hover:underline">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/jobs" className="hover:underline">Jobs</Link></li>
                        <li>/</li>
                        <li><Link href="/jobs/browse" className="hover:underline">Browse</Link></li>
                        <li>/</li>
                        <li className="text-white font-semibold">{toTitleCase(displayJob?.category || '')}</li>
                    </ol>
                </nav>
            </HeroHeader>
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <JobDescription description={displayJob?.description} />
                        <JobRequirements skills={(displayJob as any)?.skills} />
                        <CompanyOverview
                            companyName={companyName}
                            companyLogo={companyLogo}
                            location={location}
                            description={displayJob?.Company?.description}
                        />
                    </div>
                    <JobSidebar
                        postedAt={postedAt}
                        lastActivity={lastActivity}
                        closesAt={closesAt}
                        skills={(displayJob as any)?.skills}
                    />
                </div>
                <RelatedJobsSection
                    relatedJobs={relatedJobs}
                    displayJobId={displayJob?.job_id ?? ""}
                    loading={relatedLoading}
                />
                <div className="mt-16">
                    <BrowseCTASection />
                </div>
            </div>
        </div>
    );
}
