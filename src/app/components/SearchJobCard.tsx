import React from 'react';
import Image from "next/image";
import { MapPin } from "lucide-react";
import formatCurrency from "@/lib/formatCurrency";
import { highlightSearchTerms, getTimeSincePosted, getRelevanceLevel } from './search/SearchUtils';

interface Job {
    id: string;
    title: string;
    company: string;
    type: "Full Time" | "Part-time" | "Internship" | "Contract";
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    tags?: string[];
    slug?: string;
    companyLogo?: string;
    createdAt?: string;
}

interface SearchJobCardProps {
    job: Job & { _searchScore?: number };
    query: string;
    onJobClick: (job: Job) => void;
    index: number;
}

const SearchJobCard: React.FC<SearchJobCardProps> = ({ job, query, onJobClick, index }) => {
    const searchScore = job._searchScore || 0;
    const relevance = getRelevanceLevel(searchScore, query);
    
    return (
        <div
            key={job.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative"
            onClick={() => onJobClick(job)}
        >
            {/* Relevance Indicator - Only show when there's a search query */}
            {relevance && (
                <div className="absolute top-3 right-3 z-10">
                    <div className={`${relevance.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm`}>
                        <span>{relevance.icon}</span>
                        <span className="hidden sm:inline">{relevance.label}</span>
                    </div>
                </div>
            )}
            
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
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-700 text-sm truncate">
                            {query ? (
                                <span 
                                    dangerouslySetInnerHTML={{ 
                                        __html: highlightSearchTerms(job.company, query) 
                                    }} 
                                />
                            ) : (
                                job.company
                            )}
                        </h4>
                        <p className="text-xs text-gray-500">{getTimeSincePosted(job.createdAt || '')}</p>
                    </div>
                </div>

                {/* Job Type Badge */}
                <div className="mb-4">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                        {job.type}
                    </span>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {query ? (
                        <span 
                            dangerouslySetInnerHTML={{ 
                                __html: highlightSearchTerms(job.title, query) 
                            }} 
                        />
                    ) : (
                        job.title
                    )}
                </h3>

                {/* Location and Salary */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                    </div>
                    {job.salaryMin && job.salaryMin > 0 && (
                        <div className="text-sm font-medium text-green-600">
                            {formatCurrency(job.salaryMin)}
                            {job.salaryMax && job.salaryMax > job.salaryMin && 
                                ` - ${formatCurrency(job.salaryMax)}`
                            }
                            <span className="text-xs text-gray-500 ml-1">/ month</span>
                        </div>
                    )}
                </div>

                {/* Skills Tags */}
                {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {job.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span 
                                key={tagIndex} 
                                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                                {query ? (
                                    <span 
                                        dangerouslySetInnerHTML={{ 
                                            __html: highlightSearchTerms(tag, query) 
                                        }} 
                                    />
                                ) : (
                                    tag
                                )}
                            </span>
                        ))}
                        {job.tags.length > 3 && (
                            <span className="text-xs text-gray-400">
                                +{job.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchJobCard;