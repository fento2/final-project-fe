"use client";
import React from "react";
import Image from "next/image";
import { MapPin, Banknote, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";

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

    const handleCardClick = () => {
        if (job.slug) {
            router.push(`/jobs/${job.slug}`);
        } else {
            router.push(`/jobs/${job.id}`);
        }
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
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden group">
            <div className="p-6">
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

                {/* Job Type Badge */}
                <div className="mb-4">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                        {job.type}
                    </span>
                    {job.category && (
                        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full ml-2">
                            {job.category}
                        </span>
                    )}
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                </h3>

                {/* Description (array or HTML) or Tags */}
                {Array.isArray(job.description) && job.description.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 mb-3">
                        {job.description.slice(0, 3).map((req: string, idx: number) => (
                            <li className="truncate" key={idx}>{req}</li>
                        ))}
                    </ul>
                ) : typeof job.description === 'string' && job.description.trim() ? (
                    <div
                        className="prose prose-sm max-w-none text-gray-600 mb-4 line-clamp-3 [&_*]:text-inherit [&_*]:!my-0"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }}
                    />
                ) : job.tags && job.tags.length > 0 ? (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {job.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700"
                                >
                                    {tag}
                                </span>
                            ))}
                            {job.tags.length > 3 && (
                                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                                    +{job.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mb-4">
                        <p className="text-sm text-gray-500">No additional details available</p>
                    </div>
                )}

                {/* Location and Salary */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                    </div>

                    {(job.salaryDisplay || job.salaryMin) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Banknote className="w-4 h-4" />
                            <span>
                                {job.salaryDisplay ||
                                    `$${job.salaryMin?.toLocaleString()}${job.salaryMax ? ` - $${job.salaryMax.toLocaleString()}` : ''} per year`
                                }
                            </span>

                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg h-10"
                    >
                        Apply This Job
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                        className="border-gray-300 hover:bg-gray-50 rounded-lg w-10 h-10 flex-shrink-0"
                    >
                        <Bookmark className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BrowseJobCard;
