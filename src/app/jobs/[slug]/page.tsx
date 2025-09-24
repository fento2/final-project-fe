// app/jobs/[slug]/page.tsx
"use client";

import { Briefcase, MapPin, Calendar, Bookmark, BookmarkCheck, Share2, GraduationCap, Layers, Banknote, User, Hourglass, CircleCheck, Copy, MessageCircle } from "lucide-react";
import Image from "next/image";
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
import ReadOnlyQuill from "@/app/dashboard/components/ReadOnlyReactQuil";
import { useToast } from "@/components/basic-toast";


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

    const handleShareRelated = async () => {
        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : '';
            const url = `${origin}/jobs/${jobSlug}`;
            const title = `${job.title} at ${job.Company?.name || job.company?.name || 'Company'}`;
            const text = `Check out this job: ${title}`;

            if (navigator.share) {
                await navigator.share({ title, text, url });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                toast.success?.("Link copied", "Job link copied to your clipboard.");
            } else {
                // Fallback: open share URL in a new tab
                window.open(url, '_blank');
            }
        } catch (err: any) {
            // Ignore AbortError (user canceled share)
            if (err?.name !== 'AbortError') {
                toast.error?.("Share failed", err?.message || "Unable to share this job.");
            }
        }
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
                        <button onClick={handleShareRelated} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Share this job">
                            <Share2 className="w-4 h-4" />
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
            {/* Hero Header Section with Background Image */}
            <div
                className="relative bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/bg_hero.jpg')`
                }}
            >
                <div className="max-w-6xl mx-auto px-6 py-16">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-white/80 mb-6">
                        <ol className="flex space-x-2">
                            <li>
                                <Link href="/" className="hover:underline">Home</Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/jobs" className="hover:underline">Jobs</Link>
                            </li>
                            <li>/</li>
                            <li>
                                <Link href="/jobs/browse" className="hover:underline">Browse</Link>
                            </li>
                            <li>/</li>
                            <li className="text-white font-semibold">{displayJob?.category}</li>
                        </ol>
                    </nav>

                    {/* Job Header */}
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{jobTitle}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <Image
                                src={companyLogo}
                                alt={companyName}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg bg-white/10 object-cover"
                            />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-bold">{companyName}</h2>
                                    <CircleCheck fill="blue" color="white" className="w-5 h-5" />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Banknote className="w-4 h-4" />
                                        <span>{salaryStr} per {period}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {displayJob?.category && (
                                <span className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md">{displayJob.category}</span>
                            )}
                            {displayJob?.job_type && (
                                <span className="px-3 py-1 text-sm font-medium bg-purple-600 text-white rounded-md">{displayJob.job_type}</span>
                            )}
                            <span className="px-3 py-1 text-sm font-medium bg-red-600 text-white rounded-md">Urgently Needed</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {canApplyJobs ? (
                                <Link
                                    href={`/jobs/${slug}/apply`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
                                >
                                    Apply This Job
                                </Link>
                            ) : (
                                <div className="bg-gray-100 text-gray-500 font-semibold px-6 py-3 rounded-lg flex items-center">
                                    <span>Application not available</span>
                                </div>
                            )}
                            {canSaveJobs && (
                                <button
                                    onClick={toggleSave}
                                    disabled={isSaveLoading}
                                    className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold ${isSaved
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600'
                                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                                        }`}
                                    title={isSaved ? 'Remove from saved jobs' : 'Save this job'}
                                >
                                    {isSaved ? (
                                        <BookmarkCheck className="w-5 h-5" />
                                    ) : (
                                        <Bookmark className="w-5 h-5" />
                                    )}
                                    {isSaved ? 'Saved' : 'Save Job'}
                                </button>
                            )}
                            <div className="relative inline-block">
                                <button
                                    ref={shareBtnRef}
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                                    onClick={() => setShowShareMenu((v) => !v)}
                                    title="Share this job"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                {showShareMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-200 rounded-lg shadow-lg z-50">
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                                            onClick={handleCopyLink}
                                        >
                                            <Copy className="w-4 h-4 text-gray-500" />
                                            Salin Link
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                                            onClick={handleShareWhatsApp}
                                        >
                                            <MessageCircle className="w-4 h-4 text-green-500" />
                                            Share on WhatsApp
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-700"
                                            onClick={handleShare}
                                        >
                                            <Share2 className="w-4 h-4 text-blue-500" />
                                            Share (Web Share)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Content */}
                    <div className="flex-1">
                        {/* Job Description */}
                        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h3>
                            {displayJob?.description ? (
                                // <SafeHtml
                                //     html={displayJob.description}
                                //     className="text-gray-700 text-base leading-relaxed job-description"
                                // />
                                <ReadOnlyQuill value={displayJob.description} className="text-base leading-relaxed text-gray-700" />
                            ) : (
                                <p className="text-gray-500 italic">No description available for this position.</p>
                            )}
                        </div>

                        {/* Job Requirements */}
                        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Skill Requirements</h3>
                            {(displayJob as any)?.skills && Array.isArray((displayJob as any).skills) && (displayJob as any).skills.length > 0 ? (
                                <ul className="space-y-3">
                                    {(displayJob as any).skills.map((skill: any) => (
                                        <li key={skill.id || skill.name} className="flex items-start gap-3 text-gray-700">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>Proficiency in {skill.name || skill}</span>
                                        </li>
                                    ))}
                                    <li className="flex items-start gap-3 text-gray-700">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Strong problem-solving and analytical skills</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-700">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Ability to work collaboratively in a team environment</span>
                                    </li>
                                </ul>
                            ) : (
                                <p className="text-gray-600">No specific requirements listed.</p>
                            )}
                        </div>

                        {/* Company Overview */}
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <Image
                                    src={companyLogo}
                                    alt={companyName}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-xl object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-2xl font-bold text-gray-900">{companyName}</h4>
                                        <CircleCheck fill="blue" color="white" className="w-5 h-5" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Average 1-2 weeks</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>50-100 employees</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4" />
                                            <span>{displayJob?.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 className="font-bold text-gray-900 mb-3">Company Overview</h5>
                            {displayJob?.Company?.description ? (
                                <SafeHtml
                                    html={displayJob.Company.description}
                                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none [&_*]:text-inherit"
                                />
                            ) : (
                                <p className="text-gray-600">
                                    {companyName} is a forward-thinking company committed to innovation and excellence.
                                    We provide a collaborative work environment and opportunities for professional growth.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="lg:w-80 flex-shrink-0">
                        {/* Posted Date Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <div className="text-right text-sm text-gray-500 mb-4">
                                <p>Posted {postedAt}</p>
                                <p>Last activity {lastActivity}</p>
                            </div>
                        </div>

                        {/* Job Overview Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Job Overview</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <Briefcase className="w-6 h-6 text-blue-600 mt-1" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">Career Level:</div>
                                        <div className="text-gray-700">Mid-Level</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">Qualification:</div>
                                        <div className="text-gray-700">Bachelor's degree in Computer Science, Web Development or related field</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">Years of Experience:</div>
                                        <div className="text-gray-700">3+ years of experience in Web Development</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Hourglass className="w-6 h-6 text-blue-600 mt-1" />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">Job Closed in:</div>
                                        <div className="text-gray-700">{closesAt}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="font-semibold text-gray-900 text-sm mb-3">Skills Specialization:</div>
                                <div className="flex flex-wrap gap-2">
                                    {(displayJob as any)?.skills && Array.isArray((displayJob as any).skills) && (displayJob as any).skills.length > 0 ? (
                                        (displayJob as any).skills.map((skill: any) => (
                                            <span key={skill.id || skill.name} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                                                {skill.name || skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">No skills listed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Jobs Section */}
                <section className="mt-16">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Jobs</h3>
                    {relatedLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedJobs
                                .filter((job: any) => job.job_id !== displayJob?.job_id)
                                .slice(0, 6)
                                .map((job: any) => (
                                    <SimilarJobCard key={job.job_id} job={job} />
                                ))}
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <div className="mt-16">
                    <BrowseCTASection />
                </div>
            </div>
        </div>
    );
}
