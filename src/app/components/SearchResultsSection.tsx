"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useJobs } from "@/hooks/useJobs";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Briefcase, X } from "lucide-react";
import Image from "next/image";
import formatCurrency from "@/lib/formatCurrency";

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

const SearchResultsSection = () => {
    console.log('🚀 SearchResultsSection component instantiated');
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const { jobs: backendJobs, loading, error } = useJobs({ limit: 50 });
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const query = searchParams.get("query") || "";
    const location = searchParams.get("location") || "";

    // Debug: Log component render
    console.log('SearchResultsSection rendered with:', {
        searchParamsSize: searchParams.toString().length,
        allParams: searchParams.toString(),
        query,
        location,
        hasBackendJobs: backendJobs.length,
        loading,
        error
    });

    // Filter jobs based on search parameters
    useEffect(() => {
        console.log('🔍 SearchResultsSection useEffect triggered');
        console.log('Search params:', { query, location });
        console.log('Backend jobs:', backendJobs.length);
        
        const hasSearchParams = Boolean(query || location);
        console.log('Has search params?', hasSearchParams);
        
        if (hasSearchParams) {
            console.log('✅ Setting isVisible = true');
            setIsVisible(true);
            
            const filtered = backendJobs.filter((job: any) => {
                // 1. STRICT LOCATION FILTERING
                // If location is specified, job MUST be in that exact location
                if (location) {
                    const jobLocation = (job.location || '').toLowerCase();
                    const searchLocation = location.toLowerCase();
                    
                    // Check for exact match or city match (before comma)
                    const jobCity = jobLocation.split(',')[0].trim();
                    const searchCity = searchLocation.split(',')[0].trim();
                    
                    const locationMatch = jobLocation.includes(searchLocation) || 
                                        jobCity.includes(searchCity) ||
                                        searchLocation.includes(jobCity);
                    
                    if (!locationMatch) {
                        return false; // Strict: if no location match, exclude completely
                    }
                }
                
                // 2. IMPROVED QUERY MATCHING 
                // If no query, show all (location filtered) jobs
                if (!query) return true;
                
                const searchTerm = query.toLowerCase().trim();
                
                // Helper function for more selective matching
                const selectiveMatch = (text: any, searchTerm: string) => {
                    if (!text || typeof text !== 'string') return false;
                    const normalizedText = text.toLowerCase();
                    
                    // Split search term into words
                    const searchWords = searchTerm.split(/[\s_-]+/).filter(word => word.length > 1);
                    if (searchWords.length === 0) return false;
                    
                    // Calculate match score
                    let matchScore = 0;
                    let totalWords = searchWords.length;
                    
                    for (const searchWord of searchWords) {
                        if (searchWord.length < 2) continue;
                        
                        // Exact word match (highest score)
                        if (normalizedText.includes(searchWord)) {
                            matchScore += 1;
                        }
                        // Partial match for longer words (lower score)
                        else if (searchWord.length >= 4) {
                            const words = normalizedText.split(/[\s_-]+/);
                            const hasPartialMatch = words.some(word => 
                                word.length >= 3 && (
                                    word.includes(searchWord.substring(0, 3)) ||
                                    searchWord.includes(word.substring(0, 3))
                                )
                            );
                            if (hasPartialMatch) {
                                matchScore += 0.5;
                            }
                        }
                    }
                    
                    // Require at least 60% match score to be relevant
                    const relevanceThreshold = totalWords * 0.6;
                    return matchScore >= relevanceThreshold;
                };
                
                // Search in multiple fields with relevance scoring
                const titleMatch = selectiveMatch(job.title || '', searchTerm);
                const companyMatch = selectiveMatch(job.Company?.name || job.Companies?.name || job.company?.name || '', searchTerm);
                const categoryMatch = selectiveMatch(job.category || job.Category || '', searchTerm);
                const descriptionMatch = selectiveMatch(job.description || '', searchTerm);
                const jobTypeMatch = selectiveMatch(job.job_type || '', searchTerm);
                
                // Skills matching (require exact or close match)
                const skillsMatch = job.skills?.some((skill: any) => {
                    const skillName = typeof skill === 'string' ? skill : skill?.name || '';
                    return selectiveMatch(skillName, searchTerm);
                }) || false;
                
                // High priority fields (title, category, skills) get more weight
                const hasHighPriorityMatch = titleMatch || categoryMatch || skillsMatch;
                const hasLowPriorityMatch = companyMatch || descriptionMatch || jobTypeMatch;
                
                // Return true only if there's a meaningful match
                return hasHighPriorityMatch || hasLowPriorityMatch;
                
            }).map((job: any) => ({
                id: job.job_id?.toString() || job.id?.toString() || '',
                title: job.title || 'Job Position',
                company: job.Company?.name || job.Companies?.name || job.company?.name || 'Unknown Company',
                type: (job.job_type?.replace('_', ' ') || 'Full Time') as Job["type"],
                location: job.location || 'Remote',
                salaryMin: job.salary || job.salaryMin || 0,
                salaryMax: job.salaryMax || (job.salary ? job.salary * 1.2 : 0),
                tags: job.skills?.map((skill: any) => skill.name) || [],
                slug: job.slug || job.job_id?.toString() || job.id?.toString() || '',
                companyLogo: job.Company?.profile_picture || job.Companies?.profile_picture || null,
                createdAt: job.createdAt || job.created_at || new Date().toISOString(),
            }));
            
            console.log('📊 Search Results Summary:', {
                originalJobs: backendJobs.length,
                filteredJobs: filtered.length,
                query: query,
                location: location,
                hasLocation: Boolean(location),
                hasQuery: Boolean(query)
            });
            
            // Debug: Log sample of filtered jobs
            if (filtered.length > 0) {
                console.log('📝 Sample filtered jobs:', filtered.slice(0, 3).map(job => ({
                    title: job.title,
                    company: job.company,
                    location: job.location
                })));
            } else if (query || location) {
                console.log('⚠️ No jobs found for search criteria');
            }
            
            setFilteredJobs(filtered);
        } else {
            console.log('❌ Setting isVisible = false');
            setIsVisible(false);
            setFilteredJobs([]);
        }
    }, [query, location, backendJobs]);

    const handleJobClick = (job: Job) => {
        if (job.slug) {
            router.push(`/jobs/${job.slug}`);
        } else {
            router.push(`/jobs/${job.id}`);
        }
    };

    const clearSearch = () => {
        router.push("/");
        setIsVisible(false);
    };

    const getTimeSincePosted = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    if (!isVisible) {
        console.log('SearchResultsSection not visible:', { isVisible, query, location });
        return null;
    }

    console.log('SearchResultsSection rendering:', { 
        isVisible, 
        query, 
        location, 
        filteredJobsCount: filteredJobs.length,
        loading,
        error 
    });

    return (
        <section className="bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            {query && (
                                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                    Query: "{query}"
                                </span>
                            )}
                            {location && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    Location: {location}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={clearSearch}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Clear Search
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Failed to load search results. Please try again.</p>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-600">
                                Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {filteredJobs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                                    <Briefcase className="w-full h-full" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                                <div className="text-gray-600 space-y-2">
                                    {query && location ? (
                                        <p>
                                            No jobs found for "<strong>{query}</strong>" in <strong>{location}</strong>.
                                        </p>
                                    ) : query ? (
                                        <p>
                                            No jobs found matching "<strong>{query}</strong>".
                                        </p>
                                    ) : location ? (
                                        <p>
                                            No jobs found in <strong>{location}</strong>.
                                        </p>
                                    ) : (
                                        <p>No jobs found matching your search criteria.</p>
                                    )}
                                    <p className="text-sm mt-3">
                                        Try adjusting your search criteria:
                                    </p>
                                    <ul className="text-sm text-left max-w-md mx-auto space-y-1">
                                        <li>• Use more general keywords</li>
                                        {location && <li>• Try searching in nearby cities</li>}
                                        <li>• Check spelling of job titles or company names</li>
                                        <li>• Browse all available jobs without filters</li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => router.push('/jobs')}
                                    className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Browse All Jobs
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                                        onClick={() => handleJobClick(job)}
                                    >
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
                                                    <h4 className="font-medium text-gray-700 text-sm truncate">{job.company}</h4>
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
                                                {job.title}
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
                                                    {job.tags.slice(0, 3).map((tag, index) => (
                                                        <span 
                                                            key={index} 
                                                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                                        >
                                                            {tag}
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
                                ))}
                            </div>
                        )}

                        {/* View All Results Link */}
                        {filteredJobs.length > 0 && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => router.push(`/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`)}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    View All Results ({filteredJobs.length})
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default SearchResultsSection;