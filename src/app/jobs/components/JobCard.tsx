import React from "react";
import { Banknote, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { Job } from "../types/jobsPageTypes";
import { toAbsoluteUrl, getTimeSincePosted } from "../utils/jobsPageHelpers";

interface JobCardProps {
    job: Job;
    onClick: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
    return (
        <div 
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border overflow-hidden flex flex-col h-full"
            onClick={() => onClick(job)}
        >
            <div className="p-4 flex flex-col flex-1">
                {/* Company Info Header */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg border">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0 relative shadow-md">
                        {job.companyLogo && (
                            <Image
                                src={toAbsoluteUrl(job.companyLogo)}
                                alt={job.company}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover absolute inset-0 z-20"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        )}
                        <span className="text-white font-bold text-xl absolute inset-0 flex items-center justify-center z-10">
                            {job.company.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-base truncate" title={job.company}>
                            {job.company}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeSincePosted(job.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Job Type and Category Badges */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                            {job.type}
                        </span>
                        {job.tags && job.tags.slice(0, 2).map((tag, index) => (
                            <span 
                                key={index} 
                                className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
                            >
                                {tag}
                            </span>
                        ))}
                        {job.tags && job.tags.length > 2 && (
                            <span className="text-xs text-gray-500 font-medium">
                                +{job.tags.length - 2} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Job Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                </h3>

                {/* Job Details */}
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        <span className="truncate">{job.location}</span>
                    </div>

                    {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Banknote className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span className="font-semibold text-green-600">
                                {job.salaryMin && job.salaryMax 
                                    ? `Rp ${job.salaryMin.toLocaleString()} - Rp ${job.salaryMax.toLocaleString()}`
                                    : job.salaryMin 
                                        ? `From Rp ${job.salaryMin.toLocaleString()}`
                                        : `Up to Rp ${job.salaryMax?.toLocaleString()}`
                                }
                            </span>
                        </div>
                    )}
                </div>

                {/* Apply Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 transform group-hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};